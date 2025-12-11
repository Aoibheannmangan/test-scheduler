# ------------------------------
# FRONTEND BUILD STAGE
# ------------------------------
FROM node:18 AS build-frontend
WORKDIR /app

# Copy only package.json for caching
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY public ./public
COPY src ./src
RUN npm run build

# ------------------------------
# BACKEND BUILD STAGE
# ------------------------------
FROM python:3.11-slim
WORKDIR /app

# Install dependencies for Python + SQLite (if used)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc sqlite3 && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY api/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY api ./api

# Copy React build from frontend stage
COPY --from=build-frontend /app/build ./build

# Set environment variables
ENV FLASK_APP=api.wsgi
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Expose Flask port
EXPOSE 5000

# Start Flask app with Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:5000", "api.wsgi:app"]
