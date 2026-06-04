import { useEffect, useState } from 'react'
import './App.css'
import BackendStatus from './components/BackendStatus'
import DraftHistory from './components/DraftHistory'
import ResultViewer from './components/ResultViewer'
import ResultSkeleton from './components/ResultSkeleton'
import {
  blankRequirements,
  featureOptions,
  requirementPresets,
} from './data/requirementPresets'
import { getBackendHealth } from './services/systemApi'
import { generateWebsiteDraft } from './services/websiteApi'
import {
  clearDraftHistory,
  loadDraftHistory,
  saveDraftToHistory,
} from './services/draftHistoryStorage'
import { validateRequirements } from './utils/validateRequirements'

function App() {
  const [requirements, setRequirements] = useState(blankRequirements)
  const [selectedPreset, setSelectedPreset] = useState('')
  const [generatedDraft, setGeneratedDraft] = useState(null)
  const [requestStatus, setRequestStatus] = useState('idle')
  const [requestMessage, setRequestMessage] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [draftHistory, setDraftHistory] = useState(loadDraftHistory)
  const [backendHealth, setBackendHealth] = useState({
    status: 'checking',
    mode: '',
  })

  useEffect(() => {
    const controller = new AbortController()

    async function loadBackendHealth() {
      try {
        const health = await getBackendHealth({ signal: controller.signal })
        setBackendHealth({ status: 'online', mode: health.mode })
      } catch (error) {
        if (error.name !== 'AbortError') {
          setBackendHealth({ status: 'offline', mode: '' })
        }
      }
    }

    loadBackendHealth()

    return () => controller.abort()
  }, [])

  function handleFieldChange(event) {
    const { name, value } = event.target

    setRequirements((current) => ({
      ...current,
      [name]: value,
    }))
    setValidationErrors((current) => ({ ...current, [name]: '' }))
    setSelectedPreset('')
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
    setValidationErrors((current) => ({ ...current, requiredFeatures: '' }))
    setSelectedPreset('')
    setRequestMessage('')
  }

  function handlePresetChange(event) {
    const presetId = event.target.value
    const preset = requirementPresets.find((item) => item.id === presetId)

    setSelectedPreset(presetId)
    setRequirements(preset ? preset.requirements : blankRequirements)
    setValidationErrors({})
    setRequestStatus('idle')
    setRequestMessage('')
  }

  function handleResetForm() {
    setRequirements(blankRequirements)
    setSelectedPreset('')
    setValidationErrors({})
    setRequestStatus('idle')
    setRequestMessage('')
  }

  function handleClearResult() {
    setGeneratedDraft(null)
    setRequestStatus('idle')
    setRequestMessage('')
  }

  function handleSelectDraft(draft) {
    setGeneratedDraft(draft)
    setSelectedPreset('')
    setValidationErrors({})
    setRequestStatus('success')
    setRequestMessage(`Loaded ${draft.company_name} from local history.`)
  }

  function handleClearHistory() {
    setDraftHistory(clearDraftHistory())
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const errors = validateRequirements(requirements)

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setRequestStatus('error')
      setRequestMessage('Fix the highlighted fields before generating.')
      return
    }

    setValidationErrors({})
    setGeneratedDraft(null)
    setRequestStatus('loading')
    setRequestMessage('')

    try {
      const draft = await generateWebsiteDraft(requirements)
      setGeneratedDraft(draft)
      setDraftHistory(saveDraftToHistory(draft))
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
        <div className="app-header-actions">
          <span className="environment-badge">Local development</span>
          <BackendStatus
            mode={backendHealth.mode}
            status={backendHealth.status}
          />
        </div>
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

          <form className="requirements-form" onSubmit={handleSubmit} noValidate>
            <label className="form-field preset-field">
              <span>Example preset</span>
              <select value={selectedPreset} onChange={handlePresetChange}>
                <option value="">Start blank</option>
                {requirementPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <small>Choose a sample or enter your own requirements.</small>
            </label>

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
                aria-invalid={Boolean(validationErrors.businessType)}
                aria-describedby={
                  validationErrors.businessType ? 'business-type-error' : undefined
                }
                required
              />
              {validationErrors.businessType && (
                <span className="field-error" id="business-type-error">
                  {validationErrors.businessType}
                </span>
              )}
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
                aria-invalid={Boolean(validationErrors.companyName)}
                aria-describedby={
                  validationErrors.companyName ? 'company-name-error' : undefined
                }
                required
              />
              {validationErrors.companyName && (
                <span className="field-error" id="company-name-error">
                  {validationErrors.companyName}
                </span>
              )}
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
                aria-invalid={Boolean(validationErrors.targetAudience)}
                aria-describedby={
                  validationErrors.targetAudience
                    ? 'target-audience-error'
                    : undefined
                }
                required
              />
              {validationErrors.targetAudience && (
                <span className="field-error" id="target-audience-error">
                  {validationErrors.targetAudience}
                </span>
              )}
            </label>

            <fieldset
              className={`feature-fieldset ${
                validationErrors.requiredFeatures ? 'has-error' : ''
              }`}
              aria-describedby={
                validationErrors.requiredFeatures
                  ? 'required-features-error'
                  : undefined
              }
            >
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
              {validationErrors.requiredFeatures && (
                <span className="field-error" id="required-features-error">
                  {validationErrors.requiredFeatures}
                </span>
              )}
            </fieldset>

            <button
              className="primary-action"
              type="submit"
              disabled={requestStatus === 'loading'}
            >
              {requestStatus === 'loading' ? 'Generating draft' : 'Generate draft'}
            </button>

            <button
              className="secondary-action"
              type="button"
              disabled={requestStatus === 'loading'}
              onClick={handleResetForm}
            >
              Reset form
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

          <DraftHistory
            drafts={draftHistory}
            onClearHistory={handleClearHistory}
            onSelectDraft={handleSelectDraft}
          />
        </section>

        <section className="workspace-panel">
          <div className="panel-heading">
            <span className="step-number">02</span>
            <div>
              <p className="panel-label">Output</p>
              <h2>Generated website result</h2>
            </div>
            {generatedDraft && requestStatus !== 'loading' && (
              <button
                className="panel-action"
                type="button"
                onClick={handleClearResult}
              >
                Clear result
              </button>
            )}
          </div>
          {requestStatus === 'loading' ? (
            <ResultSkeleton />
          ) : generatedDraft ? (
            <ResultViewer key={generatedDraft.project_id} draft={generatedDraft} />
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
