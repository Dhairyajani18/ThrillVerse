import os
import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# Create directory for saving models
os.makedirs('models', exist_ok=True)

# =====================================================================
# 1. CROWD PREDICTION MODEL (Regression)
# Predicts total visitors based on Hour, Day of Week, and Weather
# =====================================================================
def train_crowd_model():
    print("Training Crowd Prediction Model...")
    # Generate Mock Data
    np.random.seed(42)
    n_samples = 1000
    
    data = {
        'hour': np.random.randint(9, 21, n_samples), # Park open 9 AM to 9 PM
        'day_of_week': np.random.randint(0, 7, n_samples), # 0 = Monday, 6 = Sunday
        'weather': np.random.choice(['Sunny', 'Cloudy', 'Rainy'], n_samples, p=[0.6, 0.3, 0.1])
    }
    df = pd.DataFrame(data)
    
    # Encode categorical weather
    le = LabelEncoder()
    df['weather_encoded'] = le.fit_transform(df['weather'])
    
    # Target: Crowd count affected by weekend (5,6) and peak hours (12-4 PM)
    df['crowd_count'] = (
        (df['hour'] - 12)**2 * -5 + 500 + 
        (df['day_of_week'] >= 5) * 300 - 
        (df['weather_encoded'] == 2) * 200 + 
        np.random.randint(-50, 50, n_samples)
    )
    df['crowd_count'] = df['crowd_count'].clip(lower=50) # Ensure no negative crowds

    X = df[['hour', 'day_of_week', 'weather_encoded']]
    y = df['crowd_count']
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Save model and encoder
    with open('models/crowd_model.pkl', 'wb') as f:
        pickle.dump({'model': model, 'encoder': le}, f)
    print("Crowd model saved successfully!")

# =====================================================================
# 2. WAIT TIME PREDICTION MODEL (Regression)
# Predicts wait time (mins) for a specific ride based on current park crowd
# =====================================================================
def train_wait_time_model():
    print("Training Wait Time Prediction Model...")
    np.random.seed(42)
    n_samples = 1500
    
    data = {
        'ride_id': np.random.randint(1, 11, n_samples), # 10 different rides
        'current_crowd': np.random.randint(100, 2000, n_samples),
        'day_of_week': np.random.randint(0, 7, n_samples)
    }
    df = pd.DataFrame(data)
    
    # Target: Wait time is heavily driven by ride popularity and overall park crowd
    df['wait_time'] = (df['current_crowd'] * 0.03) + (df['ride_id'] * 4) + np.random.randint(-10, 10, n_samples)
    df['wait_time'] = df['wait_time'].clip(lower=5) # Minimum 5 mins wait

    X = df[['ride_id', 'current_crowd', 'day_of_week']]
    y = df['wait_time']
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    with open('models/wait_time_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    print("Wait time model saved successfully!")

if __name__ == "__main__":
    train_crowd_model()
    train_wait_time_model()