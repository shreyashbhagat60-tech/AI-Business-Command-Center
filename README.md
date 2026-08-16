# 🚀 AI Business Command Center
### *AI-Powered Business Intelligence, Predictive Analytics & Decision Support Platform*

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.4+-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0+-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 📌 1. Project Overview & Vision

**AI Business Command Center** is a centralized, intelligent enterprise software platform designed to convert raw operational business telemetry into high-confidence predictions, automated SWOT diagnostics, and actionable executive decisions.

```
BUSINESS DATA ──► DATA PROCESSING ──► BUSINESS ANALYTICS ──► ML PREDICTIONS ──► CUSTOMER INTELLIGENCE ──► AI RECOMMENDATIONS ──► BUSINESS DECISIONS
```

The system empowers founders, executives, data scientists, and analysts to answer 7 core operational questions:
1. **What is happening?** (Real-time KPI telemetry, regional sales, profit trends, category margins)
2. **Why is it happening?** (Cost drivers, discount erosion, delivery turnaround times, customer dissatisfaction signals)
3. **What is likely to happen?** (RandomForestRegressor forecasting for sales revenues and profit trajectories)
4. **Which customers are at risk?** (Classification model with probability scoring and churn driver identification)
5. **Which customers are valuable?** (Behavioral RFM customer clustering and segment tiering)
6. **Which regions/categories are performing best?** (Multidimensional analytics with custom slicing and filtering)
7. **What should the business do next?** (Dynamic AI Business Advisor with a 0–100 Business Health Score, SWOT matrices, and conversational AI assistant)

---

## 🏛️ 2. Architectural Architecture

