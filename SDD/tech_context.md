# 詳細技術實施計畫 (Detailed Technical Implementation Plan)

本文件整合了專案的技術堆疊 (`tech.md`) 與實施策略，為開發與後續維護提供詳盡的技術指南。

## 1. 技術堆疊 (Technical Stack)

### 1.1 核心架構

- **建置工具**: **Vite 6.0** - 提供極速的 HMR 以及基於 Rollup 的生產環境優化。
- **前端框架**: **React 18.3** - 採用併發模式 (Concurrent Mode) 與 Hooks (useState, useEffect, useMemo) 進行狀態管理。
- **Python 引擎**: **Pyodide 0.26.4** - WebAssembly 版 Python 執行環境。
  - **核心版本**: Python 3.12.7 (注意：此版本起 `distutils` 已被正式移除)。
  - **CDN 載入源**: `https://cdn.jsdelivr.net/pyodide/v0.26.4/full/` (或本地 `/public/lib/pyodide/`)
- **編輯器**: **Monaco Editor 4.6** - 透過 `@monaco-editor/react` 封裝，實現高效能代碼編輯功能。

### 1.2 輔助函式庫與工具

- **UI/UX**:
  - `Lucide React 0.460`: 向量圖示。
  - `Marked 17.0` + `marked-katex-extension 5.1`: Markdown 與 LaTeX 渲染。
  - `KaTeX 0.16`: 高速數學公式排版。
  - `react-syntax-highlighter 16.1`: 代碼片段語法高亮。
- **安全性與效能**:
  - `DOMPurify 3.3`: XSS 入侵過濾。
  - `localforage 1.10`: IndexedDB 封裝，用於持久化儲存 (User Data)。
- **PWA 支援**:
  - `vite-plugin-pwa 0.21`: 自動生成 Service Worker 與 Manifest。
  - `Workbox`: 執行時資源快取策略。

### 1.3 數學渲染引擎 (Mathematical Rendering)

- **KaTeX**: 採用 `Marked` + `marked-katex-extension` 的組合，並針對台灣使用習慣進行了特殊調校：
  - **Inline Math**: 支援標準 `$...$` 行內數學公式 (需開啟 `nonStandard: true` 選項)。
  - **Display Math**: 支援 `$$...$$` 區塊數學公式。
  - **隔離實例 (Isolated Instance)**: 為了解決 SPA 與 HMR (熱模組替換) 環境下的狀態污染問題，`ContentPanel` 採用獨立的 `Marked` 實例而非全域單例。
  - **JSON 轉義規範 (JSON Escaping Rule)**: 
    - 由於內容存儲於 JSON 字串中，所有的 LaTeX 反斜線必須進行 **雙重轉義 (Double Escaping)**。
    - 例如：`\\sigma` (正確) vs `\sigma` (錯誤，會導致 JSON Parse Error)。
    - 建置腳本 (`merge_bodies.py`) 會在合併前進行語法檢查。

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

### 2.3 資料流與本地儲存模式

- **內容資料管線 (Content Pipeline)**: 
  - **源頭**: `public/data/modular/b2_ch{X}/{X.Y}.json` (模組化細碎檔案)。
  - **建置**: 透過 `scripts/consolidate_all.py` 將所有模組檔案合併。
  - **產物**: `public/data/chapters.json` (單一靜態大檔)，應用啟動時一次性請求。
- **使用者狀態**:
  - `Theme`: 儲存於 `localStorage`。
  - `Code modification`: 使用者自定義修改後的代碼暫存於 IndexedDB (`localforage` 實作)。
  - `Learning Progress`: 紀錄已讀章節與執行次數，儲存於 IndexedDB。

## 3. Python 執行與相容性策略 (Runtime & Compatibility)

### 3.1 執行啟動與環境修補 (Shims)

為了在瀏覽器環境中執行專為桌面端設計的 FRM 範例，系統實作了多層環境修補 (Shims)：

1.  **`distutils` 相容性修補**: 
    - **背景**: Python 3.12 移除了 `distutils`，但許多科學計算套件 (如 `QuantLib`) 仍依賴其進行版本檢查或路徑處理。
    - **實作**: 在 `python-shims.js` 中實作了 `distutils` 虛擬模組，模擬了 `version`, `util`, `spawn` 等子模組，確保 legacy 代碼不崩潰。
