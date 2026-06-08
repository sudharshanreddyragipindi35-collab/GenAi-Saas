import json


DEFAULT_THEME = {
    "primaryColor": "#2563EB",
    "secondaryColor": "#6D28D9",
    "backgroundColor": "#F8FAFC",
    "textColor": "#0F172A",
}

THEME_KEY_ALIASES = {
    "primaryColor": ("primaryColor", "primary", "primary_color"),
    "secondaryColor": ("secondaryColor", "secondary", "secondary_color"),
    "backgroundColor": ("backgroundColor", "background", "background_color"),
    "textColor": ("textColor", "text", "text_color"),
}


def parse_llm_json(raw_text: str) -> dict:
    cleaned = raw_text.strip()
    cleaned = cleaned.replace("```json", "").replace("```", "").strip()

    start = cleaned.find("{")
    end = cleaned.rfind("}")

    if start == -1 or end == -1 or end < start:
        raise ValueError("LLM response did not contain a JSON object")

    json_text = cleaned[start : end + 1]

    try:
        return json.loads(json_text)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON returned by LLM: {exc}") from exc


def normalize_generated_website(data: dict) -> dict:
    if not isinstance(data, dict):
        return {
            "theme": dict(DEFAULT_THEME),
            "seo": {"title": "", "description": "", "keywords": []},
            "sections": [],
        }

    normalized = dict(data)
    normalized["theme"] = _normalize_theme(normalized.get("theme"))
    normalized["seo"] = _normalize_seo(normalized.get("seo"))
    normalized["sections"] = _normalize_sections(normalized.get("sections"))

    return normalized


def _normalize_theme(theme) -> dict:
    source = theme if isinstance(theme, dict) else {}
    normalized = {}

    for expected_key, aliases in THEME_KEY_ALIASES.items():
        value = None
        for alias in aliases:
            if source.get(alias):
                value = source.get(alias)
                break
        normalized[expected_key] = str(value) if value else DEFAULT_THEME[expected_key]

    return normalized


def _normalize_seo(seo) -> dict:
    source = seo if isinstance(seo, dict) else {}
    normalized = dict(source)
    keywords = normalized.get("keywords", [])

    if isinstance(keywords, str):
        normalized["keywords"] = [
            keyword.strip()
            for keyword in keywords.split(",")
            if keyword.strip()
        ]
    elif isinstance(keywords, list):
        normalized["keywords"] = [str(keyword) for keyword in keywords]
    else:
        normalized["keywords"] = []

    normalized.setdefault("title", "")
    normalized.setdefault("description", "")

    return normalized


def _normalize_sections(sections) -> list:
    if isinstance(sections, list):
        return sections

    if isinstance(sections, dict):
        return [sections]

    return []
