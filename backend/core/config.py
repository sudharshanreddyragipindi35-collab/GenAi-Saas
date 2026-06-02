from dataclasses import dataclass, field
from pathlib import Path


@dataclass(frozen=True)
class AppSettings:
    app_name: str = "AI SaaS Website Builder"
    app_version: str = "0.1.0"
    api_prefix: str = "/api"
    static_dir: Path = Path(__file__).resolve().parents[1] / "static"
    allowed_origins: list[str] = field(
        default_factory=lambda: [
            "http://localhost:8000",
            "http://127.0.0.1:8000",
            "http://localhost:8001",
            "http://127.0.0.1:8001",
        ]
    )


settings = AppSettings()
