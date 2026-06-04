from datetime import datetime, timezone
from uuid import uuid4

from backend.schemas.website import (
    GeneratedContent,
    PreviewData,
    PromptTrace,
    SectionContent,
    Theme,
    WebsiteDraft,
    WebsiteGenerationRequest,
    WebsiteSection,
    WebsiteStructure,
)


class WebsiteGeneratorService:
    """Deterministic MVP generator that matches the future AI response shape."""

    def generate(self, payload: WebsiteGenerationRequest) -> WebsiteDraft:
        features = self._clean_features(payload.required_features)
        theme = self._build_theme(payload.color_theme)
        sections = self._build_sections(features)
        content_sections = self._build_content(payload, features)

        generated_content = GeneratedContent(
            seo_title=f"{payload.company_name} | {payload.business_type} solutions",
            seo_description=(
                f"{payload.company_name} helps {payload.target_audience} with "
                f"modern {payload.business_type} services and a clear path to action."
            ),
            tagline=f"Modern {payload.business_type} experiences for {payload.target_audience}.",
            sections=content_sections,
        )

        return WebsiteDraft(
            project_id=f"local-{uuid4().hex[:12]}",
            company_name=payload.company_name,
            business_type=payload.business_type,
            website_structure=WebsiteStructure(
                page_type="single-page-marketing-site",
                sections=sections,
            ),
            generated_content=generated_content,
            theme=theme,
            preview_data=PreviewData(
                navigation=[section.name for section in sections],
                sections=content_sections,
                theme=theme,
            ),
            prompt_trace=PromptTrace(
                provider_mode="deterministic-local",
                template_version="website-draft-v1",
                optimized_prompt_summary=(
                    "Generate a responsive landing page with structured sections, "
                    "SEO content, theme tokens, and preview-ready data."
                ),
            ),
            created_at=datetime.now(timezone.utc).isoformat(),
            metadata={
                "required_features": features,
                "ai_enabled": False,
                "provider": "deterministic-local",
                "rag_enabled": False,
                "rag_sources": [],
                "note": "This is a local fallback generator. Claude integration is used when configured.",
            },
        )

    def _clean_features(self, features: list[str]) -> list[str]:
        cleaned = [feature.strip() for feature in features if feature.strip()]
        return cleaned or ["Lead capture", "Services overview", "Contact form"]

    def _build_sections(self, features: list[str]) -> list[WebsiteSection]:
        sections = [
            WebsiteSection(
                id="hero",
                name="Hero",
                purpose="Create a strong first impression and primary action.",
                components=["headline", "subheadline", "primary_cta", "trust_note"],
                content_fields=["heading", "body", "cta_label"],
            ),
            WebsiteSection(
                id="about",
                name="About",
                purpose="Explain the business and why the audience should care.",
                components=["section_heading", "summary", "proof_points"],
                content_fields=["heading", "body", "bullets"],
            ),
            WebsiteSection(
                id="services",
                name="Services",
                purpose="Show the main offers in a scannable format.",
                components=["service_list", "benefit_copy"],
                content_fields=["heading", "body", "bullets"],
            ),
            WebsiteSection(
                id="pricing",
                name="Pricing",
                purpose="Present a simple starting package for early MVP preview.",
                components=["pricing_card", "cta"],
                content_fields=["heading", "body", "cta_label"],
            ),
            WebsiteSection(
                id="contact",
                name="Contact",
                purpose="Give visitors a direct next step.",
                components=["contact_intro", "form_placeholder", "cta"],
                content_fields=["heading", "body", "cta_label"],
            ),
        ]

        if any("testimonial" in feature.lower() for feature in features):
            sections.insert(
                3,
                WebsiteSection(
                    id="testimonials",
                    name="Testimonials",
                    purpose="Build trust with customer proof.",
                    components=["quote_list", "customer_names"],
                    content_fields=["heading", "body", "bullets"],
                ),
            )

        return sections

    def _build_content(
        self, payload: WebsiteGenerationRequest, features: list[str]
    ) -> list[SectionContent]:
        feature_sentence = ", ".join(features[:3])

        sections = [
            SectionContent(
                section_id="hero",
                heading=f"{payload.company_name} for {payload.target_audience}",
                body=(
                    f"A focused {payload.business_type} website concept built around "
                    f"{feature_sentence.lower()}."
                ),
                bullets=[
                    "Clear messaging",
                    "Responsive layout",
                    "Conversion-focused structure",
                ],
                cta_label="Start the project",
            ),
            SectionContent(
                section_id="about",
                heading=f"Built for modern {payload.business_type} teams",
                body=(
                    f"{payload.company_name} presents the business with a clean story, "
                    f"practical proof points, and content shaped for {payload.target_audience}."
                ),
                bullets=[
                    "Simple section flow",
                    "Audience-aware copy",
                    "SEO-ready page structure",
                ],
            ),
            SectionContent(
                section_id="services",
                heading="Services that are easy to understand",
                body="The page groups the most important offers into readable service blocks.",
                bullets=features,
            ),
            SectionContent(
                section_id="pricing",
                heading="A clear package to begin",
                body=(
                    "The MVP pricing section keeps the offer simple so visitors can compare "
                    "value quickly."
                ),
                bullets=["Starter package", "Growth package", "Custom plan"],
                cta_label="Request pricing",
            ),
            SectionContent(
                section_id="contact",
                heading="Turn visitors into leads",
                body=(
                    "The contact section gives interested visitors a direct way to reach "
                    f"{payload.company_name}."
                ),
                bullets=["Name", "Email", "Project message"],
                cta_label="Contact us",
            ),
        ]

        if any("testimonial" in feature.lower() for feature in features):
            sections.insert(
                3,
                SectionContent(
                    section_id="testimonials",
                    heading="Proof from happy customers",
                    body="A testimonial section is included because it was requested.",
                    bullets=[
                        "Customer quote placeholder",
                        "Customer name placeholder",
                        "Result or outcome placeholder",
                    ],
                ),
            )

        return sections

    def _build_theme(self, color_theme: str) -> Theme:
        theme_key = color_theme.lower()
        palettes = {
            "blue": {
                "primary": "#2563eb",
                "secondary": "#0f766e",
                "accent": "#f59e0b",
                "background": "#f8fafc",
                "surface": "#ffffff",
                "text": "#172033",
            },
            "green": {
                "primary": "#15803d",
                "secondary": "#2563eb",
                "accent": "#d97706",
                "background": "#f7fbf6",
                "surface": "#ffffff",
                "text": "#1c2720",
            },
            "purple": {
                "primary": "#7c3aed",
                "secondary": "#0f766e",
                "accent": "#f97316",
                "background": "#fbfafc",
                "surface": "#ffffff",
                "text": "#211827",
            },
            "red": {
                "primary": "#dc2626",
                "secondary": "#2563eb",
                "accent": "#16a34a",
                "background": "#fffafa",
                "surface": "#ffffff",
                "text": "#2f1b1b",
            },
        }

        palette = next(
            (value for key, value in palettes.items() if key in theme_key),
            {
                "primary": "#374151",
                "secondary": "#0f766e",
                "accent": "#d97706",
                "background": "#f7f7f4",
                "surface": "#ffffff",
                "text": "#202124",
            },
        )

        return Theme(
            name=f"{color_theme.title()} operational theme",
            palette=palette,
            fonts={"heading": "Inter, Arial, sans-serif", "body": "Arial, sans-serif"},
            radius="8px",
            spacing="comfortable",
            mood=["clean", "trustworthy", "modern"],
        )
