# DLsite Purchase Analysis Tool

📈 A deep analysis tool for DLsite purchase records based on user behavior, supporting visual charts, interactive pop-ups, and smart data export
- Please copy the code from DLsite.js into the browser console to use

---

## 🚀 Core Upgrade Highlights

- **New Visualization System**: Integrated dynamic charts with Chart.js
- **Enhanced Interaction Experience**: Replaced native pop-ups with fully customizable modal windows
- **Smart Error Handling**: Real-time error log recording and auto-retry mechanism
- **Added Data Comparison Analysis Feature**: Compare purchases and spending across different time periods
  *(See version history v2.2)*
- **Added Chart Download Feature**: Download buttons added to each chart window for saving as PNG images
  *(See version history v2.2)*

---

## 🌟 Functional Characteristics

### 🖥️ Interaction System
- Dynamic pop-up system (supports selection, confirmation, and input)
- Drag-and-drop, resizable chart windows
  *(Note: New result windows have replaced the original console output, with all statistics and charts displayed in independent windows)*
- GSAP animation transition effects
- Real-time progress bar feedback (supports display in both console and page)

### 📊 Data Analysis
- **Four-Dimensional Chart System**:
  - Genre/creator group statistics charts (supports switching between bar and pie charts)
  - Daily purchase trend line chart
  - Cumulative spending curve
    *(Click charts to view detailed work information and daily totals)*
- **Data Comparison Analysis Function**:
  The new comparison module allows users to select two time periods and compare the following aspects:
  - Comparison of preferences for different types of works
  - Comparison of preferences for different creator groups
  - Overall comparison of creator groups (number of purchases and spending amount)
  - Comparison of work types by creator group
  Comparison results are displayed in a unified comparison chart container in the form of combined bar charts.
- Smart filtering system (filters secondary data by minimum number of works)
- Exchange rate conversion system (supports real-time exchange rate modification)

### 🛡️ Enhanced Features
- Automatic page detection and smart jump
- Independent marking system for discontinued works
- Data sandbox mode (speeds up statistics by 300%)
- Crash recovery mechanism (restore via the global command `window.reloadData`)

### 📦 Output System
- Support for multiple export formats (MD preview, CSV, console table)
- Adaptive display for mobile devices
- Error log tracing function
- **Chart Download Feature**: Click the "Save" button in each chart window to export the current chart as a PNG image

---

## 🛠️ Usage Guide

### Environment Preparation
```javascript
// Latest browser requirements
Chrome 89+ / Firefox 86+ / Edge 91+
```

