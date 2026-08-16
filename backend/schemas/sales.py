from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class SalesPredictionRequest(BaseModel):
    age: int = Field(default=35, ge=18, le=100, description="Customer age")
    category: str = Field(default="Electronics", description="Product category")
    quantity: int = Field(default=2, ge=1, le=100, description="Order quantity")
    unit_price: float = Field(default=450.0, ge=1.0, description="Unit price of product")
    discount: float = Field(default=10.0, ge=0.0, le=100.0, description="Discount percentage")
    cost: float = Field(default=280.0, ge=0.0, description="Base product cost")
    marketing_spend: float = Field(default=2500.0, ge=0.0, description="Marketing spend for product")
    customer_satisfaction: float = Field(default=4.5, ge=1.0, le=5.0, description="Satisfaction rating (1-5)")
    region: str = Field(default="West", description="Customer / sales region")
    delivery_time: int = Field(default=3, ge=1, le=30, description="Expected delivery days")
    inventory: int = Field(default=120, ge=0, description="Available inventory stock")
    returned: int = Field(default=0, ge=0, le=1, description="Return status (0 or 1)")

class SalesPredictionResponse(BaseModel):
    predicted_sales: float
    currency: str = "INR"
    input_summary: Dict[str, Any]
    model_status: str
    confidence_score: float
    business_recommendation: str
    feature_impacts: Optional[List[Dict[str, Any]]] = None
    is_demo: bool = False
