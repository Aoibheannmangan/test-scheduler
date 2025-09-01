# Keep in different file for security. Should later be encrypted**

import os

REDCAP_API_URL = os.getenv('REDCAP_API_URL', 'https://redcap.ucc.ie/api/')
API_TOKEN = os.getenv('API_TOKEN', '866DC544C7E9B61B5F323F999235D6BC') # Change API token if needed
