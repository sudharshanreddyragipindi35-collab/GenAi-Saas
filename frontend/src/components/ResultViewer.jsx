import { useState } from 'react'
import './ResultViewer.css'
import WebsitePreview from './WebsitePreview'

function ResultViewer({ draft }) {
  const [activeView, setActiveView] = useState('preview')

  return (
    <div className="result-viewer">
      <div className="summary-heading">
        <div>
          <p className="panel-label">Draft ready</p>
          <h3>{draft.company_name}</h3>
        </div>
        <span className="project-id">{draft.project_id}</span>
      </div>

      <dl className="summary-grid">
        <div>
          <dt>Business type</dt>
          <dd>{draft.business_type}</dd>
        </div>
        <div>
          <dt>Sections</dt>
          <dd>{draft.website_structure.sections.length}</dd>
        </div>
        <div>
          <dt>Theme</dt>
          <dd>{draft.theme.name}</dd>
        </div>
        <div>
          <dt>Generator</dt>
          <dd>{draft.prompt_trace.provider_mode}</dd>
        </div>
      </dl>

      <div className="result-toolbar">
        <div className="view-tabs" role="tablist" aria-label="Generated result view">
          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'preview'}
            className={activeView === 'preview' ? 'active' : ''}
            onClick={() => setActiveView('preview')}
          >
            Preview
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'json'}
            className={activeView === 'json' ? 'active' : ''}
            onClick={() => setActiveView('json')}
          >
            JSON
          </button>
        </div>
      </div>

      {activeView === 'preview' ? (
        <div role="tabpanel" aria-label="Website preview">
          <WebsitePreview draft={draft} />
        </div>
      ) : (
        <div role="tabpanel" aria-label="JSON response">
          <pre className="json-response">{JSON.stringify(draft, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default ResultViewer
