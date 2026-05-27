// ==UserScript==
// @name         DLsite 购买分析工具
// @namespace    https://github.com/linyaocrush/DLsite-Purchase-Analyzer
// @version      3.0
// @description  深度分析你的 DLsite 购买记录 — 可视化图表、交互式筛选、多格式导出
// @author       凛遥crush
// @match        *://www.dlsite.com/maniax/mypage/userbuy*
// @match        *://www.dlsite.com/maniax/mypage/userbuy/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @homepage     https://github.com/linyaocrush/DLsite-Purchase-Analyzer
// @supportURL   https://github.com/linyaocrush/DLsite-Purchase-Analyzer/issues
// ==/UserScript==

/*
 * ╔══════════════════════════════════════════════════════════╗
 * ║  DLsite Purchase Analyzer — Tampermonkey Userscript      ║
 * ║  MD3-styled settings panel + script menu integration     ║
 * ║                                                          ║
 * ║  Menu commands:                                          ║
 * ║    📊 打开设置面板 — configure before running             ║
 * ║    ▶️ 运行分析     — run with saved or default settings   ║
 * ╚══════════════════════════════════════════════════════════╝
 */

(function () {
  "use strict";

  // ═══════════════════════════════════════════════════
  //  MD3 Settings Panel Styles
  // ═══════════════════════════════════════════════════
  const MD3_CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600&display=swap');

    :root {
      --md-sys-color-primary: #6750A4;
      --md-sys-color-on-primary: #FFFFFF;
      --md-sys-color-primary-container: #EADDFF;
      --md-sys-color-on-primary-container: #21005D;
      --md-sys-color-secondary: #625B71;
      --md-sys-color-on-secondary: #FFFFFF;
      --md-sys-color-secondary-container: #E8DEF8;
      --md-sys-color-on-secondary-container: #1D192B;
      --md-sys-color-tertiary: #7D5260;
      --md-sys-color-surface: #FFFBFE;
      --md-sys-color-surface-variant: #E7E0EC;
      --md-sys-color-on-surface: #1C1B1F;
      --md-sys-color-on-surface-variant: #49454F;
      --md-sys-color-outline: #79747E;
      --md-sys-color-outline-variant: #CAC4D0;
      --md-sys-color-error: #B3261E;
      --md-sys-color-surface-container-low: #F7F2FA;
      --md-sys-color-surface-container: #F3EDF7;
      --md-sys-color-surface-container-high: #ECE6F0;
      --md-sys-color-inverse-surface: #313033;
      --md-sys-color-inverse-on-surface: #F4EFF4;
      --md-sys-shape-corner-full: 9999px;
      --md-sys-shape-corner-xl: 28px;
      --md-sys-shape-corner-lg: 16px;
      --md-sys-shape-corner-md: 12px;
      --md-sys-shape-corner-sm: 8px;
      --md-sys-typescale-body-large: 500 16px/24px 'Noto Sans SC', sans-serif;
      --md-sys-typescale-body-medium: 400 14px/20px 'Noto Sans SC', sans-serif;
      --md-sys-typescale-label-large: 500 14px/20px 'Noto Sans SC', sans-serif;
      --md-sys-typescale-title-large: 600 22px/28px 'Noto Sans SC', sans-serif;
      --md-sys-typescale-title-medium: 500 16px/24px 'Noto Sans SC', sans-serif;
    }

    /* Overlay */
    .md3-settings-overlay {
      position: fixed; inset: 0;
      background: rgba(0, 0, 0, 0.32);
      backdrop-filter: blur(4px);
      z-index: 999998;
      opacity: 0;
      transition: opacity 0.2s ease;
      display: flex; align-items: center; justify-content: center;
    }
    .md3-settings-overlay.md3-open { opacity: 1; }

    /* Dialog */
    .md3-settings-dialog {
      background: var(--md-sys-color-surface);
      border-radius: var(--md-sys-shape-corner-xl);
      width: 520px; max-width: 92vw;
      max-height: 85vh;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1);
      transform: scale(0.92) translateY(16px);
      opacity: 0;
      transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
      display: flex; flex-direction: column;
      overflow: hidden;
    }
    .md3-settings-overlay.md3-open .md3-settings-dialog {
      transform: scale(1) translateY(0);
      opacity: 1;
    }

    /* Header */
    .md3-settings-header {
      padding: 24px 24px 0 24px;
      display: flex; align-items: center; gap: 16px;
    }
    .md3-settings-header-icon {
      width: 40px; height: 40px;
      border-radius: var(--md-sys-shape-corner-full);
      background: var(--md-sys-color-primary-container);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; flex-shrink: 0;
    }
    .md3-settings-title {
      font: var(--md-sys-typescale-title-large);
      color: var(--md-sys-color-on-surface);
    }
    .md3-settings-subtitle {
      font: var(--md-sys-typescale-body-medium);
      color: var(--md-sys-color-on-surface-variant);
      margin-top: 2px;
    }

    /* Content */
    .md3-settings-content {
      padding: 16px 24px;
      overflow-y: auto;
      flex: 1;
    }

    /* Section */
    .md3-section { margin-bottom: 20px; }
    .md3-section-title {
      font: var(--md-sys-typescale-title-medium);
      color: var(--md-sys-color-primary);
      margin-bottom: 12px;
      padding-left: 4px;
    }

    /* Card */
    .md3-card {
      background: var(--md-sys-color-surface-container-low);
      border-radius: var(--md-sys-shape-corner-lg);
      padding: 16px;
      margin-bottom: 12px;
    }

    /* Setting Row */
    .md3-setting-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 4px;
      min-height: 48px;
    }
    .md3-setting-row + .md3-setting-row {
      border-top: 1px solid var(--md-sys-color-outline-variant);
    }
    .md3-setting-label {
      font: var(--md-sys-typescale-body-large);
      color: var(--md-sys-color-on-surface);
    }
    .md3-setting-desc {
      font: var(--md-sys-typescale-body-medium);
      color: var(--md-sys-color-on-surface-variant);
      margin-top: 2px;
    }

    /* Segmented Button */
    .md3-segmented-group {
      display: flex;
      border: 1px solid var(--md-sys-color-outline);
      border-radius: var(--md-sys-shape-corner-full);
      overflow: hidden;
    }
    .md3-segmented-btn {
      flex: 1;
      padding: 10px 20px;
      font: var(--md-sys-typescale-label-large);
      color: var(--md-sys-color-on-surface);
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
      position: relative;
      text-align: center;
      white-space: nowrap;
    }
    .md3-segmented-btn + .md3-segmented-btn {
      border-left: 1px solid var(--md-sys-color-outline);
    }
    .md3-segmented-btn:hover {
      background: var(--md-sys-color-surface-variant);
    }
    .md3-segmented-btn.md3-selected {
      background: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
    }
    .md3-segmented-btn.md3-selected + .md3-segmented-btn {
      border-left-color: transparent;
    }

    /* Switch */
    .md3-switch-track {
      width: 52px; height: 32px;
      border-radius: var(--md-sys-shape-corner-full);
      background: var(--md-sys-color-surface-variant);
      border: 2px solid var(--md-sys-color-outline);
      position: relative;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    .md3-switch-thumb {
      width: 16px; height: 16px;
      border-radius: var(--md-sys-shape-corner-full);
      background: var(--md-sys-color-outline);
      position: absolute;
      top: 50%; left: 6px;
      transform: translateY(-50%);
      transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
    }
    .md3-switch-track.md3-on {
      background: var(--md-sys-color-primary);
      border-color: var(--md-sys-color-primary);
    }
    .md3-switch-track.md3-on .md3-switch-thumb {
      background: var(--md-sys-color-on-primary);
      left: calc(100% - 22px);
      width: 24px; height: 24px;
    }

    /* Select */
    .md3-select {
      appearance: none; -webkit-appearance: none;
      padding: 10px 36px 10px 16px;
      font: var(--md-sys-typescale-body-large);
      color: var(--md-sys-color-on-surface);
      background: var(--md-sys-color-surface-container-high)
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%2349454F' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")
        no-repeat right 12px center;
      border: 1px solid var(--md-sys-color-outline);
      border-radius: var(--md-sys-shape-corner-sm);
      cursor: pointer; min-width: 140px;
      transition: border-color 0.2s ease;
    }
    .md3-select:focus {
      outline: none;
      border-color: var(--md-sys-color-primary);
      border-width: 2px;
      padding: 9px 35px 9px 15px;
    }

    /* Text Field */
    .md3-text-field { position: relative; }
    .md3-text-field input {
      width: 100%;
      padding: 12px 16px;
      font: var(--md-sys-typescale-body-large);
      color: var(--md-sys-color-on-surface);
      background: var(--md-sys-color-surface-container-high);
      border: none;
      border-bottom: 2px solid var(--md-sys-color-on-surface-variant);
      border-radius: var(--md-sys-shape-corner-sm) var(--md-sys-shape-corner-sm) 0 0;
      outline: none;
      transition: border-color 0.2s ease;
      box-sizing: border-box;
    }
    .md3-text-field input:focus {
      border-bottom-color: var(--md-sys-color-primary);
    }

    /* Actions */
    .md3-settings-actions {
      padding: 16px 24px 24px 24px;
      display: flex; justify-content: flex-end; gap: 12px;
    }
    .md3-btn {
      padding: 10px 24px;
      font: var(--md-sys-typescale-label-large);
      border: none;
      border-radius: var(--md-sys-shape-corner-full);
      cursor: pointer;
      transition: all 0.15s ease;
      position: relative; overflow: hidden;
    }
    .md3-btn-text {
      background: transparent;
      color: var(--md-sys-color-primary);
    }
    .md3-btn-text:hover {
      background: rgba(103, 80, 164, 0.08);
    }
    .md3-btn-filled {
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .md3-btn-filled:hover {
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
      filter: brightness(1.08);
    }

    /* Close button */
    .md3-close-btn {
      width: 40px; height: 40px;
      border-radius: var(--md-sys-shape-corner-full);
      background: transparent; border: none;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: var(--md-sys-color-on-surface-variant);
      font-size: 20px;
      transition: background 0.15s ease;
      margin-left: auto; flex-shrink: 0;
    }
    .md3-close-btn:hover {
      background: var(--md-sys-color-surface-variant);
    }

    /* Info banner */
    .md3-info-banner {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 12px 16px;
      background: var(--md-sys-color-primary-container);
      border-radius: var(--md-sys-shape-corner-md);
      margin-bottom: 16px;
    }
    .md3-info-banner-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
    .md3-info-banner-text {
      font: var(--md-sys-typescale-body-medium);
      color: var(--md-sys-color-on-primary-container);
    }

    /* Scrollbar */
    .md3-settings-content::-webkit-scrollbar { width: 6px; }
    .md3-settings-content::-webkit-scrollbar-track { background: transparent; }
    .md3-settings-content::-webkit-scrollbar-thumb {
      background: var(--md-sys-color-outline-variant);
      border-radius: 3px;
    }
    .md3-settings-content::-webkit-scrollbar-thumb:hover {
      background: var(--md-sys-color-outline);
    }

    /* Responsive */
    @media (max-width: 560px) {
      .md3-settings-dialog { width: 100%; max-height: 100vh; border-radius: 0; }
      .md3-settings-header { padding: 16px 16px 0; }
      .md3-settings-content { padding: 12px 16px; }
      .md3-settings-actions { padding: 12px 16px 20px; }
      .md3-card { padding: 12px; }
    }
  `;

  // ═══════════════════════════════════════════════════
  //  Settings Defaults & Persistence
  // ═══════════════════════════════════════════════════
  const SETTINGS_KEY = "dlsite_analyzer_settings";
  const DEFAULTS = {
    language: "zh",
    mode: "detail",
    workType: "0",
    chartDisplay: true,
    excludeThreshold: 0,
    exchangeRateSource: "api"
  };

  function loadSettings() {
    try {
      const saved = GM_getValue(SETTINGS_KEY, null);
      if (saved && typeof saved === "object") return { ...DEFAULTS, ...saved };
    } catch (e) {}
    return { ...DEFAULTS };
  }

  function saveSettings(s) {
    try { GM_setValue(SETTINGS_KEY, s); } catch (e) {}
  }

  // ═══════════════════════════════════════════════════
  //  Panel i18n
  // ═══════════════════════════════════════════════════
  const PANEL_STRINGS = {
    zh: {
      title: "DLsite 购买分析", subtitle: "配置运行参数",
      general: "通用设置", language: "界面语言",
      mode: "运行模式", modeQuick: "快速", modeDetail: "详细",
      dataFilter: "数据筛选", workType: "作品类型",
      exclude: "排除阈值", excludeDesc: "排除作品数少于此值的分类",
      display: "显示设置", showChart: "显示图表",
      cancel: "取消", run: "开始分析",
      rateSource: "汇率来源", rateApi: "实时 API", rateDefault: "内置默认",
      workTypes: {
        "0":"全部作品","12":"同人：所有","2":"同人：全年龄","1":"同人：男性向",
        "3":"同人：女性向","13":"商业游戏：所有","9":"商业游戏：全年龄",
        "4":"商业游戏：男性向","14":"漫画：所有","10":"漫画：全年龄",
        "7":"漫画：男性向","11":"漫画：女性向"
      }
    },
    en: {
      title: "DLsite Analyzer", subtitle: "Configure run parameters",
      general: "General", language: "Language",
      mode: "Run Mode", modeQuick: "Quick", modeDetail: "Detail",
      dataFilter: "Data Filter", workType: "Work Type",
      exclude: "Exclude Threshold", excludeDesc: "Hide categories with fewer works",
      display: "Display", showChart: "Show Charts",
      cancel: "Cancel", run: "Start Analysis",
      rateSource: "Rate Source", rateApi: "Live API", rateDefault: "Built-in",
      workTypes: {
        "0":"All Works","12":"Doujin: All","2":"Doujin: All Ages","1":"Doujin: Male",
        "3":"Doujin: Female","13":"Commercial: All","9":"Commercial: All Ages",
        "4":"Commercial: Male","14":"Manga: All","10":"Manga: All Ages",
        "7":"Manga: Male","11":"Manga: Female"
      }
    },
    ja: {
      title: "DLsite 購入分析", subtitle: "実行パラメータを設定",
      general: "一般設定", language: "言語",
      mode: "実行モード", modeQuick: "クイック", modeDetail: "詳細",
      dataFilter: "データフィルター", workType: "作品タイプ",
      exclude: "除外しきい値", excludeDesc: "この値未満の分類を非表示",
      display: "表示設定", showChart: "チャート表示",
      cancel: "キャンセル", run: "分析開始",
      rateSource: "レートソース", rateApi: "リアルタイムAPI", rateDefault: "内蔵デフォルト",
      workTypes: {
        "0":"すべての作品","12":"同人：すべて","2":"同人：全年齢","1":"同人：男性向け",
        "3":"同人：女性向け","13":"商業ゲーム：すべて","9":"商業ゲーム：全年齢",
        "4":"商業ゲーム：男性向け","14":"漫画：すべて","10":"漫画：全年齢",
        "7":"漫画：男性向け","11":"漫画：女性向け"
      }
    }
  };

  // ═══════════════════════════════════════════════════
  //  Settings Panel Builder
  // ═══════════════════════════════════════════════════
  function createSettingsPanel() {
    GM_addStyle(MD3_CSS);

    const settings = loadSettings();
    let currentLang = settings.language;
    let currentMode = settings.mode;
    let currentWorkType = settings.workType;
    let showChart = settings.chartDisplay;
    let currentRateSource = settings.exchangeRateSource;

    const t = (key) => PANEL_STRINGS[currentLang]?.[key] ?? PANEL_STRINGS.zh[key];

    // Remove existing
    const existing = document.getElementById("md3-settings-overlay");
    if (existing) existing.remove();

    // Overlay
    const overlay = document.createElement("div");
    overlay.id = "md3-settings-overlay";
    overlay.className = "md3-settings-overlay";

    const dialog = document.createElement("div");
    dialog.className = "md3-settings-dialog";

    // ── Header ──
    const header = document.createElement("div");
    header.className = "md3-settings-header";
    header.innerHTML = `
      <div class="md3-settings-header-icon">📊</div>
      <div>
        <div class="md3-settings-title" data-f="title">${t("title")}</div>
        <div class="md3-settings-subtitle" data-f="subtitle">${t("subtitle")}</div>
      </div>
    `;
    const closeBtn = document.createElement("button");
    closeBtn.className = "md3-close-btn";
    closeBtn.textContent = "✕";
    closeBtn.onclick = () => closePanel();
    header.appendChild(closeBtn);

    // ── Content ──
    const content = document.createElement("div");
    content.className = "md3-settings-content";

    // Banner
    const banner = document.createElement("div");
    banner.className = "md3-info-banner";
    banner.innerHTML = `<span class="md3-info-banner-icon">💡</span><span class="md3-info-banner-text" data-f="banner">${currentLang === "zh" ? "请在 DLsite 购买记录页面使用此脚本" : currentLang === "ja" ? "DLsite 購入記録ページで使用してください" : "Use on the DLsite purchase history page"}</span>`;

    // ── General Section ──
    const generalSection = document.createElement("div");
    generalSection.className = "md3-section";
    generalSection.innerHTML = `<div class="md3-section-title" data-f="general">${t("general")}</div>`;
    const generalCard = document.createElement("div");
    generalCard.className = "md3-card";

    // Language
    const langRow = makeRow("language", t("language"));
    const langGroup = makeSegmented(
      [{v:"zh",t:"中文"},{v:"en",t:"English"},{v:"ja",t:"日本語"}],
      currentLang, (v) => { currentLang = v; refreshLang(); }
    );
    langRow.appendChild(langGroup);
    generalCard.appendChild(langRow);

    // Mode
    const modeRow = makeRow("mode", t("mode"));
    const modeGroup = makeSegmented(
      [{v:"quick",k:"modeQuick"},{v:"detail",k:"modeDetail"}],
      currentMode, (v) => {
        currentMode = v;
        workTypeRow.style.display = v === "detail" ? "flex" : "none";
      }, true
    );
    modeRow.appendChild(modeGroup);
    generalCard.appendChild(modeRow);
    generalSection.appendChild(generalCard);

    // ── Data Filter Section ──
    const filterSection = document.createElement("div");
    filterSection.className = "md3-section";
    filterSection.innerHTML = `<div class="md3-section-title" data-f="dataFilter">${t("dataFilter")}</div>`;
    const filterCard = document.createElement("div");
    filterCard.className = "md3-card";

    // Work type
    const workTypeRow = makeRow("workType", t("workType"));
    workTypeRow.style.display = currentMode === "detail" ? "flex" : "none";
    const wtSelect = document.createElement("select");
    wtSelect.className = "md3-select";
    Object.entries(t("workTypes")).forEach(([k, v]) => {
      const opt = document.createElement("option");
      opt.value = k; opt.textContent = v;
      if (k === currentWorkType) opt.selected = true;
      wtSelect.appendChild(opt);
    });
    wtSelect.onchange = () => { currentWorkType = wtSelect.value; };
    workTypeRow.appendChild(wtSelect);
    filterCard.appendChild(workTypeRow);

    // Exclude threshold
    const exRow = makeRow("exclude", t("exclude"), t("excludeDesc"));
    const exInput = document.createElement("input");
    exInput.type = "number"; exInput.min = "0";
    exInput.value = settings.excludeThreshold;
    exInput.style.cssText = "width:80px;text-align:center;padding:8px 12px;font:var(--md-sys-typescale-body-large);background:var(--md-sys-color-surface-container-high);border:1px solid var(--md-sys-color-outline);border-radius:var(--md-sys-shape-corner-sm);color:var(--md-sys-color-on-surface);";
    exRow.appendChild(exInput);
    filterCard.appendChild(exRow);
    filterSection.appendChild(filterCard);

    // ── Display Section ──
    const displaySection = document.createElement("div");
    displaySection.className = "md3-section";
    displaySection.innerHTML = `<div class="md3-section-title" data-f="display">${t("display")}</div>`;
    const displayCard = document.createElement("div");
    displayCard.className = "md3-card";

    // Chart toggle
    const chartRow = makeRow("showChart", t("showChart"));
    const switchTrack = document.createElement("div");
    switchTrack.className = `md3-switch-track${showChart ? " md3-on" : ""}`;
    switchTrack.innerHTML = `<div class="md3-switch-thumb"></div>`;
    switchTrack.onclick = () => {
      showChart = !showChart;
      switchTrack.classList.toggle("md3-on", showChart);
    };
    chartRow.appendChild(switchTrack);
    displayCard.appendChild(chartRow);

    // Rate source
    const rateRow = makeRow("rateSource", t("rateSource"));
    const rateGroup = makeSegmented(
      [{v:"api",k:"rateApi"},{v:"default",k:"rateDefault"}],
      currentRateSource, (v) => { currentRateSource = v; }, true
    );
    rateRow.appendChild(rateGroup);
    displayCard.appendChild(rateRow);
    displaySection.appendChild(displayCard);

    content.append(banner, generalSection, filterSection, displaySection);

    // ── Actions ──
    const actions = document.createElement("div");
    actions.className = "md3-settings-actions";
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "md3-btn md3-btn-text";
    cancelBtn.textContent = t("cancel");
    cancelBtn.dataset.btn = "cancel";
    cancelBtn.onclick = () => closePanel();
    const runBtn = document.createElement("button");
    runBtn.className = "md3-btn md3-btn-filled";
    runBtn.textContent = t("run");
    runBtn.dataset.btn = "run";
    runBtn.onclick = () => {
      const newSettings = {
        language: currentLang,
        mode: currentMode,
        workType: currentWorkType,
        chartDisplay: showChart,
        excludeThreshold: parseInt(exInput.value) || 0,
        exchangeRateSource: currentRateSource
      };
      saveSettings(newSettings);
      closePanel();
      runAnalyzer(newSettings);
    };
    actions.append(cancelBtn, runBtn);

    dialog.append(header, content, actions);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add("md3-open")));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closePanel(); });
    const escHandler = (e) => { if (e.key === "Escape") { closePanel(); document.removeEventListener("keydown", escHandler); } };
    document.addEventListener("keydown", escHandler);

    function closePanel() {
      overlay.classList.remove("md3-open");
      setTimeout(() => overlay.remove(), 300);
    }

    // ── Helpers ──
    function makeRow(labelKey, labelText, desc) {
      const row = document.createElement("div");
      row.className = "md3-setting-row";
      const lbl = document.createElement("div");
      lbl.innerHTML = `<div class="md3-setting-label" data-f="${labelKey}">${labelText}</div>${desc ? `<div class="md3-setting-desc">${desc}</div>` : ""}`;
      row.appendChild(lbl);
      return row;
    }

    function makeSegmented(items, selected, onChange, useT) {
      const group = document.createElement("div");
      group.className = "md3-segmented-group";
      items.forEach(({ v, t: txt, k }) => {
        const btn = document.createElement("button");
        btn.className = `md3-segmented-btn${selected === v ? " md3-selected" : ""}`;
        btn.textContent = useT ? t(k) : txt;
        if (k) btn.dataset.k = k;
        btn.dataset.v = v;
        btn.onclick = () => {
          group.querySelectorAll(".md3-segmented-btn").forEach(b => b.classList.remove("md3-selected"));
          btn.classList.add("md3-selected");
          onChange(v);
        };
        group.appendChild(btn);
      });
      return group;
    }

    function refreshLang() {
      const s = (k) => PANEL_STRINGS[currentLang]?.[k] ?? PANEL_STRINGS.zh[k];
      document.querySelectorAll("[data-f]").forEach(el => {
        const k = el.dataset.f;
        if (k === "banner") {
          el.textContent = currentLang === "zh" ? "请在 DLsite 购买记录页面使用此脚本" : currentLang === "ja" ? "DLsite 購入記録ページで使用してください" : "Use on the DLsite purchase history page";
        } else if (s(k)) {
          el.textContent = s(k);
        }
      });
      // Update segmented labels that use t()
      document.querySelectorAll("[data-k]").forEach(btn => {
        const k = btn.dataset.k;
        if (k && s(k)) btn.textContent = s(k);
      });
      // Update work type options
      const wt = s("workTypes");
      Array.from(wtSelect.options).forEach(opt => {
        if (wt[opt.value]) opt.textContent = wt[opt.value];
      });
      cancelBtn.textContent = s("cancel");
      runBtn.textContent = s("run");
    }
  }

  // ═══════════════════════════════════════════════════
  //  Run Analyzer
  // ═══════════════════════════════════════════════════
  function runAnalyzer(settings) {
    // Apply language
    try { localStorage.setItem("dlsiteAnalyzerLang", settings.language); } catch (e) {}

    // Store settings for the core script to pick up
    window.__DLsiteAnalyzerSettings = settings;

    // Check page
    if (!/dlsite\.com\/maniax\/mypage\/userbuy/.test(window.location.href)) {
      const go = confirm(
        settings.language === "zh" ? "当前页面不是 DLsite 购买记录页，是否跳转？" :
        settings.language === "ja" ? "現在のページはDLsite購入記録ページではありません。移動しますか？" :
        "Not on DLsite purchase history page. Go there?"
      );
      if (go) window.location.href = "https://www.dlsite.com/maniax/mypage/userbuy/=/type/all/start/all/sort/1/order/1/page/1";
      return;
    }

    // Inject the core script if not already loaded
    if (!document.querySelector('script[data-dlsite-core]')) {
      const script = document.createElement("script");
      script.dataset.dlsiteCore = "true";
      // Use the raw GitHub URL — update this if the repo moves
      script.src = "https://raw.githubusercontent.com/linyaocrush/DLsite-Purchase-Analyzer/main/DLsite.js";
      script.onload = () => console.log("[DLsite Analyzer] Core loaded");
      script.onerror = () => {
        alert(settings.language === "zh"
          ? "无法加载核心脚本，请检查网络连接或手动粘贴 DLsite.js 到控制台。"
          : settings.language === "ja"
          ? "コアスクリプトを読み込めません。ネットワークを確認するか、DLsite.jsを手動で貼り付けてください。"
          : "Failed to load core script. Check network or paste DLsite.js manually.");
      };
      document.head.appendChild(script);
    } else {
      // Already loaded — trigger re-run if the core exposes it
      if (typeof window.__DLsiteRerun === "function") {
        window.__DLsiteRerun();
      } else {
        // Core loaded but no rerun hook — reload page to re-trigger
        window.location.reload();
      }
    }
  }

  // ═══════════════════════════════════════════════════
  //  Tampermonkey Menu Commands
  // ═══════════════════════════════════════════════════
  GM_registerMenuCommand("📊 打开设置面板 / Settings", () => {
    createSettingsPanel();
  }, "s");

  GM_registerMenuCommand("▶️ 运行分析 / Run", () => {
    const settings = loadSettings();
    runAnalyzer(settings);
  }, "r");

  // ═══════════════════════════════════════════════════
  //  First-run: auto-show settings
  // ═══════════════════════════════════════════════════
  try {
    if (!GM_getValue("dlsite_analyzer_seen", false)) {
      GM_setValue("dlsite_analyzer_seen", true);
      setTimeout(() => createSettingsPanel(), 800);
    }
  } catch (e) {}

})();
