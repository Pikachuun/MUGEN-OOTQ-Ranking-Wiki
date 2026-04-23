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

async function loadGlossary() {
  const terms = [];
  const glossaryRoot = path.join(CONTENT, 'glossary');
  if (!(await fs.pathExists(glossaryRoot))) return terms;

  const termDirs = await fs.readdir(glossaryRoot);
  for (const slug of termDirs) {
    const metaPath = path.join(glossaryRoot, slug, 'meta.json');
    if (await fs.pathExists(metaPath)) {
      const meta = await fs.readJson(metaPath);
      terms.push({ slug, meta });
    }
  }
  return terms;
}

async function build() {
  await fs.ensureDir(DIST);
  await fs.remove(path.join(DIST, 'characters'));
  await fs.remove(path.join(DIST, 'glossary'));
  await fs.remove(path.join(DIST, 'index.html'));
  await fs.remove(path.join(DIST, 'edit.html'));
  await fs.remove(path.join(DIST, 'styles.css'));
  await fs.remove(path.join(DIST, 'i18n.js'));

  const layoutTemplate = await fs.readFile(path.join(SRC, 'templates', 'layout.ejs'), 'utf8');
  const charListTemplate = await fs.readFile(path.join(SRC, 'templates', 'character-list.ejs'), 'utf8');
  const glossaryTemplate = await fs.readFile(path.join(SRC, 'templates', 'glossary.ejs'), 'utf8');
  const indexTemplate = await fs.readFile(path.join(SRC, 'templates', 'index.ejs'), 'utf8');
  const listTemplate = await fs.readFile(path.join(SRC, 'templates', 'list.ejs'), 'utf8');



  await fs.copy(path.join(SRC, 'styles', 'main.css'), path.join(DIST, 'styles.css'));
  await fs.copy(path.join(SRC, 'styles', 'github-markdown.css'), path.join(DIST, 'github-markdown.css'));
  await fs.copy(path.join(SRC, 'assets', 'github.svg'), path.join(DIST, 'github.svg'));
  await fs.copy(path.join(SRC, 'scripts', 'i18n.js'), path.join(DIST, 'i18n.js'));

  await fs.ensureDir(path.join(DIST, 'characters'));
  await fs.ensureDir(path.join(DIST, 'glossary'));

  const tagSystem = await fs.readJson(path.join(ROOT, 'Tag-System.json'));
  const charListContent = ejs.render(charListTemplate, { r: (p) => rel(p, 1), tagSystem });
  const charListHtml = ejs.render(layoutTemplate, {
    title: 'Characters',
    content: charListContent,
    r: (p) => rel(p, 1),
    lang: 'zh'
  });
  await fs.writeFile(path.join(DIST, 'characters', 'index.html'), charListHtml);

  const terms = await loadGlossary();
  for (const { slug, meta } of terms) {
    await fs.ensureDir(path.join(DIST, 'glossary', slug));
    const innerContent = ejs.render(glossaryTemplate, { meta, slug, r: (p) => rel(p, 2), getField });
    const html = ejs.render(layoutTemplate, {
      title: getField(meta.title, 'zh') || 'Glossary',
      content: innerContent,
      r: (p) => rel(p, 2),
      lang: 'zh',
      metaRaw: JSON.stringify(meta)
    });
    await fs.writeFile(path.join(DIST, 'glossary', slug, 'index.html'), html);
  }

  const glossaryListContent = ejs.render(listTemplate, {
    items: terms,
    itemType: 'term',
    pageTitle: 'glossary',
    pageTitleZh: '术语',
    leadKey: 'noContent',
    leadZh: '所有已收录术语',
    r: (p) => rel(p, 1),
    getField
  });
  const glossaryListHtml = ejs.render(layoutTemplate, {
    title: 'Glossary',
    content: glossaryListContent,
    r: (p) => rel(p, 1),
    lang: 'zh'
  });
  await fs.writeFile(path.join(DIST, 'glossary', 'index.html'), glossaryListHtml);

  const indexContent = ejs.render(indexTemplate, { termsCount: terms.length, r: (p) => rel(p, 0) });
  const indexHtml = ejs.render(layoutTemplate, {
    title: 'MUGEN OOTQ Ranking Wiki',
    content: indexContent,
    r: (p) => rel(p, 0),
    lang: 'zh'
  });
  await fs.writeFile(path.join(DIST, 'index.html'), indexHtml);




  console.log('Build complete! Output in docs/');
}

build().catch(console.error);
