import logging

from app.rag.retriever import retrieve_relevant_context
from app.services.text_utils import first_item_type, safe_join, to_plain_text


logger = logging.getLogger(__name__)


def retrieve_context(analyzed_requirements) -> dict:
    required_sections = analyzed_requirements.get("requiredSections", [])
    query = safe_join(
        [
            analyzed_requirements.get("businessType", ""),
            analyzed_requirements.get("targetAudience", ""),
            analyzed_requirements.get("recommendedStyle", ""),
            safe_join(required_sections, " "),
        ],
        " ",
    )

    logger.debug(
        "Agent=%s retrieved_context_type=%s first_item_type=%s prompt_length=%s",
        "RAG Retrieval Agent",
        type(analyzed_requirements).__name__,
        first_item_type(required_sections),
        len(query),
    )

    matches = retrieve_relevant_context(query, top_k=7)
    context = {
        "retrievedTemplates": [],
        "seoRules": [],
        "uiRules": [],
        "tailwindRules": [],
        "examples": [],
    }

    for match in matches:
        metadata = match.get("metadata") or {}
        source = to_plain_text(metadata.get("source", ""))
        item = {
            "source": source,
            "content": to_plain_text(match.get("content", "")),
        }

        if source.startswith("templates/"):
            context["retrievedTemplates"].append(item)
        elif "seo" in source:
            context["seoRules"].append(item)
        elif "tailwind" in source:
            context["tailwindRules"].append(item)
        elif source.startswith("rules/"):
            context["uiRules"].append(item)
        elif source.startswith("examples/"):
            context["examples"].append(item)

    return context
