# UI/UX 設計規範 (UI Design Context)

本文件定義了 FRM Python 互動式學習平台的視覺風格、佈局結構與交互規範，旨在提供專業、流暢且具備金融工具感的使用體驗。

## 1. 視覺美學 (Visual Aesthetics)

### 1.1 設計風格
- **現代與高級感**：採用微光玻璃擬態 (Glassmorphism Lite)，結合細緻的邊框與柔和的陰影。
- **金融質感**：字體與間距追求精準與大氣，配色穩定且易於長期閱讀。
- **雙主題支援 (Dual Theme)**: 
    - **預設淺色 (Light Mode Default)**: 基於金融學術閱讀的長時間專注需求，採用高對比度、低視覺疲勞的淺色主題作為原生預設值。
    - **深色模式 (Dark Mode)**: 提供完整的深色適配，適用於低光源環境或開發者偏好。

### 1.2 配色方案 (Color System)
- **品牌色**: 科技藍 (`#0ea5e9`) 用於按鈕、進度條與選中狀態。
- **背景色**:
    - **亮色模式**: 背景 `hsl(210, 40%, 98%)`, 面板 `rgba(255, 255, 255, 0.7)`。
    - **深色模式**: 背景 `hsl(222, 47%, 11%)`, 面板 `rgba(30, 41, 59, 0.7)`。
- **玻璃效果**: `backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1);`
- **決策矩陣效果**: 表格採用交替行背景色 (`nth-child(even): bg-black/5` 或 `bg-white/5`)，並具備圓角邊框，提升資料可讀性。

### 1.3 字體規範 (Typography) - [REDESIGNED]
- **UI 預設字體**: `Inter`, `Outfit`, `PingFang TC`, `Noto Sans TC`, `system-ui`, sans-serif。
- **內文/內容字體**: `Inter`, `system-ui`, sans-serif (Line-height: 1.8)。
- **代碼/等寬字體**: `Fira Code`, `JetBrains Mono`, `Consolas`, monospace (啟用 Ligatures)。
- **字體權重**:
    - 常規 (Regular): 400
    - 中等 (Medium): 500
    - 半粗 (Semibold): 600
    - 粗體 (Bold): 700

## 2. 桌機版佈局結構 (Desktop Layout Structure) - [DETAILED]

針對桌機瀏覽器環境，應用程式採用全螢幕沉浸式的工作區佈局，極大化利用桌面空間以平衡「閱讀學習」與「實作執行」。

### 2.1 頂部導航列 (Fixed Top Navbar)
- **定位與尺寸**: 固定於視窗頂部，高度設定為 `64px`，確保下方內容區擁有穩定空間。
- **視覺效果**: 具備微光玻璃擬態 (Glassmorphism)，背景為 `hsla(210, 40%, 96%, 0.8)` 搭配 `backdrop-filter: blur(12px)`。
- **功能分區**:
    - **右側 (Logo/Title)**: 包含 `Book` 圖示與專案名稱。
    - **中央 (Selections)**：核心操作區，包含「章節選擇 (Chapter)」、「重點導覽 (Topic)」與「代碼檔案 (Script)」三個下拉選單，提供層次化的導航體驗。
    - **左側 (Actions)**: 包含「深/淺色模式」切換按鈕。

### 2.2 雙面板學習容器 (Dual-Pane Workspace)
這是應用的核心區域，採用水平分割的雙面板設計：

#### 2.2.1 左側：內容閱讀面板 (Content Panel)
- **角色**: 承載 Markdown 格式的教學內容。
- **佈局特點**:
    - **獨立滾動**: 面板採用 Flex 佈局 (`display: flex`)，內部 `.content-scroll` 具備 `flex: 1` 與 `overflow-y: auto`，確保在大比例內容下能穩定且獨立地滾動。
- **內容區域**: 內文寬度限制於 `1100px` 以內，以適應高解析度螢幕。
- **視覺嵌套**: 閱讀區域被嵌套在一個帶有 `radius-xl` (20px) 圓角、細緻陰影與 `margin: 0.5rem 0.75rem` 的玻璃質感容器中，內部邊距 (Padding) 設定為 `1.5rem 4rem` (Desktop)，極大化頂部可見範圍。
- **交互連結**: 代碼範例連結具備懸停高亮效果，並同步更新至內容面板。

