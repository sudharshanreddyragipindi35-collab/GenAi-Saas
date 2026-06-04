import { useMemo, useState } from 'react'
import './DraftHistory.css'

const ALL_FEATURES_FILTER = 'all'

function formatDraftDate(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Local draft'
  }

  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getDraftFeatures(draft) {
  return draft.metadata?.required_features || []
}

function getDraftSectionCount(draft) {
  return draft.website_structure?.sections?.length || 0
}

function draftMatchesSearch(draft, query) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return true
  }

  const searchableText = [
    draft.company_name,
    draft.business_type,
    draft.theme?.name,
    ...getDraftFeatures(draft),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return searchableText.includes(normalizedQuery)
}

function DraftHistory({ drafts, onClearHistory, onDeleteDraft, onSelectDraft }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [featureFilter, setFeatureFilter] = useState(ALL_FEATURES_FILTER)

  const featureFilters = useMemo(() => {
    const features = new Set()

    drafts.forEach((draft) => {
      getDraftFeatures(draft).forEach((feature) => features.add(feature))
    })

    return Array.from(features).sort((a, b) => a.localeCompare(b))
  }, [drafts])

  const filteredDrafts = useMemo(
    () =>
      drafts.filter((draft) => {
        const matchesSearch = draftMatchesSearch(draft, searchQuery)
        const matchesFeature =
          featureFilter === ALL_FEATURES_FILTER ||
          getDraftFeatures(draft).includes(featureFilter)

        return matchesSearch && matchesFeature
      }),
    [drafts, featureFilter, searchQuery],
  )

  const totalSectionCount = drafts.reduce(
    (total, draft) => total + getDraftSectionCount(draft),
    0,
  )

  if (drafts.length === 0) {
    return null
  }

  return (
    <section className="draft-history" aria-labelledby="draft-history-title">
      <div className="draft-history-heading">
        <div>
          <p className="panel-label">Local history</p>
          <h3 id="draft-history-title">Recent drafts</h3>
        </div>
        <button type="button" onClick={onClearHistory}>
          Clear
        </button>
      </div>

      <div className="draft-history-stats" aria-label="Draft history summary">
        <div>
          <strong>{drafts.length}</strong>
          <span>drafts</span>
        </div>
        <div>
          <strong>{totalSectionCount}</strong>
          <span>sections</span>
        </div>
        <div>
          <strong>{featureFilters.length}</strong>
          <span>features</span>
        </div>
      </div>

      <div className="draft-history-controls">
        <label>
          <span>Search</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Company, type, theme"
          />
        </label>

        <label>
          <span>Feature</span>
          <select
            value={featureFilter}
            onChange={(event) => setFeatureFilter(event.target.value)}
          >
            <option value={ALL_FEATURES_FILTER}>All features</option>
            {featureFilters.map((feature) => (
              <option key={feature} value={feature}>
                {feature}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="draft-history-count">
        Showing {filteredDrafts.length} of {drafts.length}
      </p>

      <ul className="draft-history-list">
        {filteredDrafts.map((draft) => (
          <li key={draft.project_id}>
            <button
              className="draft-history-card"
              type="button"
              onClick={() => onSelectDraft(draft)}
            >
              <span className="draft-history-title">
                <strong>{draft.company_name}</strong>
                <small>{draft.business_type}</small>
              </span>
              <time dateTime={draft.created_at}>
                {formatDraftDate(draft.created_at)}
              </time>
            </button>
            <div className="draft-history-meta">
              <span>{getDraftSectionCount(draft)} sections</span>
              <span>{draft.theme?.name || 'Theme pending'}</span>
            </div>
            {getDraftFeatures(draft).length > 0 && (
              <div className="draft-history-features">
                {getDraftFeatures(draft).slice(0, 4).map((feature) => (
                  <span key={feature}>{feature}</span>
                ))}
              </div>
            )}
            <button
              className="draft-history-delete"
              type="button"
              onClick={() => onDeleteDraft(draft.project_id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {filteredDrafts.length === 0 && (
        <div className="draft-history-empty" role="status">
          No saved drafts match the current filters.
        </div>
      )}
    </section>
  )
}

export default DraftHistory
