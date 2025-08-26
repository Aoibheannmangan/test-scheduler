from flask import Flask, jsonify
import requests
import os
from dotenv import load_dotenv
load_dotenv()
import logging
from flask_cors import CORS

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

REDCAP_API_URL = os.getenv("REDCAP_API_URL")
REDCAP_API_TOKEN = os.getenv("REDCAP_API_TOKEN")

@app.route('/')
def home():
    return "Hello World"

@app.route('/api/redcap-demographics', methods=['Get'])
def get_demographics():
    try:
        payload = {
            'token': REDCAP_API_TOKEN,
            'content': 'record',
            'format': 'json',
            'action': 'export',
            'forms': 'registration',
        }

        response = requests.post(REDCAP_API_URL, data=payload)
        if response.status_code == 200: #If its a success
            try:
                return jsonify(response.json())
            except ValueError:
                return jsonify({'error': 'Received non-JSON response from REDCap'})
        else:
           return jsonify({'error': 'Error fetching REDCAp data'}), 500
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == "__main__":
    app.run(debug=True)