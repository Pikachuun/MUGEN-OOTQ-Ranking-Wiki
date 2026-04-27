# MUGEN OOTQ Ranking Wiki

MUGEN 論外キャラクターランキングWiki。**GitHub Issue CMS** を採用。

## アーキテクチャ

- キャラクターデータは GitHub Issues に保存され、実行時に GitHub API で取得
- Issue は `character` ラベルを使用、本文は `<!-- en -->...<!-- en -->` ラッパー形式の多言語マークダウンテーブル
- 詳細ページは Issue コメントを自動取得してコメントセクションとして表示
- タグと階級は `tag-system.json` で定義、キーワードスキャンで自動検出
- 説明文は **GitHub Flavored Markdown** に対応
- ビルドスクリプトが `tag-system.json` をフロントエンドテンプレートに注入

## キャラクター Issue の書式

`<!-- en -->`、`<!-- zh -->`、`<!-- ja -->` ラッパーで各言語を区切ります：

```markdown
<!-- ja -->
## 基本情報

| フィールド | 値 |
|-----------|-----|
| **作者** | BlackCurl |
| **出典** | MUGEN |
| **起動方式** | %N起動 |
| **技術** | DTC型親捏造:LIFE操作、NOKO解除 |
| **階級** | 論外下位C |
| **タグ** | 参照 |
| **ダウンロード** | [ダウンロード](https://example.com) |

## キャラクター紹介

![Chizomeno](https://github.com/user-attachments/assets/xxx)
<!-- ja -->
```

対応言語コード：`en`、`zh`、`ja` — `src/i18n/langs.json` を編集して拡張可能。

### フィールド説明

| フィールド | 必須 | 説明 |
|-----------|------|------|
| **作者** | 必須 | キャラクター作者 |
| **出典** | 必須 | 出典作品/エンジン |
| **起動方式** | 任意 | 例：`%N Trigger` |
| **技術** | 任意 | 使用技術、カンマ区切り |
| **階級** | 必須 | `tag-system.json` の `tier_system` に一致するキーワード |
| **タグ** | 必須 | `tag-system.json` のエントリに一致するキーワード、カンマ区切り |
| **ダウンロード** | 任意 | ダウンロードURL |

### タグシステム

タグと階級は `src/i18n/tag-system.json` で定義：

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

- フロントエンドが本文全体をスキャンし、任意の言語のキーワードと照合（大文字小文字区別なし）
- 一致したタグは現在の言語の翻訳テキストで表示

### 階級検出

- `tier_system` に一致するタグがそのキャラクターの階級となる
- 階級ラベル（例：`Out-of-Topic Low C`）は low/mid/high/top クラスに応じたスタイルで表示

### 画像参照

画像は本文から自動抽出。対応形式：
- `![alt](url)`
- HTML `<img>` タグ
- `<!-- image:N -->` 参照マーカー

### CRUD

| 操作 | 方法 |
|------|------|
| 作成 | キャラクター投稿テンプレートから新規 Issue |
| 読取 | ページ読み込み時に GitHub API から自動取得 |
| 更新 | Issue 本文を編集 |
| 削除 | Issue をクローズまたは削除 |

## 言語切り替え

右上の言語ドロップダウンで `src/i18n/langs.json` に定義された全言語を動的切り替え：
- タグラベルが現在の言語に
- キャラクター概要が切替
- 詳細ページの本文は該当 `<!-- lang -->` セクションを表示
- 設定は `localStorage` に保存

## 言語の追加方法

1. `src/i18n/langs.json` にエントリ追加（例：`"fr": "Français"`）
2. `src/i18n/ui.json` に翻訳追加
3. `src/i18n/tag-system.json` にタグキーワード追加
4. Issue 本文を `<!-- fr -->...<!-- fr -->` でラップ
5. 再ビルド `npm run build`

## ローカルビルド

```bash
npm install
npm run build
```

出力先：`docs/`

### ビルド成果物

- `docs/characters/index.html` — キャラクター一覧（メインページ）
- `docs/index.html` — ホーム
- `docs/glossary/index.html` — 用語集

## プロジェクト構成

```
src/
  i18n/
    langs.json        # 言語コードと表示名
    ui.json           # UI 翻訳テキスト
    tag-system.json   # タグ/階級語彙（多言語）
scripts/
  build.js            # ビルドスクリプト
  convert-issues.js   # 旧形式移行ツール
src/
  assets/             # 静的アセット
  i18n/               # 多言語データ（langs.json, ui.json, tag-system.json）
  scripts/            # クライアントスクリプト（i18n.js）
  styles/             # CSS
  templates/          # EJS テンプレート
    character-list.ejs  # メインページテンプレート
    layout.ejs          # レイアウトテンプレート
docs/                 # ビルド出力 (GitHub Pages)
.github/
  ISSUE_TEMPLATE/     # Issue テンプレート
```
