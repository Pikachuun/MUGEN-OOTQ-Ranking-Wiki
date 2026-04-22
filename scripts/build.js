const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const CONTENT = path.join(ROOT, 'content');
const DIST = path.join(ROOT, 'docs');

function rel(p, depth) {
  return depth > 0 ? '../'.repeat(depth) + p : p;
}

function getField(val, lang) {
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val !== null) {
    return val[lang] || val.zh || '';
  }
  return '';
}

function processMeta(meta, lang) {
  const result = {};
  for (const [key, val] of Object.entries(meta)) {
    if (key === 'tags') {
      result.tags = Array.isArray(val)
        ? val.map(t => getField(t, lang))
        : getField(val, lang);
    } else if (key === 'description' || key === 'summary' || key === 'title' || key === 'ootqLevel') {
      result[key] = getField(val, lang);
    } else {
      result[key] = val;
    }
  }
  return result;
}

async function build() {
  await fs.emptyDir(DIST);

  const layoutTemplate = await fs.readFile(path.join(SRC, 'templates', 'layout.ejs'), 'utf8');
  const charTemplate = await fs.readFile(path.join(SRC, 'templates', 'character.ejs'), 'utf8');
  const charListTemplate = await fs.readFile(path.join(SRC, 'templates', 'character-list.ejs'), 'utf8');
  const glossaryTemplate = await fs.readFile(path.join(SRC, 'templates', 'glossary.ejs'), 'utf8');
  const indexTemplate = await fs.readFile(path.join(SRC, 'templates', 'index.ejs'), 'utf8');

  await fs.copy(path.join(SRC, 'styles', 'main.css'), path.join(DIST, 'styles.css'));
  await fs.copy(path.join(SRC, 'scripts', 'i18n.js'), path.join(DIST, 'i18n.js'));

  await fs.ensureDir(path.join(DIST, 'characters'));
  await fs.ensureDir(path.join(DIST, 'glossary'));

  const characters = [];
  const charDirs = await fs.readdir(path.join(CONTENT, 'characters'));
  for (const slug of charDirs) {
    const metaPath = path.join(CONTENT, 'characters', slug, 'meta.json');
    if (await fs.pathExists(metaPath)) {
      const meta = await fs.readJson(metaPath);
      await fs.ensureDir(path.join(DIST, 'characters', slug));
      const assetsDir = path.join(CONTENT, 'characters', slug, 'assets');
      const hasAssets = await fs.pathExists(assetsDir);
      if (hasAssets) {
        await fs.copy(assetsDir, path.join(DIST, 'characters', slug, 'assets'));
      }
      const innerContent = ejs.render(charTemplate, { meta, slug, hasAssets, r: (p) => rel(p, 2), getField });
      const html = ejs.render(layoutTemplate, { title: getField(meta.title, 'zh'), content: innerContent, r: (p) => rel(p, 2), lang: 'zh', metaRaw: JSON.stringify(meta) });
      await fs.writeFile(path.join(DIST, 'characters', slug, 'index.html'), html);
      characters.push({ slug, meta });
    }
  }

  const charListContent = ejs.render(charListTemplate, { characters, r: (p) => rel(p, 1), getField });
  const charListHtml = ejs.render(layoutTemplate, { title: 'Characters', content: charListContent, r: (p) => rel(p, 1), lang: 'zh' });
  await fs.writeFile(path.join(DIST, 'characters', 'index.html'), charListHtml);

  const terms = [];
  const termDirs = await fs.readdir(path.join(CONTENT, 'glossary'));
  for (const slug of termDirs) {
    const metaPath = path.join(CONTENT, 'glossary', slug, 'meta.json');
    if (await fs.pathExists(metaPath)) {
      const meta = await fs.readJson(metaPath);
      await fs.ensureDir(path.join(DIST, 'glossary', slug));
      const innerContent = ejs.render(glossaryTemplate, { meta, slug, r: (p) => rel(p, 2), getField });
      const html = ejs.render(layoutTemplate, { title: getField(meta.title, 'zh'), content: innerContent, r: (p) => rel(p, 2), lang: 'zh', metaRaw: JSON.stringify(meta) });
      await fs.writeFile(path.join(DIST, 'glossary', slug, 'index.html'), html);
      terms.push({ slug, meta });
    }
  }

  const glossaryListContent = `
    <div class="page-header">
      <h1>Glossary</h1>
      <p class="lead">All indexed terms</p>
    </div>
    <div class="card-grid">
      ${terms.map(term => {
        const title = getField(term.meta.title, 'zh');
        const summary = getField(term.meta.summary, 'zh');
        return `
        <a class="card glossary-card" href="${rel('glossary/', 0)}${term.slug}/">
          <h3 class="term-title">${title}</h3>
          ${summary ? `<p class="term-summary">${summary}</p>` : ''}
        </a>
      `}).join('')}
      ${terms.length === 0 ? '<div class="empty-state"><p>No terms yet</p></div>' : ''}
    </div>
  `;
  const glossaryListHtml = ejs.render(layoutTemplate, { title: 'Glossary', content: glossaryListContent, r: (p) => rel(p, 0), lang: 'zh' });
  await fs.writeFile(path.join(DIST, 'glossary', 'index.html'), glossaryListHtml);

  const indexContent = ejs.render(indexTemplate, { characters, terms, r: (p) => rel(p, 0), getField });
  const indexHtml = ejs.render(layoutTemplate, { title: 'MUGEN OOTQ Ranking Wiki', content: indexContent, r: (p) => rel(p, 0), lang: 'zh' });
  await fs.writeFile(path.join(DIST, 'index.html'), indexHtml);

  console.log('Build complete! Output in docs/');
}

build().catch(console.error);
