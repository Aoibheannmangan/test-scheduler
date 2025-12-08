# Keep in different file for security. Should later be encrypted**
import os
from dotenv import load_dotenv, dotenv_values

load_dotenv()

# Determine the base directory of the project
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
INSTANCE_PATH = os.path.join(BASE_DIR, 'instance')

os.makedirs(INSTANCE_PATH, exist_ok=True)

REDCAP_API_URL = os.getenv('REDCAP_API_URL', 'https://redcap.ucc.ie/api/')
API_TOKEN = os.getenv('API_TOKEN')
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")

# Database configuration
SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', f'sqlite:///{os.path.join(INSTANCE_PATH, "scheduler.db")}')
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Flask-Migrate configuration
MIGRATION_DIR = os.path.join(BASE_DIR, 'migrations')