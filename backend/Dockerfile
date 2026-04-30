FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

# Railway injects $PORT; fallback to 8000 for local use
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
