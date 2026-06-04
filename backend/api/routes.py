import asyncio

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from backend.schemas.ai import (
    AgentRunEnvelope,
    AgentRunRequest,
    LlmInvokeEnvelope,
    LlmInvokeRequest,
    McpToolListEnvelope,
    RagSearchEnvelope,
    RagSearchRequest,
    VectorDocumentEnvelope,
    VectorDocumentInput,
    VectorDocumentListEnvelope,
)
from backend.schemas.website import (
    AiConfigEnvelope,
    HealthEnvelope,
    HealthStatus,
    PromptPreview,
    PromptPreviewEnvelope,
    WebsiteGenerationEnvelope,
    WebsiteGenerationRequest,
)
from backend.services.claude_generator import GenerationProviderError
from backend.services.generation_orchestrator import WebsiteGenerationOrchestrator
from backend.services.llm_gateway import llm_gateway
from backend.services.mcp_registry import MCP_TOOLS
from backend.services.multi_agent_workflow import multi_agent_workflow
from backend.services.prompt_templates import (
    PROMPT_TEMPLATE_VERSION,
    build_system_prompt,
    build_user_prompt,
)
from backend.services.rag_knowledge import retrieve_rag_context
from backend.services.vector_store import vector_store


router = APIRouter()
website_generator = WebsiteGenerationOrchestrator()


@router.get("/health", response_model=HealthEnvelope)
async def health_check() -> HealthEnvelope:
    ai_status = website_generator.get_status()
    return HealthEnvelope(
        status="success",
        message="Backend is healthy.",
        data=HealthStatus(
            service="backend",
            mode=ai_status.active_provider,
            ai_provider=ai_status.configured_provider,
            ai_enabled=ai_status.active_provider == "claude",
            model=ai_status.model,
        ),
    )


@router.get("/ai/config", response_model=AiConfigEnvelope)
async def ai_config() -> AiConfigEnvelope:
    return AiConfigEnvelope(
        status="success",
        message="AI generation configuration loaded.",
        data=website_generator.get_status(),
    )


@router.post("/ai/prompts/preview", response_model=PromptPreviewEnvelope)
async def preview_prompt(
    payload: WebsiteGenerationRequest,
) -> PromptPreviewEnvelope:
    rag_context = retrieve_rag_context(payload)
    ai_status = website_generator.get_status()

    return PromptPreviewEnvelope(
        status="success",
        message="Prompt preview generated.",
        data=PromptPreview(
            provider=ai_status.active_provider,
            model=ai_status.model,
            template_version=PROMPT_TEMPLATE_VERSION,
            system_prompt=build_system_prompt(),
            user_prompt=build_user_prompt(payload, rag_context),
            rag_context=rag_context,
        ),
    )


@router.get("/mcp/tools", response_model=McpToolListEnvelope)
async def list_mcp_tools() -> McpToolListEnvelope:
    return McpToolListEnvelope(
        status="success",
        message="MCP-style tool registry loaded.",
        data=MCP_TOOLS,
    )


@router.post("/llm/invoke", response_model=LlmInvokeEnvelope)
async def invoke_llm(payload: LlmInvokeRequest) -> LlmInvokeEnvelope | JSONResponse:
    try:
        result = await asyncio.to_thread(llm_gateway.invoke, payload)
    except GenerationProviderError as exc:
        return JSONResponse(
            status_code=502,
            content={
                "status": "error",
                "message": str(exc),
            },
        )

    return LlmInvokeEnvelope(
        status="success",
        message="LLM invocation completed.",
        data=result,
    )


@router.get("/vector/documents", response_model=VectorDocumentListEnvelope)
async def list_vector_documents() -> VectorDocumentListEnvelope:
    return VectorDocumentListEnvelope(
        status="success",
        message="Vector documents loaded.",
        data=vector_store.list_documents(),
    )


@router.post("/vector/documents", response_model=VectorDocumentEnvelope)
async def upsert_vector_document(
    payload: VectorDocumentInput,
) -> VectorDocumentEnvelope:
    return VectorDocumentEnvelope(
        status="success",
        message="Vector document upserted.",
        data=vector_store.upsert_document(payload),
    )


@router.post("/rag/search", response_model=RagSearchEnvelope)
async def search_rag(payload: RagSearchRequest) -> RagSearchEnvelope:
    return RagSearchEnvelope(
        status="success",
        message="RAG search completed.",
        data=vector_store.search(
            payload.query,
            top_k=payload.top_k,
            categories=payload.categories,
        ),
    )


@router.post("/agents/run", response_model=AgentRunEnvelope)
async def run_agents(payload: AgentRunRequest) -> AgentRunEnvelope | JSONResponse:
    try:
        result = await asyncio.to_thread(multi_agent_workflow.run, payload)
    except GenerationProviderError as exc:
        return JSONResponse(
            status_code=502,
            content={
                "status": "error",
                "message": str(exc),
            },
        )

    return AgentRunEnvelope(
        status="success",
        message="Multi-agent workflow completed.",
        data=result,
    )


@router.post("/websites/generate", response_model=WebsiteGenerationEnvelope)
async def generate_website(
    payload: WebsiteGenerationRequest,
) -> WebsiteGenerationEnvelope | JSONResponse:
    try:
        draft = await asyncio.to_thread(website_generator.generate, payload)
    except GenerationProviderError as exc:
        return JSONResponse(
            status_code=502,
            content={
                "status": "error",
                "message": str(exc),
            },
        )

    return WebsiteGenerationEnvelope(
        status="success",
        message="Website draft generated from structured requirements.",
        data=draft,
    )
