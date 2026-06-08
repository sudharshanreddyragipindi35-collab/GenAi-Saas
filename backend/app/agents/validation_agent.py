from app.services.json_parser_service import parse_llm_json
from app.services.llm_service import call_llm
from app.services.prompt_service import build_validation_prompt
from app.services.text_utils import to_plain_text


REQUIRED_THEME = {
    "primaryColor": "#2563EB",
    "secondaryColor": "#6D28D9",
    "backgroundColor": "#F8FAFC",
    "textColor": "#0F172A",
}


async def validate_generated_website(generated_website, original_request) -> dict:
    issues: list[str] = []

    if not isinstance(generated_website, dict):
        issues.append("Generated website is not a JSON object.")
        return await _repair_with_llm(generated_website, original_request, issues)

    fixed = dict(generated_website)

    if not fixed.get("companyName"):
        fixed["companyName"] = original_request.companyName
        issues.append("Missing companyName; repaired locally.")

    if not fixed.get("businessType"):
        fixed["businessType"] = original_request.businessType
        issues.append("Missing businessType; repaired locally.")

    if not fixed.get("targetAudience"):
        fixed["targetAudience"] = original_request.targetAudience
        issues.append("Missing targetAudience; repaired locally.")

    if not isinstance(fixed.get("theme"), dict):
        fixed["theme"] = REQUIRED_THEME
        issues.append("Missing theme; repaired locally.")

    if not isinstance(fixed.get("seo"), dict):
        fixed["seo"] = {"title": "", "description": "", "keywords": []}
        issues.append("Missing SEO; repaired locally.")

    sections = fixed.get("sections")
    if not isinstance(sections, list) or not sections:
        issues.append("Missing content sections.")
        return await _repair_with_llm(fixed, original_request, issues)

    requested_sections = {
        to_plain_text(section).lower()
        for section in original_request.sections
        if to_plain_text(section)
    }
    generated_types = {
        section.get("type", "").lower()
        for section in sections
        if isinstance(section, dict)
    }
    missing_sections = requested_sections - generated_types

    if missing_sections:
        issues.append(
            "Missing requested sections: " + ", ".join(sorted(missing_sections))
        )
        return await _repair_with_llm(fixed, original_request, issues)

    return {
        "isValid": len(issues) == 0,
        "issues": issues,
        "fixedWebsite": fixed,
    }


async def _repair_with_llm(generated_website, original_request, issues) -> dict:
    system_prompt, user_prompt = build_validation_prompt(
        {
            "website": generated_website,
            "issues": issues,
        },
        original_request,
    )
    raw_response = await call_llm(system_prompt, user_prompt, temperature=0.2)
    repaired = parse_llm_json(raw_response)

    return {
        "isValid": True,
        "issues": issues,
        "fixedWebsite": repaired,
    }
