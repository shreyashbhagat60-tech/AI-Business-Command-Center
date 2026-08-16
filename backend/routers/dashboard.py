from fastapi import APIRouter, HTTPException
import logging
from services.analytics import analytics_engine
from schemas.dashboard import DashboardResponse

logger = logging.getLogger("ai_command_center.routers.dashboard")
router = APIRouter(tags=["Dashboard"])

@router.get(
    "/dashboard",
    response_model=DashboardResponse,
    summary="Get Executive Dashboard Intelligence",
    description="Returns full KPIs, sales trends, profit trends, regional breakdown, category performance, customer segmentation, churn metrics, and dynamic AI insight banners."
)
async def get_dashboard():
    try:
        data = analytics_engine.get_dashboard_metrics()
        return data
    except Exception as e:
        logger.error(f"Error fetching dashboard metrics: {e}")
        raise HTTPException(status_code=500, detail="Internal server error fetching dashboard data.")
