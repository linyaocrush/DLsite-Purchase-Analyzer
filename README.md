
# DLsite 购买分析工具 v2.0

📈 基于用户行为的DLsite购买记录深度分析工具，支持可视化图表、交互式弹窗和智能数据导出

---

## 🚀 核心升级亮点
- **全新可视化系统**：集成 Chart.js 动态图表
- **增强交互体验**：完全自定义的模态窗口替代原生弹窗
- **智能错误处理**：实时错误日志记录与自动重试机制

---

## 🌟 功能特性

### 🖥️ 交互系统
- 动态弹窗系统（支持选择/确认/输入）
- 可拖拽缩放图表窗口
- GSAP 动画过渡效果
- 实时进度条反馈（支持控制台和页面双显示）

### 📊 数据分析
- **四维图表系统**：
  - 类型/制作组统计图（柱状图 ↔ 饼图双向切换）
  - 每日购买趋势折线图
  - 累计消费金额曲线
  - 时间轴分组视图（控制台交互式展示）
- 智能过滤系统（按最小作品数过滤次要数据）
- 汇率换算系统（支持实时汇率修改）

### 🛡️ 增强功能
- 自动页面检测与智能跳转
- 下架作品独立标记系统
- 数据沙盒模式（快速统计提速300%）
- 崩溃恢复机制（`window.reloadData`全局命令）

### 📦 输出系统
- 多格式导出支持（MD预览/CSV/控制台表格）
- 自适应移动端显示
- 错误日志追溯功能
- 作者信息水印系统

---

## 🛠️ 使用指南

### 环境准备
```javascript
// 最新浏览器要求
Chrome 89+ / Firefox 86+ / Edge 91+
```

