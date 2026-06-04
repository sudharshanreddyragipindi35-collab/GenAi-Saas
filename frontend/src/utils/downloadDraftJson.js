function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function buildDraftJsonFilename(draft) {
  const companySlug = slugify(draft.company_name) || 'website-draft'
  return `${companySlug}-${draft.project_id}.json`
}

export function downloadDraftJson(draft, formattedJson) {
  const blob = new Blob([formattedJson], {
    type: 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = buildDraftJsonFilename(draft)
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
