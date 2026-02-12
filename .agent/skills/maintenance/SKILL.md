---
name: FRM_PWA_Orchestration
description: FRM Book 2 PWA 核心運維與數據治理：自動化管理模型程式同步、數據架構構建與全域品質稽核工作流
---

# FRM PWA 自動化運維指南

`scripts/` 工具鏈為 FRM Book 2 隨身版提供端到端的自動化維護能力。

## 前置需求 (Prerequisites)

- **Python:** 建議使用 Python 3.10+。
- **Node.js:** 建議使用 Node.js 18+（用於 `node` 腳本與預覽擷取）。
- **uv:** 本文件中多處使用 `uv run ...` 作為專案的 task runner wrapper；若系統未提供 `uv`，可直接以 `python` 執行對應腳本，例如 `python scripts/build-chapters.py`。若團隊有自訂 `uv` 設定，請在本地環境加入相應 alias 或 task runner。 
- **工作目錄:** 在專案根目錄執行上述命令。
- **額外套件:** `capture_preview.cjs` 依賴 Playwright（chromium），請安裝 `npm i -D playwright` 或全域安裝 Playwright-runner。

## uv 安裝與替代執行方式

- 若系統未提供 `uv`，可採下列方式之一建立等價執行：

- **建立 Windows 快速啟動檔 (`uv.cmd`)（專案根目錄）**:

```bat
@echo off
python %*
```

- **PowerShell（暫時）**:

```powershell
Set-Alias uv python
```

- **PowerShell（永久，加入 profile）**:

```powershell
if (-not (Test-Path $PROFILE)) { New-Item -ItemType File -Force -Path $PROFILE }
Add-Content -Path $PROFILE -Value 'Set-Alias uv python'
```

- **Bash / WSL**:

```bash
echo "alias uv=python" >> ~/.bashrc
```

- **或直接以 `python` 執行腳本**（例）：

```powershell
python scripts/build-chapters.py
```

- 注意: 若團隊採用特定 task runner，請依專案慣例安裝或設定 `uv` 封裝。

## 工作流

### 1. 數據架構構建
```powershell
uv run scripts/build-chapters.py
```
從 `public/data/modular` 生成 `chapters_index.json` 及各章節主數據。
產出/檢查點: 會在 `public/data/` 下生成或更新 `chapters_index.json`，以及 `chapters_b2_*.json` 檔案；執行後檢查這些檔案的修改時間與內容變更。
注意事項:
- `build-chapters.py` 會從專案同層的 Book2 原始碼目錄（預設名稱為 `Book2_手術刀般精準的FRM用Python科學管控財金風險_實戰篇/Book2_Python_Code`）讀取 `.py` 範例與對應 Markdown。若目錄不在預期位置，腳本會顯示錯誤並停止。
- 輸出檔案: `public/data/chapters.json`（合併檔）、`public/data/chapters_{chapter_id}.json`（逐章檔）、以及 `public/data/chapters_index.json`（索引）。

### 2. 模型程式同步
```powershell
uv run scripts/update_examples.py
```
將本地 `.py` 原始碼同步回 JSON 中的程式碼片段。
產出/檢查點: 更新 `public/data/...` 中的程式碼片段欄位（請在 commit 前檢視變更，必要時使用 git stash/branch 保護原始內容）。
注意事項:
- `update_examples.py` 預設使用絕對路徑指向 Book2 原始碼（可修改 `SOURCE_BASE_DIR` 變數或在本機改寫腳本）。
- 腳本會掃描 `public/data` 中以 `chapters_b2_ch*.json` 命名的檔案，尋找 `content.examples[*].filename`，並嘗試從對應的 Book2 原始碼目錄讀取檔案內容回寫到 `code` 欄位；若找不到對應原始檔，會列印警告。
- 建議先在分支/備份下執行，並檢視變更 diff 後再 commit。

### 3. 計算壓力治理
```powershell
uv run scripts/limit_simulations.py
```
自動注入 `__SIM_CAP` 限制，防止瀏覽器端耗盡資源。
產出/檢查點: 檢查 JSON 節點內是否新增 `__SIM_CAP` 參數或函式呼叫限制標記，並在本地測試頁面載入以驗證效果。
注意事項:
- 預設上限 `CAP = 1000`（可在腳本中修改）。
- 腳本會搜尋多個 glob 路徑（包含 Book2 原始碼與 `pwa_Book2_python/dist/data` 等），並在修改前把原檔改名為 `.bak`（例如 `file.py` -> `file.py.bak` 或 `file.json` -> `file.json.bak`），以便回滾。
- JSON 檔中的字串欄位（可能含程式碼）也會被解析並插入 guard。

### 4. 全域品質稽核
```powershell
# 使用合併後的 audit 工具：可選模式 examples / deep / all
uv run scripts/audit.py --mode all
# 或單獨執行快速檢查或深度比對
uv run scripts/audit.py --mode examples
uv run scripts/audit.py --mode deep
uv run scripts/check_aligned_wrapped.py
```

