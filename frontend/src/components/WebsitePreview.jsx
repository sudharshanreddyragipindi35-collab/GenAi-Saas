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

function getPreviewSectionId(sectionId) {
  return `preview-section-${sectionId}`
}

function formatSectionNumber(index) {
  return String(index + 1).padStart(2, '0')
}

function PreviewSection({ section, sectionCount, sectionIndex }) {
  return (
    <section
      className={`generated-section section-${section.section_id}`}
      id={getPreviewSectionId(section.section_id)}
    >
      <div className="section-copy">
        <div className="section-meta-row">
          <p className="section-kicker">{section.section_id}</p>
          <span>
            {formatSectionNumber(sectionIndex)} / {sectionCount}
          </span>
        </div>
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
          <li className="section-items-summary">
            {section.bullets.length} content items
          </li>
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
        <div className="generated-navigation-links">
          {previewData.sections.map((section, index) => (
            <a
              href={`#${getPreviewSectionId(section.section_id)}`}
              key={section.section_id}
            >
              {previewData.navigation[index] || section.section_id}
            </a>
          ))}
        </div>
      </nav>

      <div className="generated-page">
        {previewData.sections.map((section, index) => (
          <PreviewSection
            key={section.section_id}
            section={section}
            sectionCount={previewData.sections.length}
            sectionIndex={index}
          />
        ))}
      </div>
    </div>
  )
}

export default WebsitePreview
