import json
import logging

from app.prompts.prompt_optimizer_prompt import PROMPT_OPTIMIZER_SYSTEM_PROMPT
from app.prompts.requirement_prompt import REQUIREMENT_ANALYZER_SYSTEM_PROMPT
from app.prompts.seo_content_prompt import SEO_CONTENT_SYSTEM_PROMPT
from app.prompts.ui_content_prompt import UI_CONTENT_SYSTEM_PROMPT
from app.prompts.validation_prompt import VALIDATION_SYSTEM_PROMPT
from app.prompts.website_structure_prompt import WEBSITE_STRUCTURE_SYSTEM_PROMPT
from app.services.text_utils import first_item_type, safe_join, to_plain_text


JSON_RULES = (
    "Return valid JSON only. Do not use markdown. Do not explain. "
    "Do not wrap the response in backticks."
)
FINAL_WEBSITE_SCHEMA_RULES = (
    "The final website JSON must use theme keys exactly: primaryColor, "
    "secondaryColor, backgroundColor, textColor. Do not use primary, secondary, "
    "background, text, primary_color, secondary_color, background_color, or "
    "text_color. seo.keywords must always be an array of strings, never a "
    "comma-separated string."
)
logger = logging.getLogger(__name__)


def _to_json(value) -> str:
    if hasattr(value, "model_dump"):
        value = value.model_dump()
    return json.dumps(value, indent=2, ensure_ascii=False)


def _format_rag_context(rag_context) -> str:
    if not isinstance(rag_context, dict):
        return to_plain_text(rag_context)

    sections = []
    for label, value in rag_context.items():
        sections.append(f"{label}:\n{safe_join(value)}")

    return "\n\n".join(sections)


def _build_prompt(agent_name: str, system_prompt, user_prompt, debug_value=None):
    try:
        system_text = to_plain_text(system_prompt)
        user_text = to_plain_text(user_prompt)
        logger.debug(
            "Agent=%s retrieved_context_type=%s first_item_type=%s prompt_length=%s",
            agent_name,
            type(debug_value).__name__ if debug_value is not None else "None",
            first_item_type(debug_value) if debug_value is not None else "None",
            len(user_text),
        )
        return system_text, user_text
    except Exception:
        logger.exception(
            "Prompt building failed for agent=%s failing_variable_type=%s value=%r",
            agent_name,
            type(debug_value).__name__,
            debug_value,
        )
        raise


def build_requirement_prompt(request):
    return _build_prompt(
        "Requirement Analyzer Agent",
        REQUIREMENT_ANALYZER_SYSTEM_PROMPT,
        f"{JSON_RULES}\n\nAnalyze this request:\n{_to_json(request)}",
        request,
    )


def build_prompt_optimizer_prompt(analyzed_requirements, rag_context):
    rag_text = _format_rag_context(rag_context)
    return _build_prompt(
        "Prompt Optimizer Agent",
        PROMPT_OPTIMIZER_SYSTEM_PROMPT,
        (
            f"{JSON_RULES}\n\nCreate an optimized website-generation prompt using:\n"
            f"Analyzed requirements:\n{_to_json(analyzed_requirements)}\n\n"
            f"RAG context:\n{rag_text}"
        ),
        rag_context,
    )


def build_website_structure_prompt(optimized_prompt):
    return _build_prompt(
        "Website Structure Agent",
        WEBSITE_STRUCTURE_SYSTEM_PROMPT,
        (
            f"{JSON_RULES}\n\nGenerate website section structure for this prompt:\n"
            f"{to_plain_text(optimized_prompt)}"
        ),
        optimized_prompt,
    )


def build_seo_content_prompt(analyzed_requirements, rag_context):
    rag_text = _format_rag_context(rag_context)
    return _build_prompt(
        "SEO Content Agent",
        SEO_CONTENT_SYSTEM_PROMPT,
        (
            f"{JSON_RULES}\n{FINAL_WEBSITE_SCHEMA_RULES}\n\nGenerate SEO JSON from:\n"
            f"Analyzed requirements:\n{_to_json(analyzed_requirements)}\n\n"
            f"RAG context:\n{rag_text}"
        ),
        rag_context,
    )


def build_ui_content_prompt(
    analyzed_requirements,
    website_structure,
    seo_content,
    rag_context,
):
    rag_text = _format_rag_context(rag_context)
    return _build_prompt(
        "UI Content Agent",
        UI_CONTENT_SYSTEM_PROMPT,
        (
            f"{JSON_RULES}\n{FINAL_WEBSITE_SCHEMA_RULES}\n\nGenerate final website JSON from:\n"
            f"Analyzed requirements:\n{_to_json(analyzed_requirements)}\n\n"
            f"Website structure:\n{_to_json(website_structure)}\n\n"
            f"SEO content:\n{_to_json(seo_content)}\n\n"
            f"RAG context:\n{rag_text}"
        ),
        rag_context,
    )


def build_validation_prompt(generated_website, original_request):
    return _build_prompt(
        "Validation Agent",
        VALIDATION_SYSTEM_PROMPT,
        (
            f"{JSON_RULES}\n{FINAL_WEBSITE_SCHEMA_RULES}\n\nRepair this website JSON so it matches the original request.\n"
            f"Generated website:\n{_to_json(generated_website)}\n\n"
            f"Original request:\n{_to_json(original_request)}"
        ),
        generated_website,
    )
