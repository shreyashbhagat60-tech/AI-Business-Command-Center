from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class ProfitPredictionRequest(BaseModel):
    unit_price: float = Field(default=500.0, ge=1.0, description="Unit selling price")
    quantity: int = Field(default=3, ge=1, le=100, description="Sold quantity")
    cost: float = Field(default=300.0, ge=0.0, description="Base product unit cost")
    discount: float = Field(default=10.0, ge=0.0, le=100.0, description="Discount percentage")
    marketing_spend: float = Field(default=2000.0, ge=0.0, description="Marketing expenditure")
    customer_satisfaction: float = Field(default=4.2, ge=1.0, le=5.0, description="Customer satisfaction score")
    delivery_time: int = Field(default=3, ge=1, le=30, description="Delivery timeframe in days")
    returned: int = Field(default=0, ge=0, le=1, description="Return probability indicator (0 or 1)")
    category: str = Field(default="Electronics", description="Product category")
    region: str = Field(default="North", description="Sales region")

class ProfitPredictionResponse(BaseModel):
    predicted_profit: float
    predicted_revenue: float
    profit_margin_pct: float
    currency: str = "INR"
    input_summary: Dict[str, Any]
    model_status: str
    business_interpretation: str
    recommendation: str
    is_demo: bool = False
