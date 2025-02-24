// 在脚本最前面添加渐变色标题
console.log("%cDLsite购买历史统计", "font-size: 24px; font-weight: bold; color: transparent; background-image: linear-gradient(to right, #ff6347, #ff1493, #8a2be2, #32cd32); -webkit-background-clip: text;");

// 美化输出的表格函数
const generateTable = (rows, headers) => {
    // 计算每列的最长宽度
    const getMaxLengths = (rows) => {
        return headers.map((_, i) => Math.max(...rows.map(row => row[i].length)));
    };

    const maxLengths = getMaxLengths(rows.concat([headers]));
    const horizontalLine = headers.map((header, i) => `| ${'-'.repeat(maxLengths[i] + 2)} `).join('') + '|';
    const formatRow = row => headers.map((_, i) => row[i].padEnd(maxLengths[i])).join(' | ') + ' | ';

    // 美化输出，增加颜色和格式
    const headerRow = formatRow(headers).replace(/ /g, " "); // 这里你可以自定义格式
    const rowWithColors = rows.map((row, index) => {
        return index % 2 === 0
            ? formatRow(row) // 偶数行普通
            : formatRow(row).replace(/(作品数目|价格)/g, 'color: green; font-weight: bold;'); // 奇数行加绿色和加粗
    });

    return [
        `\n${horizontalLine}`,
        `| \x1b[1m${headerRow}\x1b[0m |`,
        `${horizontalLine}`,
        ...rowWithColors,
        `${horizontalLine}`
    ].join('\n');
};

// 提示用户是否开启快速查看消费金额（仅统计金额）
var detailMode = true;
var response = prompt("是否开启快速查看消费金额？（仅统计金额，输入 'Y' 或 'N'）");
if (response && response.toLowerCase() === "y") {
    detailMode = false;
}

