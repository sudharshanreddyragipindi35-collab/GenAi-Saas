from uuid import uuid4

from backend.core.config import settings
from backend.schemas.ai import (
    AgentMessage,
    AgentRunRequest,
    AgentRunResult,
    AgentStepResult,
    LlmInvokeRequest,
)
from backend.services.llm_gateway import llm_gateway
from backend.services.vector_store import vector_store


AGENT_SYSTEM_PROMPTS = {
    "strategist": (
        "You are a SaaS positioning strategist. Create a concise strategy brief "
        "with audience, offer angle, conversion goal, and risk notes."
    ),
    "copywriter": (
        "You are a conversion copywriter. Turn strategy and RAG context into "
        "section-level messaging, CTAs, and proof points."
    ),
    "designer": (
        "You are a UI design lead. Recommend layout, theme, hierarchy, and "
        "interaction ideas that fit the generated website builder preview."
    ),
    "reviewer": (
        "You are a product QA reviewer. Consolidate the other agents into an "
        "implementation-ready brief with conflicts resolved."
    ),
}


def _requirements_summary(request: AgentRunRequest) -> str:
    if not request.requirements:
        return "No structured website requirements were supplied."

    requirements = request.requirements
    return (
        f"Company: {requirements.company_name}\n"
        f"Business type: {requirements.business_type}\n"
        f"Audience: {requirements.target_audience}\n"
        f"Theme: {requirements.color_theme}\n"
        f"Features: {', '.join(requirements.required_features)}"
    )


def _rag_summary(request: AgentRunRequest) -> str:
    query = f"{request.goal}\n{_requirements_summary(request)}"
    rag_context = vector_store.search(query, top_k=request.top_k)

    return "\n".join(
        [
            f"- {item.title} ({item.category}, score {item.score}): {item.content}"
            for item in rag_context
        ]
    ), rag_context


class MultiAgentWorkflowService:
    def run(self, payload: AgentRunRequest) -> AgentRunResult:
        run_id = f"agents-{uuid4().hex[:10]}"
        rag_text, rag_context = _rag_summary(payload)
        requirements_text = _requirements_summary(payload)
        conversation = [
            AgentMessage(agent="user", role="user", content=payload.goal),
            AgentMessage(
                agent="system",
                role="system",
                content=f"Requirements:\n{requirements_text}\n\nRAG:\n{rag_text}",
            ),
        ]
        steps = []
        prior_outputs = []

        for agent_name in ("strategist", "copywriter", "designer", "reviewer"):
            prompt = self._build_agent_prompt(
                agent_name=agent_name,
                goal=payload.goal,
                requirements_text=requirements_text,
                rag_text=rag_text,
                prior_outputs=prior_outputs,
            )
            result = llm_gateway.invoke(
                LlmInvokeRequest(
                    purpose=f"agent-{agent_name}",
                    provider=payload.provider,
                    system_prompt=AGENT_SYSTEM_PROMPTS[agent_name],
                    user_prompt=prompt,
                    max_tokens=900,
                    temperature=0.25,
                )
            )
            steps.append(
                AgentStepResult(
                    agent=agent_name,
                    purpose=result.purpose,
                    output=result.output,
                    fallback_used=result.fallback_used,
                )
            )
            conversation.append(
                AgentMessage(
                    agent=agent_name,
                    role="assistant",
                    content=result.output,
                )
            )
            prior_outputs.append(f"{agent_name}: {result.output}")

        resolved_provider = (
            "local"
            if payload.provider == "local" or not llm_gateway.is_claude_available()
            else "claude"
        )

        return AgentRunResult(
            run_id=run_id,
            provider=resolved_provider,
            model=(
                settings.anthropic_model
                if resolved_provider == "claude"
                else "deterministic-local"
            ),
            goal=payload.goal,
            steps=steps,
            conversation=conversation,
            rag_context=rag_context,
            final_brief=steps[-1].output if steps else "",
        )

    def _build_agent_prompt(
        self,
        agent_name: str,
        goal: str,
        requirements_text: str,
        rag_text: str,
        prior_outputs: list[str],
    ) -> str:
        prior_context = "\n\n".join(prior_outputs) or "No prior agent outputs yet."

        return (
            f"Goal:\n{goal}\n\n"
            f"Requirements:\n{requirements_text}\n\n"
            f"RAG context:\n{rag_text or 'No retrieved context.'}\n\n"
            f"Prior agent communication:\n{prior_context}\n\n"
            f"Now respond as the {agent_name}. Keep the response compact and useful."
        )


multi_agent_workflow = MultiAgentWorkflowService()