### 快速启动
1. 登录 [DLsite购买记录页](https://www.dlsite.com/maniax/mypage/userbuy)
2. 打开开发者工具（F12）
3. 在Console面板粘贴完整代码

## 🔄 交互流程详解

```mermaid
graph TD
    A[脚本启动] --> B{页面检测}
    B -->|当前为DLsite页面| C[展示欢迎横幅]
    B -->|非DLsite页面| D[弹出跳转提示]
    D --> E{用户选择}
    E -->|确认跳转| F[重定向至购买记录页]
    E -->|取消操作| G[终止脚本运行]
    
    C --> H[模式选择对话框]
    H --> I{选择模式}
    I -->|快速模式| J[跳过详情抓取]
    I -->|详细模式| K[发起作品类型选择]
    
    K --> L[弹出类型筛选器]
    L --> M{选择具体类型}
    M -->|选择0（全部）| N[保持默认URL]
    M -->|选择特定类型| O[修改请求参数]
    
    J --> P[汇率设置对话框]
    K --> P
    P --> Q{需要修改汇率?}
    Q -->|是| R[弹出数字输入框]
    Q -->|否| S[使用默认汇率0.04858]
    
    R --> T[输入校验]
    T -->|有效数字| U[更新汇率值]
    T -->|无效输入| V[提示错误并恢复默认]
    
    U --> W[启动数据抓取]
    S --> W
    W --> X[显示双进度反馈]
    X --> Y[[实时进度条]]
    X --> Z[控制台分页显示]
    
    W --> AA[数据清洗阶段]
    AA --> AB{存在下架作品?}
    AB -->|是| AC[独立标记EOL列表]
    AB -->|否| AD[进入统计阶段]
    
    AD --> AE[弹出过滤阈值设置]
    AE --> AF[输入最小作品数]
    AF --> AG[执行数据过滤]
    
    AG --> AH[图表配置对话框]
    AH --> AI{显示图表?}
    AI -->|是| AJ[异步加载Chart.js]
    AI -->|否| AK[跳过图表渲染]
    
    AJ --> AL[生成四图表容器]
    AL --> AM[用户交互事件]
    AM --> AN[图表类型切换]
    AM --> AO[窗口拖拽/缩放]
    
    AK --> AP[结果导出对话框]
    AH --> AP
    AP --> AQ{保存文件?}
    AQ -->|是| AR[格式选择]
    AQ -->|否| AS[控制台完整输出]
    
    AR --> AT[[MD预览窗口]]
    AR --> AU[直接下载CSV]
    AT --> AV[交互式预览]
    AV --> AW[确认下载]
    
    AS --> AX[打印美化表格]
    AX --> AY[展开时间轴分组]
    AY --> AZ[控制台折叠展示]
    
    AZ --> BA[错误检测模块]
    BA --> BB{存在错误日志?}
    BB -->|是| BC[高亮显示错误条目]
    BB -->|否| BD[显示成功标识]
    
    BD --> BE[展示作者信息]
    BE --> BF[显示项目地址]
    BF --> BG[脚本运行结束]
```

---

## ⚙️ 参数配置

### 模式选择
| 选项 | 功能说明 |
|------|----------|
| 快速模式 | 仅统计基础消费数据（跳过详情请求） |
| 详细模式 | 完整标签分析 + 主类型统计 |

### 高级设置
```markdown
1. 汇率校准：默认 1CNY=0.04858JPY，支持精确到小数点后6位
2. 过滤阈值：输入数字N将自动过滤作品数<N的分类
3. 图表配置：每个图表独立记忆显示类型（柱状图/饼图）
```

---

## 📊 输出示例

### 控制台输出
```markdown
✦ DLsite购买历史统计 ✦
共购买作品：189 部
累计消费金额：¥82,450 JPY（≈¥3,987.51 CNY）

★ 各类型统计 ★
同人音声    | ██████████ 58
成人向游戏  | ███████ 37
漫画合集    | █████ 25

★ 图表系统 ★
[动态窗口1] 类型分布（柱状图）
[动态窗口2] 制作组排行（饼图）
[动态窗口3] 消费趋势折线图
```

### 文件导出
```markdown
# DLsite购买历史查询报告

## 消费轨迹分析
![累计消费图](data:image/png;base64,...)

## 异常记录
| 日期       | 作品名称         | 状态   |
|------------|------------------|--------|
| 2025/03/05 | [已下架]作品X    | 404    |
```

---

## ⚠️ 注意事项

### 性能优化
```markdown
1. 推荐在PC端运行（移动端自动适配显示但功能受限）
2. 100+作品建议开启快速模式
3. 使用 `window.clearLogs` 清理内存
```

### 错误处理
```markdown
遇到网络错误时：
1. 自动重试3次
2. 错误日志存储在 errorLogs 数组
3. 支持通过 reloadData 命令恢复
```

---

## 🏗️ 技术架构详解

### 系统分层架构
```mermaid
graph TB
    subgraph UI层
        A[可视化组件] --> A1[Chart.js 图表]
        A --> A2[GSAP 动画]
        A --> A3[自定义模态系统]
        A --> A4[可拖拽容器]
    end
    
    subgraph 数据层
        B[核心逻辑] --> B1[Fetch API]
        B --> B2[DOM解析器]
        B --> B3[并发控制器]
        B --> B4[数据清洗器]
    end
    
    subgraph 持久层
        C[数据输出] --> C1[Blob 存储]
        C --> C2[FileSaver.js]
        C --> C3[Console.table]
    end
    
    subgraph 工具层
        D[辅助模块] --> D1[进度管理器]
        D --> D2[错误收集器]
        D --> D3[汇率转换器]
        D --> D4[内存清理器]
    end
```

### 关键技术栈

#### 核心依赖库
| 库/技术 | 版本 | 用途 | 关键实现 |
|---------|------|------|----------|
| **Chart.js** | 4.4.0 | 数据可视化 | `drawGenreChart()` `drawMakerChart()` |
| **GSAP** | 3.12.0 | 动画引擎 | `animateModalIn()` `fadeOut()` |
| **DOMParser** | Native | DOM解析 | `processPage()` 数据提取 |
| **FileSaver** | 2.0.5 | 文件导出 | `exportCSV()` 实现下载 |

#### 原生技术应用
```markdown
1. **Web Animation API**  
   - 实现进度条动态效果
   - 控制台进度动画（ASCII字符）

2. **CSS Grid/Flex**  
   - 响应式图表容器布局
   - 模态窗口自适应布局

3. **ResizeObserver**  
   - 监听图表窗口缩放事件
   - 动态调整Canvas画布尺寸

4. **Proxy API**  
   - 全局状态管理（错误日志/图表类型状态）
```

### 关键模块实现

#### 1. 并发控制系统
```javascript
// 最大并行数控制
const MAX_CONCURRENT = 5;
let activePromises = 0;

async function controlledFetch(url) {
  while (activePromises >= MAX_CONCURRENT) {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  activePromises++;
  try {
    return await fetch(url);
  } finally {
    activePromises--;
  }
}
```

#### 2. 内存管理机制
```javascript
// 智能清理策略
const memoryWatcher = {
  threshold: 0.8, // 内存使用阈值
  cleanup() {
    if (performance.memory.usedJSHeapSize / 
        performance.memory.jsHeapSizeLimit > this.threshold) {
      this.forceCleanup();
    }
  },
  forceCleanup() {
    genreChartObj?.destroy();
    makerChartObj?.destroy();
    URL.revokeObjectURL(blobCache);
  }
};

// 每60秒检测一次
setInterval(() => memoryWatcher.cleanup(), 60000);
```

#### 3. 动画系统架构
```mermaid
graph LR
    A[动画触发] --> B{GSAP可用?}
    B -->|是| C[使用GSAP Timeline]
    B -->|否| D[原生Web Animations]
    C --> E[贝塞尔曲线缓动]
    D --> F[CSS Transitions]
    E --> G[复合动画]
    F --> G
    G --> H[回调队列]
```

### 性能优化策略

#### 数据抓取优化
```markdown
1. **分页预加载**  
   - 使用 `Promise.allSettled()` 并行请求
   - 动态调整并发数（根据网络延迟）

2. **DOM缓存**  
   - 复用已解析的文档对象
   - 选择器结果缓存池

3. **增量渲染**  
   - 分批次处理DOM节点（每50ms处理10个节点）
```

#### 图表优化
```javascript
// Canvas渲染优化
Chart.defaults.animation = false; // 禁用默认动画
Chart.defaults.datasets.bar.barThickness = 25; // 固定柱宽
Chart.defaults.elements.point.radius = 3; // 优化数据点

// 智能重绘策略
function debouncedRedraw() {
  let isRendering = false;
  return () => {
    if (!isRendering) {
      requestAnimationFrame(() => {
        genreChartObj?.update();
        makerChartObj?.update();
        isRendering = false;
      });
      isRendering = true;
    }
  };
}
```

### 安全机制
```markdown
1. **沙盒模式**  
   - 使用 `Proxy` 封装全局变量
   - 限制内存操作权限

2. **输入验证**  
   ```javascript
   // 汇率输入验证
   const validateExchangeRate = (input) => {
     return /^0\.0\d{1,5}$/.test(input) && 
            parseFloat(input) > 0;
   };
   ```

3. **CORS处理**  
   - 动态添加 `no-cors` 模式
   - 失败请求自动重试（指数退避算法）
```

---

> 📌 **架构设计原则**  
> 1. 模块化设计 - 每个功能模块最大代码行数≤200  
> 2. 内存安全 - 对象销毁后自动触发GC  
> 3. 渐进增强 - 核心功能不依赖第三方库  
> 4. 响应式优先 - 所有组件适配移动端触控
```

---

## 📌 版本历史

### v2.0 (2025/03/03)
- 新增四维图表系统
- 重构交互系统（弃用alert/prompt）
- 增加窗口拖拽缩放功能
- 优化移动端自适应
- 实现沙盒模式内存管理
- 添加GSAP动画引擎支持
- 错误处理系统升级

### v1.2 (2025/02/24)
- 增强CSV导出功能
- 优化控制台显示逻辑

---

## 📄 许可证
MIT License | 严禁用于商业用途  
完整声明见代码头部注释

---

> 🌐 项目地址：https://github.com/linyaocrush/DLsite-Purchase-Analyzer  
> 📧 问题反馈：附带控制台错误截图创建Issue
```
