FROM python:3.11-slim

WORKDIR /app

# Install dependencies first for better layer caching.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5002

# Gunicorn for production; app:app is the Flask instance.
CMD ["gunicorn", "--bind", "0.0.0.0:5002", "--workers", "2", "app:app"]
