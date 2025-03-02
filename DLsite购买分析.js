// =========================
// 自定义 styledLog 函数，用于美化控制台输出
// =========================
function styledLog(message, style = "") {
  console.log("%c" + message, style);
}

// =========================
// 加载 Chart.js 库函数（如果尚未加载则从 CDN 加载）
// =========================
async function loadChartJs() {
  if (typeof Chart === "undefined") {
    return new Promise((resolve, reject) => {
      var script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/chart.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}

// =========================
// 自定义模态对话框函数（alert/confirm/prompt）
// =========================
function customAlert(message) {
  return new Promise(resolve => {
    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:9999;";
    const modal = document.createElement("div");
    modal.style.cssText =
      "background:#fff; padding:20px; border-radius:8px; max-width:400px; text-align:center;";
    const msg = document.createElement("div");
    msg.innerHTML = message;
    const btn = document.createElement("button");
    btn.textContent = "确定";
    btn.style.cssText = "margin-top: 15px; padding: 5px 10px;";
    btn.addEventListener("click", () => {
      document.body.removeChild(overlay);
      resolve();
    });
    modal.appendChild(msg);
    modal.appendChild(btn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  });
}

function customConfirm(message) {
  return new Promise(resolve => {
    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:9999;";
    const modal = document.createElement("div");
    modal.style.cssText =
      "background:#fff; padding:20px; border-radius:8px; max-width:400px; text-align:center;";
    const msg = document.createElement("div");
    msg.innerHTML = message;
    const btnContainer = document.createElement("div");
    btnContainer.style.marginTop = "15px";
    const okBtn = document.createElement("button");
    okBtn.textContent = "确定";
    okBtn.style.cssText = "margin-right:10px; padding: 5px 10px;";
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "取消";
    cancelBtn.style.cssText = "padding: 5px 10px;";
    okBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
      resolve(true);
    });
    cancelBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
      resolve(false);
    });
    btnContainer.appendChild(okBtn);
    btnContainer.appendChild(cancelBtn);
    modal.appendChild(msg);
    modal.appendChild(btnContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  });
}

function customPrompt(message, defaultValue = "") {
  return new Promise(resolve => {
    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:9999;";
    const modal = document.createElement("div");
    modal.style.cssText =
      "background:#fff; padding:20px; border-radius:8px; max-width:400px; text-align:center;";
    const msg = document.createElement("div");
    msg.innerHTML = message;
    const input = document.createElement("input");
    input.type = "text";
    input.value = defaultValue;
    input.style.cssText = "width: 80%; margin-top: 15px; padding: 5px;";
    const btnContainer = document.createElement("div");
    btnContainer.style.marginTop = "15px";
    const okBtn = document.createElement("button");
    okBtn.textContent = "确定";
    okBtn.style.cssText = "margin-right:10px; padding: 5px 10px;";
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "取消";
    cancelBtn.style.cssText = "padding: 5px 10px;";
    okBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
      resolve(input.value);
    });
    cancelBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
      resolve(null);
    });
    btnContainer.appendChild(okBtn);
    btnContainer.appendChild(cancelBtn);
    modal.appendChild(msg);
    modal.appendChild(input);
    modal.appendChild(btnContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  });
}

// =========================
// 新增：Markdown预览并下载窗口（美化保存为 MD 文件时的显示）
// =========================
function showMarkdownPreviewAndDownload(markdownContent, fileName) {
  // 创建覆盖层
  const overlay = document.createElement("div");
  overlay.style.cssText =
    "position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:10000;";
  
  // 创建预览窗口
  const modal = document.createElement("div");
  modal.style.cssText =
    "background:#fff; padding:20px; border-radius:8px; width:80%; max-width:600px; max-height:80%; overflow:auto; box-shadow: 0 0 10px rgba(0,0,0,0.5);";
  
  // 标题
  const title = document.createElement("h2");
  title.textContent = "Markdown 文件预览";
  title.style.cssText =
    "margin-top:0; text-align:center; background: linear-gradient(to right, #ff6347, #ff1493, #8a2be2, #32cd32); color:#fff; padding:10px; border-radius:4px;";
  
  // 内容预览区域
  const pre = document.createElement("pre");
  pre.textContent = markdownContent;
  pre.style.cssText =
    "white-space: pre-wrap; word-break: break-all; background: #f5f5f5; border: 1px solid #ddd; padding: 10px; max-height:300px; overflow-y:auto; margin:20px 0; border-radius:4px;";
  
  // 按钮容器
  const btnContainer = document.createElement("div");
  btnContainer.style.cssText = "text-align:center;";
  
  // 下载按钮
  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "下载 MD 文件";
  downloadBtn.style.cssText =
    "margin-right:10px; padding: 8px 12px; font-size:16px; background: #32cd32; color: #fff; border:none; border-radius:4px; cursor:pointer;";
  downloadBtn.addEventListener("click", () => {
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    // 下载后关闭预览
    document.body.removeChild(overlay);
  });
  
  // 关闭按钮
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "关闭预览";
  closeBtn.style.cssText =
    "padding: 8px 12px; font-size:16px; background: #ff6347; color: #fff; border:none; border-radius:4px; cursor:pointer;";
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(overlay);
  });
  
  btnContainer.appendChild(downloadBtn);
  btnContainer.appendChild(closeBtn);
  
  modal.appendChild(title);
  modal.appendChild(pre);
  modal.appendChild(btnContainer);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// =========================
