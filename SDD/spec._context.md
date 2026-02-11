# 完整功能規格說明書 (Comprehensive Functional Specification)

## 1. 專案概要 (Project Summary)

本專案為 **FRM Python 互動式學習平台 PWA (Book 2: Quantitative Analysis)**，是個專為學習金融風險管理（FRM）設計的互動式 Progressive Web App。本平台已全面升級至 **v1.3.3 Gold Standard (黃金標準版)**，涵蓋全書 12 章節，讓使用者能夠直接在瀏覽器中執行 Python 程式碼，體驗「手術刀般精準」的金融模型學習。

## 2. 核心價值主張 (Core Value Propositions)

- **黃金標準內容 (v1.3.3)**：全書 12 章節均經過深度重構，具備統一的資深從業人員語氣 (Senior Practitioner Tone)。
- **決策導向學習**：每節均配備「專家決策矩陣 (Expert Decision Matrix)」與「資深行動清單 (Action Items)」，連結理論與實務決策。
- **瀏覽器即環境**：無需安裝 Python 或任何 IDE，完全在瀏覽器中運行。
- **隨處學習**：支持 PWA，可安裝至手機/桌面，並具備強大的離線使用能力。
- **專業級編輯體驗**：整合 VS Code 同款 Monaco 編輯器，提供語法高亮與自動完成。
- **科學運算視覺化**：原生支持 NumPy, Pandas, SciPy 與 Matplotlib，可即時捕捉並顯示金融模型圖表。
- **無縫進度追蹤**：利用 IndexedDB 實現自動儲存，確保學習進度不遺失。

## 3. 目標使用者 (Target Users)

- 姜偉生博士與塗升博士所著《FRM Python 系列》書籍的讀者。
- 希望透過 Python 實踐金融風險管理模型的學生與專業金融從業人員。

## 4. 詳細功能需求 (Detailed Functional Requirements)

### 4.1 Python 執行環境 (Pyodide Engine)

- **核心引擎**：基於 Pyodide 0.26.4。
- **效能優化**：採用 **Hybrid Loading Architecture**，結合 `Sequential Fetching` 與 `IndexedDB Persistence`，實現首次加載穩定回報與二次加載即時啟動 (Instant Warm Start)。
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

### 4.4 學習追蹤與導航 (Navigation & Tracking)

- **頂部導航 (Top-bar Navigation)**：
  - **章節選單 (Chapter Selection)**：透過頂部下拉式選單切換章節。
  - **重點導覽 (Topic Navigation)**：新增「重點導覽」下拉選單，自動解析內容中的 H3 標題，支援快速跳轉至特定知識點。
  - **程式碼快選 (Code Selection)**：選定章節後，可透過第三個下拉選單直接選擇特定的範例程式碼。
- **自動儲存**：在編輯器內容變更後 1000ms 執行防抖儲存，將代碼持久化至 IndexedDB 的 `code` 倉庫。
- **進度標記**：記錄使用者已完成或已閱讀範例。

### 4.5 主頁內容格式 (Home Content Format)

- **標識識別**：頂部導航欄左側顯示 `FRM_Book1 (基礎篇)` 及書籍圖示。
- **內容構成**：
  - **歡迎標題與視覺**：採用「左圖右文」的精緻佈局。左側展示書籍立體封面與購買連結，右側展示歡迎標語與內容導讀。
  - **輔助說明**：`👈 請從上方選擇章節開始學習`。
  - **狀態反饋**：顯示 Pyodide 核心套件載入進度與 IndexedDB 狀態（於背景以 Glassmorphism 疊層顯示）。

### 4.6 章節內容排版規範 (Chapter Content Layout)

內容結構嚴格遵循 `chapters.json` 的多級標題與圖示化編排：

