# 詳細技術實施計畫 (Detailed Technical Implementation Plan)

本文件整合了專案的技術堆疊 (`tech.md`) 與實施策略，為開發與後續維護提供詳盡的技術指南。

## 1. 技術堆疊 (Technical Stack)

### 1.1 核心架構

- **建置工具**: **Vite 6.0** - 提供極速的 HMR 以及基於 Rollup 的生產環境優化。
- **前端框架**: **React 18.3** - 採用併發模式 (Concurrent Mode) 與 Hooks (useState, useEffect, useMemo) 進行狀態管理。
- **Python 引擎**: **Pyodide 0.26.4** - WebAssembly 版 Python 執行環境。
  - **CDN 載入源**: `https://cdn.jsdelivr.net/pyodide/v0.26.4/full/`
- **編輯器**: **Monaco Editor 4.6** - 透過 `@monaco-editor/react` 封裝，實現高效能代碼編輯功能。

### 1.2 輔助函式庫與工具

- **UI/UX**:
  - `Lucide React 0.460`: 向量圖示。
  - `Marked 17.0` + `marked-katex-extension 5.1`: Markdown 與 LaTeX 渲染。
  - `KaTeX 0.16`: 高速數學公式排版。
  - `react-syntax-highlighter 16.1`: 代碼片段語法高亮。
- **安全性與效能**:
  - `DOMPurify 3.3`: XSS 入侵過濾。
  - `localforage 1.10`: IndexedDB 封裝，用於持久化儲存。
- **PWA 支援**:
  - `vite-plugin-pwa 0.21`: 自動生成 Service Worker 與 Manifest。
  - `Workbox`: 執行時資源快取策略。

### 1.3 數學渲染引擎 (Mathematical Rendering)

- **KaTeX**: 採用 `Marked` + `marked-katex-extension` 的組合，並針對台灣使用習慣進行了特殊調校：
  - **Inline Math**: 支援標準 `$...$` 行內數學公式 (需開啟 `nonStandard: true` 選項)。
  - **Display Math**: 支援 `$$...$$` 區塊數學公式。
  - **隔離實例 (Isolated Instance)**: 為了解決 SPA 與 HMR (熱模組替換) 環境下的狀態污染問題，`ContentPanel` 採用獨立的 `Marked` 實例而非全域單例。

## 2. 系統架構細節 (System Architecture)

### 2.1 組件層代碼組織 (Directory: `src/components/`)

- **App.jsx**: 應用程式核心，協調章節加載、腳本選取與 Python 執行邏輯。
- **PythonRunner.jsx**: 抽象化 Pyodide 初始化與指令執行，封裝 `loadPackage` 與 `runPython` 等 API。
- **CodePreviewPanel.jsx**: 核心交互面板，採用 VSCode 風格的 `Resizer` (GripVertical 圖標與藍色高亮導軌)，支援寬度持久化。
- **FloatingOutput.jsx**: 獨立的 Portal 視窗，顯示 Python 標準輸出 (stdout) 與 Matplotlib 繪圖結果。

### 2.2 混合式 Service Worker 策略 (Hybrid Service Worker Strategy)

為了同時滿足 **PWA 離線能力** 與 **Pyodide 高效能運算** (需 SharedArrayBuffer 支援)，本專案採用自定義 Service Worker (`src/sw.js`)：

1.  **Cross-Origin Isolation (COI)**: Service Worker 攔截所有 `fetch` 請求，並動態注入 `Cross-Origin-Opener-Policy: same-origin` 與 `Cross-Origin-Embedder-Policy: require-corp` 標頭。這確保了瀏覽器啟用 SharedArrayBuffer，讓 Pyodide 能使用高效能的運算模式。
2.  **Workbox Pre-caching**: 整合 `workbox-precaching`，將建置產物 (HTML, JS, CSS) 與關鍵 Python 套件 (`.whl`) 進行預快取，確保離線可用性。
3.  **單一控制源**: 透過 `InjectManifest` 模式，將 COI 邏輯與 Workbox 邏輯合併於同一個 SW 實例中，避免了多個 Service Worker 爭奪頁面控制權導致的 Race Condition。

### 2.2 資料流與本地儲存模式

- **唯讀資料**: `public/data/chapters.json` (由 `build-chapters.py` 生成)，應用啟動時一次性請求。
- **使用者狀態**:
  - `Theme`: 儲存於 `localStorage`。
  - `Code modification`: 使用者自定義修改後的代碼暫存於 IndexedDB (`localforage` 實作)。
  - `Learning Progress`: 紀錄已讀章節與執行次數，儲存於 IndexedDB。

## 3. Python 執行與整合策略

### 3.1 Matplotlib 捕捉機制

- 實作自定義 Python 腳本插入：
  ```python
  import io, base64
  from matplotlib import pyplot as plt
  # 截取繪圖、轉換為 Base64 並傳回 JavaScript
  buf = io.BytesIO()
  plt.savefig(buf, format='png')
  buf.seek(0)
  img_str = base64.b64encode(buf.read()).decode()
  ```
