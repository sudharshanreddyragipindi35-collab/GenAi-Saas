from backend.core.config import settings
from backend.schemas.website import AiConfigStatus, WebsiteDraft, WebsiteGenerationRequest
from backend.services.claude_generator import (
    ClaudeWebsiteGeneratorService,
    GenerationProviderError,
)
from backend.services.prompt_templates import PROMPT_TEMPLATE_VERSION
from backend.services.website_generator import WebsiteGeneratorService


class WebsiteGenerationOrchestrator:
    def __init__(self) -> None:
        self.local_generator = WebsiteGeneratorService()
        self.claude_generator = ClaudeWebsiteGeneratorService()

    def get_status(self) -> AiConfigStatus:
        return AiConfigStatus(
            active_provider=self._active_provider(),
            configured_provider=settings.generation_provider,
            api_key_configured=self.claude_generator.is_configured(),
            model=settings.anthropic_model,
            rag_enabled=settings.rag_enabled,
            prompt_template_version=PROMPT_TEMPLATE_VERSION,
        )

    def generate(self, payload: WebsiteGenerationRequest) -> WebsiteDraft:
        active_provider = self._active_provider()

        if active_provider == "claude":
            return self.claude_generator.generate(payload)

        if settings.generation_provider == "claude":
            raise GenerationProviderError(
                "Claude generation is selected but ANTHROPIC_API_KEY is not configured."
            )

        return self.local_generator.generate(payload)

    def _active_provider(self) -> str:
        if settings.generation_provider == "local":
            return "local"

        if settings.generation_provider == "claude":
            return "claude" if self.claude_generator.is_configured() else "unconfigured"

        if self.claude_generator.is_configured():
            return "claude"

        return "local"
