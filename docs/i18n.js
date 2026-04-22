const translations = {
  zh: {
    home: "首页",
    characters: "角色",
    glossary: "术语",
    search: "搜索...",
    relatedLinks: "相关链接",
    noContent: "暂无内容",
    tags: "标签",
    ootqLevel: "OOTQ 等级",
    origin: "作品来源",
    activation: "启动方式",
    summary: "摘要",
    description: "详情",
    title: "标题"
  },
  en: {
    home: "Home",
    characters: "Characters",
    glossary: "Glossary",
    search: "Search...",
    relatedLinks: "Related Links",
    noContent: "No content yet",
    tags: "Tags",
    ootqLevel: "OOTQ Level",
    origin: "Origin",
    activation: "Activation",
    summary: "Summary",
    description: "Details",
    title: "Title"
  },
  ja: {
    home: "ホーム",
    characters: "キャラクター",
    glossary: "用語",
    search: "検索...",
    relatedLinks: "関連リンク",
    noContent: "コンテンツなし",
    tags: "タグ",
    ootqLevel: "OOTQ 等級",
    origin: "作品來源",
    activation: "起動方式",
    summary: "要約",
    description: "詳細",
    title: "タイトル"
  }
};

const langNames = { zh: "中文", en: "English", ja: "日本語" };

function getStoredTheme() {
  return localStorage.getItem("theme") || "light";
}

function getStoredLang() {
  return localStorage.getItem("lang") || "zh";
}

window.getField = function(val, lang) {
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val !== null) {
    return val[lang] || val.zh || '';
  }
  return '';
};

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateThemeBtn(theme);
}

function updateThemeBtn(theme) {
  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.textContent = theme === "dark" ? "☀️" : "🌙";
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
}

function applyLang(lang) {
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  const t = translations[lang] || translations.zh;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    if (el.tagName === 'INPUT') return;
    const key = el.getAttribute("data-i18n");

    if (key.startsWith('c:') || key.startsWith('t:')) {
      const [type, idx, field] = key.split(':');
      const meta = type === 'c' ? window.__chars[parseInt(idx)] : window.__terms[parseInt(idx)];
      if (meta && meta[field]) {
        if (field === 'tags') {
          const tagsEl = el;
          const tags = meta.tags.map(tag => getField(tag, lang));
          tagsEl.innerHTML = tags.slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('');
        } else {
          el.textContent = getField(meta[field], lang);
        }
      }
    } else if (!['title', 'summary', 'description', 'ootqLevel'].includes(key)) {
      el.textContent = t[key] || key;
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

    if (meta.tags) {
      const tagsEl = document.querySelector('.infobox-table td .tags');
      if (tagsEl) {
        const tags = meta.tags.map(t => getField(t, lang));
        tagsEl.innerHTML = tags.map(t => `<span class="tag">${t}</span>`).join('');
      }
    }
  }

  updateLangSelect(lang);
}

function updateLangSelect(lang) {
  const select = document.getElementById("langSelect");
  if (select) select.value = lang;
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
