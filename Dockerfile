# ==========================================
# Multi-Stage Full-Stack Production Dockerfile
# Stage 1: Build React Frontend
# Stage 2: Python FastAPI Backend + ML Models
# ==========================================

FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ==========================================
# Final Production Runtime Image
# ==========================================
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend application and models
COPY backend/ ./backend/

# Copy built frontend assets to backend static directory
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose port (Render/Railway/Cloud will bind to $PORT)
EXPOSE 8000

WORKDIR /app/backend

# Train models on start if missing and run Uvicorn
CMD ["sh", "-c", "python train_models.py && uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]
