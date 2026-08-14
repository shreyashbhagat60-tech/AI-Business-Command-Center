# AI Business Command Center

> **Enterprise AI-Powered Business Intelligence, Predictive Machine Learning, and Decision Support Platform**

An intelligent, full-stack decision command center that transforms raw multi-dimensional business telemetry into real-time KPI metrics, predictive ML forecasts (Sales, Profit, Customer Churn, Customer Segmentation), SWOT decision advisory, and executive audit reports.

---

## 🌟 Key Highlights & Capabilities

- **Executive BI Command Center**: 8 core KPI cards (Revenue, Profit, Orders, Customers, Margin, AOV, Retention, Churn), dynamic multi-factor AI insight banners, and 7 interactive charts.
- **Predictive Machine Learning Pipelines**:
  - **Sales Revenue Predictor**: `RandomForestRegressor` trained on multi-channel order variables (Quantity, Pricing, Regional factors, Category elasticity, Logistics turnaround).
  - **Profit & Margin Simulator**: `RandomForestRegressor` evaluating gross revenue, cost structures, promotional discount sensitivity, and marketing efficiency.
  - **Customer Churn Risk Classifier**: `RandomForestClassifier` outputting real-time probability, risk tiering (Low / Medium / High), key risk drivers, and automated retention playbooks.
  - **Customer Segmentation Engine**: High-dimensional RFM & behavioral classifier grouping accounts into *High Value*, *Loyal*, *Regular*, *At-Risk*, and *Low Value* personas.
- **AI Business Advisor**: Automated SWOT intelligence, 5-pillar Business Health Score (0–100), strategic recommendations, and interactive what-if scenario simulations.
- **Multidimensional Analytics Explorer**: Filter telemetry dynamically across territories (North, South, East, West), catalog categories, customer segments, and custom date ranges.
- **Structured Reports & Multi-Format Export**: Paginated, sortable data grids with one-click **CSV**, **Excel (XLSX)**, and formatted **PDF** downloads.
- **Modern SaaS UI & Theme System**: High-contrast AI obsidian dark theme and crisp enterprise light theme, with responsive navigation and mobile drawer.
- **Zero-Crash Resiliency**: Model-specific preprocessing pipelines strictly aligned with `feature_names.pkl` to eliminate feature mismatch errors, paired with intelligent fallback demo modes.

---

## 🏗️ Architecture & Technology Stack

```
AI-Business-Command-Center/
├── backend/
│   ├── app.py                     # FastAPI entry point & CORS configuration
│   ├── requirements.txt           # Python backend dependencies
│   ├── train_models.py            # Automated ML pipeline & dataset generator
│   ├── test_backend.py            # Automated backend integration test suite
│   ├── data/
│   │   └── dataset.csv            # 2,500+ record multi-dimensional business dataset
│   ├── models/                    # Exported scikit-learn models & metadata
│   │   ├── sales_model.pkl
│   │   ├── profit_model.pkl
│   │   ├── churn_model.pkl
│   │   ├── segmentation_model.pkl
│   │   ├── scaler.pkl
│   │   ├── encoder.pkl
│   │   └── feature_names.pkl
│   ├── routers/                   # Modular REST API routes
│   │   ├── dashboard.py           # GET /dashboard
│   │   ├── sales.py               # POST /predict/sales
│   │   ├── profit.py              # POST /predict/profit
│   │   ├── churn.py               # POST /predict/churn
│   │   ├── segmentation.py        # POST /predict/segment
│   │   ├── advisor.py             # POST /advisor
│   │   ├── analytics.py           # GET & POST /analytics/filter
│   │   ├── reports.py             # GET /reports & /reports/export
│   │   └── health.py              # GET /health & POST /health/reload
│   ├── schemas/                   # Pydantic validation schemas
│   ├── services/                  # Business logic, preprocessing, and AI engine
│   │   ├── model_loader.py        # Safe Joblib loader with hot-reload
│   │   ├── preprocessing.py       # Strict feature ordering pipelines
│   │   ├── ai_engine.py           # ML inferences & Health Score generator
│   │   └── analytics.py           # Pandas aggregation engine
│   └── utils/
│       └── helpers.py             # Currency & math calculation helpers
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx                # Layout & React Router v6 routing
        ├── main.jsx               # React DOM entry
        ├── index.css              # Design system tokens (Dark/Light HSL variables)
        ├── App.css                # Layout grids, sidebars, cards, and responsive rules
        ├── context/
        │   └── ThemeContext.jsx   # Theme state provider (persisted in localStorage)
        ├── services/
        │   └── api.js             # Centralized Axios client
        ├── components/            # Reusable UI component library
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── KPICard.jsx
        │   ├── Charts.jsx
        │   ├── AIInsightCard.jsx
        │   ├── PredictionCard.jsx
        │   ├── ReportTable.jsx
        │   ├── ExportButtons.jsx
        │   ├── NotificationPanel.jsx
        │   ├── Loading.jsx
        │   └── ErrorMessage.jsx
        └── pages/                 # 9 Application Pages
            ├── Dashboard.jsx
            ├── Analytics.jsx
            ├── SalesPrediction.jsx
            ├── ProfitPrediction.jsx
            ├── CustomerChurn.jsx
            ├── CustomerSegmentation.jsx
            ├── AIAdvisor.jsx
            ├── Reports.jsx
            └── Settings.jsx
```

