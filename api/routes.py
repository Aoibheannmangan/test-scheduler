from flask import jsonify
import requests
from config import REDCAP_API_URL, API_TOKEN  

def get_data():
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
    }
    
    # Make the POST request to the REDCap API
    response = requests.post(REDCAP_API_URL, data=payload)
    
    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()  # Parse the JSON response
        return jsonify(data)  # Return the data as a JSON response

    else:
        return jsonify({'error': 'Failed to fetch data', 'status_code': response.status_code}), response.status_code
