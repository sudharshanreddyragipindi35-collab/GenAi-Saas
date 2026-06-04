const DRAFT_HISTORY_KEY = 'genai-saas:draft-history'
const MAX_DRAFT_HISTORY_ITEMS = 5

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function parseHistory(value) {
  if (!value) {
    return []
  }

  try {
    const parsedValue = JSON.parse(value)
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

function writeHistory(history) {
  if (!canUseStorage()) {
    return history
  }

  try {
    window.localStorage.setItem(DRAFT_HISTORY_KEY, JSON.stringify(history))
  } catch {
    return history
  }

  return history
}

export function loadDraftHistory() {
  if (!canUseStorage()) {
    return []
  }

  return parseHistory(window.localStorage.getItem(DRAFT_HISTORY_KEY))
}

export function saveDraftToHistory(draft) {
  const existingHistory = loadDraftHistory()
  const nextHistory = [
    draft,
    ...existingHistory.filter((item) => item.project_id !== draft.project_id),
  ].slice(0, MAX_DRAFT_HISTORY_ITEMS)

  return writeHistory(nextHistory)
}

export function clearDraftHistory() {
  if (!canUseStorage()) {
    return []
  }

  try {
    window.localStorage.removeItem(DRAFT_HISTORY_KEY)
  } catch {
    return []
  }

  return []
}
