from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class SegmentationRequest(BaseModel):
    age: int = Field(default=38, ge=18, le=100, description="Customer age")
    tenure_months: int = Field(default=24, ge=1, le=120, description="Tenure in months")
    purchase_frequency: int = Field(default=8, ge=1, le=50, description="Purchase frequency")
    total_purchases: int = Field(default=45, ge=1, le=500, description="Total lifetime transactions")
    average_order_value: float = Field(default=420.0, ge=1.0, description="Average order value")
    customer_satisfaction: float = Field(default=4.6, ge=1.0, le=5.0, description="Satisfaction score (1-5)")
    discount: float = Field(default=8.0, ge=0.0, le=100.0, description="Average discount rate percentage")

class SegmentationResponse(BaseModel):
    segment: str
    segment_description: str
    characteristics: List[str]
    recommended_strategy: List[str]
    rfm_score: Dict[str, Any]
    model_status: str
    is_demo: bool = False