- **一級標題 (#)**：章節全名（如：`# 第 1 章：程式設計初階 - 重點詳解`）。
- **二級標題 (##) - 標準化功能區塊 (三層架構編排)**：
  - **第一層：章節導讀區 (The Roadmap)**
    - `## 📌 章節導覽`：定義學習路徑建議。
    - `## 🎯 學習目標`：定義本章結束後應掌握的能力。
    - `## 📋 章節重點分明`：快速掃描核心知識點。
  - **第二層：實務價值區 (The Value)**
    - `## 💼 實務應用說明` / `## 💼 FRM 考試與實務連結`：對接職場與實務場景。
    - `## 🏛️ 財金理論深度解析`：連結金融模型背景。
    - `## 🚀 延伸閱讀與進階議題`：引導行有餘力的學習者深入探討。
    - `## 🐍 Python 實踐價值`：強調技術在金融實務的優勢。
  - **第三層：技術解析區 (The Implementation)**
    - `## ⚙️ 代碼核心邏輯`：解析程式碼實作與演算法思路。
    - `## 🛠️ 腳本實作深度解析 (PRESERVED)`：
      - **內部三級標題格式**：採用 `### 📄 [腳本名稱]`（如 `### 📄 B1_Ch1_1.py`）。
      - **內容範本**：
        - `功能說明：[描述實作功能]`
        - `使用套件：[列出套件名稱]`
        - `複雜度等級：[等級] [🟢/🟡/🔴]`
        - `相關金融概念：[對應知識點]`
    - `## 💻 應用場景清單`：列出所有腳本使命（系統渲染時會過濾 Markdown 表格以保持介面簡潔）。
    - `## 📝 章節重點詳細解說的內容`：知識點容器，包含 v1.3.3 標準組件：
      - **專家決策矩陣 (Expert Decision Matrix)**：Markdown 表格，對比不同模型或方法論的適用場景。
      - **資深從業人員行動清單 (Action Items)**：條列式清單，提供從理論到落地的執行檢查點。
- **三級標題 (###)**：具體知識點名稱（如：`### 10.1 交易對手信用風險 (CCR) 核心概念`）。
- **四級標題 (####) - 知識點元數據**：
  - `#### 技術核心` / `#### 專家定義` / `#### 專家決策矩陣` / `#### 資深從業人員行動清單 (Action Items)`。
- **代碼自動連結機制 (Automated Linking)**：
  - **全域識別**：系統自動掃描所有 `.py` 檔名（包含 `## 🛠️` 標題、表格單元格、段落文字及加粗文本），將其轉化為可點擊元件。
  - **應用場景清單 (Table List)**：採用 `| 腳本名稱 | 核心使命 |` 表格格式，腳本名稱需加粗（如 `**B1_Ch1_1.py**`）以利識別。
  - **互動連結**：點擊後立即觸發右側代碼編輯器（Monaco Editor）加載該腳本內容。

### 4.7 互動佈局規範 (Interactive Layout)

- **頂部導航區域 (Top Bar)**：
  - 左側：書名與圖示。
  - 中間：章節選擇與腳本快選下拉選單。
  - 右側：深色/亮色主題切換。
- **左側：內容顯示區 (Content Pane)**：
  - **內容模式**：顯示 Markdown 渲染後的教學內容。
  - **輸出模式 (Exclusive Output View)**：執行代碼時，自動切換至此模式顯示文字與圖表。
- **右側：代碼預覽區 (Preview Pane)**：
  - **彈出邏輯**：僅在點擊程式碼連結或從下拉選單選擇代碼時顯示，可自定義寬度。
  - **核心操作**：包含代碼編輯（唯讀或編輯）、複製、執行及關閉按鈕。

## 5. 穩定性與強健性要求 (Stability & Robustness)

- **自動重試**：當 Pyodide CDN 載入失敗時，應具備 3 次自動重試邏輯。
- **環境隔離**：支持跨來源隔離 (COOP/COEP)，以啟用 SharedArrayBuffer 並提升 Python 執行效能。
- **配額監控**：定期檢查 IndexedDB 剩餘空間，防止儲存失敗，並及時提醒使用者。

## 6. 非功能性要求 (Non-functional Requirements)

- **性能指標**：首次加載 (LCP) 應控制在 6 秒內，後續緩存加載應小於 1 秒。
- **響應式佈局**：在行動裝置上，代碼編輯區與輸出區應能通過滑動或分頁標籤輕鬆切換。
- **安全性**：使用 DOMPurify 對輸出的 HTML/Markdown 進行 XSS 過濾，並針對 KaTeX 渲染生成的 MathML 與 SVG 標籤進行精確加白名單處理。
- **數學公式渲染**：整合 `marked-katex-extension`，自動識別 Markdown 中的 TeX 公式（支援 `$ ... $` 行內公式與 `$$ ... $$` 獨立區塊公式），確保金融模型的數學推導能以印刷品質顯示。
