import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random

def forecast_balance(data, days=30):
    """
    Placeholder function for time series forecasting.
    In a real implementation, this would use LSTM or Prophet models.
    
    Args:
        data (pd.DataFrame): Preprocessed transaction data
        days (int): Number of days to forecast
        
    Returns:
        list: Forecasted daily balances
    """
    # This is a placeholder implementation
    # In a real scenario, we would train and use a proper time series model
    
    # Get the most recent balance from the data
    # For simplicity, let's assume the last row has the most recent balance
    if not isinstance(data, pd.DataFrame) or len(data) == 0:
        return []
    
    try:
        last_balance = data['balance'].iloc[-1]
    except:
        last_balance = 1000  # Default starting balance
    
    # Generate a random but somewhat realistic forecast
    forecast = []
    current_balance = last_balance
    
    today = datetime.now()
    
    for i in range(days):
        # Add some random daily fluctuation
        daily_change = np.random.normal(0, last_balance * 0.02)  # 2% standard deviation
        
        # Add some weekly patterns (higher spending on weekends)
        day_of_week = (today + timedelta(days=i)).weekday()
        if day_of_week >= 5:  # Weekend
            daily_change -= last_balance * 0.01  # More spending on weekends
        
        current_balance += daily_change
        
        # Ensure balance doesn't go negative for demo purposes
        current_balance = max(current_balance, 100)
        
        forecast.append({
            'date': (today + timedelta(days=i)).strftime('%Y-%m-%d'),
            'balance': round(current_balance, 2)
        })
    
    return forecast

def detect_anomalies(data, contamination=0.05):
    """
    Placeholder function for anomaly detection.
    In a real implementation, this would use Isolation Forest or other anomaly detection algorithms.
    
    Args:
        data (pd.DataFrame): Preprocessed transaction data
        contamination (float): Expected proportion of anomalies
        
    Returns:
        list: Indices of transactions flagged as anomalies
    """
    # This is a placeholder implementation
    # In a real scenario, we would train and use a proper anomaly detection model
    
    if not isinstance(data, pd.DataFrame) or len(data) == 0:
        return []
    
    # Generate random anomalies for demonstration
    num_anomalies = max(1, int(len(data) * contamination))
    anomaly_indices = random.sample(range(len(data)), num_anomalies)
    
    # Return transaction IDs and anomaly scores
    anomalies = []
    for idx in anomaly_indices:
        try:
            transaction_id = data.iloc[idx].get('id', idx)
            anomaly_score = random.uniform(0.7, 1.0)  # Random high anomaly score
            
            anomalies.append({
                'transaction_id': transaction_id,
                'anomaly_score': round(anomaly_score, 4),
                'reason': random.choice([
                    'Unusual amount',
                    'Unusual merchant',
                    'Unusual time',
                    'Unusual location',
                    'Pattern deviation'
                ])
            })
        except:
            pass
    
    return anomalies