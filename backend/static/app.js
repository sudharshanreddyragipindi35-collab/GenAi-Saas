const form = document.querySelector("#requirements-form");
const apiStatus = document.querySelector("#api-status");
const errorBox = document.querySelector("#error-box");
const previewRoot = document.querySelector("#preview-root");
const jsonOutput = document.querySelector("#json-output");
const projectId = document.querySelector("#project-id");
const submitButton = document.querySelector(".primary-action");
const tabButtons = document.querySelectorAll(".tab-button");
const previewTab = document.querySelector("#preview-tab");
const jsonTab = document.querySelector("#json-tab");

const sectionOrder = ["hero", "about", "services", "testimonials", "pricing", "contact"];

function setApiStatus(text, state) {
  apiStatus.textContent = text;
  apiStatus.className = `status-pill ${state || ""}`.trim();
}

function setError(message) {
  if (!message) {
    errorBox.hidden = true;
    errorBox.textContent = "";
    return;
  }

  errorBox.hidden = false;
  errorBox.textContent = message;
}

function parseFeatures(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function collectPayload() {
  return {
    business_type: document.querySelector("#business-type").value.trim(),
    company_name: document.querySelector("#company-name").value.trim(),
    color_theme: document.querySelector("#color-theme").value,
    required_features: parseFeatures(document.querySelector("#required-features").value),
    target_audience: document.querySelector("#target-audience").value.trim(),
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function findSection(sections, id) {
  return sections.find((section) => section.section_id === id);
}

function renderBullets(items) {
  if (!items.length) {
    return "";
  }

  return `
    <ul class="bullet-grid">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderPreview(draft) {
  const theme = draft.theme;
  const sections = draft.preview_data.sections;
  const hero = findSection(sections, "hero") || sections[0];
  const normalSections = sectionOrder
    .map((id) => findSection(sections, id))
    .filter(Boolean)
    .filter((section) => section.section_id !== "hero");

  previewRoot.className = "website-preview";
  previewRoot.style.setProperty("--site-bg", theme.palette.background);
  previewRoot.style.setProperty("--site-surface", theme.palette.surface);
  previewRoot.style.setProperty("--site-text", theme.palette.text);
  previewRoot.style.setProperty("--site-primary", theme.palette.primary);
  previewRoot.style.setProperty("--site-secondary", theme.palette.secondary);
  previewRoot.style.setProperty("--site-accent", theme.palette.accent);

  previewRoot.innerHTML = `
    <nav class="preview-nav">
      <div class="brand">${escapeHtml(draft.company_name)}</div>
      <div class="nav-links">
        ${draft.preview_data.navigation
          .map((item) => `<span>${escapeHtml(item)}</span>`)
          .join("")}
      </div>
    </nav>

    <section class="preview-hero">
      <div>
        <h2>${escapeHtml(hero.heading)}</h2>
        <p>${escapeHtml(hero.body)}</p>
        <span class="preview-cta">${escapeHtml(hero.cta_label || "Get started")}</span>
      </div>
      <div class="visual-panel" aria-hidden="true">
        <div class="visual-bars">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="metric-grid">
          <div class="metric">
            <strong>5</strong>
            <span>Core sections</span>
          </div>
          <div class="metric">
            <strong>SEO</strong>
            <span>Content ready</span>
          </div>
        </div>
      </div>
    </section>

    ${normalSections
      .map(
        (section) => `
          <section class="preview-section">
            <h3>${escapeHtml(section.heading)}</h3>
            <p>${escapeHtml(section.body)}</p>
            ${renderBullets(section.bullets)}
          </section>
        `
      )
      .join("")}
  `;
}

async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    if (!response.ok) {
      throw new Error("Health check failed");
    }
    setApiStatus("API online", "ok");
  } catch (error) {
    setApiStatus("API offline", "error");
  }
}

async function generateDraft(event) {
  event.preventDefault();
  setError("");
  submitButton.disabled = true;
  submitButton.textContent = "Generating";

  try {
    const response = await fetch("/api/websites/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(collectPayload()),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Generation failed");
    }

    projectId.textContent = result.data.project_id;
    jsonOutput.textContent = JSON.stringify(result, null, 2);
    renderPreview(result.data);
    setApiStatus("Draft ready", "ok");
  } catch (error) {
    setError(error.message);
    setApiStatus("Generation failed", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Generate Draft";
  }
}

function switchTab(tabName) {
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });

  previewTab.hidden = tabName !== "preview";
  jsonTab.hidden = tabName !== "json";
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tab));
});

form.addEventListener("submit", generateDraft);
checkHealth();
