from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, Field


class HealthStatus(BaseModel):
    service: str
    mode: str


class HealthEnvelope(BaseModel):
    status: Literal["success"]
    message: str
    data: HealthStatus


class WebsiteGenerationRequest(BaseModel):
    business_type: str = Field(..., min_length=2, max_length=80)
    company_name: str = Field(..., min_length=2, max_length=80)
    color_theme: str = Field(..., min_length=2, max_length=40)
    required_features: List[str] = Field(default_factory=list, max_length=12)
    target_audience: str = Field(..., min_length=2, max_length=160)


class WebsiteSection(BaseModel):
    id: str
    name: str
    purpose: str
    components: List[str]
    content_fields: List[str]


class WebsiteStructure(BaseModel):
    page_type: str
    sections: List[WebsiteSection]


class SectionContent(BaseModel):
    section_id: str
    heading: str
    body: str
    bullets: List[str] = Field(default_factory=list)
    cta_label: Optional[str] = None


class GeneratedContent(BaseModel):
    seo_title: str
    seo_description: str
    tagline: str
    sections: List[SectionContent]


class Theme(BaseModel):
    name: str
    palette: Dict[str, str]
    fonts: Dict[str, str]
    radius: str
    spacing: str
    mood: List[str]


class PreviewData(BaseModel):
    navigation: List[str]
    sections: List[SectionContent]
    theme: Theme


class PromptTrace(BaseModel):
    provider_mode: str
    template_version: str
    optimized_prompt_summary: str


class WebsiteDraft(BaseModel):
    project_id: str
    company_name: str
    business_type: str
    website_structure: WebsiteStructure
    generated_content: GeneratedContent
    theme: Theme
    preview_data: PreviewData
    prompt_trace: PromptTrace
    created_at: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class WebsiteGenerationEnvelope(BaseModel):
    status: Literal["success"]
    message: str
    data: WebsiteDraft
