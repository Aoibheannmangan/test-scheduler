# Keep in different file for security. Should later be encrypted**

import os
from dotenv import load_dotenv, dotenv_values

load_dotenv()

# Determine the base directory of the project
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
INSTANCE_PATH = os.path.join(BASE_DIR, 'instance')

REDCAP_API_URL = os.getenv('REDCAP_API_URL', 'https://redcap.ucc.ie/api/')
API_TOKEN = os.getenv('API_TOKEN')
SECRET_KEY = os.getenv('SECRET_KEY')

# Database configuration
SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Flask-Migrate configuration
MIGRATION_DIR = os.path.join(BASE_DIR, 'migrations')