// 全局错误日志记录数组
// =========================
var errorLogs = [];

// =========================
// 异步加载函数：增加错误重试、加载动画及日志记录
// =========================
async function fetchUrlAsync(url, retries = 3, delay = 500) {
  const spinner = ['|', '/', '-', '\\'];
  let spinnerIndex = 0;
  const spinnerInterval = setInterval(() => {
    styledLog("加载中 " + spinner[spinnerIndex % spinner.length], "color: #0099ff; font-weight: bold;");
    spinnerIndex++;
  }, 200);
  
  try {
    const response = await fetch(url, { credentials: "include" });
    const text = await response.text();
    clearInterval(spinnerInterval);
    styledLog("✔️ 加载完成: " + url, "color: green; font-weight: bold;");
    return text;
  } catch (err) {
    clearInterval(spinnerInterval);
    styledLog("❌ 加载错误: " + url, "color: red; font-weight: bold;");
    if (retries > 0) {
      styledLog(`⏳ 重试中 ${url}，剩余重试次数: ${retries}`, "color: orange; font-weight: bold;");
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchUrlAsync(url, retries - 1, delay);
    } else {
      styledLog("⚠️ 重试失败，放弃: " + url, "color: red; font-weight: bold;");
      errorLogs.push({ url: url, error: err });
      throw err;
    }
  }
}

// =========================
// 美化输出表格函数（保持原样，但添加一些前后分隔线）
// =========================
function generateTable(rows, headers) {
  const getMaxLengths = (rows) => {
    return headers.map((_, i) => Math.max(...rows.map(row => row[i].length)));
  };

  const maxLengths = getMaxLengths(rows.concat([headers]));
  const horizontalLine = headers.map((header, i) => `| ${'-'.repeat(maxLengths[i] + 2)} `).join('') + '|';
  const formatRow = row => headers.map((_, i) => row[i].padEnd(maxLengths[i])).join(' | ') + ' | ';

  const headerRow = formatRow(headers).replace(/ /g, " ");
  const rowWithColors = rows.map((row, index) => {
    return index % 2 === 0
      ? formatRow(row)
      : formatRow(row).replace(/(作品数目|价格)/g, 'color: green; font-weight: bold;');
  });

  return [
    horizontalLine,
    `| \x1b[1m${headerRow}\x1b[0m |`,
    horizontalLine,
    ...rowWithColors,
    horizontalLine
  ].join('\n');
}

