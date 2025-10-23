from flask import Flask, jsonify
from flask_cors import CORS
import requests
from config import REDCAP_API_URL, API_TOKEN  

app = Flask(__name__)
CORS(app)

@app.route('/api/data', methods=['GET'])
def get_data():
    if not REDCAP_API_URL or not API_TOKEN:
        return jsonify({"error": "Missing REDCAP_API_URL or API_TOKEN"}), 500
     
    # Define the payload with the required parameters
    payload = {
        'token': API_TOKEN,
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
        'fields[7]': 'nicu_sex',# Sex of patient
        'fields[9]': 'nicu_gest_age_w',# Weeks of gestation
        'fields[10]': 'nicu_gest_age_d',# Days of gestation (Additional days of gestation)
        'fields[11]': 'v2_next_visit_range', # visit 2 window
        'fields[12]': 'v3_next_visit_between', # visit 3 window
        'fields[13]': 'v4_next_visit_range', # visit 4 window
        'fields[14]': 'v5_next_visit_range', # visit 5 window
    }
    
    try:
        # Make the POST request to the REDCap API
        response = requests.post(REDCAP_API_URL, data=payload)
        response.raise_for_status()  # Raise an error for bad status codes
        data = response.json()
        return jsonify(data)  # Return the data as a JSON response
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500
   