// 详细的作品类型参数说明
var typeOptions = `
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

// 提示用户选择作品类型
var dlurl = "https://www.dlsite.com/maniax/mypage/userbuy/=/type/all/start/all/sort/1/order/1/page/";
if (!detailMode) {
    dlurl = dlurl.replace(/type\/[^/]+/, "type/all"); // 快速模式，默认选择全部作品
} else {
    var type = prompt("请从以下列表中选择作品类型：\n" + typeOptions);
    if (type) {
        if (type === "0") {
            dlurl = dlurl.replace(/type\/[^/]+/, "type/all"); // 选择全部作品
        } else {
            dlurl = dlurl.replace(/type\/[^/]+/, `type/${type}`);
        }
    }
}

// 汇率设置：1 JPY = 0.04858 CNY
var exchangeRate = 0.04858; // 默认汇率
if (!detailMode) {
    exchangeRate = 0.04858; // 快速模式，直接使用默认汇率
} else {
    // 提示用户是否修改汇率
    var exchangeRateResponse = prompt("是否需要修改汇率？输入 'Y' 修改，输入 'N' 使用默认汇率（1人民币 = 0.04858日元）");
    if (exchangeRateResponse && exchangeRateResponse.toLowerCase() === "y") {
        var newExchangeRate = parseFloat(prompt("请输入新的人民币到日元的汇率（例如 1人民币=0.05日元，请输入 0.05）："));
        if (!isNaN(newExchangeRate) && newExchangeRate > 0) {
            exchangeRate = newExchangeRate; // 使用用户输入的汇率
        } else {
            console.log("输入无效，使用默认汇率");
        }
    } else {
        console.log("使用默认汇率 1人民币 = 0.04858日元");
    }
}

// 统计结果初始化
var lastPage = 1;
var result = {
    count: 0,
    totalPrice: 0,
    works: [],
    genreCount: new Map(),
    makerCount: new Map(),
    eol: []
};

// 页面扫描
for (var i = 1; i <= lastPage; i++) {
    var doc = new DOMParser().parseFromString(fetchUrl(dlurl + i), "text/html");

    // 显示进度条
    var progress = Math.floor((i / lastPage) * 100); // 计算进度百分比
    var bar = '='.repeat(progress / 2) + ' '.repeat(50 - progress / 2); // 生成进度条（50个字符）
    console.log(`正在获取第 ${i}/${lastPage} 页 [${bar}] ${progress}%`);

    if (i == 1) {
        var lastPageElm = doc.querySelector(".page_no ul li:last-child a");
        if (lastPageElm) {
            lastPage = parseInt(lastPageElm.dataset.value);
        }
    }

    var trElms = doc.querySelectorAll(".work_list_main tr:not(.item_name)");
    trElms.forEach(elm => { // 历史记录表格行扫描
        var work = {};

        if (elm.querySelector(".work_name a") == null) {
            work.url = "";
        } else {
            work.url = elm.querySelector(".work_name a").href;
        }

        work.date = elm.querySelector(".buy_date").innerText;
        work.name = elm.querySelector(".work_name").innerText.trim();
        work.genre = elm.querySelector(".work_genre span").textContent.trim();
        
        // 提取日元价格
        var priceText = elm.querySelector(".work_price").textContent.split(' /')[0]; // 获取日元部分
        work.price = parseInt(priceText.replace(/\D/g, '')); // 提取数字

        work.makerName = elm.querySelector(".maker_name").innerText.trim();

        if (detailMode && work.url != "") {
            console.log(`正在获取作品详情: ${work.url}`);
            var docWork = new DOMParser().parseFromString(fetchUrl(work.url), "text/html");
            work.mainGenre = [];
            docWork.querySelectorAll(".main_genre a").forEach(a => {
                var g = a.textContent.trim();
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
        if (work.price > 0) { // 排除价格为 0 的作品在总消费金额中
            result.totalPrice += work.price;
        }
        result.works.push(work);
        if (work.url == "") {
            result.eol.push(work);
        }
    });
}

// 提示用户设置过滤条件
var excludeThreshold = 0;
var excludeResponse = prompt("请输入要排除的最少作品数目（例如输入 3，表示排除数目小于3的作品类型）");
if (excludeResponse) {
    excludeThreshold = parseInt(excludeResponse);
    if (isNaN(excludeThreshold) || excludeThreshold < 0) {
        console.log("无效的输入，使用默认值0（不过滤）");
        excludeThreshold = 0;
    }
} else {
    console.log("未输入数值，使用默认值0（不过滤）");
}

// 排序并转换为数组
result.genreCount = [...result.genreCount.entries()].sort((a, b) => b[1] - a[1]);
result.makerCount = [...result.makerCount.entries()].sort((a, b) => b[1] - a[1]);

// 根据用户输入的按钮值，过滤或显示全部
var filteredGenreCount = excludeThreshold === 0 ? result.genreCount : result.genreCount.filter(([, count]) => count >= excludeThreshold);
var filteredMakerCount = excludeThreshold === 0 ? result.makerCount : result.makerCount.filter(([, count]) => count >= excludeThreshold);

// 询问是否保存文件到本地
var saveToFile = prompt("统计完成！是否需要保存为文件？输入 'Y' 保存，输入 'N' 不保存：");

if (saveToFile && saveToFile.toLowerCase() === "y") {
    // 提示用户选择保存格式
    var fileFormat = prompt("请选择保存格式：0 - 全部下载，1 - 仅保存MD，2 - 仅保存CSV");

    // 生成统计结果的Markdown格式内容
    var markdownContent = `
统计结果：
------

