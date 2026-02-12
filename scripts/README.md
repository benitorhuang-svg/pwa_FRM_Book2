# Scripts

| 腳本 | 功能 |
|---|---|
| **build-chapters.py** | 從 `public/data/modular` 生成 `chapters_index.json` 及各章節主數據 |
| **update_examples.py** | 將本地 `.py` 原始碼同步回 JSON 中的程式碼片段 |
| **limit_simulations.py** | 自動注入 `__SIM_CAP` 保護機制，限制瀏覽器端模擬運算規模 |
| **enrich_chapters.py** | 為章節資料注入額外元數據 |
| **audit.py** | (新) 合併 `audit_examples.py` 與 `deep_audit.py`：提供 `examples`、`deep` 與 `all` 模式的稽核 |
| **check_aligned_wrapped.py** | 檢查 KaTeX `aligned` 區塊是否被錯誤包裹 |
| **scan_imports.py** | 掃描 Python 範例的 import，更新 `App.jsx` 的 `MODULE_MAPPING` |
| **fix_katex.cjs** | KaTeX 統一修復：Phase 1 修復 JSON 數學區塊，Phase 2 重建 ContentPanel.jsx 保護邏輯 |
| **capture_preview.cjs** | 使用 Playwright 自動擷取各章節預覽縮圖 |
| **copy_welcome_assets.js** | 複製歡迎頁面資產到目標目錄 |
| **generate-icons.py** | 生成 PWA 各尺寸圖示 |
