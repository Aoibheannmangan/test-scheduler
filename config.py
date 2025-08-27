# Keep in different file for security. Should later be encrypted**

import os

REDCAP_API_URL = os.getenv('REDCAP_API_URL', 'https://redcap.ucc.ie/api/')
API_TOKEN = os.getenv('API_TOKEN', '') # Change API token if needed
