import pandas as pd
from datetime import datetime

def preprocess_data(transactions):
    """
    Preprocess transaction data for ML models.
    
    Args:
        transactions (list): List of transaction dictionaries
        
    Returns:
        pd.DataFrame: Preprocessed data ready for model input
    """
    # Convert to DataFrame if not already
    if not isinstance(transactions, pd.DataFrame):
        try:
            df = pd.DataFrame(transactions)
        except:
            # If conversion fails, return empty DataFrame
            return pd.DataFrame()
    else:
        df = transactions.copy()
    
    # Basic preprocessing steps
    try:
        # Convert date strings to datetime objects
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
            
        # Ensure amount is numeric and consistent (positive for income, negative for expenses)
        if 'amount' in df.columns:
            df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
            
        # Create day of week feature
        if 'date' in df.columns:
            df['day_of_week'] = df['date'].dt.dayofweek
            
        # Calculate running balance if not provided
        if 'balance' not in df.columns and 'amount' in df.columns:
            # Sort by date
            if 'date' in df.columns:
                df = df.sort_values('date')
                
            # Assume starting balance of 1000 for demo
            df['balance'] = 1000 + df['amount'].cumsum()
            
        # Encode categorical variables
        if 'category' in df.columns:
            # Simple one-hot encoding for demo
            category_dummies = pd.get_dummies(df['category'], prefix='category')
            df = pd.concat([df, category_dummies], axis=1)
            
    except Exception as e:
        print(f"Error in preprocessing: {e}")
    
    return df