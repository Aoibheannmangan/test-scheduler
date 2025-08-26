from flask import jsonify
import requests
from config import REDCAP_API_URL, API_TOKEN

def get_data():
    payload = {
        'token': API_TOKEN,
        'content': 'record',
        'format': 'json',
        'type': 'flat',
    }
    response = requests.post(REDCAP_API_URL, data=payload)
    data = response.json()
    return jsonify(data)
