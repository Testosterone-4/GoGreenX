FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=7860

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Expose the HF default port
EXPOSE 7860

# Collect static files if possible, dummy secret key to avoid checking actual values
RUN SECRET_KEY="dummy_for_deployment" python manage.py collectstatic --noinput

# Run gunicorn server
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "green_living_hub.wsgi:application"]