// =========================
// 主逻辑：封装为异步函数，所有用户交互使用自定义模态框
// =========================
async function main() {
  // 美化标题输出
  styledLog("✦ DLsite购买历史统计 ✦", "font-size: 28px; font-weight: bold; color: white; background: linear-gradient(to right, #ff6347, #ff1493, #8a2be2, #32cd32); padding: 10px; border-radius: 8px;");
  
  // 使用自定义对话框替换内置 prompt/confirm
  let detailMode = true;
  const response = await customPrompt("是否开启快速查看消费金额？（仅统计金额，输入 Y 或 N）", "N");
  if (response && response.toLowerCase() === "y") {
    detailMode = false;
  }
  
  const typeOptions = `
请选择作品类型参数：

0      | 全部作品
12     | 同人：所有
2      | 同人：全年齢
1      | 同人：男性向
3      | 同人：女性向
13     | 商业游戏：所有
9      | 商业游戏：全年齢
4      | 商业游戏：男性向
14     | 漫画：所有
10     | 漫画：全年齢
7      | 漫画：男性向
11     | 漫画：女性向
`;
  
  let dlurl = "https://www.dlsite.com/maniax/mypage/userbuy/=/type/all/start/all/sort/1/order/1/page/";
  if (!detailMode) {
    dlurl = dlurl.replace(/type\/[^/]+/, "type/all");
  } else {
    const type = await customPrompt("请从以下列表中选择作品类型：\n" + typeOptions, "0");
    if (type) {
      if (type === "0") {
        dlurl = dlurl.replace(/type\/[^/]+/, "type/all");
      } else {
        dlurl = dlurl.replace(/type\/[^/]+/, `type/${type}`);
      }
    }
  }
  
  // 汇率设置
  let exchangeRate = 0.04858;
  if (!detailMode) {
    exchangeRate = 0.04858;
  } else {
    const exchangeRateResponse = await customPrompt("是否需要修改汇率？输入 Y 修改，输入 N 使用默认汇率（1人民币 = 0.04858日元）", "N");
    if (exchangeRateResponse && exchangeRateResponse.toLowerCase() === "y") {
      const newExchangeRateStr = await customPrompt("请输入新的人民币到日元的汇率（例如 1人民币=0.05日元，请输入 0.05）：", "0.05");
      const newExchangeRate = parseFloat(newExchangeRateStr);
      if (!isNaN(newExchangeRate) && newExchangeRate > 0) {
        exchangeRate = newExchangeRate;
      } else {
        styledLog("❌ 输入无效，使用默认汇率", "color: red; font-weight: bold;");
      }
    } else {
      styledLog("✔️ 使用默认汇率 1人民币 = 0.04858日元", "color: green; font-weight: bold;");
    }
  }
  
  // 初始化统计结果
  let lastPage = 1;
  const result = {
    count: 0,
    totalPrice: 0,
    works: [],
    genreCount: new Map(),
    makerCount: new Map(),
    eol: []
  };
  
  // 扫描每一页数据
  for (let i = 1; i <= lastPage; i++) {
    const pageUrl = dlurl + i;
    const pageText = await fetchUrlAsync(pageUrl);
    const doc = new DOMParser().parseFromString(pageText, "text/html");
    
    const progress = Math.floor((i / lastPage) * 100);
    const bar = '='.repeat(progress / 2) + ' '.repeat(50 - progress / 2);
    styledLog(`📄 正在获取第 ${i}/${lastPage} 页 [${bar}] ${progress}%`, "color: #0066cc; font-weight: bold;");
    
    if (i === 1) {
      const lastPageElm = doc.querySelector(".page_no ul li:last-child a");
      if (lastPageElm) {
        lastPage = parseInt(lastPageElm.dataset.value);
      }
    }
    
    const trElms = doc.querySelectorAll(".work_list_main tr:not(.item_name)");
    for (let elm of trElms) {
      const work = {};
      if (elm.querySelector(".work_name a") == null) {
        work.url = "";
      } else {
        work.url = elm.querySelector(".work_name a").href;
      }
      work.date = elm.querySelector(".buy_date").innerText;
      work.name = elm.querySelector(".work_name").innerText.trim();
      work.genre = elm.querySelector(".work_genre span").textContent.trim();
      const priceText = elm.querySelector(".work_price").textContent.split(' /')[0];
      work.price = parseInt(priceText.replace(/\D/g, ''));
      work.makerName = elm.querySelector(".maker_name").innerText.trim();
      
      if (detailMode && work.url !== "") {
        styledLog(`🔍 获取作品详情: ${work.url}`, "color: #9933ff; font-weight: bold;");
        const workText = await fetchUrlAsync(work.url);
        const docWork = new DOMParser().parseFromString(workText, "text/html");
        work.mainGenre = [];
        docWork.querySelectorAll(".main_genre a").forEach(a => {
          const g = a.textContent.trim();
          work.mainGenre.push(g);
          if (!result.genreCount.has(g)) {
            result.genreCount.set(g, 0);
          }
          result.genreCount.set(g, result.genreCount.get(g) + 1);
        });
      }
      
      if (!result.makerCount.has(work.makerName)) {
        result.makerCount.set(work.makerName, 0);
      }
      result.makerCount.set(work.makerName, result.makerCount.get(work.makerName) + 1);
      
      result.count++;
      if (work.price > 0) {
        result.totalPrice += work.price;
      }
      result.works.push(work);
      if (work.url === "") {
        result.eol.push(work);
      }
    }
  }
  
  // 设置过滤条件
  const excludeResponse = await customPrompt("请输入要排除的最少作品数目（例如输入 3，表示排除数目小于 3 的作品类型）：", "0");
  let excludeThreshold = 0;
  if (excludeResponse) {
    excludeThreshold = parseInt(excludeResponse);
    if (isNaN(excludeThreshold) || excludeThreshold < 0) {
      styledLog("❌ 无效的输入，使用默认值 0（不过滤）", "color: red; font-weight: bold;");
      excludeThreshold = 0;
    }
  } else {
    styledLog("ℹ️ 未输入数值，使用默认值 0（不过滤）", "color: #666666; font-weight: bold;");
  }
  
  result.genreCount = [...result.genreCount.entries()].sort((a, b) => b[1] - a[1]);
  result.makerCount = [...result.makerCount.entries()].sort((a, b) => b[1] - a[1]);
  
  const filteredGenreCount = excludeThreshold === 0 ? result.genreCount : result.genreCount.filter(([, count]) => count >= excludeThreshold);
  const filteredMakerCount = excludeThreshold === 0 ? result.makerCount : result.makerCount.filter(([, count]) => count >= excludeThreshold);
  
  // 新增：询问是否显示图表数据展示
  const showChart = await customPrompt("是否显示图表数据展示？输入 Y 显示，输入 N 不显示：", "Y");
  if (showChart && showChart.toLowerCase() === "y") {
    await loadChartJs();
    let chartContainer = document.getElementById("chartContainer");
    if (!chartContainer) {
      chartContainer = document.createElement("div");
      chartContainer.id = "chartContainer";
      chartContainer.style.cssText =
        "position: fixed; bottom: 10px; right: 10px; width: 600px; height: 400px; background: #fff; border: 2px solid #ccc; border-radius: 8px; padding: 10px; overflow: auto; z-index: 10000;";
      document.body.appendChild(chartContainer);
    }
    chartContainer.innerHTML = "<h3 style='text-align:center;'>作品类型统计</h3><canvas id='genreChart'></canvas><h3 style='text-align:center;'>制作组统计</h3><canvas id='makerChart'></canvas>";
    
    var genreLabels = filteredGenreCount.map(item => item[0]);
    var genreData = filteredGenreCount.map(item => item[1]);
    
    var makerLabels = filteredMakerCount.map(item => item[0]);
    var makerData = filteredMakerCount.map(item => item[1]);
    
    var ctx1 = document.getElementById("genreChart").getContext("2d");
    var ctx2 = document.getElementById("makerChart").getContext("2d");
    
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: genreLabels,
        datasets: [{
          label: '作品数目',
          data: genreData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: { beginAtZero: true }
          }]
        }
      }
    });
    
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: makerLabels,
        datasets: [{
          label: '作品数目',
          data: makerData,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: { beginAtZero: true }
          }]
        }
      }
    });
  }
  
  // 导出或显示统计结果
  const saveToFile = await customPrompt("统计完成！是否需要保存为文件？输入 Y 保存，输入 N 不保存：", "N");
  if (saveToFile && saveToFile.toLowerCase() === "y") {
    const fileFormat = await customPrompt("请选择保存格式：0 - 全部下载，1 - 仅保存 MD，2 - 仅保存 CSV：", "0");
    
    const markdownContent = `
统计结果：
------

| 统计项目         | 数量/金额                                  |
|-----------------|--------------------------------------------|
| 购买总数         | ${result.count} 部                          |
| 总消费金额       | ${result.totalPrice} 日元 (${(result.totalPrice * exchangeRate).toFixed(2)} 人民币) |

各类型作品数排名：
| 类型   | 作品数目 |
|--------|----------|
${filteredGenreCount.map(([type, count]) => `| ${type} | ${count}       |`).join("\n")}

各制作组作品数排名：
| 制作组 | 作品数目 |
|--------|----------|
${filteredMakerCount.map(([maker, count]) => `| ${maker}       | ${count}       |`).join("\n")}

已下架作品：
${result.eol.length > 0 ? `
| 购买日期 | 制作组     | 作品名称     | 价格 |
|----------|------------|--------------|------|
${result.eol.map(eol => `| ${eol.date} | ${eol.makerName} | ${eol.name} | ${eol.price} 日元 |`).join("\n")}` : `暂无已下架作品`}
`;
    
    if (fileFormat === "1") {
      showMarkdownPreviewAndDownload(markdownContent, "DLsite购买历史查询.md");
    }
    else if (fileFormat === "0") {
      showMarkdownPreviewAndDownload(markdownContent, "DLsite购买历史查询.md");
      function exportCSV(data) {
        const csvContent = data.map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "DLsite购买历史查询.csv";
        a.click();
      }
      exportCSV([
        ["统计项目", "数量/金额"],
        ["购买总数", result.count],
        ["总消费金额", `${result.totalPrice} 日元 (${(result.totalPrice * exchangeRate).toFixed(2)} 人民币)`],
        ...filteredGenreCount.map(([type, count]) => [type, count]),
        ...filteredMakerCount.map(([maker, count]) => [maker, count]),
        ...result.eol.map(eol => [eol.date, eol.makerName, eol.name, `${eol.price} 日元`])
      ]);
    }
    else if (fileFormat === "2") {
      function exportCSV(data) {
        const csvContent = data.map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "DLsite购买历史查询.csv";
        a.click();
      }
      exportCSV([
        ["统计项目", "数量/金额"],
        ["购买总数", result.count],
        ["总消费金额", `${result.totalPrice} 日元 (${(result.totalPrice * exchangeRate).toFixed(2)} 人民币)`],
        ...filteredGenreCount.map(([type, count]) => [type, count]),
        ...filteredMakerCount.map(([maker, count]) => [maker, count]),
        ...result.eol.map(eol => [eol.date, eol.makerName, eol.name, `${eol.price} 日元`])
      ]);
    }
    
    await customAlert("文件保存操作已完成！");
  } else {
    styledLog("☆ 统计结果 ☆", "font-size: 22px; font-weight: bold; color: #ffffff; background: linear-gradient(to right, #ff6347, #ff1493, #8a2be2, #32cd32); padding: 10px; border-radius: 8px;");
    styledLog(generateTable(
      [[`购买总数`, `${result.count} 部`],
       [`总消费金额`, `${result.totalPrice} 日元 (${(result.totalPrice * exchangeRate).toFixed(2)} 人民币)`]],
      [`统计项目`, `数量/金额`]
    ), "color: #333333;");
    
    styledLog("☆ 各类型作品数排名 ☆", "font-size: 20px; font-weight: bold; color: #ffffff; background: linear-gradient(to right, #ff7f50, #ff69b4); padding: 5px; border-radius: 8px;");
    styledLog(generateTable(
      filteredGenreCount.map(([type, count]) => [type, count.toString()]),
      [`类型`, `作品数目`]
    ), "color: #333333;");
    
    styledLog("☆ 各制作组作品数排名 ☆", "font-size: 20px; font-weight: bold; color: #ffffff; background: linear-gradient(to right, #87cefa, #32cd32); padding: 5px; border-radius: 8px;");
    styledLog(generateTable(
      filteredMakerCount.map(([maker, count]) => [maker, count.toString()]),
      [`制作组`, `作品数目`]
    ), "color: #333333;");
    
    if (result.eol.length > 0) {
      styledLog("☆ 已下架作品 ☆", "font-size: 20px; font-weight: bold; color: #ffffff; background: linear-gradient(to right, #ff4500, #ff1493); padding: 5px; border-radius: 8px;");
      styledLog(generateTable(
        result.eol.map(eol => [eol.date, eol.makerName, eol.name, `${eol.price} 日元`]),
        [`购买日期`, `制作组`, `作品名称`, `价格`]
      ), "color: #333333;");
    } else {
      styledLog("ℹ️ 暂无已下架作品", "font-size: 18px; color: #666666;");
    }
  }
  
  styledLog("★ 本脚本由凛遥crush修改制作 ★\n请在GitHub上为本项目点击 Star，谢谢！", "font-size: 18px; font-weight: bold; color: #ffffff; background: #333333; padding: 5px; border-radius: 5px;");
  styledLog("★ 项目地址：https://github.com/linyaocrush/DLsite-userbuy ★", "font-size: 18px; font-weight: bold; color: #ffffff; background: #333333; padding: 5px; border-radius: 5px;");
  
  if (errorLogs.length > 0) {
    styledLog("⚠️ 错误日志记录：", "color: red; font-weight: bold;");
    console.error(errorLogs);
  }
}

// =========================
// 入口：检测域名后启动主逻辑
// =========================
(async function(){
  if (!window.location.hostname.includes("dlsite.com")) {
    const jump = await customConfirm("当前网页不是DLsite页面，是否自动跳转到DLsite购买页面？");
    if (jump) {
      window.location.href = "https://www.dlsite.com/maniax/mypage/userbuy";
      return;
    }
  }
  await main();
})();
