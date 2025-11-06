from flask import Flask, jsonify
from flask_cors import CORS
import requests
from config import REDCAP_API_URL, API_TOKEN  

app = Flask(__name__)
CORS(app)

@app.route('/api/data', methods=['GET'])
#If REDCAP credentials are missing, return an error
def get_data():

    """Fetches data from the REDCap API and returns it ias JSON.
       This endpoint sends a POST request to the REDCap API the API_TOKEN 
       and REDCap url provided in the config.py file. It retrieves selected 
       fields such as site, date of birth and gestational age in weeks + days.

       **Request:**
       - Method: GET
       - Endpoint: `/api/data`
       - No request parameters required.

       **Behavior:**
        - If `REDCAP_API_URL` or `API_TOKEN` are missing, returns a 500 error with an 
        appropriate message.
        - Constructs a payload specifying which REDCap fields to retrieve.
        - Makes a POST request to the REDCap API to fetch the data.
        - If successful, returns the records in JSON format.
        - If the API request fails, returns an error message and HTTP 500.

        **Returns:**
        - `200 OK` and JSON array of REDCap records on success.
        - `500 Internal Server Error` and JSON error message if configuration or API 
        request fails.

        **Example Response:**
        ```json
        [
            {
                "record_id": "001",
                "nicu_dob": "2020-05-12",
                "nicu_sex": "F",
                "v2_next_visit_range": "2021-06-01 to 2021-06-15",
                ...
            },
            ...
        ]
        ```       
        
    """
        
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
   