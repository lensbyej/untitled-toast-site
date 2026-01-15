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

// Toast notification system
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Theme management
function setTheme(themeName) {
  const html = document.documentElement;
  
  // Remove all theme classes
  html.classList.remove("light-theme", "rubber-ducky-theme", "pinetop-theme", "ocean-breeze-theme");
  
  // Apply new theme
  if (themeName === "dark") {
    // Dark is default, no class needed
  } else if (themeName === "light") {
    html.classList.add("light-theme");
  } else if (themeName === "rubber-ducky") {
    html.classList.add("rubber-ducky-theme");
  } else if (themeName === "pinetop") {
    html.classList.add("pinetop-theme");
  } else if (themeName === "ocean-breeze") {
    html.classList.add("ocean-breeze-theme");
  }
  
  // Update dropdown to reflect current theme
  document.getElementById("themeSelect").value = themeName;
  
  localStorage.setItem(THEME_KEY, themeName);
  
  // Show toast notification
  if (themeName !== "dark") {
    showToast("Themes may be distracting. Stay focused!");
  }
}

// Load theme on startup
function loadTheme() {
  const theme = localStorage.getItem(THEME_KEY) || "dark";
  
  // Set theme without showing toast on load
  const html = document.documentElement;
  html.classList.remove("light-theme", "rubber-ducky-theme", "pinetop-theme", "ocean-breeze-theme");
  
  if (theme === "dark") {
    // Dark is default, no class needed
  } else if (theme === "light") {
    html.classList.add("light-theme");
  } else if (theme === "rubber-ducky") {
    html.classList.add("rubber-ducky-theme");
  } else if (theme === "pinetop") {
    html.classList.add("pinetop-theme");
  } else if (theme === "ocean-breeze") {
    html.classList.add("ocean-breeze-theme");
  }
  
  // Update dropdown to reflect current theme
  document.getElementById("themeSelect").value = theme;
}

// Theme dropdown event listener
document.getElementById("themeSelect").addEventListener("change", (e) => {
  setTheme(e.target.value);
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
  
  // Improved reading time calculation
  // Average adult reads 200-250 words per minute
  // Using 225 as average, with minimum 1 minute
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 225));

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

// Image upload
function insertImage() {
  document.getElementById("imageInput").click();
}

document.getElementById("imageInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const uniqueId = "img-" + Date.now();
      const imgHtml = `<div class="image-wrapper" data-img-id="${uniqueId}"><img src="${event.target.result}" style="max-width: 100%; height: auto; display: block;" /><div class="image-controls"><button class="img-btn img-up" onclick="moveImageUp(event)" title="Move up">↑</button><button class="img-btn img-down" onclick="moveImageDown(event)" title="Move down">↓</button><button class="img-btn img-delete" onclick="deleteImage(event)" title="Delete">✕</button></div></div>`;
      document.execCommand("insertHTML", false, imgHtml);
      saveContent();
    };
    reader.readAsDataURL(file);
  }
});

// Table insertion
function insertTable() {
  const rows = prompt("Number of rows:", "2");
  if (rows === null) return;
  
  const cols = prompt("Number of columns:", "3");
  if (cols === null) return;
  
  const rowCount = parseInt(rows) || 2;
  const colCount = parseInt(cols) || 3;
  
  let tableHtml = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0;"><tbody>';
  
  for (let i = 0; i < rowCount; i++) {
    tableHtml += '<tr>';
    for (let j = 0; j < colCount; j++) {
      tableHtml += '<td style="border: 1px solid #ccc; padding: 8px;">Cell</td>';
    }
    tableHtml += '</tr>';
  }
  
  tableHtml += '</tbody></table>';
  document.execCommand("insertHTML", false, tableHtml);
  saveContent();
}

// Image movement functions
function moveImageUp(event) {
  event.preventDefault();
  const imageWrapper = event.target.closest(".image-wrapper");
  const previousElement = imageWrapper.previousElementSibling;
  
  if (previousElement) {
    imageWrapper.parentNode.insertBefore(imageWrapper, previousElement);
    saveContent();
  }
}

