const HEALTH_ENDPOINT = '/api/health'
const AI_CONFIG_ENDPOINT = '/api/ai/config'
const PROMPT_PREVIEW_ENDPOINT = '/api/ai/prompts/preview'
const LLM_INVOKE_ENDPOINT = '/api/llm/invoke'
const RAG_SEARCH_ENDPOINT = '/api/rag/search'
const VECTOR_DOCUMENTS_ENDPOINT = '/api/vector/documents'
const AGENTS_RUN_ENDPOINT = '/api/agents/run'
const MCP_TOOLS_ENDPOINT = '/api/mcp/tools'

function toWebsiteGenerationPayload(requirements) {
  return {
    business_type: requirements.businessType.trim(),
    company_name: requirements.companyName.trim(),
    color_theme: requirements.colorTheme,
    required_features: requirements.requiredFeatures,
    target_audience: requirements.targetAudience.trim(),
  }
}

async function readResponse(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function getBackendHealth(options = {}) {
  const response = await fetch(HEALTH_ENDPOINT, {
    method: 'GET',
    signal: options.signal,
  })
  const result = await readResponse(response)

  if (!response.ok) {
    throw new Error(result?.message || 'Backend health check failed.')
  }

  return result.data
}

export async function getAiConfig(options = {}) {
  const response = await fetch(AI_CONFIG_ENDPOINT, {
    method: 'GET',
    signal: options.signal,
  })
  const result = await readResponse(response)

  if (!response.ok) {
    throw new Error(result?.message || 'AI configuration check failed.')
  }

  return result.data
}

export async function previewAiPrompt(requirements) {
  const response = await fetch(PROMPT_PREVIEW_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toWebsiteGenerationPayload(requirements)),
  })
  const result = await readResponse(response)

  if (!response.ok) {
    throw new Error(result?.message || 'Prompt preview failed.')
  }

  return result.data
}

export async function invokeLlm(payload) {
  const response = await fetch(LLM_INVOKE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const result = await readResponse(response)

  if (!response.ok) {
    throw new Error(result?.message || 'LLM invocation failed.')
  }

  return result.data
}

export async function searchRag(payload) {
  const response = await fetch(RAG_SEARCH_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const result = await readResponse(response)

  if (!response.ok) {
    throw new Error(result?.message || 'RAG search failed.')
  }

  return result.data
}

export async function upsertVectorDocument(payload) {
  const response = await fetch(VECTOR_DOCUMENTS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const result = await readResponse(response)

  if (!response.ok) {
    throw new Error(result?.message || 'Vector document save failed.')
  }

  return result.data
}

export async function runAgentWorkflow(requirements) {
  const payload = {
    goal: `Plan and review a website generation workflow for ${requirements.companyName.trim() || 'this business'}.`,
    requirements: toWebsiteGenerationPayload(requirements),
    top_k: 4,
  }
  const response = await fetch(AGENTS_RUN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const result = await readResponse(response)

  if (!response.ok) {
    throw new Error(result?.message || 'Multi-agent workflow failed.')
  }

  return result.data
}

export async function getMcpTools() {
  const response = await fetch(MCP_TOOLS_ENDPOINT, {
    method: 'GET',
  })
  const result = await readResponse(response)

  if (!response.ok) {
    throw new Error(result?.message || 'MCP tool registry failed.')
  }

  return result.data
}

export function buildRequirementsQuery(requirements) {
  return [
    requirements.companyName,
    requirements.businessType,
    requirements.targetAudience,
    requirements.colorTheme,
    requirements.requiredFeatures.join(' '),
  ]
    .join(' ')
    .trim()
}
