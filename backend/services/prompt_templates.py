from backend.schemas.website import RagContextItem, WebsiteGenerationRequest


PROMPT_TEMPLATE_VERSION = "claude-website-draft-v1"

WEBSITE_DRAFT_OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "website_structure": {
            "type": "object",
            "properties": {
                "page_type": {"type": "string"},
                "sections": {
                    "type": "array",
                    "minItems": 4,
                    "maxItems": 8,
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "string"},
                            "name": {"type": "string"},
                            "purpose": {"type": "string"},
                            "components": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "content_fields": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                        },
                        "required": [
                            "id",
                            "name",
                            "purpose",
                            "components",
                            "content_fields",
                        ],
                        "additionalProperties": False,
                    },
                },
            },
            "required": ["page_type", "sections"],
            "additionalProperties": False,
        },
        "generated_content": {
            "type": "object",
            "properties": {
                "seo_title": {"type": "string"},
                "seo_description": {"type": "string"},
                "tagline": {"type": "string"},
                "sections": {
                    "type": "array",
                    "minItems": 4,
                    "maxItems": 8,
                    "items": {
                        "type": "object",
                        "properties": {
                            "section_id": {"type": "string"},
                            "heading": {"type": "string"},
                            "body": {"type": "string"},
                            "bullets": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "cta_label": {"type": ["string", "null"]},
                        },
                        "required": [
                            "section_id",
                            "heading",
                            "body",
                            "bullets",
                            "cta_label",
                        ],
                        "additionalProperties": False,
                    },
                },
            },
            "required": ["seo_title", "seo_description", "tagline", "sections"],
            "additionalProperties": False,
        },
        "theme": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "palette": {
                    "type": "object",
                    "properties": {
                        "primary": {"type": "string"},
                        "secondary": {"type": "string"},
                        "accent": {"type": "string"},
                        "background": {"type": "string"},
                        "surface": {"type": "string"},
                        "text": {"type": "string"},
                    },
                    "required": [
                        "primary",
                        "secondary",
                        "accent",
                        "background",
                        "surface",
                        "text",
                    ],
                    "additionalProperties": False,
                },
                "fonts": {
                    "type": "object",
                    "properties": {
                        "heading": {"type": "string"},
                        "body": {"type": "string"},
                    },
                    "required": ["heading", "body"],
                    "additionalProperties": False,
                },
                "radius": {"type": "string"},
                "spacing": {"type": "string"},
                "mood": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["name", "palette", "fonts", "radius", "spacing", "mood"],
            "additionalProperties": False,
        },
    },
    "required": ["website_structure", "generated_content", "theme"],
    "additionalProperties": False,
}


def build_system_prompt() -> str:
    return (
        "You are a senior SaaS website strategist and UX copywriter. "
        "Generate production-ready single-page website draft data for a React preview. "
        "Return concise, specific copy. Match the requested business, audience, "
        "features, and theme. Use the provided RAG context when relevant. "
        "Every generated_content section_id must match a website_structure section id. "
        "Do not mention that you are an AI model."
    )


def _format_rag_context(rag_context: list[RagContextItem]) -> str:
    if not rag_context:
        return "No RAG context was retrieved."

    return "\n".join(
        [
            (
                f"- {item.title} ({item.category}, score {item.score}): "
                f"{item.content}"
            )
            for item in rag_context
        ]
    )


def build_user_prompt(
    payload: WebsiteGenerationRequest, rag_context: list[RagContextItem]
) -> str:
    features = ", ".join(payload.required_features) or "Lead capture, Contact form"

    return (
        "Create a generated website draft using these requirements.\n\n"
        f"Business type: {payload.business_type}\n"
        f"Company name: {payload.company_name}\n"
        f"Target audience: {payload.target_audience}\n"
        f"Color theme: {payload.color_theme}\n"
        f"Required features: {features}\n\n"
        "RAG context:\n"
        f"{_format_rag_context(rag_context)}\n\n"
        "Output requirements:\n"
        "- Create 5 to 7 sections unless the requested features clearly need fewer.\n"
        "- Include requested features as concrete page sections or section content.\n"
        "- Keep headings short and preview-friendly.\n"
        "- Use hex color tokens in the theme palette.\n"
        "- Keep all arrays populated with useful values.\n"
    )