產出/檢查點: `audit.py` 會輸出稽核報告到終端或生成 log 檔（視腳本實作而定）。執行後檢查報告中的錯誤/警告並依序處理。
詳細行為:
- `examples` 模式會比對每個章節的 scenarios Markdown 表格與 `content.examples` 列表，報告缺失或空程式碼範例。
- `deep` 模式會掃描 Book2 原始碼目錄（可使用 `--source` 指定或環境變數 `BOOK2_SOURCE`）比對 source 檔是否都已在 `public/data` 中登錄，並把缺失清單輸出為 `audit_result.json`（預設在專案根目錄）。
- `check_aligned_wrapped.py` 用來檢查 JSON 中 `\begin{aligned}` 是否被包在 `$$...$$` 之內；若發現問題會以非零 exit code 回傳。

### 5. 環境依賴編排
```powershell
uv run scripts/scan_imports.py
```
掃描 Python import，更新 `App.jsx` 的 `MODULE_MAPPING`。
產出/檢查點: 更新 `src/App.jsx` 或相關模組映射，執行後請檢查 `App.jsx` 的 `MODULE_MAPPING` 是否已同步變更。
注意事項:
- `scan_imports.py` 會掃描 `public/data` 下的章節 JSON（以絕對路徑 `DATA_DIR` 設定），並列出 top-level 套件名稱（例如 `numpy`、`pandas`）。腳本只印出清單；若需自動更新 `App.jsx`，請另寫小工具或手動複製結果。

### 6. 場景預覽捕捉
```powershell
node scripts/capture_preview.cjs
```
產出/檢查點: 會在 `public/` 或暫存目錄產生截圖或預覽資產（視腳本設定），執行後檢查 `public/` 下的新增檔案。
詳細行為:
- 使用 Playwright 啟動 headless Chromium 並導向預設 URL（可用第一個參數覆寫），將截圖、頁面 HTML、console log 與 network log 儲存到專案 `.capture` 目錄（腳本輸出檔名：`preview_screenshot.png`、`preview_page.html`、`console_log.txt`、`network_log.json`）。
- 執行前請確保已安裝 Playwright 並下載瀏覽器：

```bash
npm i -D playwright
npx playwright install chromium
```

### 7. KaTeX 數學渲染修復
```powershell
node scripts/fix_katex.cjs
```
階段 1 (Phase 1) 批量修復 JSON 數學區塊；階段 2 (Phase 2) 重建 `ContentPanel.jsx` 數學區塊保護邏輯。
產出/檢查點: JSON 內容的 math 區塊會被修正；執行後檢視受影響章節頁面以確認 KaTeX 呈現正常。
詳細行為:
- 階段 1 會遞迴處理 `public/data/modular` 下的 `.json` 檔案，修正常見的被破壞的 escape 與分行問題，並直接改寫原檔。
- 已知修復案例: 針對資料中出現的破損 `$$` 標記（如 `\\$$` 與多重 `$` 串）進行保守替換後，部分章節 JSON 已修正（範例：`public/data/chapters_b2_ch2.json`、`chapters_b2_ch3.json`、`chapters_b2_ch5.json`、`chapters_b2_ch6.json`）。修正時會建立 `.bak` 備份檔。
- 階段 2 會修改 `src/components/ContentPanel.jsx` 指定區段（以 marker 定位）插入或覆寫 pre-process 與 math-block 保護邏輯。
- 建議先建立 git 分支或備份 `ContentPanel.jsx`，以便回退。

## 維護鏈條
重大修改後建議遵循：`Code Sync` → `Load Balancing` → `Architecture Build` → `QA Audit`

## 補充建議
- **語言一致性:** 文件中混用中英文建議統一（可用中文主體並在括號提供英文對照）。
- **回滾策略:** 在執行會改寫資料的腳本前，請建立臨時分支或備份相關 JSON 檔案以便回滾。範例：

```powershell
git checkout -b maintenance/update-examples
git add public/data
git commit -m "backup: data before update_examples"
```

- **腳本連結檢視:** 如需快速瀏覽腳本實作，請參考 `scripts/` 目錄下的對應檔案（例如 `scripts/build-chapters.py`、`scripts/update_examples.py`）。

## 8. 檔案格式檢查 (Format & Lint Checks)

為確保程式碼品質，本專案提供自動化格式與靜態檢查工具。詳細說明與安裝指引請參考：

👉 **[FORMAT_AND_LINT_CHECKS.md](file:///c:/Users/benit/Desktop/FRM%20MATLAB/Python/pwa_Book2_python/.agent/skills/maintenance/FORMAT_AND_LINT_CHECKS.md)**

### 快速執行
```powershell
python scripts/run_format_checks.py
```

### 核心行為
- 自動偵測 `git status` 中的修改檔案。
- 依序執行 `eslint` (JS/JSX) 與 `ruff` (Python)。
- 具備多層級執行檔回退機制 (Fallback)，適應不同開發環境。

---
## 維護鏈條
重大修改後建議遵循：`Code Sync` → `Load Balancing` → `Architecture Build` → `QA Audit` → `Format Check`

## 補充建議
- **回滾策略:** 在執行會改寫資料的腳本前，請利用 Git 或手動備份相關 JSON 檔案。
- **維護優先:** 優先確保 `public/data/modular` 的源頭數據正確，再執行 `build-chapters.py` 進行同步。
