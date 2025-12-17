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

  const modal = {
    createModal(maxWidth = "500px") {
      const overlay = document.createElement("div");
      overlay.className = "modal-overlay";
      utils.fadeIn(overlay);
      const modalContainer = document.createElement("div");
      modalContainer.className = "modal-container";
      modalContainer.style.maxWidth = maxWidth;
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
        btn.textContent = "确定";
        btn.className = "btn";
        btn.addEventListener("click", () => {
          modal.closeModal(overlay, modalContainer, resolve);
        });
        modalContainer.appendChild(btn);
      });
    },
    customPrompt(message, defaultValue = "") {
      return new Promise(resolve => {
        const { overlay, modalContainer } = modal.createModal("400px");
        const msgDiv = document.createElement("div");
        msgDiv.innerHTML = message;
        modalContainer.appendChild(msgDiv);
        const input = document.createElement("input");
        input.type = "text";
        input.value = defaultValue;
        input.style.width = "80%";
        input.style.marginTop = "15px";
        input.style.padding = "5px";
        modalContainer.appendChild(input);
        const btnContainer = document.createElement("div");
        btnContainer.style.marginTop = "15px";
        const okBtn = document.createElement("button");
        okBtn.textContent = "确定";
        okBtn.className = "btn";
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "取消";
        cancelBtn.className = "btn";
        okBtn.addEventListener("click", () => {
          modal.closeModal(overlay, modalContainer, () => { resolve(input.value); });
        });
        cancelBtn.addEventListener("click", () => {
          modal.closeModal(overlay, modalContainer, () => { resolve(null); });
        });
        btnContainer.appendChild(okBtn);
        btnContainer.appendChild(cancelBtn);
        modalContainer.appendChild(btnContainer);
      });
    },
    customConfirm(message) {
      return new Promise(resolve => {
        const { overlay, modalContainer } = modal.createModal("400px");
        const msgDiv = document.createElement("div");
        msgDiv.innerHTML = message;
        modalContainer.appendChild(msgDiv);
        const btnContainer = document.createElement("div");
        btnContainer.style.marginTop = "15px";
        const okBtn = document.createElement("button");
        okBtn.textContent = "确定";
        okBtn.className = "btn";
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "取消";
        cancelBtn.className = "btn";
        okBtn.addEventListener("click", () => {
          modal.closeModal(overlay, modalContainer, () => { resolve(true); });
        });
        cancelBtn.addEventListener("click", () => {
          modal.closeModal(overlay, modalContainer, () => { resolve(false); });
        });
        btnContainer.appendChild(okBtn);
        btnContainer.appendChild(cancelBtn);
        modalContainer.appendChild(btnContainer);
      });
    },
    customChoice(message, options) {
      return new Promise(resolve => {
        const { overlay, modalContainer } = modal.createModal("500px");
        const msgDiv = document.createElement("div");
        msgDiv.innerHTML = message;
        modalContainer.appendChild(msgDiv);
        const btnContainer = document.createDocumentFragment();
        options.forEach(opt => {
          const btn = document.createElement("button");
          btn.textContent = opt.label;
          btn.className = "btn";
          btn.addEventListener("click", () => { modal.closeModal(overlay, modalContainer, () => { resolve(opt.value); }); });
          btnContainer.appendChild(btn);
        });
        modalContainer.appendChild(btnContainer);
      });
    },
    customSelectPeriods(availableDates) {
      return new Promise(resolve => {
        const { overlay, modalContainer } = modal.createModal("500px");
        const title = document.createElement("h2");
        title.textContent = "选择时间段及对比方面";
        modalContainer.appendChild(title);
        const period1Container = document.createElement("div");
        period1Container.style.margin = "10px 0";
        const period1Label = document.createElement("div");
        period1Label.textContent = "时间段 1:";
        period1Container.appendChild(period1Label);
        const period1StartSelect = document.createElement("select");
        availableDates.forEach(date => {
          const option = document.createElement("option");
          option.value = date;
          option.textContent = date;
          period1StartSelect.appendChild(option);
        });
        period1Container.appendChild(document.createTextNode("开始日期: "));
        period1Container.appendChild(period1StartSelect);
        const period1EndSelect = document.createElement("select");
        availableDates.forEach(date => {
          const option = document.createElement("option");
          option.value = date;
          option.textContent = date;
          period1EndSelect.appendChild(option);
        });
        period1Container.appendChild(document.createTextNode(" 结束日期: "));
        period1Container.appendChild(period1EndSelect);
        modalContainer.appendChild(period1Container);
        const period2Container = document.createElement("div");
        period2Container.style.margin = "10px 0";
        const period2Label = document.createElement("div");
        period2Label.textContent = "时间段 2:";
        period2Container.appendChild(period2Label);
        const period2StartSelect = document.createElement("select");
        availableDates.forEach(date => {
          const option = document.createElement("option");
          option.value = date;
          option.textContent = date;
          period2StartSelect.appendChild(option);
        });
        period2Container.appendChild(document.createTextNode("开始日期: "));
        period2Container.appendChild(period2StartSelect);
        const period2EndSelect = document.createElement("select");
        availableDates.forEach(date => {
          const option = document.createElement("option");
          option.value = date;
          option.textContent = date;
          period2EndSelect.appendChild(option);
        });
        period2Container.appendChild(document.createTextNode(" 结束日期: "));
        period2Container.appendChild(period2EndSelect);
        modalContainer.appendChild(period2Container);
        const aspectsContainer = document.createElement("div");
        aspectsContainer.style.margin = "10px 0";
        const aspectsTitle = document.createElement("div");
        aspectsTitle.textContent = "请选择对比的方面：";
        aspectsContainer.appendChild(aspectsTitle);
        const aspects = [
          { label: "不同类型作品偏好对比", value: "prefType" },
          { label: "不同制作组偏好对比", value: "prefMaker" },
          { label: "不同制作组对比", value: "makerOverall" },
          { label: "制作组作品类型对比", value: "makerType" }
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
          aspectsContainer.appendChild(checkbox);
          aspectsContainer.appendChild(label);
          aspectsContainer.appendChild(document.createElement("br"));
        });
        modalContainer.appendChild(aspectsContainer);
        const btnContainer = document.createElement("div");
        btnContainer.style.marginTop = "15px";
        const okBtn = document.createElement("button");
        okBtn.textContent = "确定";
        okBtn.className = "btn";
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "取消";
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
            modal.customAlert("时间段1的开始日期不能晚于结束日期。");
            return;
          }
          if(new Date(p2Start) > new Date(p2End)){
            modal.customAlert("时间段2的开始日期不能晚于结束日期。");
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
        dragButton.innerHTML = "≡";
        container.appendChild(dragButton);
        const saveButton = document.createElement("button");
        saveButton.textContent = "保存";
        saveButton.className = "btn";
        saveButton.style.position = "absolute";
        saveButton.style.top = "5px";
        saveButton.style.right = "5px";
        saveButton.style.zIndex = "101";
        saveButton.addEventListener("click", () => {
          const canvas = container.querySelector("canvas");
          if(canvas){
            const url = canvas.toDataURL("image/png");
            utils.downloadFile(container.dataset.title + ".png", url);
          }
        });
        container.appendChild(saveButton);
        const hideButton = document.createElement("button");
        hideButton.textContent = "隐藏";
        hideButton.className = "btn";
        hideButton.style.position = "absolute";
        hideButton.style.top = "5px";
        hideButton.style.right = "60px";
        hideButton.style.zIndex = "101";
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
      const container = charts.createChartContainer("chartContainer1", "100px", "100px", "500px", "400px", "作品类型统计");
      const contentDiv = container.querySelector(".chart-content");
      contentDiv.innerHTML = `<h3 style="text-align:center; margin: 0;">作品类型统计 <button id="toggleGenreChartBtn" class="btn" style="margin-left: 10px; font-size: 12px;">切换为${currentType === 'bar' ? '饼状图' : '柱状图'}</button></h3>`;
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
          let content = `类型: ${genre}\n作品数: ${worksWithGenre.length}\n\n`;
          worksWithGenre.forEach(work => {
            content += `作品名称: ${work.name}\n制作组: ${work.makerName}\n购买日期: ${work.date}\n价格: ${work.price} 日元\n\n`;
          });
          modal.customAlert(content);
        }
      };
      window.genreChartObj = new Chart(ctx, {
        type: currentType,
        data: {
          labels: filteredGenreCount.map(item => item[0]),
          datasets: [{
            label: "作品数目",
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
      const container = charts.createChartContainer("chartContainer2", "100px", "650px", "500px", "400px", "制作组统计");
      const contentDiv = container.querySelector(".chart-content");
      contentDiv.innerHTML = `<h3 style="text-align:center; margin: 0;">制作组统计 <button id="toggleMakerChartBtn" class="btn" style="margin-left: 10px; font-size: 12px;">切换为${currentType === 'bar' ? '饼状图' : '柱状图'}</button></h3>`;
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
          let content = `制作组: ${maker}\n作品数: ${worksByMaker.length}\n\n`;
          worksByMaker.forEach(work => {
            content += `作品名称: ${work.name}\n购买日期: ${work.date}\n价格: ${work.price} 日元\n\n`;
          });
          modal.customAlert(content);
        }
      };
      window.makerChartObj = new Chart(ctx, {
        type: currentType,
        data: {
          labels: filteredMakerCount.map(item => item[0]),
          datasets: [{
            label: "作品数目",
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
      const container = charts.createChartContainer("chartContainer3", "550px", "100px", "500px", "400px", "每日购买数量");
      const contentDiv = container.querySelector(".chart-content");
      contentDiv.innerHTML = `<h3 style="text-align:center; margin: 0;">每日购买数量</h3>`;
      const canvas = document.createElement("canvas");
      canvas.style.width = "100%";
      canvas.style.height = "calc(100% - 30px)";
      contentDiv.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      if (window.timelineChartObj) { window.timelineChartObj.destroy(); }
      const options = {
        scales: {
          x: { title: { display: true, text: '购买日期' } },
          y: { beginAtZero: true, title: { display: true, text: '购买数量' } }
        },
        onClick: (evt, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const date = sortedDates[index];
            const worksOnDate = works.filter(work => new Date(work.date).toISOString().slice(0,10) === date);
            let content = `日期: ${date}\n购买数量: ${worksOnDate.length}\n\n`;
            worksOnDate.forEach(work => {
              content += `作品名称: ${work.name}\n制作组: ${work.makerName}\n价格: ${work.price} 日元\n\n`;
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
            label: "每日购买数量",
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
      const container = charts.createChartContainer("chartContainer4", "550px", "650px", "500px", "400px", "累计消费金额");
      const contentDiv = container.querySelector(".chart-content");
      contentDiv.innerHTML = `<h3 style="text-align:center; margin: 0;">累计消费金额（日元）</h3>`;
      const canvas = document.createElement("canvas");
      canvas.style.width = "100%";
      canvas.style.height = "calc(100% - 30px)";
      contentDiv.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      if (window.cumulativeChartObj) { window.cumulativeChartObj.destroy(); }
      const options = {
        scales: {
          x: { title: { display: true, text: '购买日期' } },
          y: { beginAtZero: true, title: { display: true, text: '累计金额' } }
        },
        onClick: (evt, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const date = sortedDates[index];
            const worksOnDate = works.filter(work => new Date(work.date).toISOString().slice(0,10) === date);
            let content = `日期: ${date}\n当日作品: ${worksOnDate.length}\n\n`;
            worksOnDate.forEach(work => {
              content += `作品名称: ${work.name}\n制作组: ${work.makerName}\n价格: ${work.price} 日元\n\n`;
            });
            const dayTotal = worksOnDate.reduce((sum, work) => sum + work.price, 0);
            modal.customAlertWithExtraInfo(content, "当天总价：" + dayTotal + " 日元");
          }
        }
      };
      window.cumulativeChartObj = new Chart(ctx, {
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
        options: options
      });
    },
    drawCombinedBarChart(title, labels, data1, data2, datasetLabel1, datasetLabel2, yAxisLabel, uniqueKey) {
      if(ui.existingComparisonCharts[uniqueKey]) {
        modal.customAlert("该分析已存在。");
        return;
      }
      ui.existingComparisonCharts[uniqueKey] = true;
      let containerId = "comparisonChart_" + (ui.comparisonCounter++);
      let top = (150 + ui.comparisonCounter * 20) + "px";
      let left = (150 + ui.comparisonCounter * 20) + "px";
      const container = charts.createChartContainer(containerId, top, left, "600px", "400px", title);
      const contentDiv = container.querySelector(".chart-content");
      contentDiv.innerHTML = `<h3 style="text-align:center; margin: 0;">${title}</h3>`;
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
              modal.customAlert("标签：" + clickedLabel + "\n" + datasetName + ": " + clickedValue);
            }
          }
        }
      });
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
          utils.styledLog(`🔁 第 ${attempt + 1} 次重试页面 ${pageNum}`, "color: #ff8c00; font-weight: bold;");
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
              utils.styledLog(`🔍 获取作品详情: ${w.url}`, "color: #9933ff; font-weight: bold;");
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
        ui.errorLogs.push("无法获取第一页数据，终止任务。");
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
      let md = `# DLsite 购买历史统计结果\n\n`;
      md += `## 统计概览\n\n`;
      md += `| 统计项目 | 数值 |\n`;
      md += `| --- | --- |\n`;
      md += `| 购买总数 | ${result.count} 部 |\n`;
      md += `| 总消费金额 | ${result.totalPrice} 日元 (${(result.totalPrice * exchangeRate).toFixed(2)} 人民币) |\n\n`;
      md += `## 各类型作品数排名\n\n`;
      md += `| 类型 | 作品数目 |\n`;
      md += `| --- | --- |\n`;
      filteredGenreCount.forEach(item => {
          md += `| ${item[0]} | ${item[1].count} |\n`;
      });
      md += `\n`;
      md += `## 各制作组作品数排名\n\n`;
      md += `| 制作组 | 作品数目 |\n`;
      md += `| --- | --- |\n`;
      filteredMakerCount.forEach(item => {
          md += `| ${item[0]} | ${item[1].count} |\n`;
      });
      md += `\n`;
      md += `## 已下架作品\n\n`;
      if (result.eol.length > 0) {
          md += `| 购买日期 | 制作组 | 作品名称 | 价格（円） |\n`;
          md += `| --- | --- | --- | --- |\n`;
          result.eol.forEach(eol => {
              md += `| ${eol.date} | ${eol.makerName} | ${eol.name} | ${eol.price} |\n`;
          });
      } else {
          md += `暂无已下架作品\n`;
      }
      md += `\n`;
      md += `## 时间轴视图\n\n`;
      const timelineGroups = {};
      result.works.forEach(work => {
        let day = new Date(work.date).toISOString().slice(0,10);
        if(!timelineGroups[day]) timelineGroups[day] = [];
        timelineGroups[day].push(work);
      });
      const sortedDates = Object.keys(timelineGroups).sort();
      sortedDates.forEach(date => {
          md += `### ${date} (${timelineGroups[date].length} 项)\n\n`;
          md += `| 作品名称 | 制作组 | 价格（円） |\n`;
          md += `| --- | --- | --- |\n`;
          timelineGroups[date].forEach(work => {
              md += `| ${work.name} | ${work.makerName} | ${work.price} |\n`;
          });
          md += `\n`;
      });
      return md;
    },
    generateCSV(result, exchangeRate, filteredGenreCount, filteredMakerCount) {
      let csv = "";
      csv += "统计项目,数值\n";
      csv += `购买总数,${result.count} 部\n`;
      csv += `总消费金额,${result.totalPrice} 日元,${(result.totalPrice * exchangeRate).toFixed(2)} 人民币\n\n`;
      csv += "各类型作品数排名\n";
      csv += "类型,作品数目\n";
      filteredGenreCount.forEach(item => {
          csv += `${item[0]},${item[1].count}\n`;
      });
      csv += "\n";
      csv += "各制作组作品数排名\n";
      csv += "制作组,作品数目\n";
      filteredMakerCount.forEach(item => {
          csv += `${item[0]},${item[1].count}\n`;
      });
      csv += "\n";
      csv += "已下架作品\n";
      csv += "购买日期,制作组,作品名称,价格（円）\n";
      if (result.eol.length > 0) {
          result.eol.forEach(eol => {
              csv += `${eol.date},${eol.makerName},${eol.name},${eol.price}\n`;
          });
      } else {
          csv += "暂无已下架作品\n";
      }
      csv += "\n";
      csv += "时间轴视图\n";
      const timelineGroups = {};
      result.works.forEach(work => {
        let day = new Date(work.date).toISOString().slice(0,10);
        if(!timelineGroups[day]) timelineGroups[day] = [];
        timelineGroups[day].push(work);
      });
      const sortedDates = Object.keys(timelineGroups).sort();
      sortedDates.forEach(date => {
          csv += `日期: ${date} (${timelineGroups[date].length} 项)\n`;
          csv += "作品名称,制作组,价格（円）\n";
          timelineGroups[date].forEach(work => {
              csv += `${work.name},${work.makerName},${work.price}\n`;
          });
          csv += "\n";
      });
      return "\ufeff" + csv;
      },
      generateJSON(result, exchangeRate, filteredGenreCount, filteredMakerCount) {
          const jsonObject = {
              count: result.count,
              totalPriceJPY: result.totalPrice,
              totalPriceCNY: (result.totalPrice * exchangeRate).toFixed(2),
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
      downloadBtn.textContent = "下载结果";
      downloadBtn.className = "btn";
      downloadBtn.style.position = "fixed";
      downloadBtn.style.top = "10px";
      downloadBtn.style.left = "10px";
      downloadBtn.style.zIndex = "100001";
      downloadBtn.addEventListener("click", async () => {
        const choice = await modal.customChoice("请选择要下载的文件格式：", [
          { label: "Markdown (.md)", value: "md" },
            { label: "CSV (.csv)", value: "csv" },
            { label: "JSON (.json)", value: "json" },
          { label: "全部下载", value: "all" }
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
        progressText.textContent = "准备中...";
        progressBar.appendChild(innerBar);
        progressBar.appendChild(progressText);
        document.body.appendChild(progressBar);
      }
      document.getElementById("innerProgressBar").style.width = progress + "%";
      const textElem = document.getElementById("progressText");
      if (textElem) {
        const rounded = Math.min(100, Math.max(0, Math.round(progress)));
        if (currentBatch && totalBatches) {
          textElem.textContent = `批次 ${currentBatch} / ${totalBatches} (${rounded}%)`;
        } else {
          textElem.textContent = isNaN(rounded) ? "准备中..." : `${rounded}%`;
        }
      }
    },
    addCompareButton(result, exchangeRate) {
      const compareBtn = document.createElement("button");
      compareBtn.id = "compareBtn";
      compareBtn.textContent = "数据对比分析";
      compareBtn.className = "btn";
      compareBtn.style.position = "fixed";
      compareBtn.style.top = "50px";
      compareBtn.style.left = "10px";
      compareBtn.style.zIndex = "100001";
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
      resetBtn.textContent = "重置";
      resetBtn.className = "btn";
      resetBtn.style.position = "fixed";
      resetBtn.style.bottom = "10px";
      resetBtn.style.right = "10px";
      resetBtn.style.background = "red";
      resetBtn.style.color = "white";
      resetBtn.style.zIndex = "100002";
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
    const isValidDLsitePage = () => {
      return /dlsite\.com\/maniax\/mypage\/userbuy/.test(window.location.href) &&
             document.querySelector(".work_list_main") !== null;
    };
    if (!isValidDLsitePage()) {
      const jump = await modal.customConfirm("当前页面未检测到 DLsite 购买记录，是否跳转到正确的购买历史页面？");
      if (jump) {
        window.location.href = "https://www.dlsite.com/maniax/mypage/userbuy/=/type/all/start/all/sort/1/order/1/page/1";
        return;
      } else {
        await modal.customAlert("请切换到 DLsite 购买历史页面后再运行此脚本。");
        return;
      }
    }
    utils.styledLog("✦ DLsite购买历史统计 ✦", "font-size: 28px; font-weight: bold; color: white; background: linear-gradient(to right, #ff6347, #ff1493, #8a2be2, #32cd32); padding: 10px; border-radius: 8px;");
    let detailMode = true;
    const quickView = await modal.customChoice("是否开启快速查看消费金额？（仅统计金额）", [
      { label: "是", value: "y" },
      { label: "否", value: "n" }
    ]);
    if (quickView.toLowerCase() === "y") detailMode = false;
    let dlurl = "https://www.dlsite.com/maniax/mypage/userbuy/=/type/all/start/all/sort/1/order/1/page/";
    if (detailMode) {
      const typeOptionsArr = [
        { label: "全部作品", value: "0" },
        { label: "同人：所有", value: "12" },
        { label: "同人：全年龄", value: "2" },
        { label: "同人：男性向", value: "1" },
        { label: "同人：女性向", value: "3" },
        { label: "商业游戏：所有", value: "13" },
        { label: "商业游戏：全年龄", value: "9" },
        { label: "商业游戏：男性向", value: "4" },
        { label: "漫画：所有", value: "14" },
        { label: "漫画：全年龄", value: "10" },
        { label: "漫画：男性向", value: "7" },
        { label: "漫画：女性向", value: "11" }
      ];
      const typeChoice = await modal.customChoice("请选择作品类型：", typeOptionsArr);
      if (typeChoice === "0") dlurl = dlurl.replace(/type\/[^/]+/, "type/all");
      else dlurl = dlurl.replace(/type\/[^/]+/, `type/${typeChoice}`);
    } else {
      dlurl = dlurl.replace(/type\/[^/]+/, "type/all");
    }
    let exchangeRate = 0.048;
    if (detailMode) {
      const exchangeChoice = await modal.customChoice("是否需要修改汇率？", [
        { label: "使用默认 (1人民币 = 0.048日元)", value: "default" },
        { label: "修改汇率", value: "modify" }
      ]);
      if (exchangeChoice === "modify") {
        const newExchangeRateStr = await modal.customPrompt("请输入新的人民币到日元的汇率（例如 0.05）：", "0.05");
        const newExchangeRate = parseFloat(newExchangeRateStr);
        if (!isNaN(newExchangeRate) && newExchangeRate > 0) exchangeRate = newExchangeRate;
        else utils.styledLog("❌ 输入无效，使用默认汇率", "color: red; font-weight: bold;", "error");
      } else {
        utils.styledLog("✔️ 使用默认汇率 1人民币 = 0.04858日元", "color: green; font-weight: bold;", "info");
      }
    }
    console.group("📄 页面抓取进度");
    const result = await dataProcessor.fetchAllPages(dlurl, detailMode, (currentBatch, totalBatches) => {
      ui.updateProgressBar((currentBatch / totalBatches) * 100, currentBatch, totalBatches);
    });
    console.groupEnd();
    const excludeResponse = await modal.customPrompt("请输入要排除的最少作品数目（例如输入 3 表示排除数目小于 3 的作品类型）：", "0");
    let excludeThreshold = 0;
    if (excludeResponse) {
      excludeThreshold = parseInt(excludeResponse);
      if (isNaN(excludeThreshold) || excludeThreshold < 0) {
        utils.styledLog("❌ 无效的输入，使用默认值 0（不过滤）", "color: red; font-weight: bold;", "error");
        excludeThreshold = 0;
      }
    } else {
      utils.styledLog("ℹ️ 未输入数值，使用默认值 0（不过滤）", "color: #666666; font-weight: bold;", "info");
    }
    result.genreCount = [...result.genreCount.entries()].sort((a, b) => b[1].count - a[1].count);
    result.makerCount = [...result.makerCount.entries()].sort((a, b) => b[1].count - a[1].count);
    const filteredGenreCount = excludeThreshold === 0 ? result.genreCount : result.genreCount.filter(([, entry]) => entry.count >= excludeThreshold);
    const filteredMakerCount = excludeThreshold === 0 ? result.makerCount : result.makerCount.filter(([, entry]) => entry.count >= excludeThreshold);
    const showChart = await modal.customChoice("是否显示图表数据展示？", [
      { label: "显示", value: "y" },
      { label: "不显示", value: "n" }
    ]);
    if (showChart.toLowerCase() === "y") {
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
    displayResults(result, exchangeRate, filteredGenreCount, filteredMakerCount);
    ui.addCompareButton(result, exchangeRate);
    downloadContent.addDownloadButton(result, exchangeRate, filteredGenreCount, filteredMakerCount);
    ui.addResetButton();
    console.clear();
  };

  const displayResults = (result, exchangeRate, filteredGenreCount, filteredMakerCount) => {
    const container = charts.createChartContainer("resultWindow", "200px", "200px", "1000px", "800px", "查询结果");
    const contentDiv = container.querySelector(".chart-content");
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
    contentDiv.appendChild(ui.createCollapsibleSection("统计概览", overviewHtml, false));
    const genreHtml = `
      <table>
        <tr>
          <th>类型</th>
          <th>作品数目</th>
        </tr>
        ${filteredGenreCount.map(([type, entry]) => `
          <tr>
            <td>${type} ${entry.link ? `<a href="${entry.link}" target="_blank" style="margin-left: 5px; font-size: 12px;">跳转</a>` : ''}</td>
            <td>${entry.count}</td>
          </tr>
        `).join('')}
      </table>
    `;
    contentDiv.appendChild(ui.createCollapsibleSection("各类型作品数排名", genreHtml, false));
    const makerHtml = `
      <table>
        <tr>
          <th>制作组</th>
          <th>作品数目</th>
        </tr>
        ${filteredMakerCount.map(([maker, entry]) => `
          <tr>
            <td>${maker} ${entry.link ? `<a href="${entry.link}" target="_blank" style="margin-left: 5px; font-size: 12px;">跳转</a>` : ''}</td>
            <td>${entry.count}</td>
          </tr>
        `).join('')}
      </table>
    `;
    contentDiv.appendChild(ui.createCollapsibleSection("各制作组作品数排名", makerHtml, false));
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
    contentDiv.appendChild(ui.createCollapsibleSection("已下架作品", eolHtml, false));
    let timelineHtml = "";
    const timelineGroups = {};
    result.works.forEach(work => {
      let day = new Date(work.date).toISOString().slice(0,10);
      if(!timelineGroups[day]) timelineGroups[day] = [];
      timelineGroups[day].push(work);
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
    contentDiv.appendChild(ui.createCollapsibleSection("时间轴视图", timelineHtml, true));
    const authorHtml = `
      <p>★ 本脚本由 凛遥crush 修改制作 ★</p>
      <p>★ 项目地址：<a href="https://github.com/linyaocrush/DLsite-Purchase-Analyzer" target="_blank">https://github.com/linyaocrush/DLsite-Purchase-Analyzer</a></p>
    `;
    contentDiv.appendChild(ui.createCollapsibleSection("作者信息", authorHtml, false));
    if (ui.errorLogs.length > 0) {
      const errorHtml = `<pre>${ui.errorLogs.join("\n")}</pre>`;
      contentDiv.appendChild(ui.createCollapsibleSection("错误日志", errorHtml, false));
    }
  };

  ui.createCollapsibleSection = (titleText, contentHtml, collapsed = false) => {
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

  ui.injectStyles();
  main();
})();
