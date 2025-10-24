# Keep in different file for security. Should later be encrypted**

import os
from dotenv import load_dotenv, dotenv_values

load_dotenv()

REDCAP_API_URL = os.getenv('REDCAP_API_URL', 'https://redcap.ucc.ie/api/')
API_TOKEN = os.getenv('API_TOKEN' ) # Change API token if needed

if not API_TOKEN:
    print("API Token not found. Please fix")