```
AI-Business-Command-Center/
├── backend/
│   ├── app.py                      # FastAPI Application Entrypoint & Middleware
│   ├── requirements.txt            # Production Python Dependencies
│   ├── .env.example                # Environment Variable Template
│   ├── test_backend.py             # 13-Suite Backend Automated Verification
│   ├── train_models.py             # ML Training & Artifact Export Pipeline
│   ├── database/
│   │   ├── __init__.py
│   │   ├── database.py             # SQLAlchemy Engine (SQLite + PostgreSQL switchable)
│   │   └── models.py               # ORM Models (User, AuditLog, ReportArchive)
│   ├── models/
│   │   ├── sales_model.pkl         # Trained RandomForestRegressor for Sales
│   │   ├── profit_model.pkl        # Trained RandomForestRegressor for Profit
│   │   ├── churn_model.pkl         # Trained RandomForestClassifier for Churn Risk
│   │   ├── segmentation_model.pkl  # Trained RandomForestClassifier for Customer Segments
│   │   ├── scaler.pkl              # Fitted StandardScaler Dictionaries
│   │   ├── encoder.pkl             # Fitted Categorical Encoders
│   │   └── feature_names.pkl       # Strict Feature Ordering & Vector Ordering Dictionaries
│   ├── routers/
│   │   ├── auth.py                 # JWT Registration, Login, Profile & Password Recovery
│   │   ├── dashboard.py            # Executive KPIs, Regional Sales, Trends, Insights
│   │   ├── sales.py                # Sales Revenue Prediction Endpoint
│   │   ├── profit.py               # Profit & Margin Simulator Endpoint
│   │   ├── churn.py                # Churn Vulnerability Classifier Endpoint
│   │   ├── segmentation.py         # Customer Segment Classifier Endpoint
│   │   ├── advisor.py              # AI Health Score, SWOT Recommendations & Conversational Chat
│   │   ├── analytics.py            # Multidimensional Slicing & Filter Engine
│   │   ├── reports.py              # Tabular Audits & Real CSV/Excel File Streaming
│   │   └── health.py               # System Readiness & ML Diagnostic Probes
│   ├── schemas/                    # Pydantic v2 Request & Response Data Contracts
│   ├── services/
│   │   ├── auth_service.py         # Bcrypt/JWT Token Lifecycle & Database Persistence
│   │   ├── model_loader.py         # Thread-Safe ML Artifact Memory Registry
│   │   ├── preprocessing.py        # Model-Specific Feature Mismatch Protection Pipelines
│   │   ├── ai_engine.py            # Predictive Inference & Health Score Algorithm
│   │   ├── advisor_service.py      # Strategic SWOT Logic & Conversational Q&A
│   │   ├── report_service.py       # Report Tabulation & File Stream Formatter
│   │   └── analytics.py            # Aggregations, Group-Bys & Pivot Metrics
│   ├── utils/
│   │   ├── security.py             # Cryptographic Hashing (Bcrypt/HMAC) & JWT Issuance
│   │   └── helpers.py              # Math Utilities & Safe Division Handlers
│   └── data/
│       └── dataset.csv             # Enterprise Business Dataset (2,500 Records)
│
├── frontend/
│   ├── package.json                # React + Vite + UI Dependencies
│   ├── index.html                  # HTML5 Entrypoint
│   ├── vite.config.js              # Vite Build Configuration
│   ├── public/
│   └── src/
│       ├── App.jsx                 # Route Shell with Auth Guard & Navigation Layout
│       ├── main.jsx                # React DOM Bootstrapper
│       ├── App.css                 # Master Design System, Dark/Light Themes & Glassmorphism
│       ├── index.css               # Modern Typography, CSS Variables & Fluid Tokens
│       ├── components/
│       │   ├── Navbar.jsx          # Executive Header, Profile Dropdown, Search, Notification Drawer
│       │   ├── Sidebar.jsx         # Responsive Navigation Rail & ML Heartbeat Badge
│       │   ├── AuthLayout.jsx      # Split-Screen Value Hero & Form Container
│       │   ├── ProtectedRoute.jsx  # JWT Guard for Authenticated Routes
│       │   ├── KPICard.jsx         # Metric Cards with Micro-Trends & Sparklines
│       │   ├── Charts.jsx          # Recharts Dynamic Visualizations
│       │   ├── PredictionCard.jsx  # ML Forecast Outcome & Feature Impact Breakdown
│       │   ├── AIInsightCard.jsx   # Dynamic SWOT Strategic Banners
│       │   ├── NotificationPanel.jsx # Real-Time Alert Drawer
│       │   ├── Loading.jsx         # Skeleton & Neural Pulse Spinners
│       │   ├── ErrorMessage.jsx    # Accessible Feedback Alert Banners
│       │   ├── ReportTable.jsx     # Sortable, Paginated & Searchable Data Grids
│       │   └── ExportButtons.jsx   # Real CSV, Excel (.xlsx), and PDF Exports
│       ├── pages/
│       │   ├── Login.jsx           # Sign-In with 1-Click Evaluation Credentials
│       │   ├── Register.jsx        # Account Creation with Role Selection & Terms
│       │   ├── ForgotPassword.jsx  # Credential Recovery Workflow
│       │   ├── Dashboard.jsx       # Central Executive Command Center
│       │   ├── Analytics.jsx       # Dynamic Multidimensional Filter Matrix
│       │   ├── SalesPrediction.jsx # ML Revenue Forecasting Simulator
│       │   ├── ProfitPrediction.jsx# CVP Profit Margin Simulator
│       │   ├── CustomerChurn.jsx   # Churn Risk Vulnerability Diagnostic
│       │   ├── CustomerSegmentation.jsx # RFM Customer Persona Clustering
│       │   ├── AIAdvisor.jsx       # Health Score Gauge, SWOT Matrix & Conversational Chat
│       │   ├── Reports.jsx         # 5 Comprehensive Business Audit Tables
│       │   ├── Profile.jsx         # User Profile & Security Credential Editor
│       │   └── Settings.jsx        # System Health, Model Diagnostics & UI Settings
│       ├── context/
│       │   ├── AuthContext.jsx     # User Session, Token Storage & Auth State Management
│       │   └── ThemeContext.jsx    # Dark / Light Theme Manager with LocalStorage Persistence
│       └── services/
│           ├── api.js              # Axios Client with Bearer Token Interceptor
│           └── authApi.js          # Dedicated Authentication Service Client
└── README.md
```

---

## ⚡ 3. Key Features & Capabilities

### 🔐 1. Enterprise Authentication & Security
- **Secure Password Hashing:** High-entropy salt + Bcrypt password hashing.
- **Stateless JWT Tokens:** Cryptographically signed Bearer tokens (`HS256`) with configurable expiration.
- **Role-Based Profiles:** Support for Executive CEO, COO, VP of Sales, Lead Data Scientist, and Analyst roles.
- **1-Click Evaluation Accounts:** Pre-seeded demo credentials for instant evaluator testing:
  - `admin@commandcenter.ai` / `AdminPassword123!` (Executive CEO)
  - `demo@company.com` / `Demo1234!` (Lead Data Scientist)
