FROM python:3.11-slim

WORKDIR /app

# Install dependencies first for better layer caching.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5002

# python:3.11-slim has no curl/wget, so the healthcheck uses urllib instead
# of adding a package just for this.
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=5 \
  CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://localhost:5002/health').status == 200 else 1)"

# Gunicorn for production; app:app is the Flask instance.
CMD ["gunicorn", "--bind", "0.0.0.0:5002", "--workers", "2", "app:app"]