#### 2.2.2 右側：代碼預覽與執行面板 (Code Preview Panel)
- **角色**: 沉浸式代碼編輯與執行回饋區。
- **佈局特點**:
    - **動態滑出**: 當使用者選取腳本時，面板從右方以 `0.4s cubic-bezier` 轉場動畫滑出。
    - **結構垂直劃分**:
        - **側邊標頭 (Header)**: 顯示目前腳本路徑、複製按鈕與最重要的「執行」按鈕。
        - **編輯區 (Monaco Editor)**: 佔據上半部，背景採用純淨的主題色（亮色純白，深色灰黑）。
        - **輸出控制台 (Output Panel)**: 位於下半部，顯示標準輸出、錯誤訊息與內嵌圖表。

#### 2.2.3 面板調整器 (The Resizer)
- **位置**: 位於兩個面板的物理交界處。
- **設計需求**: 
    - 基礎寬度為 `12px` 的透明感應區，具備 `margin: 0 -6px` 負邊距以擴大抓取範圍而不移動面板位移。
    - **抓取指示器**: 中心具備一個高度 `32px` 的細長灰色垂直條 (Gripper)，當滑鼠懸停時指示器會加長至 `48px`、變亮並改為品牌色 (`accent-color`)，提供強烈的交互反饋。

### 2.3 滾動規範 (Scrollbar Mechanics)
- **極簡主義**: 全面移除瀏覽器預設的粗重滾動條。
- **自定義樣式**: 採用寬度僅 `6px` 的半透明細長設計，邊角全圓潤化，使其像是一層浮在界面上的交互元素，不破壞玻璃擬態的穿透感。

## 3. 響應式策略 (Responsive Strategy)
- **斷點**: **768px** (Tablet/Mobile Boundary)。
- **響應式行為**: 
    - **歡迎頁面**: 在 768px 以上堅持「左圖右文」佈局；768px 以下自動切換為垂直堆疊 (Column Layout) 並置中內容。
    - **手機模式**: 手機端自動切換為全螢幕堆疊模式，並加強「章節列表」與「代碼面板」的導航切換效率。

## 4. 交互模式 (Interaction Patterns)
- **點擊行為**: 程式碼區塊點擊後具備縮小/放大的微轉場效果。
- **非同步狀態**: 執行代碼時，整個面板邊緣具備呼吸燈式的光影流動感。

## 5. 技術實施要點 (Implementation Notes) - [NEW]

本節記錄了專案開發中針對性能與質感的關鍵技術解決方案，作為後續維護之索引。

### 5.1 內容渲染效能 (Content Performance)
- **問題**: KaTeX 數學公式解析極為耗時，在拖動分割條 (Resizer) 導致視窗重繪時會發生嚴重卡頓。
- **方案**: 
    - 使用 `React.memo` 封裝 `ContentPanel` 組件，阻斷不必要的重渲染。
    - 透過 `useMemo` 快取 Markdown 解析後的 HTML 結果，確保僅在章節切換或 Data 變動時才執行 `marked.parse`。
    - **效果**: 拖動分割條時左側內容完全靜止，達到 60fps 的絲滑體感。

### 5.2 調整器穩定性 (Resizer Stability)
- **問題**: 快速拖動時，若游標進入右側 `Monaco Editor` 或 `iframe` 區域，會丟失 `mousemove` 事件導致 Resizer 卡死或跳動。
- **方案**: 
    - **全域遮罩 (Global Overlay)**: 拖拽開始時，在全螢幕顯示一個 `z-index: 9999` 的透明 `div (.resizer-overlay)`，確保滑鼠事件全程被 `App` 捕獲。
    - **生命週期管理**: 使用 React 的 `useEffect` 管理全域 `mousemove` 與 `mouseup` 監聽器，確保組件卸載時徹底清理，避免記憶體洩漏與行為異常。

### 5.3 佈局與滾動 (Layout & Scrolling)
- **獨立滾動原理**: 透過 Flex 鏈條 (`.app` -> `.main-content` -> `.panes-container` -> `.content-pane`)，將高度 100% 逐級傳遞，最後賦予 `.content-scroll` 組件 `overflow-y: auto`。
- **高級間距策略**: 
    - 桌機模式下採用 `5rem 8rem` 特大內邊距，配合 `max-width: 900px` 與 `line-height: 2.2`。
    - 此組態是參考專業程式設計書籍（如 O'Reilly, Manning）的電子書排版比例，旨在降低長時間閱讀的認知負擔。

### 5.4 套件執行相容性 (Pyodide Compatibility)
- **pylab 映射**: 針對書中大量使用的 `import pylab`，在 `App.jsx` 的 `MODULE_MAPPING` 中將其強制映射至 `matplotlib`，避免 `micropip` 嘗試安裝不存在的虛擬套件而報錯。
- **Matplotlib 背景**: 使用 Pyodide 預設後端以支援瀏覽器圖表渲染，確保使用者能看到繪圖結果。
