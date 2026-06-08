import asyncio
import logging

from app.config.settings import settings
from app.services.text_utils import to_plain_text


logger = logging.getLogger(__name__)


async def call_llm(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.7,
) -> str:
    system_prompt = to_plain_text(system_prompt)
    user_prompt = to_plain_text(user_prompt)

    logger.debug(
        "Claude call prompt types system=%s user=%s user_prompt_length=%s",
        type(system_prompt).__name__,
        type(user_prompt).__name__,
        len(user_prompt),
    )

    try:
        from anthropic import (
            APIConnectionError,
            APIError,
            APIStatusError,
            APITimeoutError,
            AuthenticationError,
            BadRequestError,
            NotFoundError,
            RateLimitError,
        )
        from anthropic import Anthropic
    except ImportError as exc:
        raise RuntimeError(
            "Anthropic SDK is not installed. Run: pip install -r backend/requirements.txt"
        ) from exc

    client = Anthropic(
        api_key=settings.anthropic_api_key,
        timeout=settings.anthropic_timeout_seconds,
    )

    def invoke_claude() -> str:
        response = client.messages.create(
            model=settings.anthropic_model,
            max_tokens=settings.anthropic_max_tokens,
            temperature=temperature,
            system=system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": user_prompt,
                }
            ],
        )

        if not response.content:
            raise RuntimeError("Claude returned an empty response")

        text_block = response.content[0]
        generated_text = getattr(text_block, "text", "")

        if not generated_text:
            raise RuntimeError("Claude response did not contain text")

        return generated_text

    try:
        return await asyncio.to_thread(invoke_claude)
    except AuthenticationError as exc:
        logger.exception("Anthropic authentication failed. Check ANTHROPIC_API_KEY.")
        raise RuntimeError("Anthropic authentication failed. Check ANTHROPIC_API_KEY.") from exc
    except RateLimitError as exc:
        logger.exception("Anthropic quota or rate limit exceeded.")
        raise RuntimeError("Anthropic quota or rate limit exceeded.") from exc
    except APITimeoutError as exc:
        logger.exception("Anthropic request timed out.")
        raise RuntimeError(
            "Anthropic request timed out. Increase ANTHROPIC_TIMEOUT_SECONDS or retry."
        ) from exc
    except NotFoundError as exc:
        logger.exception("Anthropic model was not found: %s", settings.anthropic_model)
        raise RuntimeError(
            f"Anthropic model was not found: {settings.anthropic_model}"
        ) from exc
    except BadRequestError as exc:
        logger.exception("Anthropic rejected the request.")
        raise RuntimeError(f"Anthropic rejected the request: {exc}") from exc
    except APIConnectionError as exc:
        logger.exception("Anthropic connection failed.")
        raise RuntimeError("Anthropic connection failed. Check network connectivity.") from exc
    except APIStatusError as exc:
        logger.exception("Anthropic API status error.")
        raise RuntimeError(f"Anthropic API error: {exc}") from exc
    except APIError as exc:
        logger.exception("Anthropic API call failed.")
        raise RuntimeError(f"Anthropic API call failed: {exc}") from exc
