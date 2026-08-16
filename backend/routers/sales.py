from fastapi import APIRouter, HTTPException
import logging
from schemas.sales import SalesPredictionRequest, SalesPredictionResponse
from services.ai_engine import ai_engine

logger = logging.getLogger("ai_command_center.routers.sales")
router = APIRouter(prefix="/predict", tags=["Predictions"])

@router.post(
    "/sales",
    response_model=SalesPredictionResponse,
    summary="Predict Sales from Business Parameters",
    description="Preprocesses inputs, applies category/region encoders and feature scaling, and returns predicted sales revenue using trained RandomForestRegressor."
)
async def predict_sales(request: SalesPredictionRequest):
    try:
        payload = request.model_dump()
        result = ai_engine.predict_sales(payload)
        return result
    except Exception as e:
        logger.error(f"Failed to process sales prediction: {e}")
        raise HTTPException(status_code=500, detail="Unable to generate sales prediction. Please verify inputs.")
