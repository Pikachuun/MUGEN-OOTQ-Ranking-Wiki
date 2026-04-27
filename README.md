# MUGEN OOTQ Ranking Wiki

A character ranking wiki for MUGEN Out-of-Topic characters, powered by **GitHub Issue CMS**.

## Architecture

- Character data is stored in GitHub Issues, fetched at runtime via the GitHub API
- Issues use the `character` label; body uses a multilingual markdown format with `<!-- en -->...<!-- en -->` wrappers
- Detail pages load Issue comments as a comment section
- Tags and tiers are defined in `tag-system.json` and auto-detected via keyword scanning
- Descriptions support **GitHub Flavored Markdown**
- The build script injects `tag-system.json` into the frontend template

## Character Issue Format

Wrap each language section with `<!-- en -->`, `<!-- zh -->`, `<!-- ja -->` markers:

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

Supported language codes: `en`, `zh`, `ja` — extendable by editing `src/i18n/langs.json`.

### Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| **Author** | Yes | Character author |
| **Origin** | Yes | Source game/engine |
| **Activation** | No | Trigger method (e.g. `%N Trigger`) |
| **Techniques** | No | Techniques used, comma-separated |
| **Tier** | Yes | Keyword matching a `tier_system` entry in `tag-system.json` |
| **Tags** | Yes | Comma-separated keywords matching entries in `tag-system.json` |
| **Download** | No | Download URL |

### Tag System

Tags and tiers are defined in `src/i18n/tag-system.json`:

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

- The frontend scans the full body for keywords matching any language variant (case-insensitive)
- Matched tags are displayed using the current language's translation from the JSON

### Tier Detection

- Tags matching `tier_system` entries set the character's tier
- The tier label (e.g. `Out-of-Topic Low C`) is displayed with styling based on tier class (low/mid/high/top)

### Image References

Images are extracted from the body automatically. Supported formats:
- `![alt](url)`
- `<img>` HTML tags
- `<!-- image:N -->` reference markers

### CRUD

| Operation | Method |
|-----------|--------|
| Create | New Issue via the character submission template |
| Read | Auto-fetched from GitHub API on page load |
| Update | Edit the Issue body |
| Delete | Close or delete the Issue |

## Language Switching

The top-right language dropdown dynamically switches between all languages defined in `src/i18n/langs.json`. On change:
- Tag labels display the current language
- Character summaries switch to the current language
- Detail page body shows the matching `<!-- lang -->` section
- Preference is saved in `localStorage`

## Adding a New Language

1. Add entry to `src/i18n/langs.json` (e.g. `"fr": "Français"`)
2. Add translations in `src/i18n/ui.json`
3. Add tag keywords in `src/i18n/tag-system.json`
4. Wrap character issue body sections with `<!-- fr -->...<!-- fr -->`
5. Rebuild (`npm run build`)

## Local Build

```bash
npm install
npm run build
```

Output directory: `docs/`

### Build Outputs

- `docs/characters/index.html` — Character list page (main)
- `docs/index.html` — Home page
- `docs/glossary/index.html` — Glossary page

## Project Structure

```
src/
  i18n/
    langs.json        # Language codes and display names
    ui.json           # UI translation strings
    tag-system.json   # Tag/tier vocabulary (multilingual)
scripts/
  build.js            # Build script (injects tag-system.json)
  convert-issues.js   # Legacy format migration tool
src/
  assets/             # Static assets
  i18n/               # i18n data (langs.json, ui.json, tag-system.json)
  scripts/            # Client-side scripts (i18n.js)
  styles/             # CSS
  templates/          # EJS templates
    character-list.ejs  # Main page template (all JS logic)
    layout.ejs          # Layout template (nav bar)
docs/                 # Build output (GitHub Pages)
.github/
  ISSUE_TEMPLATE/     # Issue templates
```
