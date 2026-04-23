//
// 将现有 Issue 的 JSON 元数据格式转换为 Markdown 正文格式
// 用法: node scripts/convert-issues.js
// 输出: 每个 Issue 的 { number, 新 title, 新 labels, 新 body }
//

const https = require('https');

const OWNER = 'mugen-community';
const REPO = 'MUGEN-OOTQ-Ranking-Wiki';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'node' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('JSON parse error: ' + data.slice(0, 200))); }
      });
    }).on('error', reject);
  });
}

function pick(val, lang) {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') return val[lang] || val.zh || val.en || '';
  return '';
}

function extractJsonMeta(body) {
  const patterns = [
    /```json\s*([\s\S]*?)```/i,
    /```character\s*([\s\S]*?)```/i,
    /<!--\s*meta\s*([\s\S]*?)-->/i
  ];
  for (const p of patterns) {
    const m = (body || '').match(p);
    if (m && m[1]) {
      try { return JSON.parse(m[1].trim()); } catch (e) {}
    }
  }
  const t = (body || '').trim();
  if (t.startsWith('{') && t.endsWith('}')) {
    try { return JSON.parse(t); } catch (e) {}
  }
  return null;
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function convertToMarkdown(meta) {
  const lines = [];

  lines.push('## 基本信息');
  lines.push('');
  lines.push('| 字段 | 内容 |');
  lines.push('|------|------|');

  if (meta.author) lines.push('| **作者** | ' + pick(meta.author) + ' |');
  if (meta.origin) lines.push('| **来源** | ' + pick(meta.origin) + ' |');
  if (meta.activation && meta.activation.length) lines.push('| **启动方式** | ' + meta.activation.join(', ') + ' |');
  if (meta.techniques && meta.techniques.length) lines.push('| **技术** | ' + meta.techniques.join(', ') + ' |');
  if (meta.downloadUrl) lines.push('| **下载链接** | ' + meta.downloadUrl + ' |');

  lines.push('');

  const desc = pick(meta.description);
  if (desc) {
    lines.push('## 角色介绍');
    lines.push('');
    // If description has HTML, convert to plain-ish markdown
    const plain = desc.replace(/<\/?p>/gi, '').replace(/<\/?[a-z][^>]*>/gi, '').trim();
    lines.push(plain);
    lines.push('');
  }

  return lines.join('\n');
}

function extractImages(body) {
  const urls = [];
  const htmlRe = /<img\s[^>]*src=["'](https?:\/\/[^"']+)["']/gi;
  const mdRe = /!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/gi;
  let m;
  while ((m = htmlRe.exec(body || '')) !== null) urls.push(m[1]);
  while ((m = mdRe.exec(body || '')) !== null) urls.push(m[1]);
  return [...new Set(urls)];
}

async function main() {
  const allIssues = [];
  for (let page = 1; page <= 10; page++) {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/issues?state=all&labels=character&per_page=100&page=${page}&sort=updated&direction=desc`;
    const chunk = await fetch(url);
    const filtered = chunk.filter(i => !i.pull_request);
    allIssues.push(...filtered);
    if (chunk.length < 100) break;
  }

  console.log('共找到 ' + allIssues.length + ' 个角色 Issue\n');

  for (const issue of allIssues) {
    const meta = extractJsonMeta(issue.body);
    if (!meta) {
      console.log('---');
      console.log('#' + issue.number + ' (' + issue.title + '): 无 JSON 元数据，跳过');
      console.log('---\n');
      continue;
    }

    const title = pick(meta.title) || issue.title;
    const slug = meta.slug || slugify(title) || ('issue-' + issue.number);

    const labels = ['character'];
    const tier = (meta.ootqTier || '').toLowerCase();
    if (['low', 'mid', 'high', 'top'].includes(tier)) labels.push('tier:' + tier);

    const level = pick(meta.ootqLevel);
    if (level) labels.push('level:' + level);

    if (slug) labels.push('slug:' + slug);

    const tags = (() => {
      if (Array.isArray(meta.tags)) return meta.tags.map(String);
      if (meta.tags && typeof meta.tags === 'object') {
        const lang = 'zh';
        const v = meta.tags[lang] || meta.tags.zh || meta.tags.en || [];
        return Array.isArray(v) ? v.map(String) : [];
      }
      if (typeof meta.tags === 'string') return meta.tags.split(',').map(s => s.trim()).filter(Boolean);
      return [];
    })();
    tags.forEach(t => { if (t && !labels.includes(t)) labels.push(t); });

    const markdown = convertToMarkdown(meta);

    // Also include images from the original body
    const images = extractImages(issue.body);
    const imageSection = images.length
      ? '\n## 参考画像\n\n' + images.map(u => '![](' + u + ')').join('\n')
      : '';

    const newBody = markdown + imageSection;

    console.log('=== #' + issue.number + ': ' + title + ' ===');
    console.log('旧标题: ' + issue.title);
    console.log('新标题: ' + title);
    console.log('Labels: ' + labels.join(', '));
    console.log('--- 新 Body ---');
    console.log(newBody);
    console.log('--- END ---\n');
  }
}

main().catch(console.error);
