# MUGEN OOTQ Ranking Wiki

MUGEN 论外分级制度角色 Wiki，基于 **GitHub Issue CMS**。

## 架构

- 角色数据存储在 GitHub Issues 中，页面运行时通过 GitHub API 拉取
- 角色 Issue 使用 `character` 标签，正文使用多语言 markdown 表格格式，用 `<!-- en -->...<!-- en -->` 包裹器区分语言
- 详情页自动拉取 Issue 评论作为评论区
- 标签和分级从 `tag-system.json` 中定义，前端通过关键词匹配自动检测
- 描述支持 **GitHub Flavored Markdown** 渲染
- 构建脚本将 `tag-system.json` 注入前端模板

## 角色 Issue 数据格式

使用 `<!-- en -->`、`<!-- zh -->`、`<!-- ja -->` 包裹器区分语言：

```markdown
<!-- en -->
## Basic Info

| Field | Value |
|-------|-------|
| **Author** | BlackCurl |
| **Origin** | MUGEN |
| **Activation** | %N Trigger |
| **Techniques** | DTC-Type Fabrication Attack:LIFE Manipulation, NOKO Removal |
| **Tier** | Out-of-Topic Low C |
| **Tags** | Reference |
| **Download** | [Click to Download](https://example.com) |

## Character Introduction

![Chizomeno](https://github.com/user-attachments/assets/xxx)
<!-- en -->
<!-- zh -->
## 基本信息

| 字段 | 值 |
|------|-----|
| **作者** | BlackCurl |
| **来源** | MUGEN |
| **启动方式** | %n启动 |
| **技术** | DTC型亲捏造:LIFE弄、noko解除 |
| **分级** | 论外下位C |
| **标签** | 参考 |
| **下载链接** | [点击下载](https://example.com) |
<!-- zh -->
```

支持的语言代码：`en`、`zh`、`ja` — 修改 `src/i18n/langs.json` 即可扩展。

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| **作者** | 是 | 角色作者 |
| **来源** | 是 | 角色来源作品/引擎 |
| **启动方式** | 否 | 如 `%N Trigger` |
| **技术** | 否 | 角色使用的技术，用逗号分隔 |
| **分级** | 是 | 填写匹配 `tag-system.json` 中 `tier_system` 的关键词 |
| **标签** | 是 | 填写匹配 `tag-system.json` 中条目的关键词，用逗号分隔 |
| **下载链接** | 否 | 角色下载地址 |

### 标签系统

标签和分级在 `src/i18n/tag-system.json` 中定义：

```json
{
  "tier_system": {
    "Lower_Out_C": { "zh": "论外下位C", "en": "Out-of-Topic Low C", "ja": "論外下位C" }
  },
  "trigger_technique": {
    "PercentN_Trigger": { "zh": "%N启动", "en": "%N Trigger", "ja": "%N起動" }
  }
}
```

- 前端自动扫描正文全文，匹配任意语言的标签关键词（大小写不敏感）
- 匹配的标签使用当前语言的翻译文本显示

### 分级检测

- 匹配 `tier_system` 的标签自动设为该角色的分级
- 分级层级文本（如 `Out-of-Topic Low C`）按低/中/高/顶分级类样式显示

### 图片引用

正文中的图片自动提取，支持：
- `![alt](url)`
- HTML `<img>` 标签
- `<!-- image:N -->` 标识符引用

### 增删改查

| 操作 | 方式 |
|------|------|
| 增 | 通过角色投稿模板新建 Issue |
| 查 | 页面自动从 GitHub API 拉取 |
| 改 | 编辑 Issue 正文 |
| 删 | 关闭或删除 Issue |

## 多语言切换

页面右上角提供语言下拉框，动态切换 `src/i18n/langs.json` 中定义的所有语言：
- 标签文本自动切换
- 角色摘要切换
- 详情页正文显示对应语言的内容块
- 语言偏好保存在 `localStorage` 中

## 添加新语言

1. 在 `src/i18n/langs.json` 添加条目（如 `"fr": "Français"`）
2. 在 `src/i18n/ui.json` 添加翻译
3. 在 `src/i18n/tag-system.json` 添加标签关键词
4. 在 Issue 正文中用 `<!-- fr -->...<!-- fr -->` 包裹内容
5. 重新构建 `npm run build`

## 本地构建

```bash
npm install
npm run build
```

输出目录：`docs/`

### 构建产物

- `docs/characters/index.html` — 角色列表页（主页面）
- `docs/index.html` — 首页
- `docs/glossary/index.html` — 术语表页

## 项目结构

```
src/
  i18n/
    langs.json        # 语言代码及显示名
    ui.json           # UI 翻译文本
    tag-system.json   # 标签/分级词汇（多语言）
scripts/
  build.js            # 构建脚本（注入 tag-system.json）
  convert-issues.js   # 旧格式迁移工具
src/
  assets/             # 静态资源
  i18n/               # 多语言数据（langs.json, ui.json, tag-system.json）
  scripts/            # 客户端脚本（i18n.js）
  styles/             # CSS
  templates/          # EJS 模板
    character-list.ejs  # 主页面模板（全部 JS 逻辑）
    layout.ejs          # 布局模板（导航栏）
docs/                 # 构建输出 (GitHub Pages)
.github/
  ISSUE_TEMPLATE/     # Issue 模板
```
