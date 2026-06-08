from fastapi import APIRouter, HTTPException

from app.agents.orchestrator_agent import run_website_generation_workflow
from app.models.website_models import (
    WebsiteGenerationRequest,
    WebsiteGenerationResponse,
)
from app.services.json_parser_service import normalize_generated_website


router = APIRouter(tags=["Website Generation"])


@router.post("/generate-website", response_model=WebsiteGenerationResponse)
async def generate_website(request: WebsiteGenerationRequest):
    try:
        result = await run_website_generation_workflow(request)
        website = normalize_generated_website(result["website"])
        return WebsiteGenerationResponse(
            success=True,
            message="Website generated successfully",
            data=website,
            agentTrace=result["agentTrace"],
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Website generation failed: {exc}",
        ) from exc
