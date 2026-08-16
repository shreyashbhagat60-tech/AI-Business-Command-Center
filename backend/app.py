import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routers import (
    dashboard_router,
    sales_router,
    profit_router,
    churn_router,
    segmentation_router,
    advisor_router,
    analytics_router,
    reports_router,
    health_router,
    auth_router,
)
from services.model_loader import model_registry
from services.analytics import analytics_engine

# Setup structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("ai_command_center.main")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing AI Business Command Center Backend...")
    # Attempt to reload/check models and data on startup
    model_registry.load_all()
    analytics_engine.load_dataset()
    logger.info(f"ML Model Readiness: {model_registry.get_status()['models']}")
    yield
    logger.info("Shutting down AI Business Command Center Backend...")

app = FastAPI(
    title="AI Business Command Center API",
    description="Enterprise AI-Powered Business Intelligence, Predictive Machine Learning, and Decision Support Engine.",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global unhandled error at {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "InternalServerError",
            "message": "An unexpected error occurred while processing the request. Please verify inputs.",
            "path": str(request.url.path)
        }
    )

# Register Routers
app.include_router(dashboard_router)
app.include_router(sales_router)
app.include_router(profit_router)
app.include_router(churn_router)
app.include_router(segmentation_router)
app.include_router(advisor_router)
app.include_router(analytics_router)
app.include_router(reports_router)
app.include_router(health_router)
app.include_router(auth_router)

# Mount Frontend SPA if build exists
FRONTEND_DIST = os.path.join(os.path.dirname(BASE_DIR), "frontend", "dist")
if not os.path.exists(FRONTEND_DIST):
    FRONTEND_DIST = os.path.join(BASE_DIR, "static")

if os.path.exists(FRONTEND_DIST):
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse

    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        # Allow API docs and routes to proceed
        if full_path.startswith("docs") or full_path.startswith("redoc") or full_path.startswith("openapi.json"):
            return None
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return JSONResponse(status_code=404, content={"message": "Frontend build not found"})
else:
    @app.get("/", tags=["Root"])
    async def root():
        return {
            "platform": "AI Business Command Center",
            "status": "online",
            "documentation": "/docs",
            "redoc": "/redoc",
            "version": "2.0.0"
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)

