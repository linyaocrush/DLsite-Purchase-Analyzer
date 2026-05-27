<div align="center">

# DLsite 购买分析工具

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.4-green.svg)](#版本历史)

**深度分析你的 DLsite 购买记录 — 可视化图表、交互式筛选、多格式导出**

[日本語](README-JP.md) · [English](readme-EN.md) · **简体中文**

</div>

---

## 快速开始

1. 登录 [DLsite 购买记录页](https://www.dlsite.com/maniax/mypage/userbuy)
2. 按 `F12` 打开开发者工具 → Console 面板
3. 粘贴 `DLsite.js` 的完整代码并回车
4. 按弹窗提示操作即可

> 浏览器要求：Chrome 89+ / Firefox 86+ / Edge 91+

---

## 功能一览

<table>
<tr>
<td width="50%">

### 数据分析
- **四维图表**：类型分布、制作组排行、每日趋势、累计消费（柱状图/饼图一键切换）
- **时间段对比**：选取两个时间段，对比类型偏好、制作组偏好、消费金额等
- **实时筛选**：关键词、制作组、日期范围、价格区间 — 表格与图表同步刷新
- **汇率换算**：内置 CNY / USD / JPY 默认汇率，可自定义修改

</td>
<td width="50%">

### 交互体验
- **自定义弹窗**：完全替代原生 alert/prompt/confirm，支持键盘导航与焦点捕获
- **可拖拽窗口**：图表与结果窗口支持拖拽移动和缩放
- **三语界面**：中文 / English / 日本語 随时切换，汇率配置独立记忆
- **进度反馈**：页面进度条 + 控制台分页提示，抓取过程一目了然

</td>
</tr>
</table>

---

## 模式说明

| 模式 | 说明 | 适用场景 |
|:---:|------|----------|
| **快速** | 仅统计金额，跳过作品详情抓取 | 作品数量多（100+）、只想看总消费 |
| **详细** | 抓取每部作品的类型标签，生成完整统计 | 需要类型分布、制作组排行等深度分析 |

---

## 导出格式

| 格式 | 内容 |
|------|------|
| **Markdown** | 完整报告：概览表、类型排名、制作组排名、已下架作品、时间轴 |
| **CSV** | BOM 前缀，可直接用 Excel 打开 |
| **JSON** | 结构化数据，方便二次开发 |
| **图表 PNG** | 每个图表窗口内置保存按钮 |

支持一键全部下载。

---

## 汇率配置

脚本根据界面语言自动选择默认汇率：

| 语言 | 货币 | 默认汇率 |
|:----:|:----:|:--------:|
| 简体中文 | 人民币 (CNY) | 1 JPY = 0.048 CNY |
| English | 美元 (USD) | 1 JPY = 0.0064 USD |
| 日本語 | 日元 (JPY) | 不转换 |

运行时可通过弹窗自定义汇率，修改后按语言独立记忆。

---

## 技术架构

```
DLsite.js（单文件 IIFE，约 2600 行）
├── utils          工具函数：日志、下载、拖拽、DOM 清理
├── cache          localStorage TTL 缓存（24h）
├── i18n           三语国际化（zh / en / ja）
├── appState       全局可变状态
├── currencyHelper 汇率换算
├── modal          自定义弹窗系统（alert / prompt / confirm / choice / period-select）
├── charts         Chart.js 图表生命周期管理
├── compareAllAspects  时间段对比引擎
├── dataProcessor  分页抓取（4 并发，2 次重试）+ HTML 解析
├── downloadContent    Markdown / CSV / JSON 导出
├── ui             样式注入、进度条、语言切换器、按钮管理
├── cleanup        完整清理（监听器、图表、DOM 元素）
├── main           入口：页面校验 → 配置弹窗 → 抓取 → 聚合 → 渲染
└── displayResults 结果窗口：实时筛选 + 可折叠分组
```

### 运行时依赖（CDN）

| 库 | 版本 | 用途 |
|----|:----:|------|
| [Chart.js](https://www.chartjs.org/) | 4.4.0 | 数据可视化（用户选择显示图表时动态加载） |

---

## 注意事项

- 建议在 **PC 端** 使用（移动端功能受限）
- 脚本设计为**可重复运行**：每次执行前自动清理上次的 UI 和状态
- 网络请求失败时自动重试（最多 2 次），错误日志显示在结果窗口底部
- 仅在 `dlsite.com/maniax/mypage/userbuy` 页面生效，其他页面会提示跳转

---

## 版本历史

| 版本 | 日期 | 更新内容 |
|:----:|:----:|----------|
| **v2.4** | 2025/04/22 | 新增 JSON 导出与一键全下载；三语切换器 + 汇率记忆 |
| **v2.3** | 2025/03/18 | 结果窗口新增筛选器（关键词/制作组/日期/价格）+ 对比/下载/重置按钮 |
| **v2.2** | 2025/03/08 | 新增时间段对比分析功能；新增图表 PNG 下载 |
| **v2.1** | 2025/03/07 | 新增浮动结果窗口，替代控制台输出 |
| **v2.0** | 2025/03/03 | 四维图表系统；自定义弹窗替代原生对话框；拖拽/缩放；GSAP 动画 |
| **v1.2** | 2025/02/24 | 增强 CSV 导出；优化控制台显示 |

---

## 许可证

MIT License

---

<div align="center">

**项目地址** · [GitHub](https://github.com/linyaocrush/DLsite-Purchase-Analyzer) · 问题反馈请附带控制台错误截图

![Visitors](https://count.getloli.com/@linyaocrush?name=DLsite-Purchase-Analyzer&theme=gelbooru&padding=7&offset=0&align=top&scale=1&pixelated=1&darkmode=auto)

<a href="https://star-history.com/#linyaocrush/DLsite-Purchase-Analyzer&Timeline">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=linyaocrush/DLsite-Purchase-Analyzer&type=Timeline&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=linyaocrush/DLsite-Purchase-Analyzer&type=Timeline" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=linyaocrush/DLsite-Purchase-Analyzer&type=Timeline" />
 </picture>
</a>

</div>