2.  **`pandas_datareader` 資料模擬 (CORS Bypass)**:
    - **問題**: 瀏覽器受限於 CORS 政策，無法直接存取 Yahoo Finance 等外部 API。
    - **解決方案**: 攔截 `DataReader` 調用，當偵測到目標為金融數據 (如 'AAPL', 'yahoo') 時，動態注入由 JavaScript 生成的合成數據 (Synthetic Data)，確保學習範例的繪圖與計算邏輯能完整走完。
3.  **核心依賴預加載 (Unified Pre-loading)**:
    - 針對具有複雜 C-extension 的套件 (`statsmodels`, `sympy`, `lxml`)，強制透過 Pyodide 的 `loadPackage` 二進制通路加載，而非 `micropip` 下載，以確保運行時的二進制一致性與穩定性。

### 3.2 Matplotlib 捕捉機制

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

### 3.2 混合式加載架構 (Hybrid Loading Architecture) - [REFACTORED]

本專案採用獨創的 **Hybrid Loading** 策略，結合序列化回報與持久化緩存，解決了 Python Wasm 應用「初次加載慢、無法回報進度」的痛點。

#### 3.2.1 首次加載：序列化與進度回報 (Sequential Fetching)
- **問題**: 傳統 `micropip.install([list])` 或 `Promise.all` 會導致所有下載請求同時發出，頻寬競爭下無法精確計算進度，且使用者需面對長時間的靜止畫面。
- **解決方案**: 
    - 採用 **Recursive Sequence** 模式，依序下載核心套件 (`numpy` -> `pandas` -> `matplotlib` -> `scipy`)。
    - 每完成一個套件下載，即時更新 `LoadStatus`，讓使用者看到具體的「正在安裝 Numpy... (30%)」反饋，大幅降低等待焦慮。

#### 3.2.2 二次加載：IDBFS 持久化與極速啟動 (Persistence & Warm Start)
- **機制**: 利用 Emscripten 的 `IDBFS` 文件系統，將 Pyodide 的 `/lib/python3.11/site-packages` 掛載至瀏覽器的 IndexedDB。
- **流程**:
    1. **掛載 (Mount)**: 啟動時檢查 IDB 是否存在已安裝的套件快照。
    2. **同步 (Sync)**: 若存在，直接將 IDB 內容映射至記憶體文件系統 (MemoryFS)，跳過網路下載。
    3. **衝刺 (Sprint)**: 進度條以視覺化的「衝刺動畫」在 500ms 內跑完，達成 **Instant Warm Start (< 1.5s)** 的體驗。
- **一致性**: 透過 `package.json` 版本號比對，若核心依賴變更，會自動清除 IDB 緩存並觸發重新下載。

#### 3.2.3 三層依賴檢查機制 (Triple-Layer Dependency Guard)
1. **硬排除 (Hard Exclusion)**: 明確排除 `time`, `random`, `os` 等 Python 標準庫，防止 `micropip` 誤判。
2. **核心鎖定 (Core Lock)**: 啟動時鎖定核心科學套件版本，確保環境一致性。
3. **動態緩存 (Dynamic Cache)**: 執行期間動態引入的第三方套件 (非核心庫)，也會被同步寫入 IDB，實現「越用越快」的特性。

### 3.3 交互與穩定性模式 (UX Stability Patterns)

- **Resizer 事件隔離 (Resizer Overlay)**:

  - **問題**: 拖動調整面板時，若滑鼠進入 `Monaco Editor` 或內容區，內部的瀏覽器事件抓取會導致調整卡頓。
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
- `python scripts/merge_bodies.py <chapter_id>`: 合併單一章節的模組化內容。
- `python scripts/consolidate_all.py`: **[發布]** 將所有模組化章節彙總至主檔案 `chapters.json`。

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
- **透明度**: 實作了 **透明度診斷機制**。當 `ImportError` 發生時，系統會從 Python 堆疊中提取原始訊息 (如 `No module named 'interp2d'`) 並顯示給使用者，取代過往模糊的匯入錯誤提示。
