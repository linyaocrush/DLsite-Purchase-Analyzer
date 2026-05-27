<div align="center">

# DLsite 購入分析ツール

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-3.0-green.svg)](#バージョン履歴)

**DLsite の購入記録を深度分析 — 可視化チャート、インタラクティブフィルター、多形式エクスポート**

**日本語** · [English](readme-EN.md) · [简体中文](README.md)

</div>

---

## クイックスタート

1. [DLsite 購入記録ページ](https://www.dlsite.com/maniax/mypage/userbuy)にログイン
2. `F12` でデベロッパーを開く → コンソールパネル
3. `DLsite.js` の全コードを貼り付けて Enter
4. モーダルの指示に従って操作するだけ

> ブラウザ要件：Chrome 89+ / Firefox 86+ / Edge 91+

---

## 機能一覧

<table>
<tr>
<td width="50%">

### データ分析
- **4種チャート**：タイプ分布、サークルランキング、日別トレンド、累計支出（棒/円グラフ切替）
- **期間比較**：2つの期間を選んで、タイプ嗜好・サークル嗜好・消費額を比較
- **リアルタイムフィルター**：キーワード・サークル・日付範囲・価格帯で即時絞り込み
- **為替換算**：CNY / USD / JPY のデフォルトレート内蔵、カスタム変更可能

</td>
<td width="50%">

### インタラクション
- **カスタムモーダル**：ネイティブ alert/prompt/confirm を完全置換、キーボードナビ対応
- **ドラッグ＆リサイズ**：チャートと結果ウィンドウの移動・リサイズに対応
- **3言語UI**：中文 / English / 日本語 を即時切替、為替設定は言語ごとに記憶
- **進行状況バー**：ページ上バー + コンソール表示で進捗をリアルタイム確認

</td>
</tr>
</table>

---

## モード説明

| モード | 説明 | 用途 |
|:---:|------|------|
| **クイック** | 金額のみ集計、作品詳細の取得をスキップ | 作品数が多い（100+）、総額だけ知りたい |
| **詳細** | 各作品のタグを取得し、完全な統計を生成 | タイプ分布・サークルランキングなどの深度分析 |

---

## エクスポート形式

| 形式 | 内容 |
|------|------|
| **Markdown** | 完全レポート：概要表、タイプランキング、サークルランキング、販売終了作品、タイムライン |
| **CSV** | BOM 付き、Excel で直接開ける |
| **JSON** | 構造化データ、二次開発に便利 |
| **チャート PNG** | 各チャートウィンドウに保存ボタン内蔵 |

一括ダウンロードにも対応。

---

## 為替設定

UI の言語に応じてデフォルト為替レートを自動選択：

| 言語 | 通貨 | デフォルトレート |
|:----:|:----:|:---------------:|
| 简体中文 | 人民元 (CNY) | 1 JPY = 0.048 CNY |
| English | 米ドル (USD) | 1 JPY = 0.0064 USD |
| 日本語 | 円 (JPY) | 変換なし |

実行時にモーダルでカスタムレートを設定でき、言語ごとに独立して記憶されます。

---

## 技術アーキテクチャ

```
DLsite.js（単一ファイル IIFE、約 2600 行）
├── utils          ユーティリティ：ログ、ダウンロード、ドラッグ、DOM クリーン
├── cache          localStorage TTL キャッシュ（24h）
├── i18n           3言語国際化（zh / en / ja）
├── appState       グローバル可変状態
├── currencyHelper 為替換算
├── modal          カスタムモーダル（alert / prompt / confirm / choice / period-select）
├── charts         Chart.js チャートライフサイクル管理
├── compareAllAspects  期間比較エンジン
├── dataProcessor  ページネーション取得（4並列、2回リトライ）+ HTML 解析
├── downloadContent    Markdown / CSV / JSON エクスポート
├── ui             スタイル注入、進行バー、言語切替、ボタン管理
├── cleanup        完全クリーンアップ（リスナー、チャート、DOM 要素）
├── main           エントリ：ページ検証 → 設定モーダル → 取得 → 集計 → 描画
└── displayResults 結果ウィンドウ：リアルタイムフィルター + 折りたたみセクション
```

### ランタイム依存（CDN）

| ライブラリ | バージョン | 用途 |
|-----------|:----------:|------|
| [Chart.js](https://www.chartjs.org/) | 4.4.0 | データ可視化（チャート表示選択時に動的ロード） |

---

## 注意事項

- **PC での使用を推奨**（モバイルでは機能が制限されます）
- スクリプトは**再実行可能**：実行ごとに前回の UI と状態を自動クリーンアップ
- ネットワークリクエスト失敗時は自動リトライ（最大 2 回）、エラーログは結果ウィンドウ下部に表示
- `dlsite.com/maniax/mypage/userbuy` ページでのみ動作、他のページではジャンプを促します

---

## バージョン履歴

### v3.0 (2025/05/27) — コード品質・パフォーマンスリファクタリング

<details>
<summary><strong>完整な更新内容を展開</strong></summary>

#### パフォーマンス最適化
- `i18n.t()` テンプレート置換：呼び出し毎に N 個の正規表現生成から 1 個に削減、高頻度レンダリング時の GC 負荷を軽減
- Chart.js CDN 読み込みを `charts.loadChartJS()` に統一し、重複インジェクションを排除

#### バグ修正
- **メモリリーク**：`utils.makeDraggable` の `document` レベル mousemove/mouseup リスナーがクリーンアップシステムに正しく登録されるよう修正
- **円グラフ切替不能**：リファクタリング後に棒グラフ/円グラフ切替ボタンが動作しない問題を修正

#### コードリファクタリング
- 汎用 `drawBarPieChart()` メソッドを抽出、`drawGenreChart` / `drawMakerChart` を約 130 行の重複コードから 4 行の委譲呼び出しに削減
- `utils.groupByDay()` ユーティリティを抽出し、`drawTimelineChart`・`drawCumulativeChart`・`generateMarkdown`・`generateCSV`・`renderSections` の 5 箇所の重複する日付グルーピングロジックを排除
- `customAlert` と `customAlertWithExtraInfo` を `customAlert(message, extraInfo?)` に統合
- `dataProcessor` が `ui.errorLogs` に直接依存しなくなり、`fetchAllPages` のパラメータ経由で注入する設計に変更
- `processPage` で同一セレクタの `querySelector` が連続して 2 回呼ばれていた問題を修正
- `downloadContent` モジュール内の `generateJSON` / `addDownloadButton` のインデント不整合を修正
- コード総量を約 100 行削減（2687 → 2584）

</details>

### v2.4 (2025/04/22)
| **v2.3** | 2025/03/18 | 結果ウィンドウにフィルター（キーワード/サークル/日付/価格）+ 比較/ダウンロード/リセット追加 |
| **v2.2** | 2025/03/08 | 期間比較分析機能追加；チャート PNG ダウンロード追加 |
| **v2.1** | 2025/03/07 | フローティング結果ウィンドウ追加、コンソール出力を置換 |
| **v2.0** | 2025/03/03 | 4種チャート；カスタムモーダルでネイティブダイアログ置換；ドラッグ/リサイズ；GSAP アニメーション |
| **v1.2** | 2025/02/24 | CSV エクスポート強化；コンソール表示最適化 |

---

## ライセンス

MIT License

---

<div align="center">

**プロジェクト** · [GitHub](https://github.com/linyaocrush/DLsite-Purchase-Analyzer) · 問題報告はコンソールエラーのスクリーンショットを添付してください

</div>
