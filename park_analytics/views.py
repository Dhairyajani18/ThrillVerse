import os
import pickle
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from virtual_queue.permissions import IsAdminOrStaff

crowd_model = None
weather_encoder = None
wait_time_model = None

# પ્રોજેક્ટનું રૂટ ફોલ્ડર (sem-4_p1)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_models():
    global crowd_model, weather_encoder, wait_time_model
    
   
    selected_dir = os.path.join(BASE_DIR, 'ml_service\\models')
    
    print(f"[ML Model Loader] Django is loading files from: {selected_dir}")
    
    try:
        # 1. Crowd Model લોડ કરો
        with open(os.path.join(selected_dir, 'crowd_model.pkl'), 'rb') as f:
            crowd_data = pickle.load(f)
            crowd_model = crowd_data['model']
            weather_encoder = crowd_data['encoder']

        # 2. Wait Time Model લોડ કરો
        with open(os.path.join(selected_dir, 'wait_time_model.pkl'), 'rb') as f:
            wait_time_model = pickle.load(f)
            
        print("SUCCESS: ALL ML MODELS LOADED PERFECTLY FROM ML_SERVICE\\MODELS!")
    except Exception as e:
        print(f"Error decoding pickle files: {str(e)}")
# =====================================================================
# 1. ENDPOINT: /predict-crowd
# =====================================================================
@api_view(['POST'])
@permission_classes([IsAdminOrStaff])
def predict_crowd(request):
    try:
        hour = request.data.get('hour')
        day_of_week = request.data.get('day_of_week')
        weather = request.data.get('weather')
        
        if hour is None or day_of_week is None or weather is None:
            return Response({"status": "error", "message": "બધા ઇનપુટ (hour, day_of_week, weather) મોકલો!"}, status=status.HTTP_400_BAD_REQUEST)

        hour = int(hour)
        day_of_week = int(day_of_week)
        
        # જો મોડેલ લોડ ના થયું હોય તો આ ચેક કામ લાગશે
        if crowd_model is None or weather_encoder is None:
            return Response({"status": "error", "message": "ML મોડેલ સર્વરમાં લોડ નથી થયું. ટર્મિનલ ચેક કરો!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        weather_encoded = weather_encoder.transform([str(weather)])[0]
        import pandas as pd
        features = pd.DataFrame([[hour, day_of_week, weather_encoded]], 
                                columns=['hour', 'day_of_week', 'weather_encoded'])
        prediction = crowd_model.predict(features)[0]
        
        return Response({
            "status": "success",
            "predicted_crowd_count": int(prediction)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"status": "crash", "error_details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# =====================================================================
# 2. ENDPOINT: /predict-wait-time
# =====================================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_wait_time(request):
    try:
        ride_id = int(request.data.get('ride_id'))
        current_crowd = int(request.data.get('current_crowd'))
        day_of_week = int(request.data.get('day_of_week'))
        
        if wait_time_model is None:
            return Response({"status": "error", "message": "Wait Time મોડેલ લોડ નથી થયું."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        import pandas as pd
        features = pd.DataFrame([[ride_id, current_crowd, day_of_week]], 
                                columns=['ride_id', 'current_crowd', 'day_of_week'])
        prediction = wait_time_model.predict(features)[0]
        
        return Response({
            "status": "success",
            "ride_id": ride_id,
            "predicted_wait_time_minutes": int(prediction)
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status": "crash", "error_details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
