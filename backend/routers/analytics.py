from fastapi import APIRouter, HTTPException
from typing import Dict, Any, Optional
from pydantic import BaseModel
import logging
from services.analytics import analytics_engine

logger = logging.getLogger("ai_command_center.routers.analytics")
router = APIRouter(prefix="/analytics", tags=["Analytics"])

class AnalyticsFilterRequest(BaseModel):
    region: Optional[str] = "All"
    category: Optional[str] = "All"
    segment: Optional[str] = "All"
    start_date: Optional[str] = None
    end_date: Optional[str] = None

@router.get(
    "",
    summary="Get Overview Analytics",
    description="Returns aggregate revenue, profit, unit volume, and category margins across the dataset."
)
async def get_analytics():
    try:
        return analytics_engine.get_filtered_analytics({})
    except Exception as e:
        logger.error(f"Error fetching analytics overview: {e}")
        raise HTTPException(status_code=500, detail="Failed to calculate analytics metrics.")

@router.post(
    "/filter",
    summary="Filter Analytics by Region, Category, Date Range",
    description="Returns dynamic multidimensional aggregations and data slice based on user filters."
)
async def filter_analytics(filter_req: AnalyticsFilterRequest):
    try:
        return analytics_engine.get_filtered_analytics(filter_req.model_dump())
    except Exception as e:
        logger.error(f"Error filtering analytics: {e}")
        raise HTTPException(status_code=500, detail="Failed to filter analytics dataset.")
