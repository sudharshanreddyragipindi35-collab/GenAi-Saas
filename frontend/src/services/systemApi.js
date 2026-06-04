const HEALTH_ENDPOINT = '/api/health'
const AI_CONFIG_ENDPOINT = '/api/ai/config'
const PROMPT_PREVIEW_ENDPOINT = '/api/ai/prompts/preview'

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
