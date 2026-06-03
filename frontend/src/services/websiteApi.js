const WEBSITE_GENERATION_ENDPOINT = '/api/websites/generate'

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

export async function generateWebsiteDraft(requirements) {
  const response = await fetch(WEBSITE_GENERATION_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toWebsiteGenerationPayload(requirements)),
  })
  const result = await readResponse(response)

  if (!response.ok) {
    throw new Error(
      result?.message || 'Website generation failed. Please try again.',
    )
  }

  return result.data
}
