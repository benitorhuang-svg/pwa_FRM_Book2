---
name: Chapter_Builder
description: FRM Book 2 PWA 內容建構與核心運維：涵蓋 Premium 章節設計規範、SVG 視覺化標準、JSON 數據治理與自動化腳本工作流
---

# FRM PWA Chapter Builder & 運維指南

本指南定義了 FRM Book 2 PWA 的 Premium 內容建構標準以及 `scripts/` 工具鏈的自動化運維流程。

## 🏗️ Chapter Building: Premium 內容建構標準

為了確保內容具備專業深度與美感，所有 `public/data/modular/` 中的章節更新需遵循以下四大支柱：

### 1. 故事引導設計 (Story-First Narrative)
- **非線性介紹**: 避免直接切入公式。使用場景比喻（如「時空旅行」解析逆向誘導、「手中的鳥」對比提前行權）。
- **關鍵詞強調**: 使用 **加粗** 標記核心概念，提升掃描式閱讀的效率。

### 2. 精美 SVG 視覺擴展 (Premium SVG Visuals)
- **全量向量化**: 優先使用內嵌 SVG 代替圖片，確保縮放不失真。
- **美學風格**: 
    - 背景: `var(--glass-highlight-alt)`。
    - 色彩: 藍色系 (`#6366f1`, `#3b82f6`) 表達專業；綠色 (`#22c55e`) 代表收益/成功；紅色 (`#ef4444`) 代表風險/決策。
    - 效果: 加入微光 (`filter: url(#glow)`) 與平滑漸層。
- **響應式**: 必須設定 `viewBox` 並讓寬度佔滿容器 (`width="100%"` )。

### 3. 專家級技術深度 (Technical Depth)
- **決策矩陣 (Expert Matrix)**: 使用 Markdown 表格對比不同模型（如 CRR vs LR）或市場環境下的最優決策。
- **行動清單 (Action Items)**: 為資深風險經理提供具備實戰意義的 `[!NOTE]` 或清單，標記模型盲點與稽核重點。

### 4. JSON 與 LaTeX 轉義規範 (JSON Compliance)
- **後斜槓轉義**: **絕對關鍵**。在 JSON 中，所有 LaTeX 指令的後斜槓必須雙重轉義（例：`\\max`, `\\Delta`, `\\sigma`, `\\text`）。
- **區塊保護**: 確保 $\begin{aligned}$ 等複雜環境前後有足夠的前置轉義避免解析錯誤。

---

## 🛠️ 自動化運維工具鏈 (Maintenance Scripts)

### 1. 數據架構構建
```powershell
uv run scripts/build-chapters.py
```
從 `public/data/modular` 生成索引與主數據檔案。

### 2. 模型程式同步
```powershell
uv run scripts/update_examples.py
```
將本地 Python 檔案 (`.py`) 的內容同步更新回 JSON 的 `code` 欄位。

### 3. 計算壓力治理
```powershell
uv run scripts/limit_simulations.py
```
自動注入 `__SIM_CAP` 限制，防止前端 Pyodide 執行過度模擬導致瀏覽器崩潰。

### 4. 全域品質稽核
```powershell
uv run scripts/audit.py --mode all
uv run scripts/check_aligned_wrapped.py
```
- `examples`: 檢查範例代碼缺失。
- `deep`: 比對原始碼目錄與數據目錄的對齊。
- `aligned`: 檢查 LaTeX 對齊語法合法性。

### 5. 環境依賴編排
```powershell
uv run scripts/scan_imports.py
```
掃描 Python 套件依賴，用於更新 `App.jsx` 的 `MODULE_MAPPING` 以實現延遲載入 (Lazy Loading)。

### 6. KaTeX 數學渲染修復
```powershell
node scripts/fix_katex.cjs
```
批量修復被破壞的 JSON LaTeX 轉義字符。

---

## 🔄 維護鏈條 (Maintenance Chain)

重大修改後建議遵循：
`Premium Content Design` → `Code Sync` → `JSON validation` → `Architecture Build` → `QA Audit`

## 💡 補充建議
- **回滾策略**: 在執行任何會改寫 `public/data/` 的腳本前，請先 Commit 目前狀態或備份相關目錄。
- **維護優先**: 優先確保 `public/data/modular` 的源頭數據正確，再執行 `build-chapters.py` 進行彙整。
