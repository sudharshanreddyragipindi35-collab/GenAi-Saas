import './AiGenerationPanel.css'

const providerLabels = {
  claude: 'Claude',
  local: 'Local fallback',
  unconfigured: 'Claude missing key',
}

function AiGenerationPanel({
  aiConfig,
  onPreviewPrompt,
  promptPreview,
  promptPreviewMessage,
  promptPreviewStatus,
}) {
  const activeProvider = aiConfig?.active_provider || 'local'
  const providerLabel = providerLabels[activeProvider] || activeProvider
  const keyLabel = aiConfig?.api_key_configured ? 'Configured' : 'Not configured'
  const ragLabel = aiConfig?.rag_enabled ? 'Enabled' : 'Disabled'

  return (
    <section className="ai-generation-panel" aria-labelledby="ai-panel-title">
      <div className="ai-generation-heading">
        <div>
          <p className="panel-label">GenAI</p>
          <h3 id="ai-panel-title">Claude generation</h3>
        </div>
        <span className={`ai-provider-badge ${activeProvider}`}>
          {providerLabel}
        </span>
      </div>

      <div className="ai-status-grid">
        <div>
          <span>Model</span>
          <strong>{aiConfig?.model || 'Checking'}</strong>
        </div>
        <div>
          <span>API key</span>
          <strong>{keyLabel}</strong>
        </div>
        <div>
          <span>RAG</span>
          <strong>{ragLabel}</strong>
        </div>
      </div>

      <button
        className="ai-preview-action"
        type="button"
        disabled={promptPreviewStatus === 'loading'}
        onClick={onPreviewPrompt}
      >
        {promptPreviewStatus === 'loading'
          ? 'Building prompt'
          : 'Preview prompt + RAG'}
      </button>

      {promptPreviewMessage && (
        <p className={`ai-preview-message ${promptPreviewStatus}`}>
          {promptPreviewMessage}
        </p>
      )}

      {promptPreview && (
        <div className="prompt-preview-panel">
          <div className="prompt-preview-meta">
            <span>{promptPreview.template_version}</span>
            <span>{promptPreview.model}</span>
          </div>

          <details>
            <summary>System prompt</summary>
            <pre>{promptPreview.system_prompt}</pre>
          </details>

          <details open>
            <summary>User prompt</summary>
            <pre>{promptPreview.user_prompt}</pre>
          </details>

          <div className="rag-preview-list">
            <span>RAG sources</span>
            {promptPreview.rag_context.length > 0 ? (
              promptPreview.rag_context.map((item) => (
                <article key={item.id}>
                  <strong>{item.title}</strong>
                  <small>
                    {item.category} / score {item.score}
                  </small>
                  <p>{item.content}</p>
                </article>
              ))
            ) : (
              <p>No RAG sources selected.</p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default AiGenerationPanel
