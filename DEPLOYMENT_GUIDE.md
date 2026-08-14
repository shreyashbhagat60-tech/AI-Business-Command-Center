# 🚀 Deployment Guide - AI Business Command Center

This guide shows you step-by-step how to deploy your AI Business Command Center online for free.

---

## 🌟 Method 1: Render.com (1-Click Unified Full-Stack - Recommended)

Render provides free cloud hosting that runs both the **React Frontend** and **FastAPI ML Backend** inside one container with a single public URL.

### Steps:
1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of AI Business Command Center"
   git remote add origin https://github.com/YOUR_USERNAME/AI-Business-Command-Center.git
   git push -u origin main
   ```
2. Go to [Render.com](https://render.com) and log in.
3. Click **"New +"** -> **"Web Service"**.
4. Connect your GitHub repository.
5. Configure the following:
   - **Name**: `ai-business-command-center`
   - **Language / Runtime**: `Docker`
   - **Branch**: `main`
   - **Plan**: `Free`
6. Click **"Deploy Web Service"**.
7. Render will automatically build the React frontend, install Python dependencies, train the ML models, and give you a live HTTPS URL like:
   `https://ai-business-command-center.onrender.com`

---

## ⚡ Method 2: Railway.app

1. Go to [Railway.app](https://railway.app) and log in with GitHub.
2. Click **"New Project"** -> **"Deploy from GitHub repo"**.
3. Select your `AI-Business-Command-Center` repository.
4. Railway will automatically detect the root `Dockerfile` and deploy the full-stack container.
5. Under service **Settings**, click **"Generate Domain"** to get your public URL.

---

## 🌐 Method 3: Vercel (Frontend) + Render (Backend)

If you prefer deploying the React frontend on Vercel's global edge network:

### Step 1: Deploy Backend on Render
1. In Render, select **"New +"** -> **"Web Service"**.
2. Connect your repo, set **Root Directory** to `backend`.
3. Set:
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt && python train_models.py`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. Copy your backend URL (e.g., `https://ai-bcc-backend.onrender.com`).

### Step 2: Deploy Frontend on Vercel
1. Go to [Vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Import your GitHub repository.
3. Set **Root Directory** to `frontend`.
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://ai-bcc-backend.onrender.com`
5. Click **"Deploy"**.

---

## 🐳 Method 4: Local or VPS Docker Deployment

To run containerized anywhere (AWS EC2, DigitalOcean, or your local machine):

```bash
# Build and run with docker-compose
docker-compose up --build -d
```
Access at `http://localhost:8000`.

---

## 📋 Checklist Before Presenting

- [x] Backend ML models trained and loaded (`/health` returns `200 OK`).
- [x] Dark and Light theme toggle tested.
- [x] All 4 ML prediction pages tested (Sales, Profit, Churn, Segmentation).
- [x] AI Advisor health score calculated.
- [x] Report tables and CSV/Excel/PDF export functioning.
- [x] Mobile drawer responsive on all screen sizes.
