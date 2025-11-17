# FRONTEND BUILD STAGE
FROM node:18 AS build-frontend
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY public ./public
COPY src ./src

RUN npm run build

# BACKEND STAGE
FROM python:3.11-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc sqlite3 && rm -rf /var/lib/apt/lists/*

COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY api ./api
COPY --from=build-frontend /app/build ./build
COPY seed_rooms.py /app/


ENV FLASK_APP=api.wsgi
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

EXPOSE 5000

CMD flask db upgrade && \
    python seed_rooms.py && \
    gunicorn api.wsgi:app --bind 0.0.0.0:$PORT --chdir /app