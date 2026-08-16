from fastapi import APIRouter, HTTPException
import logging
from schemas.segmentation import SegmentationRequest, SegmentationResponse
from services.ai_engine import ai_engine

logger = logging.getLogger("ai_command_center.routers.segmentation")
router = APIRouter(prefix="/predict", tags=["Predictions"])

@router.post(
    "/segment",
    response_model=SegmentationResponse,
    summary="Classify Customer into Strategic Business Segment",
    description="Maps customer behavioral and transaction attributes to segments (High Value, Loyal, Regular, At-Risk, Low Value) and returns bespoke marketing strategies."
)
async def predict_segment(request: SegmentationRequest):
    try:
        payload = request.model_dump()
        result = ai_engine.predict_segment(payload)
        return result
    except Exception as e:
        logger.error(f"Failed to process customer segmentation: {e}")
        raise HTTPException(status_code=500, detail="Unable to determine customer segment. Please verify inputs.")
