from flask import jsonify
import requests
from config import REDCAP_API_URL, API_TOKEN  

def get_data():
    # Define the payload with the required parameters
    payload = {
        'token': API_TOKEN,  # Use the API token from your config
        'content': 'record',
        'action': 'export',
        'format': 'json',
        'type': 'flat',
        'csvDelimiter': '',
        'records[0]': '1',
        'fields[0]': 'nicu_dob',
        'forms[0]': 'neonatal_clinical_information',
        'rawOrLabel': 'raw',
        'rawOrLabelHeaders': 'raw',
        'exportCheckboxLabel': 'false',
        'exportSurveyFields': 'false',
        'exportDataAccessGroups': 'false',
        'returnFormat': 'json'
    }
    
    # Make the POST request to the REDCap API
    response = requests.post(REDCAP_API_URL, data=payload)
    
    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()  # Parse the JSON response
        return jsonify(data)  # Return the data as a JSON response

    elif response.status_code != 200:
        print('Error:', response.json())  # Print the error message
        
    else:
        return jsonify({'error': 'Failed to fetch data', 'status_code': response.status_code}), response.status_code
