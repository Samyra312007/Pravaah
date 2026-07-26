const fs = require("fs");
const path = require("path");

const TEMPLATES_DIR = path.join(__dirname, "templates");

function loadTemplate(name) {
  const filePath = path.join(TEMPLATES_DIR, `${name}.html`);
  return fs.readFileSync(filePath, "utf-8");
}

function render(template, vars) {
  let html = template;
  for (const [key, value] of Object.entries(vars)) {
    const placeholder = new RegExp(`{{${key}}}`, "g");
    html = html.replace(placeholder, value != null ? String(value) : "");
  }
  return html;
}

function renderTable(rows, columns) {
  const headerRow = columns.map((c) => `<th>${c.label}</th>`).join("");
  const bodyRows = rows
    .map((row) => {
      const cells = columns.map((c) => `<td>${row[c.key] ?? "—"}</td>`).join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");
  return { headerRow, bodyRows };
}

module.exports = { loadTemplate, render, renderTable };
