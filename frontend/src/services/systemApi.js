const HEALTH_ENDPOINT = '/api/health'

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
