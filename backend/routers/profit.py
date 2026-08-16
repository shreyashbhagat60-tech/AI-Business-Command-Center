from fastapi import APIRouter, HTTPException
import logging
from schemas.profit import ProfitPredictionRequest, ProfitPredictionResponse
from services.ai_engine import ai_engine

logger = logging.getLogger("ai_command_center.routers.profit")
router = APIRouter(prefix="/predict", tags=["Predictions"])

@router.post(
    "/profit",
    response_model=ProfitPredictionResponse,
    summary="Predict Profit and Margins",
    description="Calculates estimated gross profit, margin percentage, operational overhead, and business optimization recommendations."
)
async def predict_profit(request: ProfitPredictionRequest):
    try:
        payload = request.model_dump()
        result = ai_engine.predict_profit(payload)
        return result
    except Exception as e:
        logger.error(f"Failed to process profit prediction: {e}")
        raise HTTPException(status_code=500, detail="Unable to generate profit prediction. Please verify inputs.")
