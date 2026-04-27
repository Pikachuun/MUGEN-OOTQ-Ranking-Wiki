function getStoredTheme() {
  return localStorage.getItem("theme") || "light";
}

function getDefaultLang() {
  return (window.__LANGS && window.__LANGS[0]) || 'zh';
}

function getStoredLang() {
  return localStorage.getItem("lang") || getDefaultLang();
}

function getTranslations() {
  return window.__UI || {};
}

function __(key, lang) {
  const l = lang || getStoredLang();
  const all = getTranslations();
  const t = all[l] || all[getDefaultLang()] || {};
  return t[key] || key;
}
window.__ = __;

function getField(val, lang) {
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val !== null) {
    return val[lang] || val[getDefaultLang()] || '';
  }
  return '';
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.textContent = theme === "dark" ? "☀️" : "🌙";
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
}

function applyLang(lang) {
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  const all = getTranslations();
  const t = all[lang] || all[getDefaultLang()] || {};

  document.querySelectorAll("[data-lang]").forEach(el => {
    try {
      const langData = JSON.parse(el.dataset.lang);
      el.textContent = getField(langData, lang);
    } catch (e) {}
  });

  document.querySelectorAll("[data-i18n]").forEach(el => {
    if (el.tagName === 'INPUT') return;
    const key = el.getAttribute("data-i18n");
    if (!['title', 'summary', 'description', 'ootqLevel'].includes(key) && t[key]) {
      el.textContent = t[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (t[key]) el.placeholder = t[key];
  });

  if (window.__meta) {
    const meta = window.__meta;
    const fields = ['title', 'summary', 'description', 'ootqLevel'];
    for (const field of fields) {
      if (meta[field]) {
        const els = document.querySelectorAll(`[data-i18n="${field}"]`);
        const val = getField(meta[field], lang);
        els.forEach(el => {
          if (field === 'description') {
            el.innerHTML = val;
          } else {
            el.textContent = val;
          }
        });
      }
    }
  }

  const langSelect = document.getElementById("langSelect");
  if (langSelect) langSelect.value = lang;
}

function toggleTheme() {
  const current = getStoredTheme();
  applyTheme(current === "dark" ? "light" : "dark");
}

function init() {
  applyTheme(getStoredTheme());

  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  const langSelect = document.getElementById("langSelect");
  if (langSelect) {
    langSelect.addEventListener("change", e => applyLang(e.target.value));
  }

  applyLang(getStoredLang());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
