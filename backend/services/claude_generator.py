from datetime import datetime, timezone
import json
import re
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from uuid import uuid4

from pydantic import BaseModel, ValidationError

from backend.core.config import settings
from backend.schemas.website import (
    GeneratedContent,
    PreviewData,
    PromptTrace,
    Theme,
    WebsiteDraft,
    WebsiteGenerationRequest,
    WebsiteStructure,
)
from backend.services.prompt_templates import (
    PROMPT_TEMPLATE_VERSION,
    WEBSITE_DRAFT_OUTPUT_SCHEMA,
    build_system_prompt,
    build_user_prompt,
)
from backend.services.rag_knowledge import retrieve_rag_context


class GenerationProviderError(RuntimeError):
    """Raised when an external generation provider cannot produce a valid draft."""


class ClaudeDraftPayload(BaseModel):
    website_structure: WebsiteStructure
    generated_content: GeneratedContent
    theme: Theme


class ClaudeWebsiteGeneratorService:
    provider_name = "anthropic-claude"

    def is_configured(self) -> bool:
        return bool(settings.anthropic_api_key.strip())

    def generate(self, payload: WebsiteGenerationRequest) -> WebsiteDraft:
        if not self.is_configured():
            raise GenerationProviderError(
                "Claude API key is not configured. Set ANTHROPIC_API_KEY or use local generation."
            )

        rag_context = retrieve_rag_context(payload)
        system_prompt = build_system_prompt()
        user_prompt = build_user_prompt(payload, rag_context)
        response = self._create_message(system_prompt, user_prompt)
        parsed_payload = self._parse_message_payload(response)

        return self._build_draft(payload, parsed_payload, rag_context, response)

    def _create_message(self, system_prompt: str, user_prompt: str) -> dict:
        body = {
            "model": settings.anthropic_model,
            "max_tokens": settings.anthropic_max_tokens,
            "system": system_prompt,
            "messages": [{"role": "user", "content": user_prompt}],
            "output_config": {
                "format": {
                    "type": "json_schema",
                    "schema": WEBSITE_DRAFT_OUTPUT_SCHEMA,
                }
            },
        }
        request = Request(
            settings.anthropic_api_url,
            data=json.dumps(body).encode("utf-8"),
            headers={
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
                "x-api-key": settings.anthropic_api_key,
            },
            method="POST",
        )

        try:
            with urlopen(
                request, timeout=settings.anthropic_timeout_seconds
            ) as response:
                return json.loads(response.read().decode("utf-8"))
        except HTTPError as exc:
            details = exc.read().decode("utf-8", errors="replace")
            raise GenerationProviderError(
                f"Claude generation failed with HTTP {exc.code}: {details}"
            ) from exc
        except URLError as exc:
            raise GenerationProviderError(
                f"Claude generation failed: {exc.reason}"
            ) from exc
        except TimeoutError as exc:
            raise GenerationProviderError("Claude generation timed out.") from exc

    def _parse_message_payload(self, response: dict) -> ClaudeDraftPayload:
        parsed_json = self._extract_structured_json(response)

        try:
            if hasattr(ClaudeDraftPayload, "model_validate"):
                return ClaudeDraftPayload.model_validate(parsed_json)

            return ClaudeDraftPayload.parse_obj(parsed_json)
        except ValidationError as exc:
            raise GenerationProviderError(
                f"Claude returned an invalid website draft shape: {exc}"
            ) from exc

    def _extract_structured_json(self, response: dict) -> dict:
        for key in ("structured_output", "output_json", "json"):
            value = response.get(key)

            if isinstance(value, dict):
                return value

        for block in response.get("content", []):
            if not isinstance(block, dict):
                continue

            for key in ("json", "input", "value"):
                value = block.get(key)

                if isinstance(value, dict):
                    return value

        text = "\n".join(
            [
                block.get("text", "")
                for block in response.get("content", [])
                if isinstance(block, dict) and block.get("type") == "text"
            ]
        ).strip()

        if not text:
            raise GenerationProviderError("Claude returned an empty response.")

        try:
            return json.loads(self._strip_json_fence(text))
        except json.JSONDecodeError as exc:
            raise GenerationProviderError(
                "Claude returned text that could not be parsed as JSON."
            ) from exc

    def _strip_json_fence(self, value: str) -> str:
        match = re.search(r"```(?:json)?\s*(.*?)```", value, re.DOTALL)

        if match:
            return match.group(1).strip()

        return value

    def _build_draft(
        self,
        payload: WebsiteGenerationRequest,
        parsed_payload: ClaudeDraftPayload,
        rag_context: list,
        response: dict,
    ) -> WebsiteDraft:
        usage = response.get("usage", {})
        rag_sources = [
            {
                "id": item.id,
                "title": item.title,
                "category": item.category,
                "score": item.score,
            }
            for item in rag_context
        ]

        return WebsiteDraft(
            project_id=f"claude-{uuid4().hex[:12]}",
            company_name=payload.company_name,
            business_type=payload.business_type,
            website_structure=parsed_payload.website_structure,
            generated_content=parsed_payload.generated_content,
            theme=parsed_payload.theme,
            preview_data=PreviewData(
                navigation=[
                    section.name for section in parsed_payload.website_structure.sections
                ],
                sections=parsed_payload.generated_content.sections,
                theme=parsed_payload.theme,
            ),
            prompt_trace=PromptTrace(
                provider_mode=f"claude:{settings.anthropic_model}",
                template_version=PROMPT_TEMPLATE_VERSION,
                optimized_prompt_summary=(
                    "Claude generated structured website draft JSON using "
                    "requirements plus retrieved RAG context."
                ),
            ),
            created_at=datetime.now(timezone.utc).isoformat(),
            metadata={
                "required_features": payload.required_features,
                "ai_enabled": True,
                "provider": self.provider_name,
                "model": settings.anthropic_model,
                "rag_enabled": settings.rag_enabled,
                "rag_sources": rag_sources,
                "usage": usage,
                "note": "Generated with Claude using backend-held Anthropic credentials.",
            },
        )
