#React Frontend
FROM node:18 AS build-frontend
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY public ./public
COPY src ./src

RUN npm run build

#Build the python backend
FROM python:3.11-slim
WORKDIR /app
#Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends gcc sqlite3 && rm -rf /var/lib/apt/lists/*
#Copy and install requirements
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
#Copy API code
COPY api ./api
#Copy frontend build
COPY --from=build-frontend /app/build ./build
#Ensure sql instance folder exists
RUN mkdir -p /app/api/instance && chmod -R 777 /app/api/instance
#Set environment variables
ENV FLASK_ENV=production PYTHONUNBUFFERED=1

#Run database migrations at build time
ENV FLASK_APP=api.wsgi
#Expose port
EXPOSE 5000

#Start gunicorn
CMD flask db upgrade && \
    gunicorn api.wsgi:app --bind 0.0.0.0:5000 --chdir /app