- JS 端接收 Base64 字符串並渲染至 `<img>` 標籤。

### 3.2 性能與啟動優化 (Detailed Optimization Logic)

- **並行預載入策略 (Parallel Pre-loading)**:

  - 在 `pyodide-loader.js` 中利用 `Promise.all` **同時並行下載** 核心套件 (`numpy`, `pandas`, `matplotlib`, `scipy`)。
  - **優點**: 充分利用瀏覽器並行下載能力，在寬頻網路下可顯著縮短等待時間。
  - **代價**: 瞬間頻寬佔用較高。
  - **效果**: 消除使用者執行第一個範例時的「冷啟動」延遲，提供即時運算體驗。

- **Shim 代碼模組化 (Modularized Shims)**:
  - 將龐大的相容性代碼 (QuantLib Mock, Pymoo Shim) 提取至 `src/utils/python-shims.js`。
  - 減少 `pyodide-loader.js` 的體積，並允許未來實作按需載入 (Lazy Evaluation)。

- **三層依賴檢查機制 (Triple-Layer Dependency Guard)**:

  1. **硬排除 (Hard- **標準庫排除清單**: 在 `ensureDependencies` 中明確排除 `time`, `random`, `csv`, `copy`, `os`, `sys` 等內建標準庫，防止 `micropip` 誤抓取導致的 `ValueError`。
這些是編譯於 Python Wasm 核心中的內建模組，聯網安裝會導致 `ValueError`。
  2. **核心緩存 (Core Cache)**: `coreLibs`（如 `pandas`, `scipy`）在初始化時已載入，直接標記為已安裝。
  3. **動態緩存 (Dynamic Cache)**: 使用 `installedPackages` (Set) 紀錄運行期間動態下載的套件。每次執行前會掃描 `import` 語句，僅對「非標準庫、非核心庫、且尚未安裝」的套件調用聯網下載，極大化執行效率。

### 3.3 交互與穩定性模式 (UX Stability Patterns)

- **Resizer 事件隔離 (Resizer Overlay)**:

  - **問題**: 拖動調整面板時，若滑鼠進入 `Monaco Editor` 或內容區，內部的瀏覽器事件抓取會導致 JS `mousemove` 丟失，造成調整卡頓。
  - **解決方案**: 實作 `resizer-overlay`。在 `isDragging` 狀態為 `true` 時，於全螢幕顯示一個透明且 `z-index` 極高的遮罩，強制接管所有滑鼠事件，確保調整過程絕對流暢。
- **Matplotlib 智能後端切換 (Smart Backend Logic)**:

  - **通用後端**: 使用 Pyodide 預設的瀏覽器相容後端 (Wasm/Canvas)，確保 `plt.show()` 可以正常觸發並顯示圖表，同時消除 `UserWarning: Matplotlib is currently using agg` 警告。
  - 當偵測到程式碼含有 `matplotlib.widgets` (如 Slider) 時，Pyodide 會自動處理交互支援。
- **滾動行為優化 (Scroll Management)**:

  - **章節置頂**: 監聽 `chapter` 變化，強制重置 `.content-scroll` 的 `scrollTop`。
  - **結果置頂**: 在 `output` 產出時調用 `scrollTo({ top: 0, behavior: 'instant' })`，確保使用者能第一時間看到最重要的輸出結果，而非停留在之前的閱讀位置。

## 4. 軟體建置與開發指令 (Commands)

### 4.1 開發階段

- `npm run dev`: 啟動 Vite 開發伺服器。
- `npm run build-chapters`: 掃描 Python 源文件夾並生成 JSON 索引。

### 4.2 生產與部署

- `npm run build`: 進行混淆、壓縮與代碼分割。
- `npm run preview`: 本地預覽生產環境產物。
- `npm run deploy`: 使用 `gh-pages` 將 `dist` 目錄推送到 GitHub。

## 5. 建置配置與優化策略 (Build Config)

### 5.1 代碼分割 (Chunking Strategy)

在 `vite.config.js` 中配置 `manualChunks`：

- `vendor-react`: 核心 UI 庫。
- `vendor-monaco`: 編輯器組件。
- `vendor-pyodide`: Python 引擎相關。
- `vendor-utils`: 文本解析與圖示。

### 5.2 快取策略 (PWA Cache)

- **CacheFirst**: 針對 Pyodide 核心 package (.whl) 與靜態資產，緩存期限設為 1 年。
- **NetworkFirst**: 針對 `chapters.json` 等頻繁變動的資料索引。

## 6. 指標與要求 (Metrics)

- **性能**: 首次訪問加載時間 < 6s，二次訪問 (Service Worker 已啟動) < 1s。
- **相容性**: 支援 WASM 的主流瀏覽器 (Chrome, Edge, Firefox, Safari)。
- **安全性**: 所有動態渲染內容必須經過 DOMPurify 清理。