| 统计项目         | 数量/金额                       |
|-----------------|---------------------------------|
| 购买总数         | ${result.count} 部             |
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

    // 导出CSV功能
    function exportCSV(data) {
        const csvContent = data.map(row => row.join(",")).join("\n");
        var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); // 添加 charset=utf-8
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "DLsite购买历史查询.csv";
        a.click();
    }

    // 如果选择仅保存CSV，导出CSV
    if (fileFormat === "2") {
        exportCSV([
            ["统计项目", "数量/金额"],
            ["购买总数", result.count],
            ["总消费金额", `${result.totalPrice} 日元 (${(result.totalPrice * exchangeRate).toFixed(2)} 人民币)`],
            ...filteredGenreCount.map(([type, count]) => [type, count]),
            ...filteredMakerCount.map(([maker, count]) => [maker, count]),
            ...result.eol.map(eol => [eol.date, eol.makerName, eol.name, `${eol.price} 日元`])
        ]);
    }
    // 如果选择仅保存MD，下载Markdown文件
    else if (fileFormat === "1") {
        var blob = new Blob([markdownContent], { type: "text/markdown" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "DLsite购买历史查询.md";
        a.click();
    }
    // 如果选择全部下载，下载MD和CSV
    else if (fileFormat === "0") {
        var blobMD = new Blob([markdownContent], { type: "text/markdown" });
        var urlMD = URL.createObjectURL(blobMD);
        var aMD = document.createElement("a");
        aMD.href = urlMD;
        aMD.download = "DLsite购买历史查询.md";
        aMD.click();

        exportCSV([
            ["统计项目", "数量/金额"],
            ["购买总数", result.count],
            ["总消费金额", `${result.totalPrice} 日元 (${(result.totalPrice * exchangeRate).toFixed(2)} 人民币)`],
            ...filteredGenreCount.map(([type, count]) => [type, count]),
            ...filteredMakerCount.map(([maker, count]) => [maker, count]),
            ...result.eol.map(eol => [eol.date, eol.makerName, eol.name, `${eol.price} 日元`])
        ]);
    }

    alert("文件已保存！");
} else {
    // 控制台输出美化后的结果
    console.log("%c\n统计结果：", "font-size: 20px; font-weight: bold; color: transparent; background-image: linear-gradient(to right, #ff6347, #ff1493, #8a2be2, #32cd32); -webkit-background-clip: text;");
    console.log(generateTable(
        [[`购买总数`, `${result.count} 部`],
         [`总消费金额`, `${result.totalPrice} 日元 (${(result.totalPrice * exchangeRate).toFixed(2)} 人民币)`]],
        [`统计项目`, `数量/金额`]
    ));

    console.log("%c\n各类型作品数排名：", "font-size: 20px; font-weight: bold; color: transparent; background-image: linear-gradient(to right, #ff6347, #ff1493, #8a2be2, #32cd32); -webkit-background-clip: text;");
    console.log(generateTable(
        filteredGenreCount.map(([type, count]) => [type, count.toString()]),
        [`类型`, `作品数目`]
    ));

    console.log("%c\n各制作组作品数排名：", "font-size: 20px; font-weight: bold; color: transparent; background-image: linear-gradient(to right, #ff6347, #ff1493, #8a2be2, #32cd32); -webkit-background-clip: text;");
    console.log(generateTable(
        filteredMakerCount.map(([maker, count]) => [maker, count.toString()]),
        [`制作组`, `作品数目`]
    ));

    if (result.eol.length > 0) {
        console.log("%c\n已下架作品：", "font-size: 20px; font-weight: bold; color: transparent; background-image: linear-gradient(to right, #ff6347, #ff1493, #8a2be2, #32cd32); -webkit-background-clip: text;");
        console.log(generateTable(
            result.eol.map(eol => [eol.date, eol.makerName, eol.name, `${eol.price} 日元`]),
            [`购买日期`, `制作组`, `作品名称`, `价格`]
        ));
    } else {
        console.log("%c\n暂无已下架作品", "font-size: 20px; font-weight: bold; color: transparent; background-image: linear-gradient(to right, #ff6347, #ff1493, #8a2be2, #32cd32); -webkit-background-clip: text;");
    }
}

// HTTP 请求函数
function fetchUrl(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.withCredentials = true;
    request.send(null);
    return request.responseText;
}

console.log("%c本脚本有凛遥crush修改制作，请在GitHub上为本项目点击star，谢谢", "font-size: 18px; font-weight: bold; background: rgba(0, 0, 0, 0.5); padding: 5px; border-radius: 5px; color: transparent; background-image: linear-gradient(to right, #ff6347, #ff1493); -webkit-background-clip: text;");
console.log("%c项目地址：https://github.com/linyaocrush/DLsite-userbuy", "font-size: 18px; font-weight: bold; color: transparent; background-image: linear-gradient(to right, #ff6347, #ff1493); -webkit-background-clip: text;");
