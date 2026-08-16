from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class ChurnPredictionRequest(BaseModel):
    age: int = Field(default=32, ge=18, le=100, description="Customer age")
    tenure_months: int = Field(default=14, ge=1, le=120, description="Customer tenure in months")
    purchase_frequency: int = Field(default=4, ge=1, le=50, description="Purchases per quarter/year")
    total_purchases: int = Field(default=18, ge=1, le=500, description="Cumulative lifetime orders")
    average_order_value: float = Field(default=180.0, ge=1.0, description="Average order value")
    customer_satisfaction: float = Field(default=3.8, ge=1.0, le=5.0, description="Satisfaction score (1-5)")
    returned: int = Field(default=0, ge=0, le=1, description="Past product returns indicator")
    discount: float = Field(default=10.0, ge=0.0, le=100.0, description="Average discount rate used")
    delivery_time: int = Field(default=4, ge=1, le=30, description="Average delivery days experienced")
    region: str = Field(default="South", description="Customer geographical region")

class ChurnPredictionResponse(BaseModel):
    churn_prediction: int  # 0 or 1
    churn_probability: float  # 0.00 to 1.00
    risk_level: str  # "Low", "Medium", "High"
    risk_color: str  # green, orange, red
    model_status: str
    input_summary: Dict[str, Any]
    key_drivers: List[str]
    recommended_actions: List[str]
    is_demo: bool = False
