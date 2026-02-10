# 完整功能規格說明書 (Comprehensive Functional Specification)

## 1. 專案概要 (Project Summary)

本專案為 **FRM Python 互動式學習平台 PWA**，是個專為學習金融風險管理（FRM）設計的互動式 Progressive Web App。本平台讓使用者能夠直接在瀏覽器中執行 Python 程式碼，為《手術刀般精準的 FRM 用 Python 科學管控財金風險：基礎篇》一書提供沉浸式的學習體驗。

## 2. 核心價值主張 (Core Value Propositions)

- **瀏覽器即環境**：無需安裝 Python 或任何 IDE，完全在瀏覽器中運行。
- **隨處學習**：支持 PWA，可安裝至手機/桌面，並具備強大的離線使用能力。
- **專業級編輯體驗**：整合 VS Code 同款 Monaco 編輯器，提供語法高亮與自動完成。
- **科學運算視覺化**：原生支持 NumPy, Pandas 與 Matplotlib，可即時捕捉並顯示金融模型圖表。
- **無縫進度追蹤**：利用 IndexedDB 實現自動儲存，確保學習進度不遺失。

## 3. 目標使用者 (Target Users)

- 姜偉生博士與塗升博士所著《FRM Python 系列》書籍的讀者。
- 希望透過 Python 實踐金融風險管理模型的學生與專業金融從業人員。

## 4. 詳細功能需求 (Detailed Functional Requirements)

### 4.1 Python 執行環境 (Pyodide Engine)

- **核心引擎**：基於 Pyodide 0.26.4。
- **效能優化**：採用 `Promise.all` 實現核心套件 (NumPy, Pandas, Matplotlib, SciPy) 的 **平行預載入 (Parallel Pre-loading)**，顯著縮短應用初始化時間。
- **科學套件支援**：必須預裝並支援 NumPy, Pandas, Matplotlib, SciPy, Statsmodels, SymPy, Seaborn, Pymoo 等金融工程與數據分析必備套件。
- **圖表捕捉**：需具備自定義 Handler，截獲 `matplotlib.pyplot.show()` 調用，並將產出的 Canvas 渲染為網頁中的可視化組件（支援下載為圖檔）。
- **執行保護**：
  - **超時機制**：預設 30 秒執行限制，防止死循環導致瀏覽器掛起。
  - **記憶體管理**：每次執行前自動清理上一輪的全局變數與繪圖緩存。

### 4.2 互動式編輯器 (Monaco Editor)

- **基礎功能**：語法高亮 (Python)、代碼縮進、括號匹配、代碼摺疊。
- **智能力**：基本的 IntelliSense 自動完成建議。
- **自定義配置**：支援切換深色 (Dark) 與淺色 (Light) 主題，風格與應用整體 UI 保持一致。

### 4.3 PWA 與離線功能

- **可安裝性**：需符合 Web App Manifest 規範，提供完整的圖示 (72x72 至 512x512)。
- **混合式 Service Worker 架構**：
  - **Workbox Pre-caching**: 預先快取核心 JS 包、CSS 與靜態資源，確保離線可用。
  - **COI 標頭注入**: Service Worker 攔截請求並注入 `Cross-Origin-Opener-Policy` 與 `Cross-Origin-Embedder-Policy` 標頭，為 Pyodide 提供 SharedArrayBuffer 支援。
- **離線狀態指示**：在離線時能正常顯示已緩存的章節與範例程式碼。

### 4.4 學習追蹤與導航

- **動態導航**：自動解析 `chapters.json` 生成層級導航欄。
- **自動儲存**：在編輯器內容變更後 1000ms 執行防抖儲存，將代碼持久化至 IndexedDB 的 `code` 倉庫。
- **進度標記**：記錄使用者已完成或已閱讀的範例。

## 5. 穩定性與強健性要求 (Stability & Robustness)

- **自動重試**：當 Pyodide CDN 載入失敗時，應具備 3 次自動重試邏輯。
- **環境隔離**：支持跨來源隔離 (COOP/COEP)，以啟用 SharedArrayBuffer 並提升 Python 執行效能。
- **配額監控**：定期檢查 IndexedDB 剩餘空間，防止儲存失敗，並及時提醒使用者。

## 6. 非功能性要求 (Non-functional Requirements)

- **性能指標**：首次加載 (LCP) 應控制在 6 秒內，後續緩存加載應小於 1 秒。
- **響應式佈局**：在行動裝置上，代碼編輯區與輸出區應能通過滑動或分頁標籤輕鬆切換。
- **安全性**：使用 DOMPurify 對輸出的 HTML/Markdown 進行 XSS 過濾，並針對 KaTeX 渲染生成的 MathML 與 SVG 標籤進行精確加白名單處理。
- **數學公式渲染**：整合 `marked-katex-extension`，自動識別 Markdown 中的 TeX 公式（支援 `$ ... $` 行內公式與 `$$ ... $$` 獨立區塊公式），確保金融模型的數學推導能以印刷品質顯示。
