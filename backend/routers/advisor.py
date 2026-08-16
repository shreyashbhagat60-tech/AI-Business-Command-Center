from fastapi import APIRouter, HTTPException
import logging
from schemas.advisor import AdvisorRequest, AdvisorResponse, AdvisorChatRequest, AdvisorChatResponse
from services.advisor_service import advisor_service

logger = logging.getLogger("ai_command_center.routers.advisor")
router = APIRouter(tags=["AI Advisor"])

@router.post(
    "/advisor",
    response_model=AdvisorResponse,
    summary="Generate AI Business Decision Support & Health Score",
    description="Processes enterprise metrics and outputs Business Health Score (0-100), AI Insights, Actionable Recommendations, Critical Warnings, and Growth Opportunities."
)
async def get_ai_business_advice(request: AdvisorRequest = AdvisorRequest()):
    try:
        payload = request.model_dump()
        result = advisor_service.get_advice(payload)
        return result
    except Exception as e:
        logger.error(f"Error generating AI advisor strategy: {e}")
        raise HTTPException(status_code=500, detail="Unable to generate AI business advice.")

@router.post(
    "/advisor/chat",
    response_model=AdvisorChatResponse,
    summary="AI Business Decision Chat Assistant",
    description="Interactive conversational interface answering complex executive queries regarding regional performance, profit trends, category margins, and churn risks using live data."
)
async def chat_with_advisor(request: AdvisorChatRequest):
    try:
        res = advisor_service.answer_query(request.query)
        return AdvisorChatResponse(**res)
    except Exception as e:
        logger.error(f"Error answering advisor chat: {e}")
        raise HTTPException(status_code=500, detail="Unable to process advisor query.")
