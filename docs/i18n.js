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
    title: "标题",
    viewAll: "查看全部 →",
    tierTop: "论外最上位",
    tierHigh: "论外上位",
    tierMid: "论外中位",
    tierLow: "论外下位",
    leadText: "所有已收录的角色列表"
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
    title: "Title",
    viewAll: "View all →",
    tierTop: "Top",
    tierHigh: "High",
    tierMid: "Mid",
    tierLow: "Low",
    leadText: "All indexed characters"
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
    title: "タイトル",
    viewAll: "すべて表示 →",
    tierTop: "論外最上位",
    tierHigh: "論外上位",
    tierMid: "論外中位",
    tierLow: "論外下位",
    leadText: "すべての登録済みキャラクター"
  }
};

function getStoredTheme() {
  return localStorage.getItem("theme") || "light";
}

function getStoredLang() {
  return localStorage.getItem("lang") || "zh";
}

function getField(val, lang) {
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val !== null) {
    return val[lang] || val.zh || '';
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
  const t = translations[lang] || translations.zh;

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
