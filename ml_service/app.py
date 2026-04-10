from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Dummy prediction route for queue times
@app.route('/api/predict_queue', methods=['POST'])
def predict_queue():
    data = request.json
    area_type = data.get('type') # e.g., 'food', 'gate', 'restroom'
    current_density = data.get('density', 0)
    
    # Simple heuristic to simulate ML model prediction
    # In a real scenario, we would use a scikit-learn model here
    base_time = 0
    if area_type == 'food':
        base_time = 5
    elif area_type == 'gate':
        base_time = 2
    elif area_type == 'restroom':
        base_time = 1
        
    estimated_wait_time = base_time + (current_density * random.uniform(0.1, 0.5))

    # Trend analysis: Simulating whether the queue is likely to grow or shrink
    # In a real ML model, this would be based on time-series forecasting (LSTM/ARIMA)
    trend = random.choice(['increasing', 'decreasing', 'stable'])
    confidence = round(random.uniform(0.7, 0.95), 2)

    return jsonify({
        'status': 'success',
        'predicted_wait_time_minutes': round(estimated_wait_time, 1),
        'trend': trend,
        'confidence': confidence,
        'timestamp': datetime.now().isoformat()
    })

# AI-based crowd flow heatmap prediction simulation
@app.route('/api/predict_heatmap', methods=['POST'])
def predict_heatmap():
    # Simulate generating future density points based on current
    # Return a set of points mapping to zones
    zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D']
    predictions = {
        zone: round(random.uniform(10, 100), 2) for zone in zones
    }
    
    return jsonify({
        'status': 'success',
        'heatmap_prediction': predictions,
        'timestamp': datetime.now().isoformat()
    })


import os

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', debug=True, port=port)
