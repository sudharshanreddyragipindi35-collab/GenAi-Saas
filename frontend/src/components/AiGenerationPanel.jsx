import { useEffect, useState } from 'react'
import './AiGenerationPanel.css'
import {
  buildRequirementsQuery,
  getMcpTools,
  invokeLlm,
  runAgentWorkflow,
  searchRag,
  upsertVectorDocument,
} from '../services/systemApi'

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
  requirements,
}) {
  const [llmResult, setLlmResult] = useState(null)
  const [llmStatus, setLlmStatus] = useState('idle')
  const [llmMessage, setLlmMessage] = useState('')
  const [ragResults, setRagResults] = useState([])
  const [ragStatus, setRagStatus] = useState('idle')
  const [ragMessage, setRagMessage] = useState('')
  const [vectorNote, setVectorNote] = useState('')
  const [vectorStatus, setVectorStatus] = useState('idle')
  const [vectorMessage, setVectorMessage] = useState('')
  const [agentRun, setAgentRun] = useState(null)
  const [agentStatus, setAgentStatus] = useState('idle')
  const [agentMessage, setAgentMessage] = useState('')
  const [mcpTools, setMcpTools] = useState([])
  const activeProvider = aiConfig?.active_provider || 'local'
  const providerLabel = providerLabels[activeProvider] || activeProvider
  const keyLabel = aiConfig?.api_key_configured ? 'Configured' : 'Not configured'
  const ragLabel = aiConfig?.rag_enabled ? 'Enabled' : 'Disabled'
  const requirementsQuery = buildRequirementsQuery(requirements)

  useEffect(() => {
    let ignoreResult = false

    async function loadMcpTools() {
      try {
        const tools = await getMcpTools()

        if (!ignoreResult) {
          setMcpTools(tools)
        }
      } catch {
        if (!ignoreResult) {
          setMcpTools([])
        }
      }
    }

    loadMcpTools()

    return () => {
      ignoreResult = true
    }
  }, [])

  async function handleLlmInvoke() {
    setLlmStatus('loading')
    setLlmMessage('')

    try {
      const result = await invokeLlm({
        purpose: 'requirements-analysis',
        provider: 'auto',
        system_prompt:
          'You are a concise product strategist reviewing website requirements.',
        user_prompt: `Review these website requirements and identify the strongest website generation angle:\n${requirementsQuery}`,
        max_tokens: 700,
        temperature: 0.2,
      })
      setLlmResult(result)
      setLlmStatus('success')
      setLlmMessage('LLM invoke completed.')
    } catch (error) {
      setLlmResult(null)
      setLlmStatus('error')
      setLlmMessage(error.message)
    }
  }

  async function handleRagSearch() {
    setRagStatus('loading')
    setRagMessage('')

    try {
      const results = await searchRag({
        query: requirementsQuery || 'website generation',
        top_k: 5,
        categories: [],
      })
      setRagResults(results)
      setRagStatus('success')
      setRagMessage(`Found ${results.length} RAG matches.`)
    } catch (error) {
      setRagResults([])
      setRagStatus('error')
      setRagMessage(error.message)
    }
  }

  async function handleSaveVectorNote() {
    const content = vectorNote.trim()

    if (content.length < 10) {
      setVectorStatus('error')
      setVectorMessage('Add at least 10 characters before saving.')
      return
    }

    setVectorStatus('loading')
    setVectorMessage('')

    try {
      const document = await upsertVectorDocument({
        title: `${requirements.companyName || 'Website'} context note`,
        category: 'custom',
        content,
        metadata: {
          source: 'frontend-ai-panel',
          company_name: requirements.companyName,
          business_type: requirements.businessType,
        },
      })
      setVectorNote('')
      setVectorStatus('success')
      setVectorMessage(`Saved vector document ${document.id}.`)
    } catch (error) {
      setVectorStatus('error')
      setVectorMessage(error.message)
    }
  }

  async function handleAgentRun() {
    setAgentStatus('loading')
    setAgentMessage('')

    try {
      const result = await runAgentWorkflow(requirements)
      setAgentRun(result)
      setAgentStatus('success')
      setAgentMessage(`Completed ${result.steps.length} agent calls.`)
    } catch (error) {
      setAgentRun(null)
      setAgentStatus('error')
      setAgentMessage(error.message)
    }
  }

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

      {mcpTools.length > 0 && (
        <div className="mcp-tool-list" aria-label="MCP tools">
          <span>MCP tools</span>
          {mcpTools.map((tool) => (
            <code key={tool.name}>{tool.name}</code>
          ))}
        </div>
      )}

      <div className="ai-action-grid">
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
        <button
          className="ai-preview-action"
          type="button"
          disabled={llmStatus === 'loading'}
          onClick={handleLlmInvoke}
        >
          {llmStatus === 'loading' ? 'Invoking LLM' : 'Invoke LLM'}
        </button>
        <button
          className="ai-preview-action"
          type="button"
          disabled={ragStatus === 'loading'}
          onClick={handleRagSearch}
        >
          {ragStatus === 'loading' ? 'Searching RAG' : 'Search RAG'}
        </button>
        <button
          className="ai-preview-action"
          type="button"
          disabled={agentStatus === 'loading'}
          onClick={handleAgentRun}
        >
          {agentStatus === 'loading' ? 'Running agents' : 'Run agents'}
        </button>
      </div>

      {promptPreviewMessage && (
        <p className={`ai-preview-message ${promptPreviewStatus}`}>
          {promptPreviewMessage}
        </p>
      )}
      {llmMessage && (
        <p className={`ai-preview-message ${llmStatus}`}>{llmMessage}</p>
      )}
      {ragMessage && (
        <p className={`ai-preview-message ${ragStatus}`}>{ragMessage}</p>
      )}
      {agentMessage && (
        <p className={`ai-preview-message ${agentStatus}`}>{agentMessage}</p>
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

      {llmResult && (
        <div className="ai-result-panel">
          <div className="prompt-preview-meta">
            <span>{llmResult.provider}</span>
            <span>{llmResult.model}</span>
          </div>
          <pre>{llmResult.output}</pre>
        </div>
      )}

      {ragResults.length > 0 && (
        <div className="rag-preview-list">
          <span>Vector RAG search</span>
          {ragResults.map((item) => (
            <article key={item.id}>
              <strong>{item.title}</strong>
              <small>
                {item.category} / score {item.score}
              </small>
              <p>{item.content}</p>
            </article>
          ))}
        </div>
      )}

      <div className="vector-note-box">
        <label>
          <span>Add RAG note</span>
          <textarea
            value={vectorNote}
            onChange={(event) => setVectorNote(event.target.value)}
            placeholder="Add business-specific context to the local vector DB."
            rows="3"
          />
        </label>
        <button
          type="button"
          disabled={vectorStatus === 'loading'}
          onClick={handleSaveVectorNote}
        >
          {vectorStatus === 'loading' ? 'Saving note' : 'Save to vector DB'}
        </button>
        {vectorMessage && (
          <p className={`ai-preview-message ${vectorStatus}`}>{vectorMessage}</p>
        )}
      </div>

      {agentRun && (
        <div className="agent-run-panel">
          <div className="prompt-preview-meta">
            <span>{agentRun.provider}</span>
            <span>{agentRun.run_id}</span>
          </div>
          <article>
            <strong>Final brief</strong>
            <p>{agentRun.final_brief}</p>
          </article>
          {agentRun.steps.map((step) => (
            <details key={step.agent}>
              <summary>{step.agent}</summary>
              <pre>{step.output}</pre>
            </details>
          ))}
        </div>
      )}
    </section>
  )
}

export default AiGenerationPanel
