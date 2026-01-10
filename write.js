const editor = document.getElementById("editor");
const settingsModal = document.getElementById("settingsModal");
const settingsToggle = document.getElementById("settingsToggle");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const documentTitle = document.getElementById("documentTitle");
const STORAGE_KEY = "toast-write-content";
const SETTINGS_KEY = "toast-write-settings";
const SOURCES_KEY = "toast-write-sources";
const TITLE_KEY = "toast-write-title";
const THEME_KEY = "toast-write-theme";

// Citation templates
const citationFormats = {
  APA: "[Author]. ([Year]). [Title]. Retrieved from [URL]",
  MLA: "[Author]. \"[Title].\" [Website], [Year], [URL].",
  Chicago: "[Author]. [Title]. Accessed [Date]. [URL].",
  Harvard: "[Author], [Year]. [Title]. Available at: [URL].",
};

// Theme management
function setTheme(isDark) {
  const html = document.documentElement;
  if (isDark) {
    html.classList.remove("light-theme");
    document.getElementById("darkThemeBtn").classList.add("active");
    document.getElementById("lightThemeBtn").classList.remove("active");
    localStorage.setItem(THEME_KEY, "dark");
  } else {
    html.classList.add("light-theme");
    document.getElementById("lightThemeBtn").classList.add("active");
    document.getElementById("darkThemeBtn").classList.remove("active");
    localStorage.setItem(THEME_KEY, "light");
  }
}

// Load theme on startup
function loadTheme() {
  const theme = localStorage.getItem(THEME_KEY) || "dark";
  setTheme(theme === "dark");
}

document.getElementById("darkThemeBtn").addEventListener("click", () => {
  setTheme(true);
});

document.getElementById("lightThemeBtn").addEventListener("click", () => {
  setTheme(false);
});

// Modal controls
settingsToggle.addEventListener("click", () => {
  settingsModal.classList.add("open");
});

closeSettingsBtn.addEventListener("click", () => {
  settingsModal.classList.remove("open");
});

settingsModal.addEventListener("click", (e) => {
  if (e.target === settingsModal) {
    settingsModal.classList.remove("open");
  }
});

// Load settings
function loadSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (saved) {
    const settings = JSON.parse(saved);
    if (settings.fontSize) {
      document.getElementById("fontsize").value = settings.fontSize;
      document.getElementById("fontsizeDisplay").textContent =
        settings.fontSize + "px";
      editor.style.fontSize = settings.fontSize + "px";
    }
    if (settings.fontFamily) {
      document.getElementById("fontfamily").value = settings.fontFamily;
      editor.style.fontFamily = settings.fontFamily;
    }
    if (settings.lineSpacing) {
      document.getElementById("linespacing").value = settings.lineSpacing;
      editor.style.lineHeight = settings.lineSpacing;
    }
    if (settings.textAlign) {
      document.getElementById("textAlign").value = settings.textAlign;
      editor.style.textAlign = settings.textAlign;
    }
  }
}

function saveSettings() {
  const settings = {
    fontSize: document.getElementById("fontsize").value,
    fontFamily: document.getElementById("fontfamily").value,
    lineSpacing: document.getElementById("linespacing").value,
    textAlign: document.getElementById("textAlign").value,
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Document title management
function loadTitle() {
  const saved = localStorage.getItem(TITLE_KEY);
  if (saved) {
    documentTitle.value = saved;
  }
}

function saveTitle() {
  localStorage.setItem(TITLE_KEY, documentTitle.value || "Untitled Essay");
}

documentTitle.addEventListener("input", saveTitle);

// Statistics calculation
function updateStats() {
  const text = editor.innerText;
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;
  const charCount = text.length;
  const readingTimeMinutes = Math.ceil(wordCount / 200);

  document.getElementById("wordCount").textContent = wordCount;
  document.getElementById("charCount").textContent = charCount;
  document.getElementById("readingTime").textContent =
    readingTimeMinutes + "m";
}

// Load and manage sources
function loadSources() {
  const saved = localStorage.getItem(SOURCES_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveSources(sources) {
  localStorage.setItem(SOURCES_KEY, JSON.stringify(sources));
  renderSources();
}

function renderSources() {
  const sources = loadSources();
  const sourceList = document.getElementById("sourceList");
  sourceList.innerHTML = "";
  sources.forEach((source, index) => {
    const item = document.createElement("div");
    item.className = "settings-source-item";
    item.innerHTML = `<span>${source}</span><button type="button" onclick="removeSource(${index})">×</button>`;
    sourceList.appendChild(item);
  });
}

function addSource() {
  const input = document.getElementById("sourceInput");
  if (input.value.trim()) {
    const sources = loadSources();
    sources.push(input.value.trim());
    saveSources(sources);
    input.value = "";
  }
}

function removeSource(index) {
  const sources = loadSources();
  sources.splice(index, 1);
  saveSources(sources);
}

// Citation insertion
function insertCitation(format) {
  const template = citationFormats[format];
  const citation = `<p>[${format}] ${template}</p>`;
  document.execCommand("insertHTML", false, citation);
  saveContent();
}

// Load content
function loadContent() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    editor.innerHTML = saved;
  } else {
    editor.innerHTML =
      '<p class="placeholder">Start writing your essay…</p>';
  }
  updateStats();
}

function saveContent() {
  localStorage.setItem(STORAGE_KEY, editor.innerHTML);
  updateStats();
}

// Insert bibliography
function insertBibliography() {
  const sources = loadSources();
  if (sources.length === 0) {
    alert("No sources to insert. Add sources first.");
    return;
  }

  const bibHtml =
    '<p><strong>Sources:</strong></p><ol><li>' +
    sources.join("</li><li>") +
    "</li></ol>";
  document.execCommand("insertHTML", false, bibHtml);
  saveContent();
}

// Print function
function printDocument() {
  window.print();
}

// Export PDF
function exportPdf() {
  const title = documentTitle.value || "Untitled Essay";
  const clone = document.getElementById("editor").cloneNode(true);
  clone.style.color = "black";

  const opt = {
    margin: 10,
    filename: title.slice(0, 30) + ".pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, backgroundColor: "#ffffff" },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf()
    .set(opt)
    .from(clone)
    .save();
}

// Tab indentation
editor.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
  }
});

// Font size slider
document.getElementById("fontsize").addEventListener("input", (e) => {
  const size = e.target.value;
  editor.style.fontSize = size + "px";
  document.getElementById("fontsizeDisplay").textContent = size + "px";
  saveSettings();
});

// Font family
document.getElementById("fontfamily").addEventListener("change", (e) => {
  editor.style.fontFamily = e.target.value;
  saveSettings();
});

// Line spacing
document.getElementById("linespacing").addEventListener("change", (e) => {
  editor.style.lineHeight = e.target.value;
  saveSettings();
});

// Text alignment
document.getElementById("textAlign").addEventListener("change", (e) => {
  editor.style.textAlign = e.target.value;
  saveSettings();
});

// Source management
document.getElementById("addSourceBtn").addEventListener("click", addSource);
document
  .getElementById("sourceInput")
  .addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addSource();
    }
  });

// Action buttons
document
  .getElementById("insertBibBtn")
  .addEventListener("click", insertBibliography);
document.getElementById("printBtn").addEventListener("click", printDocument);
document.getElementById("exportPdfBtn").addEventListener("click", exportPdf);

editor.addEventListener("focus", () => {
  if (editor.querySelector(".placeholder")) {
    editor.innerHTML = "";
  }
});

editor.addEventListener("input", () => {
  saveContent();
});

// Initialize
loadTheme();
loadSettings();
loadTitle();
loadContent();
renderSources();
