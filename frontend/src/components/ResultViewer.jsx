import { useState } from 'react'
import './ResultViewer.css'
import WebsitePreview from './WebsitePreview'
import { downloadDraftJson } from '../utils/downloadDraftJson'

function ResultViewer({ draft }) {
  const [activeView, setActiveView] = useState('preview')
  const [copyStatus, setCopyStatus] = useState('idle')
  const [downloadStatus, setDownloadStatus] = useState('idle')
  const formattedJson = JSON.stringify(draft, null, 2)
  const sectionCount = draft.website_structure.sections.length
  const requestedFeatures = draft.metadata?.required_features || []
  const seoDetails = [
    {
      label: 'SEO title',
      value: draft.generated_content.seo_title,
    },
    {
      label: 'SEO description',
      value: draft.generated_content.seo_description,
    },
    {
      label: 'Tagline',
      value: draft.generated_content.tagline,
    },
  ]

  function copyWithFallback(text) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.setAttribute('readonly', '')
    textArea.style.position = 'fixed'
    textArea.style.top = '-9999px'
    document.body.appendChild(textArea)
    textArea.select()
    const copied = document.execCommand('copy')
    document.body.removeChild(textArea)

    if (!copied) {
      throw new Error('Copy command failed.')
    }
  }

  async function handleCopyJson() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(formattedJson)
      } else {
        copyWithFallback(formattedJson)
      }
      setCopyStatus('copied')
    } catch {
      setCopyStatus('error')
    }
  }

  function handleDownloadJson() {
    try {
      downloadDraftJson(draft, formattedJson)
      setDownloadStatus('downloaded')
    } catch {
      setDownloadStatus('error')
    }
  }

  function handleViewChange(view) {
    setActiveView(view)
    setCopyStatus('idle')
    setDownloadStatus('idle')
  }

  function getJsonToolbarStatus() {
    if (downloadStatus === 'downloaded') {
      return 'Downloaded JSON'
    }

    if (downloadStatus === 'error') {
      return 'Download failed'
    }

    if (copyStatus === 'copied') {
      return 'Copied JSON'
    }

    if (copyStatus === 'error') {
      return 'Copy failed'
    }

    return 'Structured response'
  }

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
          <dd>{sectionCount}</dd>
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

      <div className="preview-summary-strip">
        <div className="section-count-card">
          <strong>{sectionCount}</strong>
          <span>generated sections</span>
        </div>

        {requestedFeatures.length > 0 && (
          <div className="feature-chip-group" aria-label="Requested features">
            {requestedFeatures.map((feature) => (
              <span className="feature-chip" key={feature}>
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="result-toolbar">
        <div className="view-tabs" role="tablist" aria-label="Generated result view">
          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'preview'}
            className={activeView === 'preview' ? 'active' : ''}
            onClick={() => handleViewChange('preview')}
          >
            Preview
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'json'}
            className={activeView === 'json' ? 'active' : ''}
            onClick={() => handleViewChange('json')}
          >
            JSON
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'seo'}
            className={activeView === 'seo' ? 'active' : ''}
            onClick={() => handleViewChange('seo')}
          >
            SEO
          </button>
        </div>
      </div>

      {activeView === 'preview' ? (
        <div role="tabpanel" aria-label="Website preview">
          <WebsitePreview draft={draft} />
        </div>
      ) : activeView === 'json' ? (
        <div role="tabpanel" aria-label="JSON response">
          <div className="json-toolbar">
            <span>{getJsonToolbarStatus()}</span>
            <div className="json-toolbar-actions">
              <button type="button" onClick={handleCopyJson}>
                Copy JSON
              </button>
              <button type="button" onClick={handleDownloadJson}>
                Download JSON
              </button>
            </div>
          </div>
          <pre className="json-response">{formattedJson}</pre>
        </div>
      ) : (
        <div className="seo-panel" role="tabpanel" aria-label="SEO content">
          {seoDetails.map((item) => (
            <article className="seo-detail" key={item.label}>
              <span>{item.label}</span>
              <p>{item.value}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default ResultViewer
