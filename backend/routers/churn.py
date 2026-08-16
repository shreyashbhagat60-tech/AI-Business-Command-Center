from fastapi import APIRouter, HTTPException
import logging
from schemas.churn import ChurnPredictionRequest, ChurnPredictionResponse
from services.ai_engine import ai_engine

logger = logging.getLogger("ai_command_center.routers.churn")
router = APIRouter(prefix="/predict", tags=["Predictions"])

@router.post(
    "/churn",
    response_model=ChurnPredictionResponse,
    summary="Predict Customer Churn Probability & Risk Tier",
    description="Analyzes customer tenure, satisfaction, return history, order value, and returns churn risk (Low/Medium/High) alongside retention actions."
)
async def predict_churn(request: ChurnPredictionRequest):
    try:
        payload = request.model_dump()
        result = ai_engine.predict_churn(payload)
        return result
    except Exception as e:
        logger.error(f"Failed to process churn prediction: {e}")
        raise HTTPException(status_code=500, detail="Unable to calculate customer churn risk. Please verify inputs.")
