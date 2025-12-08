#!/bin/sh
# entrypoint.sh

# Apply database migrations
flask db upgrade

# Seed the database
python seed_rooms.py

# Start Gunicorn
gunicorn api.wsgi:app --bind 0.0.0.0:5000 --chdir /app
