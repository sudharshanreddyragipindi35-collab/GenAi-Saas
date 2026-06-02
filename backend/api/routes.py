from fastapi import APIRouter

from backend.schemas.website import (
    HealthEnvelope,
    HealthStatus,
    WebsiteGenerationEnvelope,
    WebsiteGenerationRequest,
)
from backend.services.website_generator import WebsiteGeneratorService


router = APIRouter()
website_generator = WebsiteGeneratorService()


@router.get("/health", response_model=HealthEnvelope)
async def health_check() -> HealthEnvelope:
    return HealthEnvelope(
        status="success",
        message="Backend is healthy.",
        data=HealthStatus(service="backend", mode="local-mvp"),
    )


@router.post("/websites/generate", response_model=WebsiteGenerationEnvelope)
async def generate_website(
    payload: WebsiteGenerationRequest,
) -> WebsiteGenerationEnvelope:
    draft = website_generator.generate(payload)
    return WebsiteGenerationEnvelope(
        status="success",
        message="Website draft generated from structured requirements.",
        data=draft,
    )
