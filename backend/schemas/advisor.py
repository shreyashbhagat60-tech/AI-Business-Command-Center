from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class AdvisorRequest(BaseModel):
    revenue: Optional[float] = None
    profit: Optional[float] = None
    orders: Optional[int] = None
    customers: Optional[int] = None
    churn_rate: Optional[float] = None
    sales_growth: Optional[float] = None
    profit_growth: Optional[float] = None
    category_performance: Optional[List[Dict[str, Any]]] = None
    regional_performance: Optional[List[Dict[str, Any]]] = None
    inventory_information: Optional[Dict[str, Any]] = None
    marketing_spend: Optional[float] = None

class HealthScoreBreakdown(BaseModel):
    score: int
    grade: str
    status: str
    profit_margin_score: int
    growth_score: int
    retention_score: int
    inventory_score: int
    marketing_efficiency_score: int

class AdvisorResponse(BaseModel):
    health_score: HealthScoreBreakdown
    insights: List[Dict[str, Any]]
    recommendations: List[Dict[str, Any]]
    warnings: List[Dict[str, Any]]
    opportunities: List[Dict[str, Any]]
    executive_summary: str

class AdvisorChatRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Business question for the AI Advisor")

class AdvisorChatResponse(BaseModel):
    query: str
    answer: str
    metrics_referenced: Optional[Dict[str, Any]] = None
    category: Optional[str] = "General Decision Intelligence"
