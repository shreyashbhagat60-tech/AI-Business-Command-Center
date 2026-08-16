from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class KPIData(BaseModel):
    revenue: float
    profit: float
    orders: int
    customers: int
    profit_margin: float
    average_order_value: float
    customer_retention: float
    churn_rate: float
    sales_growth: float
    profit_growth: float

class TrendItem(BaseModel):
    date: str
    sales: float
    profit: float
    orders: int

class RegionalItem(BaseModel):
    region: str
    sales: float
    profit: float
    orders: int

class CategoryItem(BaseModel):
    category: str
    sales: float
    profit: float
    quantity: int
    profit_margin: float

class SegmentDistribution(BaseModel):
    name: str
    count: int
    percentage: float

class ChurnDistribution(BaseModel):
    status: str
    count: int
    percentage: float

class AIInsightBanner(BaseModel):
    id: str
    type: str  # opportunity, warning, alert, optimization
    title: str
    message: str
    metric: Optional[str] = None
    impact: str

class DashboardResponse(BaseModel):
    kpis: KPIData
    sales_trend: List[TrendItem]
    profit_trend: List[TrendItem]
    regional_sales: List[RegionalItem]
    category_sales: List[CategoryItem]
    customer_segmentation: List[SegmentDistribution]
    customer_churn: List[ChurnDistribution]
    ai_insights: List[AIInsightBanner]
    system_status: Dict[str, Any]
    is_demo: bool = False
