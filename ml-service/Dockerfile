FROM python:3.11-slim

WORKDIR /app

# Install dependencies first for better layer caching.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5002
ENV PORT=5002

# python:3.11-slim has no curl/wget, so the healthcheck uses urllib instead
# of adding a package just for this. Reads $PORT so it still works on hosts
# (e.g. Render) that inject their own port.
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=5 \
  CMD python -c "import os,urllib.request,sys; sys.exit(0 if urllib.request.urlopen(f'http://localhost:{os.environ.get(\"PORT\",5002)}/health').status == 200 else 1)"

# Gunicorn for production; app:app is the Flask instance. Shell form (not
# exec array) so $PORT expands — most hosts inject their own PORT and expect
# the app to bind to it rather than a hardcoded value.
CMD gunicorn --bind 0.0.0.0:${PORT:-5002} --workers 2 app:app
