import './App.css'

function App() {
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
        </section>

        <section className="workspace-panel">
          <div className="panel-heading">
            <span className="step-number">02</span>
            <div>
              <p className="panel-label">Output</p>
              <h2>Generated website preview</h2>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