function moveImageDown(event) {
  event.preventDefault();
  const imageWrapper = event.target.closest(".image-wrapper");
  const nextElement = imageWrapper.nextElementSibling;
  
  if (nextElement) {
    imageWrapper.parentNode.insertBefore(nextElement, imageWrapper);
    saveContent();
  }
}

function deleteImage(event) {
  event.preventDefault();
  const imageWrapper = event.target.closest(".image-wrapper");
  imageWrapper.remove();
  saveContent();
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
document.getElementById("insertImageBtn").addEventListener("click", insertImage);
document.getElementById("insertTableBtn").addEventListener("click", insertTable);

// Tab switching
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all tabs and content
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));

    // Add active class to clicked tab and its content
    btn.classList.add("active");
    const tabId = btn.getAttribute("data-tab");
    document.getElementById(tabId).classList.add("active");
  });
});

editor.addEventListener("focus", () => {
  if (editor.querySelector(".placeholder")) {
    editor.innerHTML = "";
  }
});

editor.addEventListener("input", () => {
  saveContent();
  updateAutocomplete();
});

// Autocomplete functionality
const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", 
  "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", 
  "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", 
  "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", 
  "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", 
  "time", "no", "just", "him", "know", "take", "people", "into", "year", "your",
  "good", "some", "could", "them", "see", "other", "than", "then", "now", "look",
  "only", "come", "its", "over", "think", "also", "back", "after", "use", "two"
];

let currentWord = "";
let autocompleteVisible = false;

function updateAutocomplete() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(editor);
  preCaretRange.setEnd(range.endContainer, range.endOffset);
  
  const text = preCaretRange.toString();
  const words = text.match(/\b\w+$/);
  
  if (!words || words[0].length < 2) {
    hideAutocomplete();
    return;
  }

  currentWord = words[0].toLowerCase();
  const suggestions = commonWords.filter(w => 
    w.startsWith(currentWord) && w !== currentWord
  );

  if (suggestions.length > 0) {
    showAutocomplete(suggestions, range);
  } else {
    hideAutocomplete();
  }
}

function showAutocomplete(suggestions, range) {
  const popup = document.getElementById("autocomplete");
  popup.innerHTML = "";
  
  suggestions.slice(0, 5).forEach((word) => {
    const div = document.createElement("div");
    div.className = "autocomplete-item";
    
    const prefix = document.createElement("span");
    prefix.className = "autocomplete-match";
    prefix.textContent = currentWord;
    
    const suffix = document.createElement("span");
    suffix.className = "autocomplete-remaining";
    suffix.textContent = word.slice(currentWord.length);
    
    div.appendChild(prefix);
    div.appendChild(suffix);
    
    div.addEventListener("click", () => {
      acceptAutocomplete(word);
    });
    
    popup.appendChild(div);
  });

  // Position popup near cursor
  const rect = range.getBoundingClientRect();
  popup.style.top = (rect.bottom + window.scrollY) + "px";
  popup.style.left = rect.left + "px";
  popup.classList.add("visible");
  autocompleteVisible = true;
}

function hideAutocomplete() {
  const popup = document.getElementById("autocomplete");
  popup.classList.remove("visible");
  autocompleteVisible = false;
}

function acceptAutocomplete(word) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  
  // Delete current word
  const preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(editor);
  preCaretRange.setEnd(range.endContainer, range.endOffset);
  const text = preCaretRange.toString();
  const words = text.match(/\b\w+$/);
  
  if (words) {
    range.setStart(range.endContainer, range.endOffset - words[0].length);
    range.deleteContents();
  }
  
  // Insert completed word
  range.insertNode(document.createTextNode(word));
  range.setStartAfter(range.endContainer.lastChild);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  
  editor.focus();
  hideAutocomplete();
  saveContent();
}

// Keyboard shortcuts for autocomplete
editor.addEventListener("keydown", (e) => {
  if (!autocompleteVisible) return;
  
  if (e.key === "Tab" || e.key === "Enter") {
    e.preventDefault();
    const firstSuggestion = document.querySelector(".autocomplete-item");
    if (firstSuggestion) {
      const text = firstSuggestion.textContent;
      acceptAutocomplete(text);
    }
  } else if (e.key === "Escape") {
    hideAutocomplete();
  }
});

// Initialize
loadTheme();
loadSettings();
loadTitle();
loadContent();
renderSources();