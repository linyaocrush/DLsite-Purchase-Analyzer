(function(){
  "use strict";
  
  // -------------------------
  // 样式注入（抽离内联样式）
  // -------------------------
  const injectStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .modal-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100000;
        opacity: 0;
      }
      .modal-container {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        max-width: 500px;
        text-align: center;
        transform: scale(0.8);
        opacity: 0;
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
        transition: width 0.2s;
      }
      .chart-container {
        background: #fff;
        border: 2px solid #ccc;
        border-radius: 8px;
        overflow: hidden;
        z-index: 10000;
        position: absolute;
      }
      .drag-button {
        position: absolute;
        top: 5px;
        left: 5px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #007BFF;
        border: 2px solid white;
        cursor: grab;
        user-select: none;
        z-index: 100;
        text-align: center;
        line-height: 24px;
        color: white;
        font-size: 16px;
      }
      .chart-content {
        width: 100%;
        height: calc(100% - 30px);
        margin-top: 30px;
        overflow: auto;
      }
      .btn {
        margin: 5px;
        padding: 5px 10px;
        cursor: pointer;
        border: none;
        background: #4caf50;
        color: #fff;
        border-radius: 4px;
        transition: background 0.2s;
      }
      .btn:hover {
        background: #45a049;
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
        transform: scale(0.8);
        opacity: 0;
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
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10px;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: center;
      }
      th {
        background: #f2f2f2;
      }
      /* 折叠面板样式 */
      .collapsible-section {
        border: 1px solid #ccc;
        margin-bottom: 10px;
        border-radius: 4px;
      }
      .collapsible-header {
        margin: 0;
        padding: 5px 10px;
        background: #f2f2f2;
        cursor: pointer;
        user-select: none;
      }
      .collapsible-content {
        padding: 10px;
      }
    `;
    document.head.appendChild(style);
  };
  
  // -------------------------
  // 全局变量和错误日志（采用 let/const 替换 var）
  // -------------------------
  let genreChartObj = null;
  let makerChartObj = null;
  let timelineChartObj = null;
  let cumulativeChartObj = null;
  let errorLogs = [];
  let genreChartType = 'bar';
  let makerChartType = 'bar';
  
  // -------------------------
  // 通用日志输出（使用箭头函数）
  // -------------------------
  const styledLog = (message, style = "", type = "log") => {
    const logFns = { log: console.log, warn: console.warn, error: console.error, info: console.info };
    logFns[type](`%c${message}`, style);
  };
  window.styledLog = styledLog;
  
  // -------------------------
  // 创建折叠面板（在标题前添加一个箭头指示）
  // -------------------------
  const createCollapsibleSection = (titleText, contentHtml, collapsed = false) => {
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
    content.innerHTML = contentHtml;
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
  
  // -------------------------
  // 创建结果窗口（与数据图窗口类似，可拖拽、缩放，默认尺寸为数据图的2倍）
  // -------------------------
  const createResultWindow = () => {
    let container = document.getElementById("resultWindow");
    if (!container) {
      container = document.createElement("div");
      container.id = "resultWindow";
      container.className = "chart-container";
      // 默认宽 1000px，高 800px
      container.style.top = "200px";
      container.style.left = "200px";
      container.style.width = "1000px";
      container.style.height = "800px";
      container.style.minWidth = "300px";
      container.style.minHeight = "200px";
      container.style.resize = "both";
      // 设置容器内自己滚动，而不是整个网页滚动
      container.style.overflowY = "auto";
      container.style.overflowX = "hidden";
      document.body.appendChild(container);
      
      const dragButton = document.createElement("div");
      dragButton.className = "drag-button";
      dragButton.innerHTML = "≡";
      container.appendChild(dragButton);
      
      const contentDiv = document.createElement("div");
      contentDiv.className = "chart-content";
      container.appendChild(contentDiv);
      
      makeDraggable(container, dragButton);
      return contentDiv;
    }
    return container.querySelector(".chart-content");
  };
  
  // -------------------------
  // 将所有统计及相关信息显示到结果窗口中
  // -------------------------
  const displayResults = (result, exchangeRate, filteredGenreCount, filteredMakerCount) => {
    const contentDiv = createResultWindow();
    contentDiv.innerHTML = "";
    
    const overviewHtml = `
      <table>
        <tr>
          <th>统计项目</th>
          <th>数量/金额</th>
        </tr>
        <tr>
          <td>购买总数</td>
          <td>${result.count} 部</td>
        </tr>
        <tr>
          <td>总消费金额</td>
          <td>${result.totalPrice} 日元 (${(result.totalPrice * exchangeRate).toFixed(2)} 人民币)</td>
        </tr>
      </table>
    `;
    contentDiv.appendChild(createCollapsibleSection("统计概览", overviewHtml, false));
    
    const genreHtml = `
      <table>
        <tr>
          <th>类型</th>
          <th>作品数目</th>
        </tr>
        ${filteredGenreCount.map(([type, count]) => `
          <tr>
            <td>${type}</td>
            <td>${count}</td>
          </tr>
        `).join('')}
      </table>
    `;
    contentDiv.appendChild(createCollapsibleSection("各类型作品数排名", genreHtml, false));
    
    const makerHtml = `
      <table>
        <tr>
          <th>制作组</th>
          <th>作品数目</th>
        </tr>
        ${filteredMakerCount.map(([maker, count]) => `
          <tr>
            <td>${maker}</td>
            <td>${count}</td>
          </tr>
        `).join('')}
      </table>
    `;
    contentDiv.appendChild(createCollapsibleSection("各制作组作品数排名", makerHtml, false));
    
    const eolHtml = result.eol.length > 0 ? `
      <table>
        <tr>
          <th>购买日期</th>
          <th>制作组</th>
          <th>作品名称</th>
          <th>价格</th>
        </tr>
        ${result.eol.map(eol => `
          <tr>
            <td>${eol.date}</td>
            <td>${eol.makerName}</td>
            <td>${eol.name}</td>
            <td>${eol.price} 日元</td>
          </tr>
        `).join('')}
      </table>
    ` : `<p>暂无已下架作品</p>`;
    contentDiv.appendChild(createCollapsibleSection("已下架作品", eolHtml, false));
    
    let timelineHtml = "";
    const timelineGroups = {};
    result.works.forEach(work => {
      if(!timelineGroups[work.date]) timelineGroups[work.date] = [];
      timelineGroups[work.date].push(work);
    });
    const sortedDates = Object.keys(timelineGroups).sort();
    sortedDates.forEach(date => {
      let tableHtml = `<table>
         <tr>
            <th>作品名称</th>
            <th>制作组</th>
            <th>价格</th>
         </tr>`;
      timelineGroups[date].forEach(work => {
         tableHtml += `<tr>
           <td>${work.name}</td>
           <td>${work.makerName}</td>
           <td>${work.price} 日元</td>
         </tr>`;
      });
      tableHtml += `</table>`;
      timelineHtml += `<div><strong>${date} (${timelineGroups[date].length} 项)</strong>${tableHtml}</div>`;
    });
    contentDiv.appendChild(createCollapsibleSection("时间轴视图", timelineHtml, true));
    
    const authorHtml = `
      <p>★ 本脚本由 凛遥crush 修改制作 ★</p>
      <p>★ 项目地址：<a href="https://github.com/linyaocrush/DLsite-Purchase-Analyzer" target="_blank">https://github.com/linyaocrush/DLsite-Purchase-Analyzer</a></p>
    `;
    contentDiv.appendChild(createCollapsibleSection("作者信息", authorHtml, false));
    
    if (errorLogs.length > 0) {
      const errorHtml = `<pre>${errorLogs.join("\n")}</pre>`;
      contentDiv.appendChild(createCollapsibleSection("错误日志", errorHtml, false));
    }
  };
  
  // -------------------------
  // 进度条更新
  // -------------------------
  const updateProgressBar = (progress) => {
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
  };
  
  // -------------------------
  // 创建可拖拽并支持缩放的窗口（数据图和结果窗口均采用）
  // -------------------------
  const createChartContainer = (id, top, left, width = "500px", height = "400px") => {
    let container = document.getElementById(id);
    if (!container) {
      container = document.createElement("div");
      container.id = id;
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
      document.body.appendChild(container);
      
      const dragButton = document.createElement("div");
      dragButton.className = "drag-button";
      dragButton.innerHTML = "≡";
      container.appendChild(dragButton);
      
      const contentDiv = document.createElement("div");
      contentDiv.className = "chart-content";
      container.appendChild(contentDiv);
      
      makeDraggable(container, dragButton);
    }
    return container;
  };
  
  // -------------------------
  // 让窗口可拖拽（使用箭头函数，采用 pageX/pageY 避免拖动时跳顶）
  // -------------------------
  const makeDraggable = (element, handle) => {
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
  };
  
  // -------------------------
  // 动画函数：使用 gsap 或 CSS 过渡
  // -------------------------
  const fadeIn = (element) => {
    if (typeof gsap !== "undefined") {
      gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" });
    } else {
      element.style.opacity = 0;
      element.style.transition = "opacity 0.2s ease-out";
      setTimeout(() => { element.style.opacity = 1; }, 10);
    }
  };
  const fadeOut = (element, callback) => {
    if (typeof gsap !== "undefined") {
      gsap.to(element, { opacity: 0, duration: 0.2, ease: "power2.in", onComplete: callback });
    } else {
      element.style.opacity = 0;
      setTimeout(callback, 200);
    }
  };
  const animateModalIn = (element) => {
    if (typeof gsap !== "undefined") {
      gsap.fromTo(element, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(1.7)" });
    } else {
      element.style.transform = "scale(0.8)";
      element.style.opacity = "0";
      element.style.transition = "transform 0.2s ease-out, opacity 0.2s ease-out";
      setTimeout(() => {
        element.style.transform = "scale(1)";
        element.style.opacity = "1";
      }, 10);
    }
  };
  const animateModalOut = (element, callback) => {
    if (typeof gsap !== "undefined") {
      gsap.to(element, { scale: 0.8, opacity: 0, duration: 0.2, ease: "back.in(1.7)", onComplete: callback });
    } else {
      element.style.transform = "scale(1)";
      element.style.opacity = "1";
      element.style.transition = "transform 0.2s ease-in, opacity 0.2s ease-in";
      setTimeout(() => {
        element.style.transform = "scale(0.8)";
        element.style.opacity = "0";
        setTimeout(callback, 200);
      }, 10);
    }
  };
  
  // -------------------------
  // 统一关闭模态窗口
  // -------------------------
  const closeModal = (overlay, modal, callback) => {
    animateModalOut(modal, () => {
      fadeOut(overlay, () => {
        document.body.removeChild(overlay);
        if(callback) callback();
      });
    });
  };
  
  // -------------------------
  // 统一创建模态窗口（用于交互提示）
  // -------------------------
  const createModal = (maxWidth) => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    fadeIn(overlay);
    const modal = document.createElement("div");
    modal.className = "modal-container";
    modal.style.maxWidth = maxWidth || "500px";
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    animateModalIn(modal);
    return { overlay, modal };
  };
  
  const customChoice = (message, options) => {
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
        btn.addEventListener("click", () => { closeModal(overlay, modal, () => { resolve(opt.value); }); });
        btnContainer.appendChild(btn);
      });
      modal.appendChild(btnContainer);
    });
  };
  
  const customAlert = (message) => {
    return new Promise(resolve => {
      const { overlay, modal } = createModal("400px");
      const msgDiv = document.createElement("div");
      msgDiv.innerHTML = message;
      modal.appendChild(msgDiv);
      const btn = document.createElement("button");
      btn.textContent = "确定";
      btn.className = "btn";
      btn.addEventListener("click", () => { closeModal(overlay, modal, resolve); });
      modal.appendChild(btn);
    });
  };
  
  const customPrompt = (message, defaultValue = "") => {
    return new Promise(resolve => {
      const { overlay, modal } = createModal("400px");
      const msgDiv = document.createElement("div");
      msgDiv.innerHTML = message;
      modal.appendChild(msgDiv);
      const input = document.createElement("input");
      input.type = "text"; 
      input.value = defaultValue;
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
      okBtn.addEventListener("click", () => { closeModal(overlay, modal, () => { resolve(input.value); }); });
      cancelBtn.addEventListener("click", () => { closeModal(overlay, modal, () => { resolve(null); }); });
      btnContainer.appendChild(okBtn);
      btnContainer.appendChild(cancelBtn);
      modal.appendChild(btnContainer);
    });
  };
  
  const customConfirm = (message) => {
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
      okBtn.addEventListener("click", () => { closeModal(overlay, modal, () => { resolve(true); }); });
      cancelBtn.addEventListener("click", () => { closeModal(overlay, modal, () => { resolve(false); }); });
      btnContainer.appendChild(okBtn);
      btnContainer.appendChild(cancelBtn);
      modal.appendChild(btnContainer);
    });
  };
  
  // -------------------------
  // 文件导出相关函数
  // -------------------------
  const exportCSV = (data, filename) => {
    const csvContent = data.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
  };
  
  // -------------------------
  // Chart.js 加载（异步加载）
  // -------------------------
  const loadChartJs = async () => {
    if (typeof Chart === "undefined") {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/chart.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
  };
  
  // -------------------------
  // fetchUrlAsync：统一请求封装及错误处理
  // -------------------------
  const fetchUrlAsync = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(response.statusText);
      return await response.text();
    } catch (e) {
      errorLogs.push("Error fetching " + url + ": " + e);
      return "";
    }
  };
  
  // -------------------------
  // 图表绘制函数：作品类型统计（仅在 detailMode 为 true 时显示）
  // -------------------------
  const drawGenreChart = (filteredGenreCount) => {
    const container = createChartContainer("chartContainer1", "100px", "100px");
    const contentDiv = container.querySelector(".chart-content");
    contentDiv.innerHTML = `<h3 style="text-align:center; margin: 0;">
      作品类型统计 
      <button id="toggleGenreChartBtn" class="btn" style="margin-left: 10px; font-size: 12px;">
        切换为${genreChartType === 'bar' ? '饼状图' : '柱状图'}
      </button>
    </h3>`;
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "calc(100% - 30px)";
    contentDiv.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (genreChartObj) { genreChartObj.destroy(); }
    
    let backgroundColors, borderColors, options;
    if (genreChartType === 'pie') {
      backgroundColors = filteredGenreCount.map((_, i) => `hsl(${(i * 360 / filteredGenreCount.length)}, 70%, 70%)`);
      borderColors = filteredGenreCount.map((_, i) => `hsl(${(i * 360 / filteredGenreCount.length)}, 70%, 50%)`);
      options = {};
    } else {
      backgroundColors = "rgba(75, 192, 192, 0.6)";
      borderColors = "rgba(75, 192, 192, 1)";
      options = { scales: { y: { beginAtZero: true } } };
    }
    
    genreChartObj = new Chart(ctx, {
      type: genreChartType,
      data: {
        labels: filteredGenreCount.map(item => item[0]),
        datasets: [{
          label: "作品数目",
          data: filteredGenreCount.map(item => item[1]),
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
          genreChartType = genreChartType === 'bar' ? 'pie' : 'bar';
          drawGenreChart(filteredGenreCount);
        });
      }
    }, 0);
  };
  
  // -------------------------
  // 图表绘制函数：制作组统计（添加切换按钮）
  // -------------------------
  const drawMakerChart = (filteredMakerCount) => {
    const container = createChartContainer("chartContainer2", "100px", "650px");
    const contentDiv = container.querySelector(".chart-content");
    contentDiv.innerHTML = `<h3 style="text-align:center; margin: 0;">
      制作组统计 
      <button id="toggleMakerChartBtn" class="btn" style="margin-left: 10px; font-size: 12px;">
        切换为${makerChartType === 'bar' ? '饼状图' : '柱状图'}
      </button>
    </h3>`;
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "calc(100% - 30px)";
    contentDiv.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (makerChartObj) { makerChartObj.destroy(); }
    
    let backgroundColors, borderColors, options;
    if (makerChartType === 'pie') {
      backgroundColors = filteredMakerCount.map((_, i) => `hsl(${(i * 360 / filteredMakerCount.length)}, 70%, 70%)`);
      borderColors = filteredMakerCount.map((_, i) => `hsl(${(i * 360 / filteredMakerCount.length)}, 70%, 50%)`);
      options = {};
    } else {
      backgroundColors = "rgba(153, 102, 255, 0.6)";
      borderColors = "rgba(153, 102, 255, 1)";
      options = { scales: { y: { beginAtZero: true } } };
    }
    
    makerChartObj = new Chart(ctx, {
      type: makerChartType,
      data: {
        labels: filteredMakerCount.map(item => item[0]),
        datasets: [{
          label: "作品数目",
          data: filteredMakerCount.map(item => item[1]),
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
          makerChartType = makerChartType === 'bar' ? 'pie' : 'bar';
          drawMakerChart(filteredMakerCount);
        });
      }
    }, 0);
  };
  
  const drawTimelineChart = (works) => {
    const groups = {};
    works.forEach(work => {
      groups[work.date] = (groups[work.date] || 0) + 1;
    });
    const sortedDates = Object.keys(groups).sort();
    const counts = sortedDates.map(date => groups[date]);
    const container = createChartContainer("chartContainer3", "550px", "100px");
    const contentDiv = container.querySelector(".chart-content");
    contentDiv.innerHTML = `<h3 style="text-align:center; margin: 0;">每日购买数量</h3>`;
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "calc(100% - 30px)";
    contentDiv.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (timelineChartObj) { timelineChartObj.destroy(); }
    timelineChartObj = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sortedDates,
        datasets: [{
          label: "每日购买数量",
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
  };
  
  const drawCumulativeChart = (works) => {
    const groups = {};
    works.forEach(work => {
      groups[work.date] = (groups[work.date] || 0) + work.price;
    });
    const sortedDates = Object.keys(groups).sort();
    let cumulative = [];
    let total = 0;
    sortedDates.forEach(date => { total += groups[date]; cumulative.push(total); });
    const container = createChartContainer("chartContainer4", "550px", "650px");
    const contentDiv = container.querySelector(".chart-content");
    contentDiv.innerHTML = `<h3 style="text-align:center; margin: 0;">累计消费金额（日元）</h3>`;
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "calc(100% - 30px)";
    contentDiv.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (cumulativeChartObj) { cumulativeChartObj.destroy(); }
    cumulativeChartObj = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sortedDates,
        datasets: [{
          label: "累计消费金额",
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
  };
  
  // -------------------------
  // 清理函数：移除特定 DOM 元素并重置图表变量
  // -------------------------
  const cleanup = () => {
    const ids = ["progressBar", "chartContainer1", "chartContainer2", "chartContainer3", "chartContainer4", "resultWindow"];
    ids.forEach(id => {
      const elem = document.getElementById(id);
      if (elem) { elem.remove(); }
    });
    genreChartObj = makerChartObj = timelineChartObj = cumulativeChartObj = null;
  };
  
  // 清理所有残留的模态遮罩层，防止页面变灰
  const cleanupOverlays = () => {
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
  };
  
  // -------------------------
  // 数据抓取及处理
  // -------------------------
  const processPage = async (doc, result, detailMode) => {
    const trElms = doc.querySelectorAll(".work_list_main tr:not(.item_name)");
    const detailPromises = [];
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
        detailPromises.push((async (w) => {
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
  };
  
  const fetchAllPages = async (dlurl, detailMode, updateProgressCallback) => {
    const result = { count: 0, totalPrice: 0, works: [], genreCount: new Map(), makerCount: new Map(), eol: [] };
    const firstPageText = await fetchUrlAsync(dlurl + "1");
    const firstDoc = new DOMParser().parseFromString(firstPageText, "text/html");
    let lastPage = 1;
    const lastPageElm = firstDoc.querySelector(".page_no ul li:last-child a");
    if (lastPageElm) { lastPage = parseInt(lastPageElm.dataset.value); }
    await processPage(firstDoc, result, detailMode);
    updateProgressCallback(1, lastPage);
    const promises = [];
    for (let i = 2; i <= lastPage; i++) {
      promises.push((async (pageNum) => {
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
  };
  
  // -------------------------
  // 主逻辑
  // -------------------------
  const main = async () => {
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
        { label: "2: 同人：全年龄", value: "2" },
        { label: "1: 同人：男性向", value: "1" },
        { label: "3: 同人：女性向", value: "3" },
        { label: "13: 商业游戏：所有", value: "13" },
        { label: "9: 商业游戏：全年龄", value: "9" },
        { label: "4: 商业游戏：男性向", value: "4" },
        { label: "14: 漫画：所有", value: "14" },
        { label: "10: 漫画：全年龄", value: "10" },
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
    
    console.group("📄 页面抓取进度");
    const result = await fetchAllPages(dlurl, detailMode, (page, total) => {
      updateProgressBar((page / total) * 100);
    });
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
      if (detailMode) {
        drawGenreChart(filteredGenreCount);
      }
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
    
    // 将所有统计结果及信息整合到结果窗口中显示
    displayResults(result, exchangeRate, filteredGenreCount, filteredMakerCount);
    
    // 清理残留的模态遮罩层，确保页面正常交互
    cleanupOverlays();
  };
  
  // -------------------------
  // Markdown预览及下载窗口
  // -------------------------
  const showMarkdownPreviewAndDownload = (markdownContent, fileName) => {
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
      closeModal(overlay, modal);
    });
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "关闭预览";
    closeBtn.className = "btn";
    closeBtn.addEventListener("click", () => { closeModal(overlay, modal); });
    btnContainer.appendChild(downloadBtn);
    btnContainer.appendChild(closeBtn);
    modal.appendChild(title);
    modal.appendChild(pre);
    modal.appendChild(btnContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    animateModalIn(modal);
  };
  
  // -------------------------
  // 全局命令（方便调试）
  // -------------------------
  window.clearLogs = () => { console.clear(); };
  window.reloadData = async () => { cleanup(); try { await main(); } catch(e) { console.error("reloadData encountered an error:", e); } };
  
  // -------------------------
  // 程序入口：直接运行
  // -------------------------
  injectStyles();
  (async () => {
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
