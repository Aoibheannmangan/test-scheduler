# Keep in different file for security. Should later be encrypted**

import os

REDCAP_API_URL = os.getenv('REDCAP_API_URL', 'https://redcap.ucc.ie/api/')
API_TOKEN = os.getenv('API_TOKEN', 'CFDCD0DDA078B4619DD5D0C1450EA3A4') # Change API token if needed
