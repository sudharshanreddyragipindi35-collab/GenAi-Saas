import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from backend.core.config import settings
from backend.schemas.ai import LlmInvokeRequest, LlmInvokeResult
from backend.services.claude_generator import GenerationProviderError


class LlmGateway:
    def is_claude_available(self) -> bool:
        return bool(settings.anthropic_api_key.strip())

    def invoke(self, payload: LlmInvokeRequest) -> LlmInvokeResult:
        provider = self._resolve_provider(payload.provider)

        if provider == "claude":
            return self._invoke_claude(payload)

        if payload.provider == "claude":
            raise GenerationProviderError(
                "Claude invoke was requested but ANTHROPIC_API_KEY is not configured."
            )

        return self._invoke_local(payload)

    def _resolve_provider(self, requested_provider: str) -> str:
        if requested_provider == "local":
            return "local"

        if requested_provider == "claude":
            return "claude" if self.is_claude_available() else "unconfigured"

        return "claude" if self.is_claude_available() else "local"

    def _invoke_claude(self, payload: LlmInvokeRequest) -> LlmInvokeResult:
        body = {
            "model": settings.anthropic_model,
            "max_tokens": payload.max_tokens,
            "temperature": payload.temperature,
            "messages": [{"role": "user", "content": payload.user_prompt}],
        }

        if payload.system_prompt.strip():
            body["system"] = payload.system_prompt

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
                message = json.loads(response.read().decode("utf-8"))
        except HTTPError as exc:
            details = exc.read().decode("utf-8", errors="replace")
            raise GenerationProviderError(
                f"Claude invoke failed with HTTP {exc.code}: {details}"
            ) from exc
        except URLError as exc:
            raise GenerationProviderError(f"Claude invoke failed: {exc.reason}") from exc
        except TimeoutError as exc:
            raise GenerationProviderError("Claude invoke timed out.") from exc

        output = "\n".join(
            [
                block.get("text", "")
                for block in message.get("content", [])
                if isinstance(block, dict) and block.get("type") == "text"
            ]
        ).strip()

        return LlmInvokeResult(
            provider="claude",
            model=settings.anthropic_model,
            purpose=payload.purpose,
            output=output,
            fallback_used=False,
            usage=message.get("usage", {}),
        )

    def _invoke_local(self, payload: LlmInvokeRequest) -> LlmInvokeResult:
        summarized_prompt = " ".join(payload.user_prompt.split())
        output = (
            f"Local LLM fallback for {payload.purpose}: "
            f"{summarized_prompt[:520]}"
        )

        return LlmInvokeResult(
            provider="local",
            model="deterministic-local",
            purpose=payload.purpose,
            output=output,
            fallback_used=True,
            usage={"input_tokens": 0, "output_tokens": len(output.split())},
        )


llm_gateway = LlmGateway()