### Technologies

- **Frontend**: React 19, Vite, Recharts, Lucide Icons, Axios, React Router DOM v6, SheetJS (XLSX), jsPDF, jsPDF-AutoTable.
- **Backend**: Python 3.14 / 3.10+, FastAPI, Uvicorn, Pydantic v2, Pandas, NumPy, Scikit-learn, Joblib, OpenPyXL.

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Python 3.10+ installed
- Node.js 18+ and npm installed

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# (Optional) Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Retrain models or generate fresh dataset
python train_models.py

# Start FastAPI server
uvicorn app:app --reload --port 8000
```
Backend will be live at: **http://127.0.0.1:8000**  
Interactive Swagger API documentation: **http://127.0.0.1:8000/docs**

### 3. Frontend Setup
```bash
# In a separate terminal, navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Launch Vite development server
npm run dev
```
Frontend will be live at: **http://localhost:5173**

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | System diagnostics, active dataset records, and `.pkl` model readiness |
| `POST` | `/health/reload` | Hot-reloads all ML models and dataset into server memory |
| `GET` | `/dashboard` | Complete telemetry: 8 KPIs, time-series trends, regional/category charts |
| `POST` | `/predict/sales` | Predicts sales revenue using `RandomForestRegressor` |
| `POST` | `/predict/profit` | Predicts gross profit, net margin %, and cost recommendations |
| `POST` | `/predict/churn` | Classifies customer retention risk (Low/Med/High) & retention playbook |
| `POST` | `/predict/segment` | Identifies RFM segment persona & strategic personalization plays |
| `POST` | `/advisor` | Computes Business Health Score (0-100) & SWOT decision intelligence |
| `POST` | `/analytics/filter` | Slices business data by Region, Category, Segment, and Date Range |
| `GET` | `/reports` | Tabular data for Sales, Profit, Churn, Segmentation, or Performance |
| `GET` | `/reports/export` | Generates streaming CSV / spreadsheet download |

---

## 🛡️ Robust Machine Learning Preprocessing

Previous iterations encountered dimensionality errors (*"X has 12 features, but model expected 28"*).  
This architecture resolves this permanently:
1. **`feature_names.pkl` Registry**: Saves the exact ordered sequence of feature columns during training.
2. **Dedicated Preprocessors**: `preprocess_sales()`, `preprocess_profit()`, `preprocess_churn()`, `preprocess_segmentation()` map incoming JSON fields to precise column indexes.
3. **Graceful Fallbacks**: If any `.pkl` file is unavailable, the backend automatically transitions to realistic mathematical heuristic estimation, explicitly labeled as *Demo Fallback Mode* to prevent application disruption.

---

## 🧪 Testing

To verify the backend API and ML models:
```bash
cd backend
python test_backend.py
```
This executes automated integration tests against all endpoints and validates 100% schema compliance.

---

## 📄 License
MIT License - Built for College Final Year Project & Commercial Decision Intelligence.
