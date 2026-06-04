import './DraftHistory.css'

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

function DraftHistory({ drafts, onClearHistory, onSelectDraft }) {
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

      <ul className="draft-history-list">
        {drafts.map((draft) => (
          <li key={draft.project_id}>
            <button type="button" onClick={() => onSelectDraft(draft)}>
              <span>
                <strong>{draft.company_name}</strong>
                <small>{draft.business_type}</small>
              </span>
              <time dateTime={draft.created_at}>
                {formatDraftDate(draft.created_at)}
              </time>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default DraftHistory
