import os
import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# Force the script to save directly into your active Django model directory
target_dir = r"C:\Users\Jani Dhairya\OneDrive\Desktop\sem-4_p1\ml_service\models"
os.makedirs(target_dir, exist_ok=True)

# =====================================================================
# 1. CROWD PREDICTION MODEL
# =====================================================================
def train_crowd_model():
    print("Training Crowd Prediction Model...")
    np.random.seed(42)
    n_samples = 1000
    
    data = {
        'hour': np.random.randint(9, 21, n_samples),
        'day_of_week': np.random.randint(0, 7, n_samples),
        'weather': np.random.choice(['Sunny', 'Cloudy', 'Rainy'], n_samples, p=[0.6, 0.3, 0.1])
    }
    df = pd.DataFrame(data)
    
    le = LabelEncoder()
    df['weather_encoded'] = le.fit_transform(df['weather'])
    
    df['crowd_count'] = (
        (df['hour'] - 12)**2 * -5 + 500 + 
        (df['day_of_week'] >= 5) * 300 - 
        (df['weather_encoded'] == 2) * 200 + 
        np.random.randint(-50, 50, n_samples)
    )
    df['crowd_count'] = df['crowd_count'].clip(lower=50)

    X = df[['hour', 'day_of_week', 'weather_encoded']]
    y = df['crowd_count']
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    with open(os.path.join(target_dir, 'crowd_model.pkl'), 'wb') as f:
        pickle.dump({'model': model, 'encoder': le}, f)
    print("-> saved crowd_model.pkl")

# =====================================================================
# 2. WAIT TIME PREDICTION MODEL
# =====================================================================
def train_wait_time_model():
    print("Training Wait Time Prediction Model...")
    np.random.seed(42)
    n_samples = 1500
    
    data = {
        'ride_id': np.random.randint(1, 11, n_samples),
        'current_crowd': np.random.randint(100, 2000, n_samples),
        'day_of_week': np.random.randint(0, 7, n_samples)
    }
    df = pd.DataFrame(data)
    
    df['wait_time'] = (df['current_crowd'] * 0.03) + (df['ride_id'] * 4) + np.random.randint(-10, 10, n_samples)
    df['wait_time'] = df['wait_time'].clip(lower=5)

    X = df[['ride_id', 'current_crowd', 'day_of_week']]
    y = df['wait_time']
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    with open(os.path.join(target_dir, 'wait_time_model.pkl'), 'wb') as f:
        pickle.dump(model, f)
    print("-> saved wait_time_model.pkl")

if __name__ == "__main__":
    print(f"Writing fresh model data directly to: {target_dir}\n")
    train_crowd_model()
    train_wait_time_model()
    print("\n All files successfully populated with fresh data!")