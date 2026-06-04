from backend.schemas.ai import McpTool


MCP_TOOLS = [
    McpTool(
        name="llm.invoke",
        description="Invoke the configured LLM provider for a generic prompt.",
        endpoint="/api/llm/invoke",
        method="POST",
        input_model="LlmInvokeRequest",
    ),
    McpTool(
        name="rag.search",
        description="Search the local vector store for relevant RAG context.",
        endpoint="/api/rag/search",
        method="POST",
        input_model="RagSearchRequest",
    ),
    McpTool(
        name="vector.documents.upsert",
        description="Add or update a local vector document.",
        endpoint="/api/vector/documents",
        method="POST",
        input_model="VectorDocumentInput",
    ),
    McpTool(
        name="website.generate",
        description="Generate a structured website draft with Claude or local fallback.",
        endpoint="/api/websites/generate",
        method="POST",
        input_model="WebsiteGenerationRequest",
    ),
    McpTool(
        name="agents.run",
        description="Run the strategist, copywriter, designer, and reviewer agent workflow.",
        endpoint="/api/agents/run",
        method="POST",
        input_model="AgentRunRequest",
    ),
]
