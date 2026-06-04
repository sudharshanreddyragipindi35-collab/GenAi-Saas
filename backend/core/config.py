import os
from dataclasses import dataclass, field
from pathlib import Path


def _load_dotenv() -> None:
    env_path = Path(__file__).resolve().parents[2] / ".env"

    if not env_path.exists():
        return

    for line in env_path.read_text(encoding="utf-8").splitlines():
        stripped_line = line.strip()

        if not stripped_line or stripped_line.startswith("#") or "=" not in stripped_line:
            continue

        key, value = stripped_line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


_load_dotenv()


def _get_bool_env(name: str, default: bool) -> bool:
    value = os.getenv(name)

    if value is None:
        return default

    return value.strip().lower() in {"1", "true", "yes", "on"}


@dataclass(frozen=True)
class AppSettings:
    app_name: str = "AI SaaS Website Builder"
    app_version: str = "0.1.0"
    api_prefix: str = "/api"
    static_dir: Path = Path(__file__).resolve().parents[1] / "static"
    generation_provider: str = os.getenv("GENERATION_PROVIDER", "auto").lower()
    anthropic_api_key: str = os.getenv("ANTHROPIC_API_KEY", "")
    anthropic_model: str = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-5")
    anthropic_api_url: str = os.getenv(
        "ANTHROPIC_API_URL", "https://api.anthropic.com/v1/messages"
    )
    anthropic_max_tokens: int = int(os.getenv("ANTHROPIC_MAX_TOKENS", "4200"))
    anthropic_timeout_seconds: int = int(os.getenv("ANTHROPIC_TIMEOUT_SECONDS", "45"))
    rag_enabled: bool = _get_bool_env("RAG_ENABLED", True)
    allowed_origins: list[str] = field(
        default_factory=lambda: [
            "http://localhost:8000",
            "http://127.0.0.1:8000",
            "http://localhost:8001",
            "http://127.0.0.1:8001",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]
    )


settings = AppSettings()