- **Account Self-Service:** Full profile editing, password changing, and safe forgot-password recovery.

### 📊 2. Executive Command Center Dashboard
- **10 Core Business KPIs:** Total Revenue, Net Profit, Total Orders, Unique Customers, Gross Profit Margin, Sales Growth Velocity, Profit Growth, Churn Rate, Average Order Value (AOV), Customer Retention Rate.
- **Interactive Visualizations:**
  - Revenue & Profit Trends (Multi-line charts with hover tooltips)
  - Regional Performance Bar Charts (North, South, East, West)
  - Category Share (Electronics, Furniture, Clothing, Grocery, Home & Kitchen, Fitness)
  - Customer Persona Donut Breakdown
  - Churn Vulnerability Distribution (Active vs. At Risk vs. Churned)
- **AI Opportunity & Alert Banners:** Dynamic real-time alerts flagging regional momentum and margin contraction.

### 🤖 3. Machine Learning & Predictive Engines
- **Sales Revenue Prediction:** `RandomForestRegressor` forecasting expected sales volume based on product price, discounts, marketing budget, customer satisfaction, and inventory levels.
- **Profit & Margin Simulator:** `RandomForestRegressor` predicting net dollar profit and operating margin percentages.
- **Customer Churn Risk Classifier:** `RandomForestClassifier` outputting probability of churn (0.00–1.00) with High/Medium/Low risk classifications and customized retention interventions.
- **Customer Segmentation Engine:** `RandomForestClassifier` clustering customer records into 5 distinct behavioral segments: *High Value Customer*, *Loyal Customer*, *Regular Customer*, *At-Risk Customer*, and *Low Value Customer*.
- **🛡️ Strict Feature-Mismatch Protection:** Dedicated preprocessing functions (`preprocess_sales`, `preprocess_profit`, `preprocess_churn`, `preprocess_segmentation`) that automatically order, encode, and scale input vectors to match model expectations exactly, preventing shape mismatches.
- **Zero-Crash Demo Fallback:** If an external model artifact is missing or corrupt, the platform transparently executes deterministic business heuristic fallbacks and badges the result as `Demo Mode`.

### 🧠 4. AI Business Decision Advisor & Conversational Assistant
- **Business Health Score (0–100):** Weighted multi-factor algorithm evaluating:
  - Profit Margin Pillar (25 pts)
  - Sales Growth Velocity (25 pts)
  - Customer Retention Index (25 pts)
  - Inventory & Operations (15 pts)
  - Marketing Spend ROI (10 pts)
  - Grading scale: **80–100: Excellent (Grade A)** | **60–79: Good (Grade B)** | **40–59: Needs Attention (Grade C)** | **0–39: Critical (Grade D)**
- **4-Quadrant SWOT Decision Matrix:**
  1. *Key Insights* ("What is happening?")
  2. *Strategic Recommendations* ("What should leadership do next?")
  3. *Critical Warnings* ("What requires immediate risk mitigation?")
  4. *Growth Opportunities* ("Where can the business expand?")
- **Conversational AI Q&A Assistant:** Interactive executive chat interface answering natural language queries (*"Why did profit decrease?"*, *"Which region is performing best?"*, *"Which customers are at risk?"*) using live business metrics.

### 📑 5. Audits, Reporting & Real File Exports
- **5 Comprehensive Audit Views:** Sales Transactions, Profit & Cost Audit, Churn Vulnerability, Customer Segmentation, and Executive Performance Summary.
- **Rich Data Grid:** Instant live search, column sorting, category/region filtering, and pagination.
- **Real File Exports:**
  - **CSV Export:** Generated in-browser or streamed from backend via `text/csv`.
  - **Excel Export (.xlsx):** Native multi-column formatted spreadsheet stream via `openpyxl`.
  - **PDF Export (.pdf):** Executive formatted vector PDF documents with report metadata and headers via `jspdf` & `jspdf-autotable`.

---

