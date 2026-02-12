---
name: FormatAndLintChecks
description: 專案程式碼品質管理：自動化 ESLint 與 Ruff 檢查工作流
---

# 檔案格式檢查 (Format & Lint Checks)

為確保程式碼品質，本工具提供自動化格式與靜態檢查。當工作區有檔案修改時，應優先執行此檢查。

## 快速執行

在專案根目錄執行：

```powershell
python scripts/run_format_checks.py
```

## 行為說明

`scripts/run_format_checks.py` 會執行以下操作：
1. **變更偵測**：檢查 `git status --porcelain`，僅在有未提交或已修改檔案時運行。
2. **ESLint (JS/JSX)**：優先使用專案 `node_modules` 下的執行檔，具備自動回退 (Fallback) 機制。
3. **Ruff (Python)**：執行專案代碼與腳本的靜態檢查。
4. **回傳結果**：若兩者皆通過，返回成功；任一失敗會以非零 exit code 返回。

## 建議整合

### Git Hook (Pre-push)
建議將檢查整合至 `.git/hooks/pre-push`：

```bash
#!/usr/bin/env bash
python scripts/run_format_checks.py || { echo "Format/lint checks failed"; exit 1; }
```

## 環境安裝指引

### 1. 安裝 Ruff (Python)
建議安裝於虛擬環境中：

```powershell
python -m venv .venv
.venv\Scripts\activate
python -m pip install --upgrade pip
pip install ruff
```

或是透過 `uv`（若可用）：
```powershell
uv run python -m pip install ruff
```

### 2. 安裝 ESLint (Node.js)
確保已安裝 Node.js 與專案相依套件：

```powershell
npm install
```

---

## 故障排除與更新 (2026-02-12)
- **執行檔遺失**：腳本會嘗試多種路徑（npx, global, local）。若環境完全缺乏對應工具，腳本會跳過該項檢查並輸出說明，而不會直接崩潰。
- **Lint 失敗**：請根據終端輸出的錯誤訊息進行修正。若為 ESLint，可嘗試執行 `npm run lint:fix`。
