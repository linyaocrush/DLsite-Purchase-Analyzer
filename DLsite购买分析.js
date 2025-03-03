(function(){
  "use strict";
  
  // -------------------------
  // 样式注入（抽离内联样式）
  // -------------------------
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .modal-overlay {
        position: fixed;
        top:0; left:0;
        width:100%;
        height:100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .modal-container {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        max-width: 500px;
        text-align: center;
      }
      .progress-bar {
        position: fixed;
        bottom: 10px;
        left: 10px;
        width: 300px;
        height: 20px;
        background: #ddd;
        border-radius: 10px;
        overflow: hidden;
        z-index: 10000;
      }
      .inner-progress {
        height: 100%;
        width: 0%;
        background: linear-gradient(to right, #4caf50, #81c784);
        transition: width 0.3s;
      }
      .chart-container {
        position: fixed;
        background: #fff;
        border: 2px solid #ccc;
        border-radius: 8px;
        padding: 5px;
        overflow: auto;
        z-index: 10000;
      }
      .btn {
        margin: 5px;
        padding: 5px 10px;
        cursor: pointer;
      }
      .md-modal {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        width: 80%;
        max-width: 600px;
        max-height: 80%;
        overflow: auto;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
      }
      .md-modal h2 {
        margin-top: 0;
        text-align: center;
        background: linear-gradient(to right, #ff6347, #ff1493, #8a2be2, #32cd32);
        color: #fff;
        padding: 10px;
        border-radius: 4px;
      }
      .md-modal pre {
        white-space: pre-wrap;
        word-break: break-all;
        background: #f5f5f5;
        border: 1px solid #ddd;
        padding: 10px;
        max-height: 300px;
        overflow-y: auto;
        margin: 20px 0;
        border-radius: 4px;
      }
    `;
    document.head.appendChild(style);
  }
  
  // -------------------------
  // 全局变量和错误日志
  // -------------------------
  var genreChartObj = null;
  var makerChartObj = null;
  var timelineChartObj = null;
  var cumulativeChartObj = null;
  var errorLogs = [];
  
  // -------------------------
  // 通用工具函数
  // -------------------------
  function styledLog(message, style = "", type = "log") {
    const logFns = { log: console.log, warn: console.warn, error: console.error, info: console.info };
    logFns[type](`%c${message}`, style);
  }
  
  function displayTable(data, headers) {
    const tableData = data.map(row => {
      let obj = {};
      headers.forEach((header, i) => { obj[header] = row[i]; });
      return obj;
    });
    console.table(tableData);
  }
  
  function updateProgressBar(progress) {
    let progressBar = document.getElementById("progressBar");
    if (!progressBar) {
      progressBar = document.createElement("div");
      progressBar.id = "progressBar";
      progressBar.className = "progress-bar";
      const innerBar = document.createElement("div");
      innerBar.id = "innerProgressBar";
      innerBar.className = "inner-progress";
      progressBar.appendChild(innerBar);
      document.body.appendChild(progressBar);
    }
    document.getElementById("innerProgressBar").style.width = progress + "%";
  }
  
  function createChartContainer(id, top, left, width, height) {
    let container = document.getElementById(id);
    if (!container) {
      container = document.createElement("div");
      container.id = id;
      container.className = "chart-container";
      container.style.top = top;
      container.style.left = left;
      container.style.width = width;
      container.style.height = height;
      document.body.appendChild(container);
    }
    return container;
  }
  
  // -------------------------
  // 淡入淡出动画
  // -------------------------
  function fadeIn(element) {
    element.style.opacity = 0;
    setTimeout(() => { element.style.opacity = 1; }, 10);
  }
  function fadeOut(element, callback) {
    element.style.opacity = 0;
    setTimeout(callback, 300);
  }
  
  // -------------------------
  // 统一创建模态窗口（抽离公共代码）
  // -------------------------
  function createModal(maxWidth) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    fadeIn(overlay);
    const modal = document.createElement("div");
    modal.className = "modal-container";
    modal.style.maxWidth = maxWidth || "500px";
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    return { overlay, modal };
  }
  
  function customChoice(message, options) {
    return new Promise(resolve => {
      const { overlay, modal } = createModal("500px");
      const msgDiv = document.createElement("div");
      msgDiv.innerHTML = message;
      modal.appendChild(msgDiv);
      const btnContainer = document.createDocumentFragment();
      options.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt.label;
        btn.className = "btn";
        btn.addEventListener("click", () => {
          fadeOut(overlay, () => { document.body.removeChild(overlay); resolve(opt.value); });
        });
        btnContainer.appendChild(btn);
      });
      modal.appendChild(btnContainer);
    });
  }
  
  function customAlert(message) {
    return new Promise(resolve => {
      const { overlay, modal } = createModal("400px");
      const msgDiv = document.createElement("div");
      msgDiv.innerHTML = message;
      modal.appendChild(msgDiv);
      const btn = document.createElement("button");
      btn.textContent = "确定";
      btn.className = "btn";
      btn.addEventListener("click", () => { fadeOut(overlay, () => { document.body.removeChild(overlay); resolve(); }); });
      modal.appendChild(btn);
    });
  }
  
  function customPrompt(message, defaultValue = "") {
    return new Promise(resolve => {
      const { overlay, modal } = createModal("400px");
      const msgDiv = document.createElement("div");
      msgDiv.innerHTML = message;
      modal.appendChild(msgDiv);
      const input = document.createElement("input");
      input.type = "text"; input.value = defaultValue;
      input.style.width = "80%";
      input.style.marginTop = "15px";
      input.style.padding = "5px";
      modal.appendChild(input);
      const btnContainer = document.createElement("div");
      btnContainer.style.marginTop = "15px";
      const okBtn = document.createElement("button");
      okBtn.textContent = "确定";
      okBtn.className = "btn";
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "取消";
      cancelBtn.className = "btn";
      okBtn.addEventListener("click", () => { fadeOut(overlay, () => { document.body.removeChild(overlay); resolve(input.value); }); });
      cancelBtn.addEventListener("click", () => { fadeOut(overlay, () => { document.body.removeChild(overlay); resolve(null); }); });
      btnContainer.appendChild(okBtn);
      btnContainer.appendChild(cancelBtn);
      modal.appendChild(btnContainer);
    });
  }
  
  function customConfirm(message) {
    return new Promise(resolve => {
      const { overlay, modal } = createModal("400px");
      const msgDiv = document.createElement("div");
      msgDiv.innerHTML = message;
      modal.appendChild(msgDiv);
      const btnContainer = document.createElement("div");
      btnContainer.style.marginTop = "15px";
      const okBtn = document.createElement("button");
      okBtn.textContent = "确定";
      okBtn.className = "btn";
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "取消";
      cancelBtn.className = "btn";
      okBtn.addEventListener("click", () => { fadeOut(overlay, () => { document.body.removeChild(overlay); resolve(true); }); });
      cancelBtn.addEventListener("click", () => { fadeOut(overlay, () => { document.body.removeChild(overlay); resolve(false); }); });
      btnContainer.appendChild(okBtn);
      btnContainer.appendChild(cancelBtn);
      modal.appendChild(btnContainer);
    });
  }
  
  // -------------------------
  // 文件导出相关函数
  // -------------------------
  function exportCSV(data, filename) {
    const csvContent = data.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
  }
  
  // -------------------------
  // Chart.js 加载（异步加载）
  // -------------------------
  async function loadChartJs() {
    if (typeof Chart === "undefined") {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/chart.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
  }
  
  // -------------------------
  // fetchUrlAsync：统一请求封装及错误处理
  // -------------------------
  async function fetchUrlAsync(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(response.statusText);
      return await response.text();
    } catch (e) {
      errorLogs.push("Error fetching " + url + ": " + e);
      return "";
    }
  }
  
  // -------------------------
  // 图表绘制函数
  // -------------------------
  function drawGenreChart(filteredGenreCount) {
    const container = createChartContainer("chartContainer1", "0", "0", "50vw", "50vh");
    container.innerHTML = `<h3 style="text-align:center; margin: 0;">作品类型统计</h3>`;
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "calc(100% - 30px)";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (genreChartObj) { genreChartObj.destroy(); }
    genreChartObj = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: filteredGenreCount.map(item => item[0]),
        datasets: [{
          label: '作品数目',
          data: filteredGenreCount.map(item => item[1]),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1
        }]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });
  }
  
  function drawMakerChart(filteredMakerCount) {
    const container = createChartContainer("chartContainer2", "0", "50vw", "50vw", "50vh");
    container.innerHTML = `<h3 style="text-align:center; margin: 0;">制作组统计</h3>`;
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "calc(100% - 30px)";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (makerChartObj) { makerChartObj.destroy(); }
    makerChartObj = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: filteredMakerCount.map(item => item[0]),
        datasets: [{
          label: '作品数目',
          data: filteredMakerCount.map(item => item[1]),
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1
        }]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });
  }
  
  function drawTimelineChart(works) {
    const groups = {};
    works.forEach(work => {
      groups[work.date] = (groups[work.date] || 0) + 1;
    });
    const sortedDates = Object.keys(groups).sort();
    const counts = sortedDates.map(date => groups[date]);
    const container = createChartContainer("chartContainer3", "50vh", "0", "50vw", "50vh");
    container.innerHTML = `<h3 style="text-align:center; margin: 0;">每日购买数量</h3>`;
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "calc(100% - 30px)";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (timelineChartObj) { timelineChartObj.destroy(); }
    timelineChartObj = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sortedDates,
        datasets: [{
          label: '每日购买数量',
          data: counts,
          fill: false,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: { title: { display: true, text: '购买日期' } },
          y: { beginAtZero: true, title: { display: true, text: '购买数量' } }
        }
      }
    });
  }
  
  function drawCumulativeChart(works) {
    const groups = {};
    works.forEach(work => {
      groups[work.date] = (groups[work.date] || 0) + work.price;
    });
    const sortedDates = Object.keys(groups).sort();
    let cumulative = [];
    let total = 0;
    sortedDates.forEach(date => { total += groups[date]; cumulative.push(total); });
    const container = createChartContainer("chartContainer4", "50vh", "50vw", "50vw", "50vh");
    container.innerHTML = `<h3 style="text-align:center; margin: 0;">累计消费金额（日元）</h3>`;
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "calc(100% - 30px)";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (cumulativeChartObj) { cumulativeChartObj.destroy(); }
    cumulativeChartObj = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sortedDates,
        datasets: [{
          label: '累计消费金额',
          data: cumulative,
          fill: true,
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: { title: { display: true, text: '购买日期' } },
          y: { beginAtZero: true, title: { display: true, text: '累计金额' } }
        }
      }
    });
  }
  
  // 时间轴控制台输出
  function displayTimeline(works) {
    const groups = {};
    works.forEach(work => {
      groups[work.date] = groups[work.date] || [];
      groups[work.date].push(work);
    });
    const sortedDates = Object.keys(groups).sort();
    console.group("时间轴视图");
    sortedDates.forEach(date => {
      console.groupCollapsed(`日期：${date} （${groups[date].length} 项）`);
      const timelineData = groups[date].map(work => ({
        "作品名称": work.name,
        "制作组": work.makerName,
        "价格": work.price + " 日元"
      }));
      console.table(timelineData);
      console.groupEnd();
    });
    console.groupEnd();
  }
  
  // 数据回放动画（每日购买数量逐步展示）
  function animateTimelineChart(works) {
    const groups = {};
    works.forEach(work => {
      groups[work.date] = (groups[work.date] || 0) + 1;
    });
    const sortedDates = Object.keys(groups).sort();
    const finalCounts = sortedDates.map(date => groups[date]);
    let animatedCounts = new Array(finalCounts.length).fill(0);
    if (timelineChartObj) {
      timelineChartObj.data.labels = sortedDates;
      timelineChartObj.data.datasets[0].data = animatedCounts;
      timelineChartObj.update();
    }
    let step = 0, steps = 50;
    const interval = setInterval(() => {
      step++;
      animatedCounts = finalCounts.map(count => Math.round(count * (step / steps)));
      if (timelineChartObj) {
        timelineChartObj.data.datasets[0].data = animatedCounts;
        timelineChartObj.update();
      }
      if (step >= steps) clearInterval(interval);
    }, 100);
    styledLog("数据回放开始……", "color: #0099ff; font-weight: bold;");
  }
  
  // -------------------------
  // 清理函数：移除动态创建的 DOM 元素并重置图表变量
  // -------------------------
  function cleanup() {
    const ids = ["progressBar", "chartContainer1", "chartContainer2", "chartContainer3", "chartContainer4"];
    ids.forEach(id => {
      const elem = document.getElementById(id);
      if (elem) { elem.remove(); }
    });
    genreChartObj = makerChartObj = timelineChartObj = cumulativeChartObj = null;
  }
  
  // -------------------------
  // 数据抓取及处理（优化并发请求）
  // -------------------------
  async function processPage(doc, result, detailMode) {
    const trElms = doc.querySelectorAll(".work_list_main tr:not(.item_name)");
    let detailPromises = [];
    trElms.forEach(elm => {
      const work = {};
      work.url = elm.querySelector(".work_name a") ? elm.querySelector(".work_name a").href : "";
      work.date = elm.querySelector(".buy_date").innerText;
      work.name = elm.querySelector(".work_name").innerText.trim();
      work.genre = elm.querySelector(".work_genre span").textContent.trim();
      const priceText = elm.querySelector(".work_price").textContent.split(' /')[0];
      work.price = parseInt(priceText.replace(/\D/g, ''));
      work.makerName = elm.querySelector(".maker_name").innerText.trim();
      if (detailMode && work.url !== "") {
        detailPromises.push((async function(w) {
          try {
            styledLog(`🔍 获取作品详情: ${w.url}`, "color: #9933ff; font-weight: bold;");
            const workText = await fetchUrlAsync(w.url);
            const docWork = new DOMParser().parseFromString(workText, "text/html");
            w.mainGenre = [];
            docWork.querySelectorAll(".main_genre a").forEach(a => {
              const g = a.textContent.trim();
              w.mainGenre.push(g);
              result.genreCount.set(g, (result.genreCount.get(g) || 0) + 1);
            });
          } catch(e) {
            errorLogs.push(`Error fetching detail for ${w.url}: ${e}`);
          }
        })(work));
      }
      result.makerCount.set(work.makerName, (result.makerCount.get(work.makerName) || 0) + 1);
      result.count++;
      if (work.price > 0) result.totalPrice += work.price;
      result.works.push(work);
      if (!work.url) result.eol.push(work);
    });
    if (detailPromises.length > 0) await Promise.all(detailPromises);
  }
  
  async function fetchAllPages(dlurl, detailMode, updateProgressCallback) {
    let result = { count: 0, totalPrice: 0, works: [], genreCount: new Map(), makerCount: new Map(), eol: [] };
    // 请求第一页
    const firstPageText = await fetchUrlAsync(dlurl + "1");
    const firstDoc = new DOMParser().parseFromString(firstPageText, "text/html");
    let lastPage = 1;
    const lastPageElm = firstDoc.querySelector(".page_no ul li:last-child a");
    if (lastPageElm) { lastPage = parseInt(lastPageElm.dataset.value); }
    await processPage(firstDoc, result, detailMode);
    updateProgressCallback(1, lastPage);
    let promises = [];
    for (let i = 2; i <= lastPage; i++) {
      promises.push((async function(pageNum) {
        try {
          const pageText = await fetchUrlAsync(dlurl + pageNum);
          const doc = new DOMParser().parseFromString(pageText, "text/html");
          await processPage(doc, result, detailMode);
        } catch (e) {
          errorLogs.push(`Error fetching page ${pageNum}: ${e}`);
        }
        updateProgressCallback(pageNum, lastPage);
      })(i));
    }
    await Promise.all(promises);
    return result;
  }
  
  // -------------------------
  // 主逻辑
  // -------------------------
  async function main() {
    console.clear();
    cleanup();
    styledLog("✦ DLsite购买历史统计 ✦", "font-size: 28px; font-weight: bold; color: white; background: linear-gradient(to right, #ff6347, #ff1493, #8a2be2, #32cd32); padding: 10px; border-radius: 8px;");
    
    let detailMode = true;
    const quickView = await customChoice("是否开启快速查看消费金额？（仅统计金额）", [
      { label: "是", value: "y" },
      { label: "否", value: "n" }
    ]);
    if (quickView.toLowerCase() === "y") detailMode = false;
    
    let dlurl = "https://www.dlsite.com/maniax/mypage/userbuy/=/type/all/start/all/sort/1/order/1/page/";
    if (detailMode) {
      const typeOptionsArr = [
        { label: "0: 全部作品", value: "0" },
        { label: "12: 同人：所有", value: "12" },
        { label: "2: 同人：全年齢", value: "2" },
        { label: "1: 同人：男性向", value: "1" },
        { label: "3: 同人：女性向", value: "3" },
        { label: "13: 商业游戏：所有", value: "13" },
        { label: "9: 商业游戏：全年齢", value: "9" },
        { label: "4: 商业游戏：男性向", value: "4" },
        { label: "14: 漫画：所有", value: "14" },
        { label: "10: 漫画：全年齢", value: "10" },
        { label: "7: 漫画：男性向", value: "7" },
        { label: "11: 漫画：女性向", value: "11" }
      ];
      const typeChoice = await customChoice("请选择作品类型：", typeOptionsArr);
      if (typeChoice === "0") dlurl = dlurl.replace(/type\/[^/]+/, "type/all");
      else dlurl = dlurl.replace(/type\/[^/]+/, `type/${typeChoice}`);
    } else {
      dlurl = dlurl.replace(/type\/[^/]+/, "type/all");
    }
    
    let exchangeRate = 0.04858;
    if (detailMode) {
      const exchangeChoice = await customChoice("是否需要修改汇率？", [
        { label: "使用默认 (1人民币 = 0.04858日元)", value: "default" },
        { label: "修改汇率", value: "modify" }
      ]);
      if (exchangeChoice === "modify") {
        const newExchangeRateStr = await customPrompt("请输入新的人民币到日元的汇率（例如 0.05）：", "0.05");
        const newExchangeRate = parseFloat(newExchangeRateStr);
        if (!isNaN(newExchangeRate) && newExchangeRate > 0) exchangeRate = newExchangeRate;
        else styledLog("❌ 输入无效，使用默认汇率", "color: red; font-weight: bold;", "error");
      } else {
        styledLog("✔️ 使用默认汇率 1人民币 = 0.04858日元", "color: green; font-weight: bold;", "info");
      }
    }
    
    function updatePageProgress(pageNum, totalPages) {
      const progress = Math.floor((pageNum / totalPages) * 100);
      updateProgressBar(progress);
      styledLog(`📄 正在获取第 ${pageNum}/${totalPages} 页 [${'='.repeat(progress/2)}${' '.repeat(50 - progress/2)}] ${progress}%`, "color: #0066cc; font-weight: bold;");
    }
    
    console.group("📄 页面抓取进度");
    const result = await fetchAllPages(dlurl, detailMode, updatePageProgress);
    console.groupEnd();
    
    const excludeResponse = await customPrompt("请输入要排除的最少作品数目（例如输入 3 表示排除数目小于 3 的作品类型）：", "0");
    let excludeThreshold = 0;
    if (excludeResponse) {
      excludeThreshold = parseInt(excludeResponse);
      if (isNaN(excludeThreshold) || excludeThreshold < 0) {
        styledLog("❌ 无效的输入，使用默认值 0（不过滤）", "color: red; font-weight: bold;", "error");
        excludeThreshold = 0;
      }
    } else {
      styledLog("ℹ️ 未输入数值，使用默认值 0（不过滤）", "color: #666666; font-weight: bold;", "info");
    }
    
    result.genreCount = [...result.genreCount.entries()].sort((a, b) => b[1] - a[1]);
    result.makerCount = [...result.makerCount.entries()].sort((a, b) => b[1] - a[1]);
    const filteredGenreCount = excludeThreshold === 0 ? result.genreCount : result.genreCount.filter(([, count]) => count >= excludeThreshold);
    const filteredMakerCount = excludeThreshold === 0 ? result.makerCount : result.makerCount.filter(([, count]) => count >= excludeThreshold);
    
    const showChart = await customChoice("是否显示图表数据展示？", [
      { label: "显示", value: "y" },
      { label: "不显示", value: "n" }
    ]);
    if (showChart.toLowerCase() === "y") {
      await loadChartJs();
      drawGenreChart(filteredGenreCount);
      drawMakerChart(filteredMakerCount);
      drawTimelineChart(result.works);
      drawCumulativeChart(result.works);
    }
    
    const saveFile = await customChoice("统计完成！是否需要保存为文件？", [
      { label: "保存", value: "y" },
      { label: "不保存", value: "n" }
    ]);
    if (saveFile.toLowerCase() === "y") {
      const fileFormat = await customChoice("请选择保存格式：", [
        { label: "全部下载", value: "0" },
        { label: "仅保存 MD", value: "1" },
        { label: "仅保存 CSV", value: "2" }
      ]);
      const markdownContent = `
# DLsite购买历史查询报告

> 数据统计报告，生成时间：${new Date().toLocaleString()}

---

## 统计概览

- **购买总数**：${result.count} 部
- **总消费金额**：${result.totalPrice} 日元 (${(result.totalPrice * exchangeRate).toFixed(2)} 人民币)

---

## 各类型作品数排名

| 类型 | 作品数目 |
| ---- | -------- |
${filteredGenreCount.map(([type, count]) => `| ${type} | ${count} |`).join("\n")}

---

## 各制作组作品数排名

| 制作组 | 作品数目 |
| ------ | -------- |
${filteredMakerCount.map(([maker, count]) => `| ${maker} | ${count} |`).join("\n")}

---

## 已下架作品

${result.eol.length > 0 ? (
`| 购买日期 | 制作组 | 作品名称 | 价格 |
| -------- | ------ | -------- | ---- |
${result.eol.map(eol => `| ${eol.date} | ${eol.makerName} | ${eol.name} | ${eol.price} 日元 |`).join("\n")}`
) : "暂无已下架作品"}
`;
      if (fileFormat === "1") {
        showMarkdownPreviewAndDownload(markdownContent, "DLsite购买历史查询.md");
      } else if (fileFormat === "0") {
        showMarkdownPreviewAndDownload(markdownContent, "DLsite购买历史查询.md");
        exportCSV([
          ["统计项目", "数量/金额"],
          ["购买总数", result.count],
          ["总消费金额", `${result.totalPrice} 日元 (${(result.totalPrice * exchangeRate).toFixed(2)} 人民币)`],
          ...filteredGenreCount,
          ...filteredMakerCount,
          ...result.eol.map(eol => [eol.date, eol.makerName, eol.name, `${eol.price} 日元`])
        ], "DLsite购买历史查询.csv");
      } else if (fileFormat === "2") {
        exportCSV([
          ["统计项目", "数量/金额"],
          ["购买总数", result.count],
          ["总消费金额", `${result.totalPrice} 日元 (${(result.totalPrice * exchangeRate).toFixed(2)} 人民币)`],
          ...filteredGenreCount,
          ...filteredMakerCount,
          ...result.eol.map(eol => [eol.date, eol.makerName, eol.name, `${eol.price} 日元`])
        ], "DLsite购买历史查询.csv");
      }
      await customAlert("文件保存操作已完成！");
    }
    
    console.group("统计结果展示");
    styledLog("☆ 统计结果 ☆", "font-size: 22px; font-weight: bold; color: #fff; background: linear-gradient(to right, #ff6347, #ff1493, #8a2be2, #32cd32); padding: 10px; border-radius: 8px;");
    displayTable([ [`购买总数`, `${result.count} 部`], [`总消费金额`, `${result.totalPrice} 日元 (${(result.totalPrice * exchangeRate).toFixed(2)} 人民币)`] ], ["统计项目", "数量/金额"]);
    styledLog("☆ 各类型作品数排名 ☆", "font-size: 20px; font-weight: bold; color: #fff; background: linear-gradient(to right, #ff7f50, #ff69b4); padding: 5px; border-radius: 8px;");
    displayTable(filteredGenreCount.map(([type, count]) => [type, count.toString()]), ["类型", "作品数目"]);
    styledLog("☆ 各制作组作品数排名 ☆", "font-size: 20px; font-weight: bold; color: #fff; background: linear-gradient(to right, #87cefa, #32cd32); padding: 5px; border-radius: 8px;");
    displayTable(filteredMakerCount.map(([maker, count]) => [maker, count.toString()]), ["制作组", "作品数目"]);
    if (result.eol.length > 0) {
      styledLog("☆ 已下架作品 ☆", "font-size: 20px; font-weight: bold; color: #fff; background: linear-gradient(to right, #ff4500, #ff1493); padding: 5px; border-radius: 8px;");
      displayTable(result.eol.map(eol => [eol.date, eol.makerName, eol.name, `${eol.price} 日元`]), ["购买日期", "制作组", "作品名称", "价格"]);
    } else {
      styledLog("ℹ️ 暂无已下架作品", "font-size: 18px; color: #666;", "info");
    }
    console.groupEnd();
    
    displayTimeline(result.works);
    
    styledLog("★ 本脚本由凛遥crush修改制作 ★\n请在GitHub上为本项目点击 Star，谢谢！", "font-size: 18px; font-weight: bold; color: #fff; background: #333; padding: 5px; border-radius: 5px;");
    styledLog("★ 项目地址：https://github.com/linyaocrush/DLsite-Purchase-Analyzer ★", "font-size: 18px; font-weight: bold; color: #fff; background: #333; padding: 5px; border-radius: 5px;");
    if (errorLogs.length > 0) {
      styledLog("⚠️ 错误日志记录：", "color: red; font-weight: bold;", "error");
      console.error(errorLogs);
    }
  }
  
  // -------------------------
  // Markdown预览及下载窗口
  // -------------------------
  function showMarkdownPreviewAndDownload(markdownContent, fileName) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.style.background = "rgba(0,0,0,0.7)";
    fadeIn(overlay);
    const modal = document.createElement("div");
    modal.className = "md-modal";
    const title = document.createElement("h2");
    title.textContent = "Markdown 文件预览";
    const pre = document.createElement("pre");
    pre.textContent = markdownContent;
    const btnContainer = document.createElement("div");
    btnContainer.style.textAlign = "center";
    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "下载 MD 文件";
    downloadBtn.className = "btn";
    downloadBtn.addEventListener("click", () => {
      const blob = new Blob([markdownContent], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = fileName; a.click();
      fadeOut(overlay, () => { document.body.removeChild(overlay); });
    });
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "关闭预览";
    closeBtn.className = "btn";
    closeBtn.addEventListener("click", () => { fadeOut(overlay, () => { document.body.removeChild(overlay); }); });
    btnContainer.appendChild(downloadBtn);
    btnContainer.appendChild(closeBtn);
    modal.appendChild(title);
    modal.appendChild(pre);
    modal.appendChild(btnContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }
  
  // -------------------------
  // 全局命令（方便调试）
  // -------------------------
  window.clearLogs = function() { console.clear(); };
  window.reloadData = async function() { console.clear(); cleanup(); try { await main(); } catch(e) { console.error("reloadData encountered an error:", e); } };
  
  // -------------------------
  // 程序入口
  // -------------------------
  injectStyles();
  (async function(){
    if (!window.location.hostname.includes("dlsite.com")) {
      const jump = await customChoice("当前网页不是DLsite页面，是否自动跳转到DLsite购买页面？", [
        { label: "跳转", value: "y" },
        { label: "取消", value: "n" }
      ]);
      if (jump === "y") { window.location.href = "https://www.dlsite.com/maniax/mypage/userbuy"; return; }
    }
    await main();
  })();
  
})();
