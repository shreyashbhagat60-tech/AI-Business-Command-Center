from .dashboard import router as dashboard_router
from .sales import router as sales_router
from .profit import router as profit_router
from .churn import router as churn_router
from .segmentation import router as segmentation_router
from .advisor import router as advisor_router
from .analytics import router as analytics_router
from .reports import router as reports_router
from .health import router as health_router
from .auth import router as auth_router

__all__ = [
    "dashboard_router",
    "sales_router",
    "profit_router",
    "churn_router",
    "segmentation_router",
    "advisor_router",
    "analytics_router",
    "reports_router",
    "health_router",
    "auth_router",
]
