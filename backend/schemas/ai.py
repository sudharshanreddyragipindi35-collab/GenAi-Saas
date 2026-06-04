from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, Field

from backend.schemas.website import RagContextItem, WebsiteGenerationRequest


class LlmInvokeRequest(BaseModel):
    purpose: str = Field(..., min_length=2, max_length=80)
    system_prompt: str = Field(default="", max_length=4000)
    user_prompt: str = Field(..., min_length=2, max_length=24000)
    max_tokens: int = Field(default=900, ge=64, le=4200)
    temperature: float = Field(default=0.2, ge=0, le=1)
    provider: Literal["auto", "claude", "local"] = "auto"


class LlmInvokeResult(BaseModel):
    provider: str
    model: str
    purpose: str
    output: str
    fallback_used: bool
    usage: Dict[str, Any] = Field(default_factory=dict)


class LlmInvokeEnvelope(BaseModel):
    status: Literal["success"]
    message: str
    data: LlmInvokeResult


class VectorDocumentInput(BaseModel):
    id: Optional[str] = Field(default=None, max_length=80)
    title: str = Field(..., min_length=2, max_length=120)
    category: str = Field(default="custom", min_length=2, max_length=60)
    content: str = Field(..., min_length=10, max_length=4000)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class VectorDocument(BaseModel):
    id: str
    title: str
    category: str
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    embedding: List[float] = Field(default_factory=list)


class VectorDocumentEnvelope(BaseModel):
    status: Literal["success"]
    message: str
    data: VectorDocument


class VectorDocumentListEnvelope(BaseModel):
    status: Literal["success"]
    message: str
    data: List[VectorDocument]


class RagSearchRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=1000)
    top_k: int = Field(default=5, ge=1, le=12)
    categories: List[str] = Field(default_factory=list, max_length=8)


class RagSearchEnvelope(BaseModel):
    status: Literal["success"]
    message: str
    data: List[RagContextItem]


class AgentRunRequest(BaseModel):
    goal: str = Field(..., min_length=5, max_length=1000)
    requirements: Optional[WebsiteGenerationRequest] = None
    top_k: int = Field(default=4, ge=1, le=8)
    provider: Literal["auto", "claude", "local"] = "auto"


class AgentMessage(BaseModel):
    agent: str
    role: Literal["user", "assistant", "system"]
    content: str


class AgentStepResult(BaseModel):
    agent: str
    purpose: str
    output: str
    fallback_used: bool


class AgentRunResult(BaseModel):
    run_id: str
    provider: str
    model: str
    goal: str
    steps: List[AgentStepResult]
    conversation: List[AgentMessage]
    rag_context: List[RagContextItem]
    final_brief: str


class AgentRunEnvelope(BaseModel):
    status: Literal["success"]
    message: str
    data: AgentRunResult


class McpTool(BaseModel):
    name: str
    description: str
    endpoint: str
    method: Literal["GET", "POST"]
    input_model: str


class McpToolListEnvelope(BaseModel):
    status: Literal["success"]
    message: str
    data: List[McpTool]
