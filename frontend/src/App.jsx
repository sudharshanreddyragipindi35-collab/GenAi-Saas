import { useState } from 'react'
import './App.css'
import { generateWebsiteDraft } from './services/websiteApi'

const featureOptions = [
  'Lead capture',
  'Services overview',
  'Pricing',
  'Testimonials',
  'Contact form',
  'FAQ',
]

function App() {
  const [requirements, setRequirements] = useState({
    businessType: '',
    companyName: '',
    colorTheme: 'Blue',
    targetAudience: '',
    requiredFeatures: ['Lead capture', 'Services overview', 'Contact form'],
  })
  const [generatedDraft, setGeneratedDraft] = useState(null)
  const [requestStatus, setRequestStatus] = useState('idle')
  const [requestMessage, setRequestMessage] = useState('')

  function handleFieldChange(event) {
    const { name, value } = event.target

    setRequirements((current) => ({
      ...current,
      [name]: value,
    }))
    setRequestMessage('')
  }

  function handleFeatureChange(event) {
    const { checked, value } = event.target

    setRequirements((current) => ({
      ...current,
      requiredFeatures: checked
        ? [...current.requiredFeatures, value]
        : current.requiredFeatures.filter((feature) => feature !== value),
    }))
    setRequestMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setRequestStatus('loading')
    setRequestMessage('')

    try {
      const draft = await generateWebsiteDraft(requirements)
      setGeneratedDraft(draft)
      setRequestStatus('success')
      setRequestMessage('Website draft generated successfully.')
    } catch (error) {
      setGeneratedDraft(null)
      setRequestStatus('error')
      setRequestMessage(error.message)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="product-label">GenAI SaaS</p>
          <h1>Website Builder</h1>
        </div>
        <span className="environment-badge">Local development</span>
      </header>

      <main className="builder-workspace">
        <section className="workspace-panel">
          <div className="panel-heading">
            <span className="step-number">01</span>
            <div>
              <p className="panel-label">Input</p>
              <h2>Business requirements</h2>
            </div>
          </div>

          <form className="requirements-form" onSubmit={handleSubmit}>
            <label className="form-field">
              <span>Business type</span>
              <input
                name="businessType"
                type="text"
                value={requirements.businessType}
                onChange={handleFieldChange}
                placeholder="Example: AI automation agency"
                minLength="2"
                maxLength="80"
                required
              />
            </label>

            <label className="form-field">
              <span>Company name</span>
              <input
                name="companyName"
                type="text"
                value={requirements.companyName}
                onChange={handleFieldChange}
                placeholder="Example: NovaFlow"
                minLength="2"
                maxLength="80"
                required
              />
            </label>

            <label className="form-field">
              <span>Color theme</span>
              <select
                name="colorTheme"
                value={requirements.colorTheme}
                onChange={handleFieldChange}
              >
                <option value="Blue">Blue</option>
                <option value="Green">Green</option>
                <option value="Purple">Purple</option>
                <option value="Red">Red</option>
                <option value="Neutral">Neutral</option>
              </select>
            </label>

            <label className="form-field">
              <span>Target audience</span>
              <input
                name="targetAudience"
                type="text"
                value={requirements.targetAudience}
                onChange={handleFieldChange}
                placeholder="Example: Small business owners"
                minLength="2"
                maxLength="160"
                required
              />
            </label>

            <fieldset className="feature-fieldset">
              <legend>Required website features</legend>
              <div className="feature-options">
                {featureOptions.map((feature) => (
                  <label className="feature-option" key={feature}>
                    <input
                      type="checkbox"
                      value={feature}
                      checked={requirements.requiredFeatures.includes(feature)}
                      onChange={handleFeatureChange}
                    />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              className="primary-action"
              type="submit"
              disabled={requestStatus === 'loading'}
            >
              {requestStatus === 'loading' ? 'Generating draft' : 'Generate draft'}
            </button>

            {requestMessage && (
              <p
                className={`form-status ${requestStatus}`}
                role={requestStatus === 'error' ? 'alert' : 'status'}
              >
                {requestMessage}
              </p>
            )}
          </form>
        </section>

        <section className="workspace-panel">
          <div className="panel-heading">
            <span className="step-number">02</span>
            <div>
              <p className="panel-label">Output</p>
              <h2>Generated website preview</h2>
            </div>
          </div>
          {generatedDraft ? (
            <div className="draft-summary">
              <div className="summary-heading">
                <div>
                  <p className="panel-label">Draft ready</p>
                  <h3>{generatedDraft.company_name}</h3>
                </div>
                <span className="project-id">{generatedDraft.project_id}</span>
              </div>

              <dl className="summary-grid">
                <div>
                  <dt>Business type</dt>
                  <dd>{generatedDraft.business_type}</dd>
                </div>
                <div>
                  <dt>Sections</dt>
                  <dd>{generatedDraft.website_structure.sections.length}</dd>
                </div>
                <div>
                  <dt>Theme</dt>
                  <dd>{generatedDraft.theme.name}</dd>
                </div>
                <div>
                  <dt>Generator</dt>
                  <dd>{generatedDraft.prompt_trace.provider_mode}</dd>
                </div>
              </dl>

              <div className="preview-placeholder ready">
                <p>
                  Backend connection is working. The visual website renderer will
                  be added in a later update.
                </p>
              </div>
            </div>
          ) : (
            <div className="preview-placeholder">
              <p>Submit business requirements to generate a website draft.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
