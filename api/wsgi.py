# api/wsgi.py
from scheduler_api import create_app

app = create_app()
