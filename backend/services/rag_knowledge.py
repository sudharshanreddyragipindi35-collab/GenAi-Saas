from dataclasses import dataclass
import re

from backend.core.config import settings
from backend.schemas.website import RagContextItem, WebsiteGenerationRequest


@dataclass(frozen=True)
class KnowledgeDocument:
    id: str
    title: str
    category: str
    content: str
    keywords: tuple[str, ...]


KNOWLEDGE_BASE = [
    KnowledgeDocument(
        id="landing-page-flow",
        title="Single-page SaaS landing page flow",
        category="structure",
        content=(
            "Use a conversion-first flow: hero promise, audience problem, services "
            "or offer cards, proof, pricing or package clarity, FAQ, and contact. "
            "Each section should have one job and a clear next action."
        ),
        keywords=("landing", "saas", "website", "services", "pricing", "faq"),
    ),
    KnowledgeDocument(
        id="lead-capture",
        title="Lead capture best practices",
        category="conversion",
        content=(
            "Lead capture pages should explain the value exchange before the form, "
            "keep form fields short, and use a CTA that describes the outcome rather "
            "than a generic submit action."
        ),
        keywords=("lead", "capture", "contact", "form", "cta", "conversion"),
    ),
    KnowledgeDocument(
        id="trust-proof",
        title="Trust and proof blocks",
        category="content",
        content=(
            "Testimonials, proof metrics, and outcome statements work best when they "
            "are specific. Tie proof back to the target audience's business goal."
        ),
        keywords=("testimonial", "testimonials", "proof", "trust", "customer"),
    ),
    KnowledgeDocument(
        id="automation-agency",
        title="AI automation agency positioning",
        category="industry",
        content=(
            "AI automation agencies should emphasize workflow savings, operational "
            "reliability, handoff support, and measurable time returned to teams."
        ),
        keywords=("ai", "automation", "agency", "workflow", "operations"),
    ),
    KnowledgeDocument(
        id="wellness-coaching",
        title="Wellness coaching tone",
        category="industry",
        content=(
            "Wellness coaching websites should feel calm, credible, and action-oriented. "
            "Copy should avoid pressure while making the first step feel easy."
        ),
        keywords=("wellness", "health", "coaching", "coach", "calm"),
    ),
    KnowledgeDocument(
        id="design-studio",
        title="Design studio positioning",
        category="industry",
        content=(
            "Design studios should lead with strategic outcomes, portfolio-ready proof, "
            "clear engagement models, and language that appeals to founders."
        ),
        keywords=("design", "studio", "brand", "product", "founder"),
    ),
]


def _tokens(value: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", value.lower()))


def _payload_terms(payload: WebsiteGenerationRequest) -> set[str]:
    text = " ".join(
        [
            payload.business_type,
            payload.company_name,
            payload.color_theme,
            payload.target_audience,
            " ".join(payload.required_features),
        ]
    )
    return _tokens(text)


def retrieve_rag_context(
    payload: WebsiteGenerationRequest, limit: int = 4
) -> list[RagContextItem]:
    if not settings.rag_enabled:
        return []

    from backend.services.vector_store import vector_store

    query = " ".join(sorted(_payload_terms(payload)))
    results = vector_store.search(query, top_k=limit)

    if results:
        return results

    return [
        RagContextItem(
            id=document.id,
            title=document.title,
            category=document.category,
            content=document.content,
            score=1,
        )
        for document in KNOWLEDGE_BASE[:2]
    ]