## 🛠️ 4. Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend Framework** | React 18 (Vite) | High-performance SPA with fast HMR |
| **Styling & Theme** | Modern Vanilla CSS | Custom design tokens, glassmorphism, responsive breakpoints |
| **Icons & Visuals** | Lucide React | Modern executive SVG icon library |
| **Charts & Data Viz** | Recharts | Composable SVG charts with animations |
| **State & Auth** | React Context API | Global authentication and Dark/Light theme state |
| **HTTP Client** | Axios | Configured with Bearer token interceptor |
| **Backend API** | FastAPI (Python 3.11+) | Async high-throughput REST framework |
| **ASGI Web Server** | Uvicorn | Production-grade ASGI server |
| **Validation & Schema** | Pydantic v2 | Strict request/response data contracts |
| **Database & ORM** | SQLAlchemy 2.0 | Dual-engine support: SQLite (local) + PostgreSQL (prod) |
| **Machine Learning** | Scikit-Learn, NumPy, Pandas, Joblib | Random Forest models, encoders, and scalers |
| **Spreadsheet Engine** | OpenPyXL, XLSX | Binary Excel file generation |
| **API Documentation** | Swagger UI & ReDoc | Auto-generated interactive API documentation |

---

## 🚀 5. Getting Started & Local Installation

### Prerequisites
- **Python 3.10+** (Tested on Python 3.11, 3.12, 3.14)
- **Node.js 18+** & **npm 9+**

---

### Step 1: Clone Repository
```bash
git clone https://github.com/shreyashbhagat60-tech/AI-Business-Command-Center.git
cd AI-Business-Command-Center
```

---

### Step 2: Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
python -m pip install -r requirements.txt

# (Optional) Verify backend test suite
python test_backend.py

# Start the FastAPI Server
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
```
Backend will be available at: **`http://localhost:8000`**  
Interactive Swagger API Docs: **`http://localhost:8000/docs`**  
ReDoc API Documentation: **`http://localhost:8000/redoc`**

---

### Step 3: Frontend Setup
```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite Development Server
npm run dev
```
Frontend will be accessible at: **`http://localhost:5173`** (or `http://localhost:3000`)

---

## 🔑 6. Evaluation Accounts

When opening the web application, you can log in immediately using the 1-click evaluation shortcuts:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Executive CEO** | `admin@commandcenter.ai` | `AdminPassword123!` | Full Enterprise Admin |
| **Lead Data Scientist** | `demo@company.com` | `Demo1234!` | Analyst & ML Explorer |

You can also click **Create Account** to register a new user in the database.

---

## 🌐 7. API Endpoints Reference

### Authentication & Profile
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register new user account | No |
| `POST` | `/auth/login` | Authenticate credentials & issue JWT | No |
| `GET` | `/auth/me` | Fetch active user session profile | Yes (Bearer) |
| `POST` | `/auth/forgot-password` | Request password recovery instructions | No |
| `GET` | `/profile` | Retrieve user profile details | Yes (Bearer) |
| `PUT` | `/profile` | Update profile information & password | Yes (Bearer) |
| `POST` | `/auth/logout` | Invalidate active user session | No |

### Business Intelligence & Predictions
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | System health check & ML model status probe |
| `POST` | `/health/reload` | Dynamically reload ML artifacts into memory |
| `GET` | `/dashboard` | Executive KPIs, charts & dynamic AI insights |
| `POST` | `/predict/sales` | Predict sales revenue using ML Random Forest |
| `POST` | `/predict/profit` | Predict net dollar profit and margin percentage |
| `POST` | `/predict/churn` | Classify customer churn risk and retention actions |
| `POST` | `/predict/segment` | Predict customer behavioral RFM segment |
| `POST` | `/advisor` | Generate Business Health Score & SWOT advice |
| `POST` | `/advisor/chat` | Conversational AI Decision Assistant Q&A |
| `GET` | `/analytics` | Multidimensional aggregations across dimensions |
| `POST` | `/analytics/filter` | Apply dynamic filters on business metrics |
| `GET` | `/reports` | Tabular report records for sales, profit, churn, etc. |
| `GET` | `/reports/export` | Stream real CSV or Excel (.xlsx) file download |

---

## 📦 8. Production Deployment

### Frontend (Vercel / Netlify / Cloudflare Pages)
1. Set the Root Directory to `frontend`.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Set Environment Variable: `VITE_API_URL=https://your-fastapi-backend.onrender.com`

### Backend (Render / Railway / AWS ECS / DigitalOcean)
1. Root Directory: `backend`
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables:
   - `DATABASE_URL=postgresql://user:password@hostname/dbname` (optional; falls back to SQLite)
   - `JWT_SECRET_KEY=your-secure-production-key`
   - `CORS_ORIGINS=https://your-frontend.vercel.app`

---

## 📄 9. License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

### Built with ❤️ for enterprise intelligence and academic excellence.