### Quick Start
1. Log in to the [DLsite Purchase Records Page](https://www.dlsite.com/maniax/mypage/userbuy)
2. Open Developer Tools (F12)
3. Paste the full code into the Console panel

## 🔄 Detailed Interaction Flow Explanation

```mermaid
graph TD
    A[Script Launch] --> B{Page Detection}
    B -->|Current page is DLsite| C[Display Welcome Banner]
    B -->|Not a DLsite page| D[Display Jump Prompt]
    D --> E{User Choice}
    E -->|Confirm Jump| F[Redirect to Purchase Records Page]
    E -->|Cancel Operation| G[Script Termination]
    
    C --> H[Mode Selection Dialog]
    H --> I{Mode Selection}
    I -->|Quick Mode| J[Skip Detail Fetching]
    I -->|Detail Mode| K[Initiate Work Type Selection]
    
    K --> L[Display Type Filter]
    L --> M{Select Specific Type}
    M -->|Select 0 (All)| N[Maintain Default URL]
    M -->|Select Specific Type| O[Modify Request Parameters]
    
    J --> P[Exchange Rate Setting Dialog]
    K --> P
    P --> Q{Need to Modify Exchange Rate?}
    Q -->|Yes| R[Display Number Input Box]
    Q -->|No| S[Use Default Exchange Rate 0.04858]
    
    R --> T[Input Validation]
    T -->|Valid Number| U[Update Exchange Rate]
    T -->|Invalid Input| V[Show Error and Restore Default]
    
    U --> W[Start Data Fetching]
    S --> W
    W --> X[Display Dual Progress Feedback]
    X --> Y[[Real-time Progress Bar]]
    X --> Z[Console Pagination Display]
    
    W --> AA[Data Cleaning Stage]
    AA --> AB{Are There Discontinued Works?}
    AB -->|Yes| AC[Independently Mark EOL List]
    AB -->|No| AD[Proceed to Statistics Stage]
    
    AD --> AE[Filter Threshold Setting]
    AE --> AF[Enter Minimum Number of Works]
    AF --> AG[Execute Data Filtering]
    
    AG --> AH[Chart Configuration Dialog]
    AH --> AI{Display Charts?}
    AI -->|Yes| AJ[Asynchronously Load Chart.js]
    AI -->|No| AK[Skip Chart Rendering]
    
    AJ --> AL[Generate Four-Chart Container]
    AL --> AM[User Interaction Events]
    AM --> AN[Chart Type Switching]
    AM --> AO[Window Dragging/Resizing]
    
    AK --> AP[Results Export Dialog]
    AH --> AP
    AP --> AQ{Save File?}
    AQ -->|Yes| AR[Format Selection]
    AQ -->|No| AS[Full Console Output]
    
    AR --> AT[[MD Preview Window]]
    AR --> AU[Direct CSV Download]
    AT --> AV[Interactive Preview]
    AV --> AW[Confirm Download]
    
    AS --> AX[Print Beautified Table]
    AX --> AY[Expand Timeline Groups]
    AY --> AZ[Console Collapsed Display]
    
    AZ --> BA[Error Detection Module]
    BA --> BB{Are There Error Logs?}
    BB -->|Yes| BC[Highlight Error Entries]
    BB -->|No| BD[Display Success Icon]
    
    BD --> BE[Display Author Information]
    BE --> BF[Show Project Address]
    BF --> BG[Script Execution Ends]
    
    %% New Data Comparison Analysis Flow
    BG --> BH[Data Comparison Analysis Module Launch]
    BH --> BI[User Selects Time Periods and Comparison Aspects]
    BI --> BJ[Generate Comparison Chart (Combined Bar Chart)]
```

### Key Interaction Node Explanations

#### 1. Dynamic Pop-up System
- **Three-Layer Pop-up Architecture**:
  - Base Layer: Semi-transparent overlay (`.modal-overlay`)
  - Content Layer: Adaptive container (`.modal-container`)
  - Operation Layer: Button group (`.btn` cluster)
- **Smart Focus**: The last pop-up always gets the highest z-index

#### 2. Chart Interaction
- **Instant Redraw**: Destroy old Chart instance and rebuild when switching buttons are clicked
- **Memory Function**: Each chart's type state (bar/pie) is independently stored in global variables
- **Responsive Design**:
  ```javascript
  // Window resize event listener
  container.style.resize = "both";
  // Canvas size adapts automatically
  canvas.style.width = "100%";
  canvas.style.height = "calc(100% - 30px)";
  ```

#### 3. Data Fetching Flow
```mermaid
graph LR
    A[Starting Page] --> B[DOM Parsing]
    B --> C{Detail Mode?}
    C -->|Yes| D[Initiate Detail Requests]
    C -->|No| E[Skip Details]
    D --> F[Parallel Request Management]
    F --> G[Max Concurrency Control]
    G --> H[Error Retry Mechanism]
    H --> I[Data Aggregation]
    E --> I
```

#### 4. Exception Handling Path
```mermaid
graph TD
    A[Network Request] --> B{Status Code 200?}
    B -->|No| C[Record Error Log]
    C --> D[Retry Counter +1]
    D --> E{Retries <3?}
    E -->|Yes| F[Retry After 1 Second Delay]
    E -->|No| G[Mark as Failed Request]
    B -->|Yes| H[Continue Data Processing]
```

#### 5. File Export Flow
```mermaid
graph LR
    A[Export Triggered] --> B{Format Selection}
    B --> C[MD Preview]
    B --> D[Direct CSV Export]
    B --> E[Combined Export]
    C --> F[Blob Generation]
    D --> F
    E --> F
    F --> G[Virtual Download]
    G --> H[Memory Release]
```

---

## ⚙️ Parameter Configuration

### Mode Selection
| Option   | Function Description                                   |
| ------ | ------------------------------------------------------ |
| Quick Mode | Statistics on basic consumption data only (skips detail requests) |
| Detail Mode | Complete label analysis + main type statistics      |

### Advanced Settings
```markdown
1. Exchange Rate Calibration: Default is 1 CNY = 0.04858 JPY, supports up to 6 decimal places
2. Filter Threshold: Entering a number N automatically filters categories with fewer works
3. Chart Configuration: Each chart independently remembers its display type (bar/pie chart)
```

---

## 📊 Output Examples

### Console Output
```markdown
✦ DLsite Purchase History Statistics ✦
Total works purchased: 189
Cumulative consumption amount: ¥82,450 JPY (≈¥3,987.51 CNY)

★ Genre Statistics ★
Doujin Audio    | ██████████ 58
Adult Game  | ███████ 37
Manga Collection    | █████ 25

★ Chart System ★
[Dynamic Window 1] Genre Distribution (Bar/Pie Chart Switch)
[Dynamic Window 2] Creator Group Ranking (Bar/Pie Chart Switch)
[Dynamic Window 3] Consumption Trend Line Chart
[Dynamic Window 4] Cumulative Consumption Curve
```

### File Export
```markdown
# DLsite Purchase History Inquiry Report

## Consumption Trend Analysis
![Cumulative Consumption Chart](data:image/png;base64,...)

## Exception Records
| Date       | Work Title         | Status |
|------------|--------------------|--------|
| 2025/03/05 | [Discontinued] Work X    | 404    |
```

---

## ⚠️ Notes

### Performance Optimization
```markdown
1. Recommended to run on PC (mobile devices automatically adapt but have limited functionality)
2. For purchases over 100, quick mode is suggested
3. Use `window.clearLogs` to clean up memory
```

### Error Handling
```markdown
When encountering network errors:
1. Automatically retry 3 times
2. Error logs stored in errorLogs array
3. Support recovery via reloadData command
```

---

## 🏗️ Technical Architecture Details

### System Layer Architecture
```mermaid
graph TB
    subgraph UI Layer
        A[Visualization Components] --> A1[Chart.js Charts]
        A --> A2[GSAP Animations]
        A --> A3[Custom Modal System]
        A --> A4[Draggable Containers]
    end
    
    subgraph Data Layer
        B[Core Logic] --> B1[Fetch API]
        B --> B2[DOM Parser]
        B --> B3[Concurrency Controller]
        B --> B4[Data Cleaner]
    end
    
    subgraph Persistence Layer
        C[Data Output] --> C1[Blob Storage]
        C --> C2[FileSaver.js]
        C --> C3[Console.table]
    end
    
    subgraph Tool Layer
        D[Helper Modules] --> D1[Progress Manager]
        D --> D2[Error Collector]
        D --> D3[Exchange Converter]
        D --> D4[Memory Cleaner]
    end
```

### Key Technology Stack

#### Core Dependency Libraries
| Library/Technology         | Version    | Purpose               | Key Implementation Functions                         |
| -------------------------- | ------- | --------------------- | ---------------------------------------------------- |
| **Chart.js**               | 4.4.0   | Data Visualization    | `drawGenreChart()`, `drawMakerChart()` etc.          |
| **GSAP**                   | 3.12.0  | Animation Engine      | `animateModalIn()`, `fadeOut()`                      |
| **DOMParser**              | Native  | DOM Parsing           | `processPage()` data extraction                      |
| **FileSaver**              | 2.0.5   | File Export           | `exportCSV()` download implementation               |

#### Native Technology Applications
```markdown
1. **Web Animation API**
   - Implement progress bar dynamic effects
   - Console progress animation (ASCII characters)

2. **CSS Grid/Flex**
   - Responsive chart container layout
   - Custom modal window adaptive layout

3. **ResizeObserver**
   - Listen for chart window resize events
   - Dynamically adjust Canvas canvas size

4. **Proxy API**
   - Global state management (error logs/chart type states)
```

### Key Module Implementations

#### 1. Concurrency Control System
```javascript
// Maximum concurrent control
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

#### 2. Memory Management Mechanism
```javascript
// Smart cleanup strategy
const memoryWatcher = {
  threshold: 0.8, // Memory usage threshold
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

// Detect every 60 seconds
setInterval(() => memoryWatcher.cleanup(), 60000);
```

#### 3. Animation System Architecture
```mermaid
graph LR
    A[Animation Trigger] --> B{Is GSAP Available?}
    B -->|Yes| C[Use GSAP Timeline]
    B -->|No| D[Use Native Web Animations]
    C --> E[Bezier Curve Easing]
    D --> F[CSS Transitions]
    E --> G[Composite Animations]
    F --> G
    G --> H[Callback Queue]
```

### Performance Optimization Strategies

#### Data Fetching Optimization
```markdown
1. **Pagination Preloading**
   - Use Promise.allSettled() for parallel requests
   - Dynamically adjust concurrency based on network latency

2. **DOM Caching**
   - Reuse parsed document objects
   - Selector result cache pool

3. **Incremental Rendering**
   - Process DOM nodes in batches (every 50ms process 10 nodes)
```

#### Chart Optimization
```javascript
// Canvas rendering optimization
Chart.defaults.animation = false; // Disable default animations
Chart.defaults.datasets.bar.barThickness = 25; // Fixed bar width
Chart.defaults.elements.point.radius = 3; // Optimize data points

// Smart redraw strategy
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

### Security Mechanisms
```markdown
1. **Sandbox Mode**
   - Use Proxy to encapsulate global variables
   - Restrict memory operation permissions

2. **Input Validation**
   ```javascript
   // Exchange rate input validation
   const validateExchangeRate = (input) => {
     return /^0\.0\d{1,5}$/.test(input) && 
            parseFloat(input) > 0;
   };
   ```

### CORS Handling
   - Dynamically add no-cors mode
   - Failed requests automatically retry using exponential backoff algorithm


> 📌 **Architecture Design Principles**
> 1. Modular design - Each functional module has a maximum of 200 lines of code
> 2. Memory safety - Objects are automatically garbage collected after destruction
> 3. Progressive enhancement - Core functions don't depend on third-party libraries
> 4. Mobile-first - All components adapt to mobile touch interactions

---

## 📌 Version History

### v2.2 (2025/03/08)
- Added data comparison analysis feature (compares purchases and spending across different time periods)
- Added chart download feature

### v2.1 (2025/03/07)
- Added result windows so users no longer need to view console output

### v2.0 (2025/03/03)
- Added four-dimensional chart system
- Restructured interaction system (replaced all alerts/prompts with custom modals)
- Added window drag and resize functionality
- Optimized mobile device adaptability
- Implemented sandbox mode memory management
- Added GSAP animation engine support
- Upgraded error handling system

### v1.2 (2025/02/24)
- Enhanced CSV export functionality
- Optimized console display logic

---

## 📄 License
MIT License | Prohibited for commercial use
Full statement in code header comments

---

> 🌐 Project Address: https://github.com/linyaocrush/DLsite-Purchase-Analyzer
> 📧 Issue Feedback: Please attach console error screenshots when creating issues
