from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from predict import forecast_balance, detect_anomalies
from utils import preprocess_data

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'FinSight ML Service API',
        'endpoints': {
            '/forecast': 'GET - Forecast next 30 days of financial data',
            '/anomaly': 'POST - Detect anomalies in transaction data'
        }
    })

@app.route('/forecast', methods=['POST'])
def get_forecast():
    try:
        data = request.json
        
        if not data or 'transactions' not in data:
            return jsonify({'error': 'No transaction data provided'}), 400
            
        # Preprocess the data
        processed_data = preprocess_data(data['transactions'])
        
        # Generate forecast
        forecast_data = forecast_balance(processed_data)
        
        return jsonify({
            'success': True,
            'forecast': forecast_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/anomaly', methods=['POST'])
def get_anomalies():
    try:
        data = request.json
        
        if not data or 'transactions' not in data:
            return jsonify({'error': 'No transaction data provided'}), 400
            
        # Preprocess the data
        processed_data = preprocess_data(data['transactions'])
        
        # Detect anomalies
        anomalies = detect_anomalies(processed_data)
        
        return jsonify({
            'success': True,
            'anomalies': anomalies
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Modify this part at the bottom of your app.py file
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))  # Changed from 5001 to 5002
    app.run(host='0.0.0.0', port=port, debug=True)