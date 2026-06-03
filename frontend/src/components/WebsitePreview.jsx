import './WebsitePreview.css'

function buildThemeStyles(theme) {
  return {
    '--preview-background': theme.palette.background,
    '--preview-surface': theme.palette.surface,
    '--preview-text': theme.palette.text,
    '--preview-primary': theme.palette.primary,
    '--preview-secondary': theme.palette.secondary,
    '--preview-accent': theme.palette.accent,
    '--preview-radius': theme.radius,
    '--preview-heading-font': theme.fonts.heading,
    '--preview-body-font': theme.fonts.body,
  }
}

function PreviewSection({ section }) {
  return (
    <section className={`generated-section section-${section.section_id}`}>
      <div className="section-copy">
        <p className="section-kicker">{section.section_id}</p>
        <h4>{section.heading}</h4>
        <p>{section.body}</p>
        {section.cta_label && (
          <button className="preview-button" type="button">
            {section.cta_label}
          </button>
        )}
      </div>

      {section.bullets.length > 0 && (
        <ul className="section-items">
          {section.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  )
}

function WebsitePreview({ draft }) {
  const { preview_data: previewData, theme } = draft

  return (
    <div className="website-preview" style={buildThemeStyles(theme)}>
      <nav className="generated-navigation">
        <strong>{draft.company_name}</strong>
        <div>
          {previewData.navigation.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </nav>

      <div className="generated-page">
        {previewData.sections.map((section) => (
          <PreviewSection key={section.section_id} section={section} />
        ))}
      </div>
    </div>
  )
}

export default WebsitePreview
