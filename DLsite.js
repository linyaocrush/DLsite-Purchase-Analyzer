(function(){
  "use strict";
  
  const utils = {
    styledLog(message, style = "", type = "log") {
      const logFns = { log: console.log, warn: console.warn, error: console.error, info: console.info };
      logFns[type](`%c${message}`, style);
    },
    downloadFile(filename, content, mimeType = "text/plain") {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    makeDraggable(element, handle) {
      let offsetX, offsetY;
      let isDragging = false;
      handle.addEventListener("mousedown", (e) => {
        e.preventDefault();
        isDragging = true;
        offsetX = e.pageX - element.offsetLeft;
        offsetY = e.pageY - element.offsetTop;
        handle.style.cursor = "grabbing";
      });
      document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        let newX = e.pageX - offsetX;
        let newY = e.pageY - offsetY;
        newX = Math.max(0, Math.min(document.documentElement.clientWidth - element.offsetWidth, newX));
        newY = Math.max(0, Math.min(document.documentElement.clientHeight - element.offsetHeight, newY));
        element.style.left = newX + "px";
        element.style.top = newY + "px";
      });
      document.addEventListener("mouseup", () => {
        isDragging = false;
        handle.style.cursor = "grab";
      });
    },
    fadeIn(element) {
      if (typeof gsap !== "undefined") {
        gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
      } else {
        element.style.opacity = 0;
        element.style.transition = "opacity 0.1s ease-in-out";
        setTimeout(() => { element.style.opacity = 1; }, 10);
      }
    },
    fadeOut(element, callback) {
      if (typeof gsap !== "undefined") {
        gsap.to(element, { opacity: 0, duration: 0.5, ease: "power2.in", onComplete: callback });
      } else {
        element.style.opacity = 0;
        setTimeout(callback, 200);
      }
    },
    animateModalIn(element) {
      if (typeof gsap !== "undefined") {
        gsap.fromTo(element, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
      } else {
        element.style.transform = "scale(0.8)";
        element.style.opacity = "0";
        element.style.transition = "transform 0.1s ease-out, opacity 0.1s ease-out";
        setTimeout(() => {
          element.style.transform = "scale(1)";
          element.style.opacity = "1";
        }, 10);
      }
    },
    animateModalOut(element, callback) {
      if (typeof gsap !== "undefined") {
        gsap.to(element, { scale: 0.8, opacity: 0, duration: 0.5, ease: "back.in(1.7)", onComplete: callback });
      } else {
        element.style.transform = "scale(1)";
        element.style.opacity = "1";
        element.style.transition = "transform 0.1s ease-in, opacity 0.1s ease-in";
        setTimeout(() => {
          element.style.transform = "scale(0.8)";
          element.style.opacity = "0";
          setTimeout(callback, 200);
        }, 10);
      }
    }
  };

  const i18n = {
    languages: {
      zh: {
        name: "简体中文",
        currencyLabel: "人民币",
        currencyShort: "CNY",
        defaultRate: 0.048,
        strings: {
          ok: "确定",
          cancel: "取消",
          yes: "是",
          no: "否",
          save: "保存",
          hide: "隐藏",
          reset: "重置",
          download: "下载结果",
          compare: "数据对比分析",
          applyFilters: "应用过滤",
          redrawCharts: "根据当前过滤器重绘图表",
          keywordPlaceholder: "作品名关键词",
          minPrice: "最低价格",
          maxPrice: "最高价格",
          allMakers: "全部制作组",
          selectTypePrompt: "请选择作品类型：",
          quickViewPrompt: "是否开启快速查看消费金额？（仅统计金额）",
          modifyRatePrompt: "是否需要修改汇率？",
          modifyRateOption: "修改汇率",
          useDefaultRateOption: "使用默认 (1日元 = 0.048人民币)",
          enterRatePrompt: "请输入 1 日元兑换人民币的汇率（例如 0.05）：",
          invalidRate: "输入无效，使用默认汇率",
          usingDefaultRate: "使用默认汇率 {rate}",
          excludePrompt: "请输入要排除的最少作品数目（例如输入 3 表示排除数目小于 3 的作品类型）：",
          excludeInvalid: "无效的输入，使用默认值 0（不过滤）",
          excludeEmpty: "未输入数值，使用默认值 0（不过滤）",
          showChartPrompt: "是否显示图表数据展示？",
          show: "显示",
          hideOption: "不显示",
          notDlsite: "当前页面未检测到 DLsite 购买记录，是否跳转到正确的购买历史页面？",
          switchToDlsite: "请切换到 DLsite 购买历史页面后再运行此脚本。",
          jumpConfirmYes: "跳转",
          jumpConfirmNo: "取消",
          pageTitleLog: "✦ DLsite购买历史统计 ✦",
          periodTitle: "选择时间段及对比方面",
          period1: "时间段 1:",
          period2: "时间段 2:",
          startDate: "开始日期:",
          endDate: "结束日期:",
          aspectTitle: "请选择对比的方面：",
          aspectPrefType: "不同类型作品偏好对比",
          aspectPrefMaker: "不同制作组偏好对比",
          aspectMakerOverall: "不同制作组对比",
          aspectMakerType: "制作组作品类型对比",
          period1Invalid: "时间段1的开始日期不能晚于结束日期。",
          period2Invalid: "时间段2的开始日期不能晚于结束日期。",
          analysisExists: "该分析已存在。",
          downloadFormatPrompt: "请选择要下载的文件格式：",
          downloadMd: "Markdown (.md)",
          downloadCsv: "CSV (.csv)",
          downloadJson: "JSON (.json)",
          downloadAll: "全部下载",
          chartGenreTitle: "作品类型统计",
          chartMakerTitle: "制作组统计",
          chartTimelineTitle: "每日购买数量",
          chartCumulativeTitle: "累计消费金额",
          chartSwitchPie: "切换为饼状图",
          chartSwitchBar: "切换为柱状图",
          workCount: "作品数目",
          workTypeLabel: "类型",
          workMakerLabel: "制作组",
          workNameLabel: "作品名称",
          purchaseDate: "购买日期",
          priceYen: "价格: {amount} 日元",
          worksCount: "作品数: {count}",
          dateLabel: "日期: {date}",
          purchaseCount: "购买数量: {count}",
          purchaseCountLabel: "购买数量",
          totalDay: "当天总价：{amount} 日元",
          comparisonLabel: "标签：{label}\n{dataset}: {value}",
          makerOverallSummary: "时间段 1：\n  作品数：{count1}\n  总价：{price1} 日元 ({converted1} {currency})\n\n时间段 2：\n  作品数：{count2}\n  总价：{price2} 日元 ({converted2} {currency})",
          makerTypeTitle: "制作组作品类型对比（前 5 制作组）\n\n",
          timelineItem: "  {genre}: 时间段1 {v1} / 时间段2 {v2}\n",
          preparation: "准备中...",
          batchProgress: "批次 {current} / {total} ({percent}%)",
          overview: "统计概览",
          genreRanking: "各类型作品数排名",
          makerRanking: "各制作组作品数排名",
          eolTitle: "已下架作品",
          timeline: "时间轴视图",
          authorInfo: "作者信息",
          authorCredit: "★ 本脚本由 凛遥crush 修改制作 ★",
          projectLabel: "★ 项目地址：",
          purchaseTotal: "购买总数",
          totalSpent: "总消费金额",
          statItem: "统计项目",
          valueLabel: "数值",
          jumpText: "跳转",
          noGenreData: "暂无符合条件的类型数据",
          noMakerData: "暂无符合条件的制作组数据",
          noEol: "暂无已下架作品",
          noData: "暂无数据",
          filterTitle: "查询结果",
          exportAll: "全部下载",
          minWorksCount: "作品数目",
          currencyConverted: "{yen} 日元 ({converted} {currency})",
          yenOnly: "{yen} 日元",
          downloadTitle: "下载结果",
          compareTitle: "数据对比分析",
          resetTitle: "重置",
          errorLogTitle: "错误日志",
          retryPage: "第 {attempt} 次重试页面 {page}",
          firstPageFail: "无法获取第一页数据，终止任务。",
          fetchDetailLog: "获取作品详情: {url}",
          progressGroup: "页面抓取进度",
          makerOptionUnknown: "未知",
          showCharts: "显示",
          hideCharts: "不显示",
          selectLanguage: "语言/Language/言語",
          languageChanged: "语言已切换为 {lang}，界面正在更新...",
          rateLabel: "汇率",
          currencyEditLabel: "编辑汇率",
          ratePromptUsd: "请输入 1 日元兑换美元的汇率（例如 0.0064）：",
          modifyRateNotice: "使用默认汇率 {rate}",
          dragHandleLabel: "拖动以移动窗口",
          typeAllWorks: "全部作品",
          doujinAll: "同人：所有",
          doujinAllAges: "同人：全年龄",
          doujinMale: "同人：男性向",
          doujinFemale: "同人：女性向",
          commercialAll: "商业游戏：所有",
          commercialAllAges: "商业游戏：全年龄",
          commercialMale: "商业游戏：男性向",
          mangaAll: "漫画：所有",
          mangaAllAges: "漫画：全年龄",
          mangaMale: "漫画：男性向",
          mangaFemale: "漫画：女性向"
        }
      },
      en: {
        name: "English",
        currencyLabel: "USD",
        currencyShort: "USD",
        defaultRate: 0.0064,
        strings: {
          ok: "OK",
          cancel: "Cancel",
          yes: "Yes",
          no: "No",
          save: "Save",
          hide: "Hide",
          reset: "Reset",
          download: "Download results",
          compare: "Compare data",
          applyFilters: "Apply filters",
          redrawCharts: "Redraw charts with filters",
          keywordPlaceholder: "Title keyword",
          minPrice: "Min price",
          maxPrice: "Max price",
          allMakers: "All makers",
          selectTypePrompt: "Choose a work type:",
          quickViewPrompt: "Enable quick spend preview? (only totals)",
          modifyRatePrompt: "Do you want to edit the rate?",
          modifyRateOption: "Edit rate",
          useDefaultRateOption: "Use default (1 JPY = 0.0064 USD)",
          enterRatePrompt: "Enter the USD per JPY rate (e.g. 0.0064):",
          invalidRate: "Invalid input, using default rate",
          usingDefaultRate: "Using default rate {rate}",
          excludePrompt: "Enter minimum works to keep (e.g. 3 removes items under 3):",
          excludeInvalid: "Invalid input, using default 0 (no filter)",
          excludeEmpty: "No input, using default 0 (no filter)",
          showChartPrompt: "Show chart visualizations?",
          show: "Show",
          hideOption: "Do not show",
          notDlsite: "No DLsite purchase history detected. Go to the correct page?",
          switchToDlsite: "Please open the DLsite purchase history page before running this script.",
          jumpConfirmYes: "Go",
          jumpConfirmNo: "Stay",
          pageTitleLog: "✦ DLsite Purchase Analyzer ✦",
          periodTitle: "Select periods and aspects",
          period1: "Period 1:",
          period2: "Period 2:",
          startDate: "Start date:",
          endDate: "End date:",
          aspectTitle: "Pick comparison aspects:",
          aspectPrefType: "Type preference",
          aspectPrefMaker: "Maker preference",
          aspectMakerOverall: "Maker overall",
          aspectMakerType: "Maker vs. type",
          period1Invalid: "Start date of period 1 cannot be after the end date.",
          period2Invalid: "Start date of period 2 cannot be after the end date.",
          analysisExists: "This analysis already exists.",
          downloadFormatPrompt: "Choose a download format:",
          downloadMd: "Markdown (.md)",
          downloadCsv: "CSV (.csv)",
          downloadJson: "JSON (.json)",
          downloadAll: "Download all",
          chartGenreTitle: "Works by type",
          chartMakerTitle: "Works by maker",
          chartTimelineTitle: "Purchases per day",
          chartCumulativeTitle: "Cumulative spend",
          chartSwitchPie: "Switch to pie",
          chartSwitchBar: "Switch to bar",
          workCount: "Works",
          workTypeLabel: "Type",
          workMakerLabel: "Maker",
          workNameLabel: "Title",
          purchaseDate: "Purchase date",
          priceYen: "Price: {amount} JPY",
          worksCount: "Count: {count}",
          dateLabel: "Date: {date}",
          purchaseCount: "Purchases: {count}",
          purchaseCountLabel: "Purchases",
          totalDay: "Daily total: {amount} JPY",
          comparisonLabel: "Label: {label}\n{dataset}: {value}",
          makerOverallSummary: "Period 1:\n  Works: {count1}\n  Total: {price1} JPY ({converted1} {currency})\n\nPeriod 2:\n  Works: {count2}\n  Total: {price2} JPY ({converted2} {currency})",
          makerTypeTitle: "Top 5 makers by type\n\n",
          timelineItem: "  {genre}: Period1 {v1} / Period2 {v2}\n",
          preparation: "Preparing...",
          batchProgress: "Batch {current} / {total} ({percent}%)",
          overview: "Overview",
          genreRanking: "Type ranking",
          makerRanking: "Maker ranking",
          eolTitle: "Unavailable works",
          timeline: "Timeline",
          authorInfo: "Credits",
          authorCredit: "★ Script modified by 凛遥crush ★",
          projectLabel: "★ Project: ",
          purchaseTotal: "Total purchases",
          totalSpent: "Total spend",
          statItem: "Item",
          valueLabel: "Value",
          jumpText: "Open",
          noGenreData: "No matching type data",
          noMakerData: "No matching maker data",
          noEol: "No unavailable works",
          noData: "No data",
          filterTitle: "Results",
          exportAll: "Download all",
          minWorksCount: "Works",
          currencyConverted: "{yen} JPY ({converted} {currency})",
          yenOnly: "{yen} JPY",
          downloadTitle: "Download results",
          compareTitle: "Compare data",
          resetTitle: "Reset",
          errorLogTitle: "Errors",
          retryPage: "Retry {attempt} for page {page}",
          firstPageFail: "Failed to fetch the first page, stopping.",
          fetchDetailLog: "Fetching work detail: {url}",
          progressGroup: "Page fetch progress",
          makerOptionUnknown: "Unknown",
          showCharts: "Show",
          hideCharts: "Hide",
          selectLanguage: "语言/Language/言語",
          languageChanged: "Language switched to {lang}. Updating UI...",
          rateLabel: "Exchange rate",
          currencyEditLabel: "Edit rate",
          ratePromptUsd: "Enter the USD per JPY rate (e.g. 0.0064):",
          modifyRateNotice: "Using default rate {rate}",
          dragHandleLabel: "Drag to move window",
          typeAllWorks: "All works",
          doujinAll: "Doujin: all",
          doujinAllAges: "Doujin: all ages",
          doujinMale: "Doujin: male oriented",
          doujinFemale: "Doujin: female oriented",
          commercialAll: "Commercial games: all",
          commercialAllAges: "Commercial games: all ages",
          commercialMale: "Commercial games: male oriented",
          mangaAll: "Manga: all",
          mangaAllAges: "Manga: all ages",
          mangaMale: "Manga: male oriented",
          mangaFemale: "Manga: female oriented"
        }
      },
      ja: {
        name: "日本語",
        currencyLabel: "円",
        currencyShort: "JPY",
        defaultRate: 1,
        strings: {
          ok: "OK",
          cancel: "キャンセル",
          yes: "はい",
          no: "いいえ",
          save: "保存",
          hide: "非表示",
          reset: "リセット",
          download: "結果をダウンロード",
          compare: "データ比較",
          applyFilters: "フィルター適用",
          redrawCharts: "フィルターでグラフ再描画",
          keywordPlaceholder: "作品名キーワード",
          minPrice: "最低価格",
          maxPrice: "最高価格",
          allMakers: "すべてのサークル",
          selectTypePrompt: "作品タイプを選択してください：",
          quickViewPrompt: "金額のみのクイック確認を有効にしますか？",
          modifyRatePrompt: "為替レートを変更しますか？",
          modifyRateOption: "レートを変更",
          useDefaultRateOption: "デフォルトを使用 (変換なし)",
          enterRatePrompt: "円からの変換は行いません。",
          invalidRate: "入力が無効です。デフォルトを使用します。",
          usingDefaultRate: "デフォルトレート {rate} を使用",
          excludePrompt: "最低作品数を入力してください（例: 3 なら 3 未満を除外）：",
          excludeInvalid: "無効な入力です。0（フィルターなし）を使用します。",
          excludeEmpty: "未入力です。0（フィルターなし）を使用します。",
          showChartPrompt: "グラフを表示しますか？",
          show: "表示",
          hideOption: "表示しない",
          notDlsite: "DLsite の購入履歴が見つかりません。正しいページに移動しますか？",
          switchToDlsite: "購入履歴ページを開いてから実行してください。",
          jumpConfirmYes: "移動",
          jumpConfirmNo: "とどまる",
          pageTitleLog: "✦ DLsite購入履歴分析 ✦",
          periodTitle: "期間と比較内容の選択",
          period1: "期間1:",
          period2: "期間2:",
          startDate: "開始日:",
          endDate: "終了日:",
          aspectTitle: "比較内容を選択してください：",
          aspectPrefType: "タイプ別嗜好",
          aspectPrefMaker: "サークル別嗜好",
          aspectMakerOverall: "サークル比較",
          aspectMakerType: "サークルとタイプ比較",
          period1Invalid: "期間1の開始日は終了日より後にできません。",
          period2Invalid: "期间2の開始日は終了日より後にできません。",
          analysisExists: "この分析は既に存在します。",
          downloadFormatPrompt: "ダウンロード形式を選んでください：",
          downloadMd: "Markdown (.md)",
          downloadCsv: "CSV (.csv)",
          downloadJson: "JSON (.json)",
          downloadAll: "すべてダウンロード",
          chartGenreTitle: "タイプ別統計",
          chartMakerTitle: "サークル統計",
          chartTimelineTitle: "日別購入数",
          chartCumulativeTitle: "累計支出",
          chartSwitchPie: "円グラフに切替",
          chartSwitchBar: "棒グラフに切替",
          workCount: "作品数",
          workTypeLabel: "タイプ",
          workMakerLabel: "サークル",
          workNameLabel: "作品名",
          purchaseDate: "購入日",
          priceYen: "価格: {amount} 円",
          worksCount: "作品数: {count}",
          dateLabel: "日付: {date}",
          purchaseCount: "購入数: {count}",
          purchaseCountLabel: "購入数",
          totalDay: "当日の合計: {amount} 円",
          comparisonLabel: "ラベル: {label}\n{dataset}: {value}",
          makerOverallSummary: "期間1:\n  作品数: {count1}\n  合計: {price1} 円\n\n期間2:\n  作品数: {count2}\n  合計: {price2} 円",
          makerTypeTitle: "上位5サークルのタイプ比較\n\n",
          timelineItem: "  {genre}: 期間1 {v1} / 期間2 {v2}\n",
          preparation: "準備中...",
          batchProgress: "バッチ {current} / {total} ({percent}%)",
          overview: "概要",
          genreRanking: "タイプ別ランキング",
          makerRanking: "サークル別ランキング",
          eolTitle: "販売終了作品",
          timeline: "タイムライン",
          authorInfo: "作者情報",
          authorCredit: "★ 本スクリプトは 凛遥crush が改修 ★",
          projectLabel: "★ プロジェクト：",
          purchaseTotal: "購入総数",
          totalSpent: "総支出",
          statItem: "項目",
          valueLabel: "値",
          jumpText: "開く",
          noGenreData: "該当するタイプデータがありません",
          noMakerData: "該当するサークルデータがありません",
          noEol: "販売終了作品なし",
          noData: "データなし",
          filterTitle: "結果",
          exportAll: "すべてダウンロード",
          minWorksCount: "作品数",
          currencyConverted: "{yen} 円",
          yenOnly: "{yen} 円",
          downloadTitle: "結果をダウンロード",
          compareTitle: "データ比較",
          resetTitle: "リセット",
          errorLogTitle: "エラーログ",
          retryPage: "{page} ページを {attempt} 回目再試行", 
          firstPageFail: "最初のページを取得できません。処理を終了します。",
          fetchDetailLog: "作品詳細を取得: {url}",
          progressGroup: "ページ取得の進行状況",
          makerOptionUnknown: "不明",
          showCharts: "表示",
          hideCharts: "表示しない",
          selectLanguage: "语言/Language/言語",
          languageChanged: "言語を {lang} に変更しました。更新中...",
          rateLabel: "為替レート",
          currencyEditLabel: "レートを編集",
          ratePromptUsd: "円はそのまま表示されます。",
          modifyRateNotice: "デフォルトレート {rate} を使用",
          dragHandleLabel: "ドラッグして移動",
          typeAllWorks: "すべての作品",
          doujinAll: "同人：すべて",
          doujinAllAges: "同人：全年齢",
          doujinMale: "同人：男性向け",
          doujinFemale: "同人：女性向け",
          commercialAll: "商業ゲーム：すべて",
          commercialAllAges: "商業ゲーム：全年齢",
          commercialMale: "商業ゲーム：男性向け",
          mangaAll: "漫画：すべて",
          mangaAllAges: "漫画：全年齢",
          mangaMale: "漫画：男性向け",
          mangaFemale: "漫画：女性向け"
        }
      }
    },
    current: null,
    init() {
      const stored = localStorage.getItem("dlsiteAnalyzerLang");
      if (stored && this.languages[stored]) {
        this.current = stored;
      } else {
        const nav = (navigator.language || "zh").toLowerCase();
        if (nav.startsWith("ja")) this.current = "ja";
        else if (nav.startsWith("en")) this.current = "en";
        else this.current = "zh";
        localStorage.setItem("dlsiteAnalyzerLang", this.current);
      }
    },
    setLanguage(lang) {
      if (!this.languages[lang]) return;
      this.current = lang;
      localStorage.setItem("dlsiteAnalyzerLang", lang);
    },
    t(key, vars = {}) {
      const langPack = this.languages[this.current] || this.languages.zh;
      let template = langPack.strings[key] || key;
      Object.entries(vars).forEach(([k, v]) => {
        template = template.replace(new RegExp(`{${k}}`, "g"), v);
      });
      return template;
    },
    getCurrencyConfig() {
      const langPack = this.languages[this.current] || this.languages.zh;
      return {
        label: langPack.currencyLabel,
        short: langPack.currencyShort,
        rate: langPack.defaultRate
      };
    }
  };

  i18n.init();

  const appState = {
    result: null,
    filteredGenreCount: null,
    filteredMakerCount: null,
    exchangeRate: null,
    excludeThreshold: 0,
    showCharts: false,
    detailMode: true,
    currencyLang: i18n.current,
    customRates: {}
  };

  const currencyHelper = {
    format(amountJPY, exchangeRate) {
      const config = i18n.getCurrencyConfig();
      const rate = typeof exchangeRate === "number" ? exchangeRate : config.rate;
      if (!rate || rate === 1 || i18n.current === "ja") {
        return i18n.t("yenOnly", { yen: amountJPY });
      }
      const converted = (amountJPY * rate).toFixed(2);
      return i18n.t("currencyConverted", { yen: amountJPY, converted, currency: config.label });
    }
  };

  const modal = {
    createModal(maxWidth = "500px") {
      const overlay = document.createElement("div");
      overlay.className = "modal-overlay";
      overlay.setAttribute("role", "presentation");
      overlay.tabIndex = -1;
      utils.fadeIn(overlay);
      const modalContainer = document.createElement("div");
      modalContainer.className = "modal-container";
      modalContainer.style.maxWidth = maxWidth;
      modalContainer.setAttribute("role", "dialog");
      modalContainer.setAttribute("aria-modal", "true");
      modalContainer.tabIndex = -1;
      overlay.appendChild(modalContainer);
      document.body.appendChild(overlay);
      utils.animateModalIn(modalContainer);
      return { overlay, modalContainer };
    },
    closeModal(overlay, modalContainer, callback) {
      utils.animateModalOut(modalContainer, () => {
        utils.fadeOut(overlay, () => {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
          if (callback) callback();
        });
      });
    },
    setupAccessibility(overlay, modalContainer, onClose) {
      const focusSelectors = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";
      const getFocusable = () => Array.from(overlay.querySelectorAll(focusSelectors)).filter(el => !el.disabled && el.offsetParent !== null);
      const handleKeydown = (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        } else if (e.key === "Tab") {
          const focusables = getFocusable();
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first || !overlay.contains(document.activeElement)) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last || !overlay.contains(document.activeElement)) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };
      overlay.addEventListener("keydown", handleKeydown);
      setTimeout(() => {
        const focusables = getFocusable();
        if (focusables.length > 0) {
          focusables[0].focus();
        } else {
          modalContainer.focus();
        }
      }, 0);
    },
    customAlert(message) {
      return new Promise(resolve => {
        const { overlay, modalContainer } = modal.createModal("600px");
        const msgDiv = document.createElement("pre");
        msgDiv.style.textAlign = "left";
        msgDiv.style.maxHeight = "400px";
        msgDiv.style.overflowY = "auto";
        msgDiv.textContent = message;
        modalContainer.appendChild(msgDiv);
        const btn = document.createElement("button");
        btn.textContent = i18n.t("ok");
        btn.className = "btn";
        btn.setAttribute("aria-label", i18n.t("ok"));
        btn.addEventListener("click", () => {
          modal.closeModal(overlay, modalContainer, resolve);
        });
        modal.setupAccessibility(overlay, modalContainer, () => modal.closeModal(overlay, modalContainer, resolve));
        modalContainer.appendChild(btn);
      });
    },
    customAlertWithExtraInfo(message, extraInfo) {
      return new Promise(resolve => {
        const { overlay, modalContainer } = modal.createModal("600px");
        const msgDiv = document.createElement("pre");
        msgDiv.style.textAlign = "left";
        msgDiv.style.maxHeight = "400px";
        msgDiv.style.overflowY = "auto";
        msgDiv.textContent = message;
        modalContainer.appendChild(msgDiv);
        if (extraInfo) {
          const extra = document.createElement("div");
          extra.textContent = extraInfo;
          extra.style.marginTop = "10px";
          extra.setAttribute("aria-label", extraInfo);
          modalContainer.appendChild(extra);
        }
        const btn = document.createElement("button");
        btn.textContent = i18n.t("ok");
        btn.className = "btn";
        btn.setAttribute("aria-label", i18n.t("ok"));
        btn.addEventListener("click", () => {
          modal.closeModal(overlay, modalContainer, resolve);
        });
        modal.setupAccessibility(overlay, modalContainer, () => modal.closeModal(overlay, modalContainer, resolve));
        modalContainer.appendChild(btn);
      });
    },
    customPrompt(message, defaultValue = "") {
      return new Promise(resolve => {
        const { overlay, modalContainer } = modal.createModal("400px");
        const msgDiv = document.createElement("div");
        msgDiv.textContent = message;
        modalContainer.appendChild(msgDiv);
        const input = document.createElement("input");
        input.type = "text";
        input.value = defaultValue;
        input.style.width = "80%";
        input.style.marginTop = "15px";
        input.style.padding = "5px";
        input.setAttribute("aria-label", message);
        modalContainer.appendChild(input);
        const btnContainer = document.createElement("div");
        btnContainer.style.marginTop = "15px";
        const okBtn = document.createElement("button");
        okBtn.textContent = i18n.t("ok");
        okBtn.className = "btn";
        okBtn.setAttribute("aria-label", i18n.t("ok"));
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = i18n.t("cancel");
        cancelBtn.className = "btn";
        cancelBtn.setAttribute("aria-label", i18n.t("cancel"));
        okBtn.addEventListener("click", () => {
          modal.closeModal(overlay, modalContainer, () => { resolve(input.value); });
        });
        cancelBtn.addEventListener("click", () => {
          modal.closeModal(overlay, modalContainer, () => { resolve(null); });
        });
        btnContainer.appendChild(okBtn);
        btnContainer.appendChild(cancelBtn);
        modalContainer.appendChild(btnContainer);
        modal.setupAccessibility(overlay, modalContainer, () => modal.closeModal(overlay, modalContainer, () => resolve(null)));
      });
    },
    customConfirm(message) {
      return new Promise(resolve => {
        const { overlay, modalContainer } = modal.createModal("400px");
        const msgDiv = document.createElement("div");
        msgDiv.textContent = message;
        modalContainer.appendChild(msgDiv);
        const btnContainer = document.createElement("div");
        btnContainer.style.marginTop = "15px";
        const okBtn = document.createElement("button");
        okBtn.textContent = i18n.t("ok");
        okBtn.className = "btn";
        okBtn.setAttribute("aria-label", i18n.t("ok"));
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = i18n.t("cancel");
        cancelBtn.className = "btn";
        cancelBtn.setAttribute("aria-label", i18n.t("cancel"));
        okBtn.addEventListener("click", () => {
          modal.closeModal(overlay, modalContainer, () => { resolve(true); });
        });
        cancelBtn.addEventListener("click", () => {
          modal.closeModal(overlay, modalContainer, () => { resolve(false); });
        });
        btnContainer.appendChild(okBtn);
        btnContainer.appendChild(cancelBtn);
        modalContainer.appendChild(btnContainer);
        modal.setupAccessibility(overlay, modalContainer, () => modal.closeModal(overlay, modalContainer, () => resolve(false)));
      });
    },
    customChoice(message, options) {
      return new Promise(resolve => {
        const { overlay, modalContainer } = modal.createModal("500px");
        const msgDiv = document.createElement("div");
        msgDiv.textContent = message;
        modalContainer.appendChild(msgDiv);
        const btnContainer = document.createDocumentFragment();
        options.forEach(opt => {
          const btn = document.createElement("button");
          btn.textContent = opt.label;
          btn.className = "btn";
          btn.setAttribute("aria-label", opt.label);
          btn.addEventListener("click", () => { modal.closeModal(overlay, modalContainer, () => { resolve(opt.value); }); });
          btnContainer.appendChild(btn);
        });
        modalContainer.appendChild(btnContainer);
        modal.setupAccessibility(overlay, modalContainer, () => modal.closeModal(overlay, modalContainer, () => resolve(null)));
      });
    },
    customSelectPeriods(availableDates) {
      return new Promise(resolve => {
        const { overlay, modalContainer } = modal.createModal("500px");
        const title = document.createElement("h2");
        title.textContent = i18n.t("periodTitle");
        modalContainer.appendChild(title);
        const period1Container = document.createElement("div");
        period1Container.style.margin = "10px 0";
        const period1Label = document.createElement("div");
        period1Label.textContent = i18n.t("period1");
        period1Container.appendChild(period1Label);
        const period1StartSelect = document.createElement("select");
        availableDates.forEach(date => {
          const option = document.createElement("option");
          option.value = date;
          option.textContent = date;
          period1StartSelect.appendChild(option);
        });
        period1Container.appendChild(document.createTextNode(i18n.t("startDate") + " "));
        period1Container.appendChild(period1StartSelect);
        const period1EndSelect = document.createElement("select");
        availableDates.forEach(date => {
          const option = document.createElement("option");
          option.value = date;
          option.textContent = date;
          period1EndSelect.appendChild(option);
        });
        period1Container.appendChild(document.createTextNode(" " + i18n.t("endDate") + " "));
        period1Container.appendChild(period1EndSelect);
        modalContainer.appendChild(period1Container);
        const period2Container = document.createElement("div");
        period2Container.style.margin = "10px 0";
        const period2Label = document.createElement("div");
        period2Label.textContent = i18n.t("period2");
        period2Container.appendChild(period2Label);
        const period2StartSelect = document.createElement("select");
        availableDates.forEach(date => {
          const option = document.createElement("option");
          option.value = date;
          option.textContent = date;
          period2StartSelect.appendChild(option);
        });
        period2Container.appendChild(document.createTextNode(i18n.t("startDate") + " "));
        period2Container.appendChild(period2StartSelect);
        const period2EndSelect = document.createElement("select");
        availableDates.forEach(date => {
          const option = document.createElement("option");
          option.value = date;
          option.textContent = date;
          period2EndSelect.appendChild(option);
        });
        period2Container.appendChild(document.createTextNode(" " + i18n.t("endDate") + " "));
        period2Container.appendChild(period2EndSelect);
        modalContainer.appendChild(period2Container);
        const aspectsContainer = document.createElement("div");
        aspectsContainer.style.margin = "10px 0";
        const aspectsTitle = document.createElement("div");
        aspectsTitle.textContent = i18n.t("aspectTitle");
        aspectsContainer.appendChild(aspectsTitle);
        const aspects = [
          { label: i18n.t("aspectPrefType"), value: "prefType" },
          { label: i18n.t("aspectPrefMaker"), value: "prefMaker" },
          { label: i18n.t("aspectMakerOverall"), value: "makerOverall" },
          { label: i18n.t("aspectMakerType"), value: "makerType" }
        ];
        const checkboxes = {};
        aspects.forEach(item => {
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.value = item.value;
          checkbox.id = "chk_" + item.value;
          checkboxes[item.value] = checkbox;
          const label = document.createElement("label");
          label.htmlFor = checkbox.id;
          label.textContent = item.label;
          label.setAttribute("aria-label", item.label);
          aspectsContainer.appendChild(checkbox);
          aspectsContainer.appendChild(label);
          aspectsContainer.appendChild(document.createElement("br"));
        });
        modalContainer.appendChild(aspectsContainer);
        const btnContainer = document.createElement("div");
        btnContainer.style.marginTop = "15px";
        const okBtn = document.createElement("button");
        okBtn.textContent = i18n.t("ok");
        okBtn.className = "btn";
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = i18n.t("cancel");
        cancelBtn.className = "btn";
        btnContainer.appendChild(okBtn);
        btnContainer.appendChild(cancelBtn);
        modalContainer.appendChild(btnContainer);
        okBtn.addEventListener("click", () => {
          const p1Start = period1StartSelect.value;
          const p1End = period1EndSelect.value;
          const p2Start = period2StartSelect.value;
          const p2End = period2EndSelect.value;
          if(new Date(p1Start) > new Date(p1End)){
            modal.customAlert(i18n.t("period1Invalid"));
            return;
          }
          if(new Date(p2Start) > new Date(p2End)){
            modal.customAlert(i18n.t("period2Invalid"));
            return;
          }
          const selectedAspects = {
            prefType: checkboxes["prefType"].checked,
            prefMaker: checkboxes["prefMaker"].checked,
            makerOverall: checkboxes["makerOverall"].checked,
            makerType: checkboxes["makerType"].checked
          };
          modal.closeModal(overlay, modalContainer, () => {
            resolve({
              period1: { start: new Date(p1Start), end: new Date(p1End) },
              period2: { start: new Date(p2Start), end: new Date(p2End) },
              aspects: selectedAspects
            });
          });
        });
        cancelBtn.addEventListener("click", () => {
          modal.closeModal(overlay, modalContainer, () => { resolve(null); });
        });
        modal.setupAccessibility(overlay, modalContainer, () => modal.closeModal(overlay, modalContainer, () => resolve(null)));
      });
    }
  };

  const charts = {
    createChartContainer(id, top, left, width = "500px", height = "400px", title = id) {
      let container = document.getElementById(id);
      if (!container) {
        container = document.createElement("div");
        container.id = id;
        container.dataset.title = title;
        container.className = "chart-container";
        container.style.top = top;
        container.style.left = left;
        container.style.width = width;
        container.style.height = height;
        container.style.minWidth = "300px";
        container.style.minHeight = "250px";
        container.style.resize = "both";
        container.style.overflow = "hidden";
        container.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
        container.style.border = "1px solid #ccc";
        container.style.zIndex = ui.currentZIndex++;
        document.body.appendChild(container);
        const dragButton = document.createElement("div");
        dragButton.className = "drag-button";
        dragButton.textContent = "≡";
        dragButton.setAttribute("role", "button");
        dragButton.setAttribute("aria-label", i18n.t("dragHandleLabel"));
        container.appendChild(dragButton);
        const saveButton = document.createElement("button");
        saveButton.textContent = i18n.t("save");
        saveButton.className = "btn";
        saveButton.style.position = "absolute";
        saveButton.style.top = "5px";
        saveButton.style.right = "5px";
        saveButton.style.zIndex = "101";
        saveButton.setAttribute("aria-label", i18n.t("save"));
        saveButton.addEventListener("click", () => {
          const canvas = container.querySelector("canvas");
          if(canvas){
            const url = canvas.toDataURL("image/png");
            utils.downloadFile(container.dataset.title + ".png", url);
          }
        });
        container.appendChild(saveButton);
        const hideButton = document.createElement("button");
        hideButton.textContent = i18n.t("hide");
        hideButton.className = "btn";
        hideButton.style.position = "absolute";
        hideButton.style.top = "5px";
        hideButton.style.right = "60px";
        hideButton.style.zIndex = "101";
        hideButton.setAttribute("aria-label", i18n.t("hide"));
        hideButton.addEventListener("click", () => {
          container.style.display = "none";
          let hiddenContainer = document.getElementById("hiddenChartsContainer");
          if (!hiddenContainer) {
            hiddenContainer = document.createElement("div");
            hiddenContainer.id = "hiddenChartsContainer";
            hiddenContainer.style.position = "fixed";
            hiddenContainer.style.right = "10px";
            hiddenContainer.style.top = "10px";
            hiddenContainer.style.zIndex = "110000";
            document.body.appendChild(hiddenContainer);
          }
          const restoreButton = document.createElement("button");
          restoreButton.textContent = container.dataset.title || container.id;
          restoreButton.className = "btn";
          restoreButton.style.display = "block";
          restoreButton.style.marginBottom = "5px";
          restoreButton.setAttribute("aria-label", container.dataset.title || container.id);
          restoreButton.addEventListener("click", () => {
            container.style.display = "block";
            hiddenContainer.removeChild(restoreButton);
          });
          hiddenContainer.appendChild(restoreButton);
        });
        container.appendChild(hideButton);
        container.addEventListener("mousedown", () => {
          container.style.zIndex = ui.currentZIndex++;
        });
        const contentDiv = document.createElement("div");
        contentDiv.className = "chart-content";
        container.appendChild(contentDiv);
        utils.makeDraggable(container, dragButton);
        return container;
      }
      return container;
    },
    drawGenreChart(filteredGenreCount, works, currentType) {
      currentType = currentType || "bar";
      const container = charts.createChartContainer("chartContainer1", "100px", "100px", "500px", "400px", i18n.t("chartGenreTitle"));
      const contentDiv = container.querySelector(".chart-content");
      while (contentDiv.firstChild) contentDiv.removeChild(contentDiv.firstChild);
      const header = document.createElement("h3");
      header.style.textAlign = "center";
      header.style.margin = "0";
      header.textContent = i18n.t("chartGenreTitle") + " ";
      const toggleBtn = document.createElement("button");
      toggleBtn.id = "toggleGenreChartBtn";
      toggleBtn.className = "btn";
      toggleBtn.style.marginLeft = "10px";
      toggleBtn.style.fontSize = "12px";
      toggleBtn.textContent = currentType === 'bar' ? i18n.t("chartSwitchPie") : i18n.t("chartSwitchBar");
      toggleBtn.setAttribute("aria-label", toggleBtn.textContent);
      header.appendChild(toggleBtn);
      contentDiv.appendChild(header);
      const canvas = document.createElement("canvas");
      canvas.style.width = "100%";
      canvas.style.height = "calc(100% - 30px)";
      contentDiv.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      if (window.genreChartObj) { window.genreChartObj.destroy(); }
      let backgroundColors, borderColors, options;
      if (currentType === 'pie') {
        backgroundColors = filteredGenreCount.map((_, i) => `hsl(${(i * 360 / filteredGenreCount.length)}, 70%, 70%)`);
        borderColors = filteredGenreCount.map((_, i) => `hsl(${(i * 360 / filteredGenreCount.length)}, 70%, 50%)`);
        options = {};
      } else {
        backgroundColors = "rgba(75, 192, 192, 0.6)";
        borderColors = "rgba(75, 192, 192, 1)";
        options = { scales: { y: { beginAtZero: true } } };
      }
      options.onClick = (evt, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          const genre = filteredGenreCount[index][0];
          const worksWithGenre = works.filter(work => work.genre === genre || (work.mainGenre && work.mainGenre.includes(genre)));
          let content = `${i18n.t("workTypeLabel")}: ${genre}\n${i18n.t("worksCount", { count: worksWithGenre.length })}\n\n`;
          worksWithGenre.forEach(work => {
            content += `${i18n.t("workNameLabel")}: ${work.name}\n${i18n.t("workMakerLabel")}: ${work.makerName}\n${i18n.t("purchaseDate")}: ${work.date}\n${i18n.t("priceYen", { amount: work.price })}\n\n`;
          });
          modal.customAlert(content);
        }
      };
      window.genreChartObj = new Chart(ctx, {
        type: currentType,
        data: {
          labels: filteredGenreCount.map(item => item[0]),
          datasets: [{
            label: i18n.t("workCount"),
            data: filteredGenreCount.map(item => item[1].count),
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          }]
        },
        options: options
      });
      setTimeout(() => {
        const btn = document.getElementById("toggleGenreChartBtn");
        if (btn) {
          btn.addEventListener("click", () => {
            const newType = currentType === 'bar' ? 'pie' : 'bar';
            charts.drawGenreChart(filteredGenreCount, works, newType);
          });
        }
      }, 0);
    },
    drawMakerChart(filteredMakerCount, works, currentType) {
      currentType = currentType || "bar";
      const container = charts.createChartContainer("chartContainer2", "100px", "650px", "500px", "400px", i18n.t("chartMakerTitle"));
      const contentDiv = container.querySelector(".chart-content");
      while (contentDiv.firstChild) contentDiv.removeChild(contentDiv.firstChild);
      const header = document.createElement("h3");
      header.style.textAlign = "center";
      header.style.margin = "0";
      header.textContent = i18n.t("chartMakerTitle") + " ";
      const toggleBtn = document.createElement("button");
      toggleBtn.id = "toggleMakerChartBtn";
      toggleBtn.className = "btn";
      toggleBtn.style.marginLeft = "10px";
      toggleBtn.style.fontSize = "12px";
      toggleBtn.textContent = currentType === 'bar' ? i18n.t("chartSwitchPie") : i18n.t("chartSwitchBar");
      toggleBtn.setAttribute("aria-label", toggleBtn.textContent);
      header.appendChild(toggleBtn);
      contentDiv.appendChild(header);
      const canvas = document.createElement("canvas");
      canvas.style.width = "100%";
      canvas.style.height = "calc(100% - 30px)";
      contentDiv.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      if (window.makerChartObj) { window.makerChartObj.destroy(); }
      let backgroundColors, borderColors, options;
      if (currentType === 'pie') {
        backgroundColors = filteredMakerCount.map((_, i) => `hsl(${(i * 360 / filteredMakerCount.length)}, 70%, 70%)`);
        borderColors = filteredMakerCount.map((_, i) => `hsl(${(i * 360 / filteredMakerCount.length)}, 70%, 50%)`);
        options = {};
      } else {
        backgroundColors = "rgba(153, 102, 255, 0.6)";
        borderColors = "rgba(153, 102, 255, 1)";
        options = { scales: { y: { beginAtZero: true } } };
      }
      options.onClick = (evt, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          const maker = filteredMakerCount[index][0];
          const worksByMaker = works.filter(work => work.makerName === maker);
          let content = `${i18n.t("workMakerLabel")}: ${maker}\n${i18n.t("worksCount", { count: worksByMaker.length })}\n\n`;
          worksByMaker.forEach(work => {
            content += `${i18n.t("workNameLabel")}: ${work.name}\n${i18n.t("purchaseDate")}: ${work.date}\n${i18n.t("priceYen", { amount: work.price })}\n\n`;
          });
          modal.customAlert(content);
        }
      };
      window.makerChartObj = new Chart(ctx, {
        type: currentType,
        data: {
          labels: filteredMakerCount.map(item => item[0]),
          datasets: [{
            label: i18n.t("workCount"),
            data: filteredMakerCount.map(item => item[1].count),
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          }]
        },
        options: options
      });
      setTimeout(() => {
        const btn = document.getElementById("toggleMakerChartBtn");
        if (btn) {
          btn.addEventListener("click", () => {
            const newType = currentType === 'bar' ? 'pie' : 'bar';
            charts.drawMakerChart(filteredMakerCount, works, newType);
          });
        }
      }, 0);
    },
    drawTimelineChart(works) {
      const groups = {};
      works.forEach(work => {
        let day = new Date(work.date).toISOString().slice(0,10);
        groups[day] = (groups[day] || 0) + 1;
      });
      const sortedDates = Object.keys(groups).sort();
      const counts = sortedDates.map(date => groups[date]);
      const container = charts.createChartContainer("chartContainer3", "550px", "100px", "500px", "400px", i18n.t("chartTimelineTitle"));
      const contentDiv = container.querySelector(".chart-content");
      while (contentDiv.firstChild) contentDiv.removeChild(contentDiv.firstChild);
      const header = document.createElement("h3");
      header.style.textAlign = "center";
      header.style.margin = "0";
      header.textContent = i18n.t("chartTimelineTitle");
      contentDiv.appendChild(header);
      const canvas = document.createElement("canvas");
      canvas.style.width = "100%";
      canvas.style.height = "calc(100% - 30px)";
      contentDiv.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      if (window.timelineChartObj) { window.timelineChartObj.destroy(); }
      const options = {
        scales: {
          x: { title: { display: true, text: i18n.t("purchaseDate") } },
          y: { beginAtZero: true, title: { display: true, text: i18n.t("purchaseCountLabel") } }
        },
        onClick: (evt, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const date = sortedDates[index];
            const worksOnDate = works.filter(work => new Date(work.date).toISOString().slice(0,10) === date);
            let content = `${i18n.t("dateLabel", { date })}\n${i18n.t("purchaseCount", { count: worksOnDate.length })}\n\n`;
            worksOnDate.forEach(work => {
              content += `${i18n.t("workNameLabel")}: ${work.name}\n${i18n.t("workMakerLabel")}: ${work.makerName}\n${i18n.t("priceYen", { amount: work.price })}\n\n`;
            });
            modal.customAlert(content);
          }
        }
      };
      window.timelineChartObj = new Chart(ctx, {
        type: 'line',
        data: {
          labels: sortedDates,
          datasets: [{
            label: i18n.t("chartTimelineTitle"),
            data: counts,
            fill: false,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            tension: 0.1
          }]
        },
        options: options
      });
    },
    drawCumulativeChart(works) {
      const groups = {};
      works.forEach(work => {
        let day = new Date(work.date).toISOString().slice(0,10);
        groups[day] = (groups[day] || 0) + work.price;
      });
      const sortedDates = Object.keys(groups).sort();
      let cumulative = [];
      let total = 0;
      sortedDates.forEach(date => { total += groups[date]; cumulative.push(total); });
      const container = charts.createChartContainer("chartContainer4", "550px", "650px", "500px", "400px", i18n.t("chartCumulativeTitle"));
      const contentDiv = container.querySelector(".chart-content");
      while (contentDiv.firstChild) contentDiv.removeChild(contentDiv.firstChild);
      const header = document.createElement("h3");
      header.style.textAlign = "center";
      header.style.margin = "0";
      header.textContent = i18n.t("chartCumulativeTitle") + " (JPY)";
      contentDiv.appendChild(header);
      const canvas = document.createElement("canvas");
      canvas.style.width = "100%";
      canvas.style.height = "calc(100% - 30px)";
      contentDiv.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      if (window.cumulativeChartObj) { window.cumulativeChartObj.destroy(); }
      const options = {
        scales: {
          x: { title: { display: true, text: i18n.t("purchaseDate") } },
          y: { beginAtZero: true, title: { display: true, text: i18n.t("chartCumulativeTitle") } }
        },
        onClick: (evt, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const date = sortedDates[index];
            const worksOnDate = works.filter(work => new Date(work.date).toISOString().slice(0,10) === date);
            let content = `${i18n.t("dateLabel", { date })}\n${i18n.t("purchaseCount", { count: worksOnDate.length })}\n\n`;
            worksOnDate.forEach(work => {
              content += `${i18n.t("workNameLabel")}: ${work.name}\n${i18n.t("workMakerLabel")}: ${work.makerName}\n${i18n.t("priceYen", { amount: work.price })}\n\n`;
            });
            const dayTotal = worksOnDate.reduce((sum, work) => sum + work.price, 0);
            modal.customAlertWithExtraInfo(content, i18n.t("totalDay", { amount: dayTotal }));
          }
        }
      };
      window.cumulativeChartObj = new Chart(ctx, {
        type: 'line',
        data: {
          labels: sortedDates,
          datasets: [{
            label: i18n.t("chartCumulativeTitle"),
            data: cumulative,
            fill: true,
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
            tension: 0.1
          }]
        },
        options: options
      });
    },
    drawCombinedBarChart(title, labels, data1, data2, datasetLabel1, datasetLabel2, yAxisLabel, uniqueKey) {
      if(ui.existingComparisonCharts[uniqueKey]) {
        modal.customAlert(i18n.t("analysisExists"));
        return;
      }
      ui.existingComparisonCharts[uniqueKey] = true;
      let containerId = "comparisonChart_" + (ui.comparisonCounter++);
      let top = (150 + ui.comparisonCounter * 20) + "px";
      let left = (150 + ui.comparisonCounter * 20) + "px";
      const container = charts.createChartContainer(containerId, top, left, "600px", "400px", title);
      const contentDiv = container.querySelector(".chart-content");
      while (contentDiv.firstChild) contentDiv.removeChild(contentDiv.firstChild);
      const header = document.createElement("h3");
      header.style.textAlign = "center";
      header.style.margin = "0";
      header.textContent = title;
      contentDiv.appendChild(header);
      const canvas = document.createElement("canvas");
      canvas.style.width = "100%";
      canvas.style.height = "calc(100% - 30px)";
      contentDiv.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: datasetLabel1,
            data: data1,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1
          },{
            label: datasetLabel2,
            data: data2,
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: { beginAtZero: true, title: { display: true, text: yAxisLabel } }
          },
          onClick: (evt, elements) => {
            if (elements.length > 0) {
              const element = elements[0];
              const datasetIndex = element.datasetIndex;
              const index = element.index;
              const clickedLabel = labels[index];
              const clickedValue = datasetIndex === 0 ? data1[index] : data2[index];
              const datasetName = datasetIndex === 0 ? datasetLabel1 : datasetLabel2;
              modal.customAlert(i18n.t("comparisonLabel", { label: clickedLabel, dataset: datasetName, value: clickedValue }));
            }
          }
        }
      });
    }
  };

  const compareAllAspects = (result, periods, exchangeRate, aspects) => {
    const filterByPeriod = (works, period) => {
      return works.filter(work => {
        const d = new Date(work.date);
        return d >= period.start && d <= period.end;
      });
    };

    const period1Works = filterByPeriod(result.works, periods.period1);
    const period2Works = filterByPeriod(result.works, periods.period2);

    const countByKey = (works, keyGetter) => {
      const map = new Map();
      works.forEach(work => {
        const key = keyGetter(work);
        if (!key) return;
        map.set(key, (map.get(key) || 0) + 1);
      });
      return map;
    };

    const collectGenres = work => {
      const genres = [];
      if (Array.isArray(work.mainGenre) && work.mainGenre.length > 0) {
        genres.push(...work.mainGenre);
      }
      if (work.genre) genres.push(work.genre);
      return genres;
    };

    const countGenres = works => {
      const map = new Map();
      works.forEach(work => {
        const genres = collectGenres(work);
        if (genres.length === 0) return;
        genres.forEach(g => {
          map.set(g, (map.get(g) || 0) + 1);
        });
      });
      return map;
    };

    const topEntries = (map, limit = 10) => {
      return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
    };

    if (aspects.prefType) {
      const genres1 = countGenres(period1Works);
      const genres2 = countGenres(period2Works);
      const allGenres = new Set([...genres1.keys(), ...genres2.keys()]);
      const labels = [...allGenres];
      const data1 = labels.map(label => genres1.get(label) || 0);
      const data2 = labels.map(label => genres2.get(label) || 0);
      charts.drawCombinedBarChart(
        i18n.t("aspectPrefType"),
        labels,
        data1,
        data2,
        `${i18n.t("period1")} ${i18n.t("workCount")}`,
        `${i18n.t("period2")} ${i18n.t("workCount")}`,
        i18n.t("workCount"),
        `prefType_${Date.now()}`
      );
    }

    if (aspects.prefMaker || aspects.makerOverall) {
      const makers1 = countByKey(period1Works, work => work.makerName || i18n.t("makerOptionUnknown"));
      const makers2 = countByKey(period2Works, work => work.makerName || i18n.t("makerOptionUnknown"));
      const allMakers = [...new Set([...makers1.keys(), ...makers2.keys()])];
      const combinedSorted = allMakers
        .map(maker => ({ maker, total: (makers1.get(maker) || 0) + (makers2.get(maker) || 0) }))
        .sort((a, b) => b.total - a.total);
      const topMakers = combinedSorted.slice(0, 10).map(entry => entry.maker);
      if (aspects.prefMaker && topMakers.length > 0) {
        const data1 = topMakers.map(maker => makers1.get(maker) || 0);
        const data2 = topMakers.map(maker => makers2.get(maker) || 0);
        charts.drawCombinedBarChart(
          i18n.t("aspectPrefMaker"),
          topMakers,
          data1,
          data2,
          `${i18n.t("period1")} ${i18n.t("workCount")}`,
          `${i18n.t("period2")} ${i18n.t("workCount")}`,
          i18n.t("workCount"),
          `prefMaker_${Date.now()}`
        );
      }

      if (aspects.makerOverall) {
        const summarize = works => ({
          count: works.length,
          totalPrice: works.reduce((sum, w) => sum + (w.price || 0), 0)
        });
        const sum1 = summarize(period1Works);
        const sum2 = summarize(period2Works);
        const config = i18n.getCurrencyConfig();
        const summaryText = i18n.t("makerOverallSummary", {
          count1: sum1.count,
          price1: sum1.totalPrice,
          converted1: (sum1.totalPrice * exchangeRate).toFixed(2),
          count2: sum2.count,
          price2: sum2.totalPrice,
          converted2: (sum2.totalPrice * exchangeRate).toFixed(2),
          currency: config.label
        });
        modal.customAlert(summaryText);
      }
    }

    if (aspects.makerType) {
      const makerGenreMap = works => {
        const outer = new Map();
        works.forEach(work => {
          const maker = work.makerName || i18n.t("makerOptionUnknown");
          const genres = collectGenres(work);
          if (genres.length === 0) return;
          if (!outer.has(maker)) outer.set(maker, new Map());
          const inner = outer.get(maker);
          genres.forEach(g => inner.set(g, (inner.get(g) || 0) + 1));
        });
        return outer;
      };

      const map1 = makerGenreMap(period1Works);
      const map2 = makerGenreMap(period2Works);
      const makerTotals = new Map();
      const addTotals = (map) => {
        map.forEach((genreMap, maker) => {
          const total = [...genreMap.values()].reduce((s, c) => s + c, 0);
          makerTotals.set(maker, (makerTotals.get(maker) || 0) + total);
        });
      };
      addTotals(map1);
      addTotals(map2);
      const topMakers = [...makerTotals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(entry => entry[0]);

      let text = i18n.t("makerTypeTitle");
      topMakers.forEach(maker => {
        const g1 = map1.get(maker) || new Map();
        const g2 = map2.get(maker) || new Map();
        const allGenres = new Set([...g1.keys(), ...g2.keys()]);
        text += `${maker}:\n`;
        allGenres.forEach(genre => {
          const v1 = g1.get(genre) || 0;
          const v2 = g2.get(genre) || 0;
          text += i18n.t("timelineItem", { genre, v1, v2 });
        });
        text += "\n";
      });
      modal.customAlert(text);
    }
  };

  const dataProcessor = {
    async fetchUrlAsync(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(response.statusText);
        return await response.text();
      } catch (e) {
        ui.errorLogs.push("Error fetching " + url + ": " + e);
        return "";
      }
    },
    async fetchPageWithRetry(url, pageNum, maxRetries = 2) {
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const pageText = await dataProcessor.fetchUrlAsync(url + pageNum);
        if (pageText) return pageText;
        if (attempt < maxRetries) {
          utils.styledLog(`🔁 ${i18n.t("retryPage", { attempt: attempt + 1, page: pageNum })}`, "color: #ff8c00; font-weight: bold;");
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      ui.errorLogs.push(`Page ${pageNum} failed after ${maxRetries + 1} attempts`);
      return null;
    },
    async processPage(doc, result, detailMode) {
      const trElms = doc.querySelectorAll(".work_list_main tr:not(.item_name)");
      const detailPromises = [];
      trElms.forEach(elm => {
        const work = {};
        work.url = elm.querySelector(".work_name a") ? elm.querySelector(".work_name a").href : "";
        work.date = elm.querySelector(".buy_date").innerText;
        work.name = elm.querySelector(".work_name").innerText.trim();
        work.genre = elm.querySelector(".work_genre span").textContent.trim();
        let genreAnchor = elm.querySelector(".work_genre a");
        work.genreLink = genreAnchor ? genreAnchor.href : "";
        const priceText = elm.querySelector(".work_price").textContent.split(' /')[0];
        work.price = parseInt(priceText.replace(/\D/g, ''));
        work.makerName = elm.querySelector(".maker_name").innerText.trim();
        let makerAnchor = elm.querySelector(".maker_name a");
        work.makerLink = makerAnchor ? makerAnchor.href : "";
        if (detailMode && work.url !== "") {
          detailPromises.push((async (w) => {
            try {
              utils.styledLog(`🔍 ${i18n.t("fetchDetailLog", { url: w.url })}`, "color: #9933ff; font-weight: bold;");
              const workText = await dataProcessor.fetchUrlAsync(w.url);
              const docWork = new DOMParser().parseFromString(workText, "text/html");
              w.mainGenre = [];
              docWork.querySelectorAll(".main_genre a").forEach(a => {
                const g = a.textContent.trim();
                w.mainGenre.push(g);
                let entry = result.genreCount.get(g);
                if (!entry) {
                  entry = { count: 0, link: a.href };
                  result.genreCount.set(g, entry);
                }
                entry.count++;
              });
            } catch(e) {
              ui.errorLogs.push(`Error fetching detail for ${w.url}: ${e}`);
            }
          })(work));
        }
        let makerEntry = result.makerCount.get(work.makerName);
        if (!makerEntry) {
          makerEntry = { count: 0, link: work.makerLink };
          result.makerCount.set(work.makerName, makerEntry);
        }
        makerEntry.count++;
        if (!makerEntry.link && work.makerLink) makerEntry.link = work.makerLink;
        result.count++;
        if (work.price > 0) result.totalPrice += work.price;
        result.works.push(work);
        if (!work.url) result.eol.push(work);
        if (!result.genreCount.has(work.genre)) {
          result.genreCount.set(work.genre, { count: 1, link: work.genreLink });
        } else {
          let gEntry = result.genreCount.get(work.genre);
          gEntry.count++;
          if (!gEntry.link && work.genreLink) gEntry.link = work.genreLink;
        }
      });
      if (detailPromises.length > 0) await Promise.all(detailPromises);
    },
    async fetchAllPages(dlurl, detailMode, updateProgressCallback) {
      const result = { count: 0, totalPrice: 0, works: [], genreCount: new Map(), makerCount: new Map(), eol: [] };
      const concurrencyLimit = 4;
      const firstPageText = await dataProcessor.fetchPageWithRetry(dlurl, 1);
      if (!firstPageText) {
        ui.errorLogs.push(i18n.t("firstPageFail"));
        return result;
      }
      const firstDoc = new DOMParser().parseFromString(firstPageText, "text/html");
      let lastPage = 1;
      const lastPageElm = firstDoc.querySelector(".page_no ul li:last-child a");
      if (lastPageElm) { lastPage = parseInt(lastPageElm.dataset.value); }
      await dataProcessor.processPage(firstDoc, result, detailMode);
      const remainingPages = Math.max(0, lastPage - 1);
      const totalBatches = Math.ceil(remainingPages / concurrencyLimit) + 1;
      let currentBatch = 1;
      updateProgressCallback(currentBatch, totalBatches);
      let nextPage = 2;
      while (nextPage <= lastPage) {
        const batchTasks = [];
        for (let i = 0; i < concurrencyLimit && nextPage <= lastPage; i++, nextPage++) {
          const pageNum = nextPage;
          batchTasks.push((async () => {
            try {
              const pageText = await dataProcessor.fetchPageWithRetry(dlurl, pageNum);
              if (!pageText) return;
              const doc = new DOMParser().parseFromString(pageText, "text/html");
              await dataProcessor.processPage(doc, result, detailMode);
            } catch (e) {
              ui.errorLogs.push(`Error fetching page ${pageNum}: ${e}`);
            }
          })());
        }
        await Promise.all(batchTasks);
        currentBatch++;
        updateProgressCallback(Math.min(currentBatch, totalBatches), totalBatches);
      }
      return result;
    }
  };

  const downloadContent = {
    generateMarkdown(result, exchangeRate, filteredGenreCount, filteredMakerCount) {
      const currencyText = currencyHelper.format(result.totalPrice, exchangeRate);
      let md = `# ${i18n.t("downloadTitle")}\n\n`;
      md += `## ${i18n.t("overview")}\n\n`;
      md += `| ${i18n.t("statItem")} | ${i18n.t("valueLabel")} |\n`;
      md += `| --- | --- |\n`;
      md += `| ${i18n.t("purchaseTotal")} | ${result.count} ${i18n.t("workCount")} |\n`;
      md += `| ${i18n.t("totalSpent")} | ${currencyText} |\n\n`;
      md += `## ${i18n.t("genreRanking")}\n\n`;
      md += `| ${i18n.t("workTypeLabel")} | ${i18n.t("workCount")} |\n`;
      md += `| --- | --- |\n`;
      filteredGenreCount.forEach(item => {
          md += `| ${item[0]} | ${item[1].count} |\n`;
      });
      md += `\n`;
      md += `## ${i18n.t("makerRanking")}\n\n`;
      md += `| ${i18n.t("workMakerLabel")} | ${i18n.t("workCount")} |\n`;
      md += `| --- | --- |\n`;
      filteredMakerCount.forEach(item => {
          md += `| ${item[0]} | ${item[1].count} |\n`;
      });
      md += `\n`;
      md += `## ${i18n.t("eolTitle")}\n\n`;
      if (result.eol.length > 0) {
          md += `| ${i18n.t("purchaseDate")} | ${i18n.t("workMakerLabel")} | ${i18n.t("workNameLabel")} | ${i18n.t("priceYen", { amount: i18n.t("valueLabel") })} |\n`;
          md += `| --- | --- | --- | --- |\n`;
          result.eol.forEach(eol => {
              md += `| ${eol.date} | ${eol.makerName} | ${eol.name} | ${i18n.t("priceYen", { amount: eol.price })} |\n`;
          });
      } else {
          md += `${i18n.t("noEol")}\n`;
      }
      md += `\n`;
      md += `## ${i18n.t("timeline")}\n\n`;
      const timelineGroups = {};
      result.works.forEach(work => {
        let day = new Date(work.date).toISOString().slice(0,10);
        if(!timelineGroups[day]) timelineGroups[day] = [];
        timelineGroups[day].push(work);
      });
      const sortedDates = Object.keys(timelineGroups).sort();
      sortedDates.forEach(date => {
          md += `### ${date} (${timelineGroups[date].length} ${i18n.t("workCount")})\n\n`;
          md += `| ${i18n.t("workNameLabel")} | ${i18n.t("workMakerLabel")} | ${i18n.t("priceYen", { amount: i18n.t("valueLabel") })} |\n`;
          md += `| --- | --- | --- |\n`;
          timelineGroups[date].forEach(work => {
              md += `| ${work.name} | ${work.makerName} | ${i18n.t("priceYen", { amount: work.price })} |\n`;
          });
          md += `\n`;
      });
      return md;
    },
    generateCSV(result, exchangeRate, filteredGenreCount, filteredMakerCount) {
      const currencyText = currencyHelper.format(result.totalPrice, exchangeRate);
      let csv = "";
      csv += `${i18n.t("statItem")},${i18n.t("valueLabel")}\n`;
      csv += `${i18n.t("purchaseTotal")},${result.count} ${i18n.t("workCount")}\n`;
      csv += `${i18n.t("totalSpent")},${currencyText}\n\n`;
      csv += `${i18n.t("genreRanking")}\n`;
      csv += `${i18n.t("workTypeLabel")},${i18n.t("workCount")}\n`;
      filteredGenreCount.forEach(item => {
          csv += `${item[0]},${item[1].count}\n`;
      });
      csv += "\n";
      csv += `${i18n.t("makerRanking")}\n`;
      csv += `${i18n.t("workMakerLabel")},${i18n.t("workCount")}\n`;
      filteredMakerCount.forEach(item => {
          csv += `${item[0]},${item[1].count}\n`;
      });
      csv += "\n";
      csv += `${i18n.t("eolTitle")}\n`;
      csv += `${i18n.t("purchaseDate")},${i18n.t("workMakerLabel")},${i18n.t("workNameLabel")},${i18n.t("priceYen", { amount: i18n.t("valueLabel") })}\n`;
      if (result.eol.length > 0) {
          result.eol.forEach(eol => {
              csv += `${eol.date},${eol.makerName},${eol.name},${eol.price}\n`;
          });
      } else {
          csv += `${i18n.t("noEol")}\n`;
      }
      csv += "\n";
      csv += `${i18n.t("timeline")}\n`;
      const timelineGroups = {};
      result.works.forEach(work => {
        let day = new Date(work.date).toISOString().slice(0,10);
        if(!timelineGroups[day]) timelineGroups[day] = [];
        timelineGroups[day].push(work);
      });
      const sortedDates = Object.keys(timelineGroups).sort();
      sortedDates.forEach(date => {
          csv += `${i18n.t("dateLabel", { date })} (${timelineGroups[date].length} ${i18n.t("workCount")})\n`;
          csv += `${i18n.t("workNameLabel")},${i18n.t("workMakerLabel")},${i18n.t("priceYen", { amount: i18n.t("valueLabel") })}\n`;
          timelineGroups[date].forEach(work => {
              csv += `${work.name},${work.makerName},${work.price}\n`;
          });
          csv += "\n";
      });
      return "\ufeff" + csv;
      },
      generateJSON(result, exchangeRate, filteredGenreCount, filteredMakerCount) {
          const config = i18n.getCurrencyConfig();
          const jsonObject = {
              count: result.count,
              totalPriceJPY: result.totalPrice,
              totalPriceConverted: (result.totalPrice * exchangeRate).toFixed(2),
              currency: config.label,
              genreRanking: filteredGenreCount.map(([genre, entry]) => ({ genre, count: entry.count })),
              makerRanking: filteredMakerCount.map(([maker, entry]) => ({ maker, count: entry.count })),
              eol: result.eol,
              works: result.works
          };
          return JSON.stringify(jsonObject, null, 2);
      },
    addDownloadButton(result, exchangeRate, filteredGenreCount, filteredMakerCount) {
      const downloadBtn = document.createElement("button");
      downloadBtn.id = "downloadBtn";
      downloadBtn.textContent = i18n.t("download");
      downloadBtn.className = "btn";
      downloadBtn.style.position = "fixed";
      downloadBtn.style.top = "10px";
      downloadBtn.style.left = "10px";
      downloadBtn.style.zIndex = "100001";
      downloadBtn.setAttribute("aria-label", i18n.t("download"));
      downloadBtn.addEventListener("click", async () => {
        const choice = await modal.customChoice(i18n.t("downloadFormatPrompt"), [
          { label: i18n.t("downloadMd"), value: "md" },
            { label: i18n.t("downloadCsv"), value: "csv" },
            { label: i18n.t("downloadJson"), value: "json" },
          { label: i18n.t("downloadAll"), value: "all" }
        ]);
        if(choice === "md" || choice === "all") {
          const mdContent = downloadContent.generateMarkdown(result, exchangeRate, filteredGenreCount, filteredMakerCount);
          utils.downloadFile("DLsite_Result.md", mdContent, "text/markdown");
        }
        if(choice === "csv" || choice === "all") {
          const csvContent = downloadContent.generateCSV(result, exchangeRate, filteredGenreCount, filteredMakerCount);
          utils.downloadFile("DLsite_Result.csv", csvContent, "text/csv");
          }
        if (choice === "json" || choice === "all") {
              const jsonContent = downloadContent.generateJSON(result, exchangeRate, filteredGenreCount, filteredMakerCount);
              utils.downloadFile("DLsite_Result.json", jsonContent, "application/json");
          }

      });
      document.body.appendChild(downloadBtn);
    }
  };

  const ui = {
    currentZIndex: 100001,
    comparisonCounter: 1,
    existingComparisonCharts: {},
    errorLogs: [],
    injectStyles() {
      const style = document.createElement("style");
      style.id = "DLsiteStyle";
      style.textContent = `
        body { 
           font-family: 'Open Sans', sans-serif; 
           background: linear-gradient(135deg, #f8f9fa, #e9ecef); 
           color: #343a40; 
           margin: 0; 
           padding: 0;
        }
        .modal-overlay {
           position: fixed;
           top: 0;
           left: 0;
           width: 100%;
           height: 100%;
           background: rgba(0, 0, 0, 0.5);
           backdrop-filter: blur(6px);
           display: flex;
           align-items: center;
           justify-content: center;
           z-index: 1000000;
           opacity: 0;
           animation: fadeIn 0.1s forwards;
        }
        .modal-container {
           background: #ffffff;
           padding: 20px 30px;
           border-radius: 12px;
           max-width: 600px;
           text-align: center;
           position: relative;
           box-shadow: 0 8px 20px rgba(0,0,0,0.2);
           animation: slideIn 0.1s forwards;
        }
        @keyframes fadeIn {
           from { opacity: 0; }
           to { opacity: 1; }
        }
        @keyframes slideIn {
           from { transform: translateY(-20px); }
           to { transform: translateY(0); }
        }
        .progress-bar {
           position: fixed;
           bottom: 20px;
           left: 20px;
           width: 320px;
           height: 24px;
           background: #ddd;
           border-radius: 12px;
           overflow: hidden;
           z-index: 10000;
           box-shadow: 0 4px 6px rgba(0,0,0,0.1);
           display: flex;
           align-items: center;
           justify-content: center;
           color: #fff;
           font-weight: bold;
           font-size: 12px;
        }
        .progress-text {
           position: absolute;
           width: 100%;
           height: 100%;
           left: 0;
           top: 0;
           display: flex;
           align-items: center;
           justify-content: center;
           text-align: center;
           z-index: 2;
           pointer-events: none;
           text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .inner-progress {
           height: 100%;
           width: 0%;
           background: linear-gradient(90deg, #6a11cb, #2575fc);
           transition: width 0.1s ease;
           position: absolute;
           top: 0;
           left: 0;
           z-index: 1;
        }
        .chart-container {
           background: #fff;
           border: 1px solid #ccc;
           border-radius: 12px;
           overflow: hidden;
           z-index: 10000;
           position: absolute;
           box-shadow: 0 4px 10px rgba(0,0,0,0.1);
           transition: transform 0.3s ease;
        }
        .chart-container:hover {
           transform: scale(1.02);
        }
        .drag-button {
           position: absolute;
           top: 10px;
           left: 10px;
           width: 30px;
           height: 30px;
           border-radius: 50%;
           background: #ff5722;
           border: 2px solid #fff;
           cursor: grab;
           user-select: none;
           z-index: 101;
           text-align: center;
           line-height: 30px;
           color: #fff;
           font-size: 16px;
           transition: background 0.3s;
        }
        .drag-button:hover {
           background: #e64a19;
        }
        .chart-content {
           width: 100%;
           height: calc(100% - 40px);
           margin-top: 40px;
           overflow: auto;
           padding: 10px;
           background: rgba(250,250,250,0.8);
        }
        .btn {
           margin: 8px;
           padding: 10px 18px;
           cursor: pointer;
           border: none;
           background: linear-gradient(135deg, #42a5f5, #1e88e5);
           color: #fff;
           border-radius: 6px;
           transition: background 0.3s, transform 0.2s;
           font-size: 14px;
        }
        .btn:hover {
           background: linear-gradient(135deg, #1e88e5, #42a5f5);
           transform: scale(1.05);
        }
        .md-modal {
           background: #fff;
           padding: 30px;
           border-radius: 12px;
           width: 80%;
           max-width: 600px;
           max-height: 80%;
           overflow: auto;
           box-shadow: 0 8px 20px rgba(0,0,0,0.2);
           position: relative;
           animation: modalBounceIn 0.6s forwards;
        }
        @keyframes modalBounceIn {
           0% { transform: scale(0.7); opacity: 0; }
           60% { transform: scale(1.05); opacity: 1; }
           80% { transform: scale(0.95); }
           100% { transform: scale(1); }
        }
        .md-modal h2 {
           margin-top: 0;
           text-align: center;
           background: linear-gradient(90deg, #ff8a65, #ff7043);
           color: #fff;
           padding: 12px;
           border-radius: 6px;
           letter-spacing: 1px;
        }
        .md-modal pre {
           white-space: pre-wrap;
           word-break: break-all;
           background: #f1f1f1;
           border: 1px solid #ccc;
           padding: 12px;
           max-height: 300px;
           overflow-y: auto;
           margin: 20px 0;
           border-radius: 6px;
        }
        table {
           width: 100%;
           border-collapse: collapse;
           margin-bottom: 10px;
        }
        th, td {
           border: 1px solid #ccc;
           padding: 10px;
           text-align: center;
        }
        th {
           background: #f0f0f0;
        }
        .collapsible-section {
           border: 1px solid #bbb;
           margin-bottom: 10px;
           border-radius: 6px;
           overflow: hidden;
           background: #fafafa;
        }
        .collapsible-header {
           margin: 0;
           padding: 10px 15px;
           background: #e0e0e0;
           cursor: pointer;
           user-select: none;
           font-weight: bold;
           transition: background 0.3s;
        }
        .collapsible-header:hover {
           background: #d5d5d5;
        }
        .collapsible-content {
           padding: 15px;
           background: #fff;
        }
        #hiddenChartsContainer {
           position: fixed;
           right: 20px;
           top: 20px;
           z-index: 11000;
        }
      `;
      document.head.appendChild(style);
    },
    updateProgressBar(progress, currentBatch, totalBatches) {
      let progressBar = document.getElementById("progressBar");
      if (!progressBar) {
        progressBar = document.createElement("div");
        progressBar.id = "progressBar";
        progressBar.className = "progress-bar";
        const innerBar = document.createElement("div");
        innerBar.id = "innerProgressBar";
        innerBar.className = "inner-progress";
        const progressText = document.createElement("div");
        progressText.id = "progressText";
        progressText.className = "progress-text";
        progressText.textContent = i18n.t("preparation");
        progressBar.appendChild(innerBar);
        progressBar.appendChild(progressText);
        document.body.appendChild(progressBar);
      }
      document.getElementById("innerProgressBar").style.width = progress + "%";
      const textElem = document.getElementById("progressText");
      if (textElem) {
        const rounded = Math.min(100, Math.max(0, Math.round(progress)));
        if (currentBatch && totalBatches) {
          textElem.textContent = i18n.t("batchProgress", { current: currentBatch, total: totalBatches, percent: rounded });
        } else {
          textElem.textContent = isNaN(rounded) ? i18n.t("preparation") : `${rounded}%`;
        }
      }
    },
    async rebuildAfterLanguageChange() {
      const savedRate = appState.customRates[i18n.current];
      let rate = typeof savedRate === "number" ? savedRate : i18n.getCurrencyConfig().rate;
      if (i18n.current === "ja") rate = 1;
      appState.exchangeRate = rate;
      appState.currencyLang = i18n.current;
      const label = document.querySelector("#languageSwitcher label");
      if (label) label.textContent = i18n.t("selectLanguage");
      const select = document.getElementById("languageSelectBox");
      if (select) {
        Array.from(select.options).forEach(option => {
          option.textContent = i18n.languages[option.value].name;
          option.selected = option.value === i18n.current;
        });
        select.setAttribute("aria-label", i18n.t("selectLanguage"));
      }
      if (!appState.result) return;
      cleanup();
      if (!document.getElementById("DLsiteStyle")) {
        ui.injectStyles();
      }
      const renderCharts = async () => {
        if (appState.showCharts) {
          if (typeof Chart === "undefined") {
            await new Promise((resolve, reject) => {
              const script = document.createElement("script");
              script.src = "https://cdn.jsdelivr.net/npm/chart.js";
              script.onload = resolve;
              script.onerror = reject;
              document.head.appendChild(script);
            });
          }
          if (appState.detailMode) {
            charts.drawGenreChart(appState.filteredGenreCount, appState.result.works, window.genreChartObj ? window.genreChartObj.config.type : "bar");
          }
          charts.drawMakerChart(appState.filteredMakerCount, appState.result.works, window.makerChartObj ? window.makerChartObj.config.type : "bar");
          charts.drawTimelineChart(appState.result.works);
          charts.drawCumulativeChart(appState.result.works);
        }
      };
      await renderCharts();
      displayResults(appState.result, appState.exchangeRate, appState.filteredGenreCount, appState.filteredMakerCount, appState.excludeThreshold);
      ui.addCompareButton(appState.result, appState.exchangeRate);
      downloadContent.addDownloadButton(appState.result, appState.exchangeRate, appState.filteredGenreCount, appState.filteredMakerCount);
      ui.addResetButton();
    },
    addLanguageSwitcher() {
      let switcher = document.getElementById("languageSwitcher");
      if (switcher) return;
      switcher = document.createElement("div");
      switcher.id = "languageSwitcher";
      switcher.style.position = "fixed";
      switcher.style.top = "10px";
      switcher.style.right = "10px";
      switcher.style.zIndex = "100002";
      const label = document.createElement("label");
      label.textContent = i18n.t("selectLanguage");
      label.style.marginRight = "6px";
      label.setAttribute("for", "languageSelectBox");
      const select = document.createElement("select");
      select.id = "languageSelectBox";
      select.setAttribute("aria-label", i18n.t("selectLanguage"));
      Object.keys(i18n.languages).forEach(lang => {
        const option = document.createElement("option");
        option.value = lang;
        option.textContent = i18n.languages[lang].name;
        if (lang === i18n.current) option.selected = true;
        select.appendChild(option);
      });
      select.addEventListener("change", async () => {
        i18n.setLanguage(select.value);
        utils.styledLog(i18n.t("languageChanged", { lang: i18n.languages[select.value].name }), "color: #1e88e5; font-weight: bold;", "info");
        await ui.rebuildAfterLanguageChange();
      });
      switcher.appendChild(label);
      switcher.appendChild(select);
      document.body.appendChild(switcher);
    },
    addCompareButton(result, exchangeRate) {
      const compareBtn = document.createElement("button");
      compareBtn.id = "compareBtn";
      compareBtn.textContent = i18n.t("compare");
      compareBtn.className = "btn";
      compareBtn.style.position = "fixed";
      compareBtn.style.top = "50px";
      compareBtn.style.left = "10px";
      compareBtn.style.zIndex = "100001";
      compareBtn.setAttribute("aria-label", i18n.t("compare"));
      compareBtn.addEventListener("click", async () => {
        let availableDates = [...new Set(result.works.map(work => new Date(work.date).toISOString().slice(0,10)))].sort();
        const periods = await modal.customSelectPeriods(availableDates);
        if (periods) {
          compareAllAspects(result, periods, exchangeRate, periods.aspects);
        }
      });
      document.body.appendChild(compareBtn);
    },
    addResetButton() {
      const resetBtn = document.createElement("button");
      resetBtn.id = "resetBtn";
      resetBtn.textContent = i18n.t("reset");
      resetBtn.className = "btn";
      resetBtn.style.position = "fixed";
      resetBtn.style.bottom = "10px";
      resetBtn.style.right = "10px";
      resetBtn.style.background = "red";
      resetBtn.style.color = "white";
      resetBtn.style.zIndex = "100002";
      resetBtn.setAttribute("aria-label", i18n.t("reset"));
      resetBtn.addEventListener("click", () => {
        cleanup();
        const injectedStyle = document.getElementById("DLsiteStyle");
        if (injectedStyle && injectedStyle.parentNode) {
          injectedStyle.parentNode.removeChild(injectedStyle);
        }
      });
      document.body.appendChild(resetBtn);
    }
  };

  const cleanup = () => {
    const ids = [
      "progressBar", "chartContainer1", "chartContainer2", "chartContainer3",
      "chartContainer4", "resultWindow", "comparisonChartsContainer",
      "hiddenChartsContainer", "downloadBtn", "compareBtn", "resetBtn"
    ];
    ids.forEach(id => {
      const elem = document.getElementById(id);
      if (elem && elem.parentNode) {
        try {
          elem.parentNode.removeChild(elem);
        } catch(e) {
          console.warn(e);
        }
      }
    });
    window.genreChartObj = window.makerChartObj = window.timelineChartObj = window.cumulativeChartObj = null;
    ui.existingComparisonCharts = {};
  };

  const main = async () => {
    cleanup();
    ui.addLanguageSwitcher();
    const isValidDLsitePage = () => {
      return /dlsite\.com\/maniax\/mypage\/userbuy/.test(window.location.href) &&
             document.querySelector(".work_list_main") !== null;
    };
    if (!isValidDLsitePage()) {
      const jump = await modal.customConfirm(i18n.t("notDlsite"));
      if (jump) {
        window.location.href = "https://www.dlsite.com/maniax/mypage/userbuy/=/type/all/start/all/sort/1/order/1/page/1";
        return;
      } else {
        await modal.customAlert(i18n.t("switchToDlsite"));
        return;
      }
    }
    utils.styledLog(i18n.t("pageTitleLog"), "font-size: 28px; font-weight: bold; color: white; background: linear-gradient(to right, #ff6347, #ff1493, #8a2be2, #32cd32); padding: 10px; border-radius: 8px;");
    let detailMode = true;
    const quickView = await modal.customChoice(i18n.t("quickViewPrompt"), [
      { label: i18n.t("yes"), value: "y" },
      { label: i18n.t("no"), value: "n" }
    ]);
    if (quickView && quickView.toLowerCase() === "y") detailMode = false;
    let dlurl = "https://www.dlsite.com/maniax/mypage/userbuy/=/type/all/start/all/sort/1/order/1/page/";
    if (detailMode) {
      const typeOptionsArr = [
        { label: i18n.t("typeAllWorks"), value: "0" },
        { label: i18n.t("doujinAll"), value: "12" },
        { label: i18n.t("doujinAllAges"), value: "2" },
        { label: i18n.t("doujinMale"), value: "1" },
        { label: i18n.t("doujinFemale"), value: "3" },
        { label: i18n.t("commercialAll"), value: "13" },
        { label: i18n.t("commercialAllAges"), value: "9" },
        { label: i18n.t("commercialMale"), value: "4" },
        { label: i18n.t("mangaAll"), value: "14" },
        { label: i18n.t("mangaAllAges"), value: "10" },
        { label: i18n.t("mangaMale"), value: "7" },
        { label: i18n.t("mangaFemale"), value: "11" }
      ];
      const typeChoice = await modal.customChoice(i18n.t("selectTypePrompt"), typeOptionsArr);
      if (typeChoice === "0") dlurl = dlurl.replace(/type\/[^/]+/, "type/all");
      else dlurl = dlurl.replace(/type\/[^/]+/, `type/${typeChoice}`);
    } else {
      dlurl = dlurl.replace(/type\/[^/]+/, "type/all");
    }
    let exchangeRate = i18n.getCurrencyConfig().rate;
    appState.currencyLang = i18n.current;
    if (i18n.current !== "ja") {
      const exchangeChoice = await modal.customChoice(i18n.t("modifyRatePrompt"), [
        { label: i18n.t("useDefaultRateOption"), value: "default" },
        { label: i18n.t("modifyRateOption"), value: "modify" }
      ]);
      if (exchangeChoice === "modify") {
        const promptText = i18n.current === "en" ? i18n.t("ratePromptUsd") : i18n.t("enterRatePrompt");
        const newExchangeRateStr = await modal.customPrompt(promptText, exchangeRate.toString());
        const newExchangeRate = parseFloat(newExchangeRateStr);
        if (!isNaN(newExchangeRate) && newExchangeRate > 0) exchangeRate = newExchangeRate;
        else utils.styledLog(i18n.t("invalidRate"), "color: red; font-weight: bold;", "error");
      } else {
        utils.styledLog(i18n.t("usingDefaultRate", { rate: exchangeRate }), "color: green; font-weight: bold;", "info");
      }
    } else {
      exchangeRate = 1;
    }
    appState.customRates[i18n.current] = exchangeRate;
    console.group(`📄 ${i18n.t("progressGroup")}`);
    const result = await dataProcessor.fetchAllPages(dlurl, detailMode, (currentBatch, totalBatches) => {
      ui.updateProgressBar((currentBatch / totalBatches) * 100, currentBatch, totalBatches);
    });
    console.groupEnd();
    const excludeResponse = await modal.customPrompt(i18n.t("excludePrompt"), "0");
    let excludeThreshold = 0;
    if (excludeResponse) {
      excludeThreshold = parseInt(excludeResponse);
      if (isNaN(excludeThreshold) || excludeThreshold < 0) {
        utils.styledLog(i18n.t("excludeInvalid"), "color: red; font-weight: bold;", "error");
        excludeThreshold = 0;
      }
    } else {
      utils.styledLog(i18n.t("excludeEmpty"), "color: #666666; font-weight: bold;", "info");
    }
    result.genreCount = [...result.genreCount.entries()].sort((a, b) => b[1].count - a[1].count);
    result.makerCount = [...result.makerCount.entries()].sort((a, b) => b[1].count - a[1].count);
    const filteredGenreCount = excludeThreshold === 0 ? result.genreCount : result.genreCount.filter(([, entry]) => entry.count >= excludeThreshold);
    const filteredMakerCount = excludeThreshold === 0 ? result.makerCount : result.makerCount.filter(([, entry]) => entry.count >= excludeThreshold);
    const showChart = await modal.customChoice(i18n.t("showChartPrompt"), [
      { label: i18n.t("showCharts"), value: "y" },
      { label: i18n.t("hideCharts"), value: "n" }
    ]);
    appState.showCharts = showChart && showChart.toLowerCase() === "y";
    appState.result = result;
    appState.filteredGenreCount = filteredGenreCount;
    appState.filteredMakerCount = filteredMakerCount;
    appState.exchangeRate = exchangeRate;
    appState.excludeThreshold = excludeThreshold;
    appState.detailMode = detailMode;
    if (appState.showCharts) {
      if (typeof Chart === "undefined") {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/chart.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      if (detailMode) {
        charts.drawGenreChart(filteredGenreCount, result.works, "bar");
      }
      charts.drawMakerChart(filteredMakerCount, result.works, "bar");
      charts.drawTimelineChart(result.works);
      charts.drawCumulativeChart(result.works);
    }
    displayResults(result, exchangeRate, filteredGenreCount, filteredMakerCount, excludeThreshold);
    ui.addCompareButton(result, exchangeRate);
    downloadContent.addDownloadButton(result, exchangeRate, filteredGenreCount, filteredMakerCount);
    ui.addResetButton();
    console.clear();
  };

  const displayResults = (result, exchangeRate, filteredGenreCount, filteredMakerCount, excludeThreshold = 0) => {
    const container = charts.createChartContainer("resultWindow", "200px", "200px", "1000px", "800px", i18n.t("filterTitle"));
    const contentDiv = container.querySelector(".chart-content");
    while (contentDiv.firstChild) contentDiv.removeChild(contentDiv.firstChild);

    const createTable = (headers, rows) => {
      const table = document.createElement("table");
      const headerRow = document.createElement("tr");
      headers.forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);
      rows.forEach(cells => {
        const tr = document.createElement("tr");
        cells.forEach(cell => {
          const td = document.createElement("td");
          if (cell instanceof Node) {
            td.appendChild(cell);
          } else {
            td.textContent = cell;
          }
          tr.appendChild(td);
        });
        table.appendChild(tr);
      });
      return table;
    };

    const filterForm = document.createElement("div");
    filterForm.style.display = "flex";
    filterForm.style.flexWrap = "wrap";
    filterForm.style.gap = "10px";
    filterForm.style.marginBottom = "10px";

    const keywordInput = document.createElement("input");
    keywordInput.type = "text";
    keywordInput.placeholder = i18n.t("keywordPlaceholder");
    keywordInput.setAttribute("aria-label", i18n.t("keywordPlaceholder"));
    keywordInput.style.flex = "1";

    const makerSelect = document.createElement("select");
    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = i18n.t("allMakers");
    makerSelect.appendChild(allOption);
    const makerNames = Array.isArray(result.makerCount) ? result.makerCount.map(item => item[0]) : [...result.makerCount.keys()];
    makerNames.sort().forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      makerSelect.appendChild(option);
    });

    const startDateInput = document.createElement("input");
    startDateInput.type = "date";
    startDateInput.style.flex = "0 0 160px";
    const endDateInput = document.createElement("input");
    endDateInput.type = "date";
    endDateInput.style.flex = "0 0 160px";

    const minPriceInput = document.createElement("input");
    minPriceInput.type = "number";
    minPriceInput.placeholder = i18n.t("minPrice");
    minPriceInput.setAttribute("aria-label", i18n.t("minPrice"));
    minPriceInput.style.flex = "0 0 120px";
    const maxPriceInput = document.createElement("input");
    maxPriceInput.type = "number";
    maxPriceInput.placeholder = i18n.t("maxPrice");
    maxPriceInput.setAttribute("aria-label", i18n.t("maxPrice"));
    maxPriceInput.style.flex = "0 0 120px";

    const applyFilterBtn = document.createElement("button");
    applyFilterBtn.textContent = i18n.t("applyFilters");
    applyFilterBtn.className = "btn";
    applyFilterBtn.style.flex = "0 0 100px";
    applyFilterBtn.setAttribute("aria-label", i18n.t("applyFilters"));

    const redrawChartsBtn = document.createElement("button");
    redrawChartsBtn.textContent = i18n.t("redrawCharts");
    redrawChartsBtn.className = "btn";
    redrawChartsBtn.style.flex = "1 1 200px";
    redrawChartsBtn.setAttribute("aria-label", i18n.t("redrawCharts"));

    filterForm.appendChild(keywordInput);
    filterForm.appendChild(makerSelect);
    filterForm.appendChild(startDateInput);
    filterForm.appendChild(endDateInput);
    filterForm.appendChild(minPriceInput);
    filterForm.appendChild(maxPriceInput);
    filterForm.appendChild(applyFilterBtn);
    filterForm.appendChild(redrawChartsBtn);
    contentDiv.appendChild(filterForm);

    const overviewContent = document.createElement("div");
    const genreContent = document.createElement("div");
    const makerContent = document.createElement("div");
    const eolContent = document.createElement("div");
    const timelineContent = document.createElement("div");

    const overviewSection = ui.createCollapsibleSection(i18n.t("overview"), overviewContent, false);
    const genreSection = ui.createCollapsibleSection(i18n.t("genreRanking"), genreContent, false);
    const makerSection = ui.createCollapsibleSection(i18n.t("makerRanking"), makerContent, false);
    const eolSection = ui.createCollapsibleSection(i18n.t("eolTitle"), eolContent, false);
    const timelineSection = ui.createCollapsibleSection(i18n.t("timeline"), timelineContent, true);

    contentDiv.appendChild(overviewSection);
    contentDiv.appendChild(genreSection);
    contentDiv.appendChild(makerSection);
    contentDiv.appendChild(eolSection);
    contentDiv.appendChild(timelineSection);

    const authorContainer = document.createElement("div");
    const p1 = document.createElement("p");
    p1.textContent = i18n.t("authorCredit");
    const p2 = document.createElement("p");
    p2.textContent = i18n.t("projectLabel");
    const link = document.createElement("a");
    link.href = "https://github.com/linyaocrush/DLsite-Purchase-Analyzer";
    link.target = "_blank";
    link.textContent = "https://github.com/linyaocrush/DLsite-Purchase-Analyzer";
    p2.appendChild(link);
    authorContainer.appendChild(p1);
    authorContainer.appendChild(p2);
    contentDiv.appendChild(ui.createCollapsibleSection(i18n.t("authorInfo"), authorContainer, false));

    const computeCounts = (works) => {
      const genreMap = new Map();
      const makerMap = new Map();
      const applyThreshold = (entries) => excludeThreshold === 0 ? entries : entries.filter(([, entry]) => entry.count >= excludeThreshold);

      const findGenreEntry = (genre) => {
        if (result.genreCount instanceof Map) return result.genreCount.get(genre);
        if (Array.isArray(result.genreCount)) {
          const entry = result.genreCount.find(item => item[0] === genre);
          return entry ? entry[1] : null;
        }
        return null;
      };

      const findMakerEntry = (maker) => {
        if (result.makerCount instanceof Map) return result.makerCount.get(maker);
        if (Array.isArray(result.makerCount)) {
          const entry = result.makerCount.find(item => item[0] === maker);
          return entry ? entry[1] : null;
        }
        return null;
      };

      const addGenre = (genre) => {
        if (!genre) return;
        const originEntry = findGenreEntry(genre);
        const link = originEntry && originEntry.link ? originEntry.link : "";
        const existing = genreMap.get(genre) || { count: 0, link };
        existing.count++;
        if (!existing.link && link) existing.link = link;
        genreMap.set(genre, existing);
      };

      works.forEach(work => {
        addGenre(work.genre);
        if (Array.isArray(work.mainGenre)) {
          work.mainGenre.forEach(g => addGenre(g));
        }
        const makerOrigin = findMakerEntry(work.makerName);
        const makerLink = makerOrigin && makerOrigin.link ? makerOrigin.link : "";
        const makerEntry = makerMap.get(work.makerName) || { count: 0, link: makerLink };
        makerEntry.count++;
        if (!makerEntry.link && makerLink) makerEntry.link = makerLink;
        makerMap.set(work.makerName, makerEntry);
      });

      const genreArray = [...genreMap.entries()].sort((a, b) => b[1].count - a[1].count);
      const makerArray = [...makerMap.entries()].sort((a, b) => b[1].count - a[1].count);

      return {
        genreArray,
        makerArray,
        filteredGenreCount: applyThreshold(genreArray),
        filteredMakerCount: applyThreshold(makerArray)
      };
    };

    const renderSections = (works, genreCountArr, makerCountArr) => {
      overviewContent.innerHTML = "";
      const totalPrice = works.reduce((sum, work) => sum + (work.price || 0), 0);
      const overviewTable = createTable(
        [i18n.t("statItem"), i18n.t("valueLabel")],
        [
          [i18n.t("purchaseTotal"), `${works.length} ${i18n.t("workCount")}`],
          [i18n.t("totalSpent"), currencyHelper.format(totalPrice, exchangeRate)]
        ]
      );
      overviewContent.appendChild(overviewTable);

      genreContent.innerHTML = "";
      if (genreCountArr.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = i18n.t("noGenreData");
        genreContent.appendChild(empty);
      } else {
        const genreRows = genreCountArr.map(([type, entry]) => {
          const cellContainer = document.createElement("span");
          cellContainer.textContent = type;
          if (entry.link) {
            const link = document.createElement("a");
            link.href = entry.link;
            link.target = "_blank";
            link.style.marginLeft = "5px";
            link.style.fontSize = "12px";
            link.textContent = i18n.t("jumpText");
            cellContainer.appendChild(link);
          }
          return [cellContainer, `${entry.count}`];
        });
        const genreTable = createTable([i18n.t("workTypeLabel"), i18n.t("workCount")], genreRows);
        genreContent.appendChild(genreTable);
      }

      makerContent.innerHTML = "";
      if (makerCountArr.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = i18n.t("noMakerData");
        makerContent.appendChild(empty);
      } else {
        const makerRows = makerCountArr.map(([maker, entry]) => {
          const cellContainer = document.createElement("span");
          cellContainer.textContent = maker;
          if (entry.link) {
            const link = document.createElement("a");
            link.href = entry.link;
            link.target = "_blank";
            link.style.marginLeft = "5px";
            link.style.fontSize = "12px";
            link.textContent = i18n.t("jumpText");
            cellContainer.appendChild(link);
          }
          return [cellContainer, `${entry.count}`];
        });
        const makerTable = createTable([i18n.t("workMakerLabel"), i18n.t("workCount")], makerRows);
        makerContent.appendChild(makerTable);
      }

      eolContent.innerHTML = "";
      const eolWorks = works.filter(work => !work.url);
      if (eolWorks.length > 0) {
        const eolRows = eolWorks.map(eol => [eol.date, eol.makerName, eol.name, i18n.t("priceYen", { amount: eol.price })]);
        const eolTable = createTable([i18n.t("purchaseDate"), i18n.t("workMakerLabel"), i18n.t("workNameLabel"), i18n.t("valueLabel")], eolRows);
        eolContent.appendChild(eolTable);
      } else {
        const noEol = document.createElement("p");
        noEol.textContent = i18n.t("noEol");
        eolContent.appendChild(noEol);
      }

      timelineContent.innerHTML = "";
      if (works.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = i18n.t("noData");
        timelineContent.appendChild(empty);
      } else {
        const timelineGroups = {};
        works.forEach(work => {
          let day = new Date(work.date).toISOString().slice(0,10);
          if(!timelineGroups[day]) timelineGroups[day] = [];
          timelineGroups[day].push(work);
        });
        const sortedDates = Object.keys(timelineGroups).sort();
        sortedDates.forEach(date => {
          const section = document.createElement("div");
          const title = document.createElement("strong");
          title.textContent = `${date} (${timelineGroups[date].length} ${i18n.t("workCount")})`;
          section.appendChild(title);
          const table = createTable(
            [i18n.t("workNameLabel"), i18n.t("workMakerLabel"), i18n.t("valueLabel")],
            timelineGroups[date].map(work => [work.name, work.makerName, i18n.t("priceYen", { amount: work.price })])
          );
          section.appendChild(table);
          timelineContent.appendChild(section);
        });
      }
    };

    const updateChartsWithFilteredData = (works, genreCountArr, makerCountArr) => {
      if (typeof Chart === "undefined") return;
      const genreType = window.genreChartObj ? window.genreChartObj.config.type : "bar";
      const makerType = window.makerChartObj ? window.makerChartObj.config.type : "bar";
      if (document.getElementById("chartContainer1")) {
        charts.drawGenreChart(genreCountArr, works, genreType);
      }
      if (document.getElementById("chartContainer2")) {
        charts.drawMakerChart(makerCountArr, works, makerType);
      }
      if (document.getElementById("chartContainer3")) {
        charts.drawTimelineChart(works);
      }
      if (document.getElementById("chartContainer4")) {
        charts.drawCumulativeChart(works);
      }
    };

    const getFilteredWorks = () => {
      const keyword = keywordInput.value.trim().toLowerCase();
      const maker = makerSelect.value;
      const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
      const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
      if (endDate) endDate.setHours(23, 59, 59, 999);
      const minPrice = parseInt(minPriceInput.value, 10);
      const maxPrice = parseInt(maxPriceInput.value, 10);

      return result.works.filter(work => {
        const nameMatch = !keyword || work.name.toLowerCase().includes(keyword);
        const makerMatch = !maker || work.makerName === maker;
        const workDate = new Date(work.date);
        const validDate = workDate.toString() !== "Invalid Date";
        const startMatch = !startDate || (validDate && workDate >= startDate);
        const endMatch = !endDate || (validDate && workDate <= endDate);
        const minMatch = isNaN(minPrice) || work.price >= minPrice;
        const maxMatch = isNaN(maxPrice) || work.price <= maxPrice;
        return nameMatch && makerMatch && startMatch && endMatch && minMatch && maxMatch;
      });
    };

    let lastFilteredWorks = result.works.slice();
    let lastGenreCount = filteredGenreCount || [];
    let lastMakerCount = filteredMakerCount || [];

    const applyFilters = () => {
      const works = getFilteredWorks();
      const counts = computeCounts(works);
      lastFilteredWorks = works;
      lastGenreCount = counts.filteredGenreCount;
      lastMakerCount = counts.filteredMakerCount;
      renderSections(works, counts.filteredGenreCount, counts.filteredMakerCount);
      updateChartsWithFilteredData(works, counts.filteredGenreCount, counts.filteredMakerCount);
    };

    [keywordInput, makerSelect, startDateInput, endDateInput, minPriceInput, maxPriceInput].forEach(input => {
      input.addEventListener("input", applyFilters);
      input.addEventListener("change", applyFilters);
    });
    applyFilterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      applyFilters();
    });
    redrawChartsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      updateChartsWithFilteredData(lastFilteredWorks, lastGenreCount, lastMakerCount);
    });

    applyFilters();

    if (ui.errorLogs.length > 0) {
      const errorPre = document.createElement("pre");
      errorPre.textContent = ui.errorLogs.join("\n");
      contentDiv.appendChild(ui.createCollapsibleSection(i18n.t("errorLogTitle"), errorPre, false));
    }
  };

  ui.createCollapsibleSection = (titleText, contentNode, collapsed = false) => {
    const section = document.createElement("div");
    section.className = "collapsible-section";
    const header = document.createElement("h3");
    header.className = "collapsible-header";
    const indicator = document.createElement("span");
    indicator.style.marginRight = "5px";
    indicator.textContent = collapsed ? "►" : "▼";
    header.appendChild(indicator);
    header.appendChild(document.createTextNode(titleText));
    const content = document.createElement("div");
    content.className = "collapsible-content";
    if (contentNode) content.appendChild(contentNode);
    content.style.display = collapsed ? "none" : "block";
    header.addEventListener("click", () => {
      if (content.style.display === "none") {
        content.style.display = "block";
        indicator.textContent = "▼";
      } else {
        content.style.display = "none";
        indicator.textContent = "►";
      }
    });
    section.appendChild(header);
    section.appendChild(content);
    return section;
  };

  ui.injectStyles();
  main();
})();
