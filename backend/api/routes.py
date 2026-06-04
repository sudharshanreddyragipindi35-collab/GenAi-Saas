import asyncio

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from backend.schemas.website import (
    AiConfigEnvelope,
    HealthEnvelope,
    HealthStatus,
    PromptPreview,
    PromptPreviewEnvelope,
    WebsiteGenerationEnvelope,
    WebsiteGenerationRequest,
)
from backend.services.claude_generator import GenerationProviderError
from backend.services.generation_orchestrator import WebsiteGenerationOrchestrator
from backend.services.prompt_templates import (
    PROMPT_TEMPLATE_VERSION,
    build_system_prompt,
    build_user_prompt,
)
from backend.services.rag_knowledge import retrieve_rag_context


router = APIRouter()
website_generator = WebsiteGenerationOrchestrator()


@router.get("/health", response_model=HealthEnvelope)
async def health_check() -> HealthEnvelope:
    ai_status = website_generator.get_status()
    return HealthEnvelope(
        status="success",
        message="Backend is healthy.",
        data=HealthStatus(
            service="backend",
            mode=ai_status.active_provider,
            ai_provider=ai_status.configured_provider,
            ai_enabled=ai_status.active_provider == "claude",
            model=ai_status.model,
        ),
    )


@router.get("/ai/config", response_model=AiConfigEnvelope)
async def ai_config() -> AiConfigEnvelope:
    return AiConfigEnvelope(
        status="success",
        message="AI generation configuration loaded.",
        data=website_generator.get_status(),
    )


@router.post("/ai/prompts/preview", response_model=PromptPreviewEnvelope)
async def preview_prompt(
    payload: WebsiteGenerationRequest,
) -> PromptPreviewEnvelope:
    rag_context = retrieve_rag_context(payload)
    ai_status = website_generator.get_status()

    return PromptPreviewEnvelope(
        status="success",
        message="Prompt preview generated.",
        data=PromptPreview(
            provider=ai_status.active_provider,
            model=ai_status.model,
            template_version=PROMPT_TEMPLATE_VERSION,
            system_prompt=build_system_prompt(),
            user_prompt=build_user_prompt(payload, rag_context),
            rag_context=rag_context,
        ),
    )


@router.post("/websites/generate", response_model=WebsiteGenerationEnvelope)
async def generate_website(
    payload: WebsiteGenerationRequest,
) -> WebsiteGenerationEnvelope | JSONResponse:
    try:
        draft = await asyncio.to_thread(website_generator.generate, payload)
    except GenerationProviderError as exc:
        return JSONResponse(
            status_code=502,
            content={
                "status": "error",
                "message": str(exc),
            },
        )

    return WebsiteGenerationEnvelope(
        status="success",
        message="Website draft generated from structured requirements.",
        data=draft,
    )
