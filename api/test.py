from flask import Flask, jsonify
import requests
import os
from dotenv import load_dotenv
load_dotenv()
import logging
from flask_cors import CORS

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

REDCAP_API_URL = os.getenv("REDCAP_API_URL")
REDCAP_API_TOKEN = os.getenv("REDCAP_API_TOKEN")

@app.route('/api/patient', methods=['GET'])
def get_patdata():
    try:
        payload = {
        'token': REDCAP_API_TOKEN,
        'content': 'record',
        'format': 'json',
        'type': 'flat',
        'fields[0]': 'record_id', # Record id
        'fields[1]': 'nicu_ooa', # Kildare?
        'fields[2]': 'nicu_participant_group', # Part group
        'fields[3]': 'nicu_dob', # Dat of birth
        'fields[4]': 'nicu_dag', # Site
        'fields[5]': 'nicu_email',# Contact email
        'fields[6]': 'nicu_days_early',# Days early
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
    app.run(debug=True, host='0.0.0.0', port=5000)

    