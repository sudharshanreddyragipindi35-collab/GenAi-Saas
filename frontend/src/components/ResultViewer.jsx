import { useState } from 'react'
import './ResultViewer.css'
import WebsitePreview from './WebsitePreview'
import { downloadDraftJson } from '../utils/downloadDraftJson'

function ResultViewer({ draft }) {
  const [activeView, setActiveView] = useState('preview')
  const [previewViewport, setPreviewViewport] = useState('desktop')
  const [copyStatus, setCopyStatus] = useState('idle')
  const [downloadStatus, setDownloadStatus] = useState('idle')
  const formattedJson = JSON.stringify(draft, null, 2)
  const structureSections = draft.website_structure.sections
  const sectionCount = structureSections.length
  const requestedFeatures = draft.metadata?.required_features || []
  const themePalette = Object.entries(draft.theme.palette)
  const themeDetails = [
    {
      label: 'Heading font',
      value: draft.theme.fonts.heading,
    },
    {
      label: 'Body font',
      value: draft.theme.fonts.body,
    },
    {
      label: 'Radius',
      value: draft.theme.radius,
    },
    {
      label: 'Spacing',
      value: draft.theme.spacing,
    },
  ]
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
  const traceDetails = [
    {
      label: 'Provider mode',
      value: draft.prompt_trace.provider_mode,
    },
    {
      label: 'Template version',
      value: draft.prompt_trace.template_version,
    },
    {
      label: 'AI enabled',
      value: draft.metadata?.ai_enabled ? 'Yes' : 'No',
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
            aria-selected={activeView === 'outline'}
            className={activeView === 'outline' ? 'active' : ''}
            onClick={() => handleViewChange('outline')}
          >
            Outline
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
          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'theme'}
            className={activeView === 'theme' ? 'active' : ''}
            onClick={() => handleViewChange('theme')}
          >
            Theme
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'trace'}
            className={activeView === 'trace' ? 'active' : ''}
            onClick={() => handleViewChange('trace')}
          >
            Trace
          </button>
        </div>
      </div>

      {activeView === 'preview' ? (
        <div role="tabpanel" aria-label="Website preview">
          <div className="preview-viewport-toolbar" aria-label="Preview viewport">
            <button
              type="button"
              className={previewViewport === 'desktop' ? 'active' : ''}
              onClick={() => setPreviewViewport('desktop')}
            >
              Desktop
            </button>
            <button
              type="button"
              className={previewViewport === 'mobile' ? 'active' : ''}
              onClick={() => setPreviewViewport('mobile')}
            >
              Mobile
            </button>
          </div>
          <div className={`preview-viewport-frame ${previewViewport}`}>
            <WebsitePreview draft={draft} />
          </div>
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
      ) : activeView === 'outline' ? (
        <div className="outline-panel" role="tabpanel" aria-label="Page outline">
          {structureSections.map((section, index) => (
            <article className="outline-card" key={section.id}>
              <div className="outline-card-heading">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h4>{section.name}</h4>
                  <p>{section.purpose}</p>
                </div>
              </div>
              <div className="outline-chip-row" aria-label={`${section.name} parts`}>
                {section.components.map((component) => (
                  <span key={component}>{component}</span>
                ))}
              </div>
              <div className="outline-fields">
                Fields: {section.content_fields.join(', ')}
              </div>
            </article>
          ))}
        </div>
      ) : activeView === 'seo' ? (
        <div className="seo-panel" role="tabpanel" aria-label="SEO content">
          {seoDetails.map((item) => (
            <article className="seo-detail" key={item.label}>
              <span>{item.label}</span>
              <p>{item.value}</p>
            </article>
          ))}
        </div>
      ) : activeView === 'theme' ? (
        <div className="theme-panel" role="tabpanel" aria-label="Theme tokens">
          <div className="theme-swatch-grid">
            {themePalette.map(([name, value]) => (
              <article className="theme-swatch" key={name}>
                <span
                  className="swatch-sample"
                  style={{ backgroundColor: value }}
                />
                <div>
                  <strong>{name}</strong>
                  <code>{value}</code>
                </div>
              </article>
            ))}
          </div>
          <div className="theme-detail-grid">
            {themeDetails.map((item) => (
              <article className="seo-detail" key={item.label}>
                <span>{item.label}</span>
                <p>{item.value}</p>
              </article>
            ))}
          </div>
          <div className="theme-mood-row" aria-label="Theme mood">
            {draft.theme.mood.map((mood) => (
              <span key={mood}>{mood}</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="trace-panel" role="tabpanel" aria-label="Prompt trace">
          <div className="trace-detail-grid">
            {traceDetails.map((item) => (
              <article className="seo-detail" key={item.label}>
                <span>{item.label}</span>
                <p>{item.value}</p>
              </article>
            ))}
          </div>
          <article className="trace-summary">
            <span>Prompt summary</span>
            <p>{draft.prompt_trace.optimized_prompt_summary}</p>
          </article>
          {draft.metadata?.note && (
            <article className="trace-summary">
              <span>Generator note</span>
              <p>{draft.metadata.note}</p>
            </article>
          )}
        </div>
      )}
    </div>
  )
}

export default ResultViewer
