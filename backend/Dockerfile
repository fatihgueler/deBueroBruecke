FROM python:3.12-slim

# Tesseract OCR + Sprachpakete
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-deu \
    tesseract-ocr-eng \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Abhängigkeiten
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Quellcode
COPY . .

# Uploads-Verzeichnis
RUN mkdir -p /app/uploads

# Umgebungsvariablen
ENV PYTHONUNBUFFERED=1
ENV UPLOAD_DIR=/app/uploads
ENV DATABASE_URL=sqlite+aiosqlite:////data/buerbruecke.db

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
