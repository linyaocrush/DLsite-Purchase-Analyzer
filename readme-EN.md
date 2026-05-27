<div align="center">

# DLsite Purchase Analyzer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-3.0-green.svg)]()

**Deep analysis of your DLsite purchase history — visual charts, interactive filters, multi-format export**

[日本語](README-JP.md) · **English** · [简体中文](README.md)

</div>

---

## Quick Start

> [!tip]
> Browser requirement: Chrome 89+ / Firefox 86+ / Edge 91+

1. Log in to the [DLsite Purchase History](https://www.dlsite.com/maniax/mypage/userbuy) page
2. Press `F12` to open DevTools → **Console** tab
3. Paste the full contents of `DLsite.js` and press Enter
4. Follow the on-screen prompts

---

## Features

<table>
<tr>
<td width="50%">

### Analysis
- **4 chart types** — Genre distribution, maker ranking, daily trend, cumulative spend (bar/pie toggle)
- **Period comparison** — Pick two time periods and compare genre preferences, maker preferences, spending
- **Real-time filters** — Keyword, maker, date range, price — tables and charts update instantly
- **Currency conversion** — Built-in CNY / USD / JPY defaults, fully customizable

</td>
<td width="50%">

### Interaction
- **Custom modals** — Replace native alert / prompt / confirm with keyboard-navigable dialogs
- **Draggable windows** — Move and resize chart and result windows
- **Trilingual UI** — Switch between Chinese, English, and Japanese — rates remembered per language
- **Progress feedback** — On-page progress bar + console batch updates

</td>
</tr>
</table>

---

## Modes

| Mode | Description | Best For |
|:---:|-------------|----------|
| **Quick** | Totals only, skips fetching work details | Large libraries (100+), just want the total spend |
| **Detailed** | Fetches genre tags from each work's detail page | Full genre/maker analysis with tag-level breakdown |

---

## Export Formats

| Format | Contents |
|--------|----------|
| **Markdown** | Full report: overview table, genre ranking, maker ranking, discontinued works, timeline |
| **CSV** | BOM-prefixed, opens directly in Excel |
| **JSON** | Structured data for further processing |
| **Chart PNG** | Save button built into each chart window |

> One-click download-all option available.

---

## Currency Configuration

The script auto-selects a default exchange rate based on UI language. You can customize the rate at runtime via a modal prompt — each language remembers its own rate independently.

| Language | Currency | Default Rate |
|:--------:|:--------:|:------------:|
| 简体中文 | CNY | 1 JPY = 0.048 CNY |
| English | USD | 1 JPY = 0.0064 USD |
| 日本語 | JPY | No conversion |

---

## Architecture

```
DLsite.js (single-file IIFE, ~2600 lines)
│
├─ utils              Logging · Download · Drag-and-drop · DOM cleanup
├─ cache              localStorage TTL cache (24h)
├─ i18n               Trilingual i18n (zh / en / ja)
├─ appState           Global mutable state
├─ currencyHelper     JPY conversion via stored exchange rates
│
├─ modal              Custom modal system
├─ charts             Chart.js lifecycle management
├─ compareAllAspects  Two-period comparison engine
├─ dataProcessor      Paginated fetch (4 concurrent, 2 retries) + HTML parsing
├─ downloadContent    Markdown / CSV / JSON export
│
├─ ui                 CSS injection · Progress bar · Language switcher · Button management
├─ cleanup            Full teardown (listeners, charts, DOM elements)
├─ main               Entry: page validation → config → fetch → aggregate → render
└─ displayResults     Result window: real-time filtering + collapsible sections
```

### Runtime Dependencies

| Library | Version | Purpose |
|---------|:-------:|---------|
| [Chart.js](https://www.chartjs.org/) | 4.4.0 | Data visualization (loaded dynamically when user enables charts) |

---

## Notes

- Recommended for **desktop** use (mobile has limited functionality)
- The script is **re-runnable**: each execution cleans up prior UI and state automatically
- Failed network requests are retried (up to 2 times); error logs appear at the bottom of the result window
- Only works on `dlsite.com/maniax/mypage/userbuy` — other pages will prompt a redirect

---

<div align="center">

**Project** · [GitHub](https://github.com/linyaocrush/DLsite-Purchase-Analyzer) · Please attach console error screenshots when reporting issues

</div>
