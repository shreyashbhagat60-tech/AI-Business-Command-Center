from fastapi import APIRouter
from services.model_loader import model_registry
from services.analytics import analytics_engine

router = APIRouter(tags=["System Health & Diagnostics"])

@router.get(
    "/health",
    summary="System Health & Model Status Diagnostic",
    description="Returns backend server health, connected ML models, dataset availability, and operational metrics."
)
async def health_check():
    status_info = model_registry.get_status()
    models_ready = {
        "sales": model_registry.is_model_available("sales"),
        "profit": model_registry.is_model_available("profit"),
        "churn": model_registry.is_model_available("churn"),
        "segmentation": model_registry.is_model_available("segmentation")
    }
    
    return {
        "status": "healthy",
        "service": "AI Business Command Center Core Engine",
        "version": "2.0.0",
        "models": models_ready,
        "model_details": status_info["models"],
        "auxiliary": status_info["auxiliary"],
        "dataset": {
            "loaded": analytics_engine.df is not None,
            "record_count": len(analytics_engine.df) if analytics_engine.df is not None else 0
        }
    }

@router.post(
    "/health/reload",
    summary="Reload ML Models and Data",
    description="Dynamically reloads ML model artifacts and dataset into active memory."
)
async def reload_models():
    model_registry.load_all()
    analytics_engine.load_dataset()
    return {
        "message": "Model registry and dataset reloaded successfully",
        "status": model_registry.get_status()
    }
