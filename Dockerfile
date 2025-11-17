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

ENV FLASK_APP=api.wsgi
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

EXPOSE 5000

CMD ["gunicorn", "api.wsgi:app", "--bind", "0.0.0.0:5000", "--chdir", "/app"]
