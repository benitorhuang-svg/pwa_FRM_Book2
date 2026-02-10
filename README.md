# 📚 FRM Python 互動式學習平台 PWA - 實戰篇

這是《手術刀般精準的 FRM 用 Python 科學管控財金風險：實戰篇》的 Progressive Web App (PWA) 互動式學習平台。

## ✨ 特色功能

- 🐍 **瀏覽器中執行 Python** - 使用 Pyodide 在瀏覽器中直接執行 Python 程式碼
- 📱 **PWA 支援** - 可安裝到桌面/手機，支援離線使用
- 💻 **Monaco 編輯器** - VS Code 同款編輯器，提供語法高亮和自動完成
- 📊 **即時視覺化** - 支援 Matplotlib、NumPy、Pandas 等套件
- 💾 **學習進度追蹤** - 自動儲存學習進度和程式碼修改
- 🌓 **深色/淺色模式** - 護眼的雙主題切換
- 📱 **響應式設計** - 手機、平板、桌面都能完美使用

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 建立章節資料

```bash
npm run build-chapters
```

這會掃描 `Book2_Python_Code` 目錄，將所有 Python 範例轉換為 JSON 格式。

### 3. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問 `http://localhost:5173`

### 4. 建置生產版本

```bash
npm run build
```

建置完成的檔案會在 `dist` 目錄中。

## 📁 專案結構

```
pwa_Book2_python/
├── public/                    # 靜態資源
│   ├── data/
│   │   └── chapters.json      # 自動生成的章節資料
│   ├── icons/                 # PWA 圖示
│   └── test-pyodide.html      # Pyodide 測試頁面
├── src/                       # React 應用程式原始碼
│   ├── components/            # UI 組件
│   │   ├── ChapterNav.jsx     # 章節導航
│   │   ├── CodeEditor.jsx     # 程式碼編輯器
│   │   ├── OutputPanel.jsx    # 輸出面板
│   │   └── PythonRunner.jsx   # Python 執行器
│   ├── hooks/                 # React Hooks
│   │   └── useAutoSave.js     # 自動儲存
│   ├── utils/                 # 工具函數
│   │   ├── pyodide-loader.js  # Pyodide 載入器
│   │   ├── storage.js         # 本地儲存管理
│   │   ├── error-handler.js   # 錯誤處理
│   │   ├── matplotlib-handler.js # 圖表處理
│   │   └── performance.js     # 效能監控
│   ├── App.jsx                # 主應用程式
│   └── main.jsx               # 入口點
├── scripts/                   # 建置腳本
│   └── build-chapters.py      # 章節資料建置工具
├── package.json               # NPM 套件設定
├── vite.config.js             # Vite 建置設定
└── 文檔檔案                    # 各種說明文檔
```

## 📚 文檔索引

### 快速開始
- **`開始使用_PWA.md`** - 新手入門指南
- **`CHECKLIST.md`** - 開發檢查清單
- **`DEPLOYMENT.md`** - 部署指南

### 問題排除
- **`TROUBLESHOOTING.md`** - 常見問題排除
- **`解決_Pandas_PyArrow_警告.md`** - Pandas 警告解決方案

## 🔧 技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| React | 18.3 | 前端框架 |
| Vite | 6.0 | 建置工具 |
| Pyodide | 0.26 | 瀏覽器中的 Python |
| Monaco Editor | 4.6 | 程式碼編輯器 |
| localforage | 1.10 | IndexedDB 封裝 |
| vite-plugin-pwa | 0.21 | PWA 支援 |

## 🎯 核心功能

### 1. Python 執行環境
- 支援 NumPy、Pandas、Matplotlib、SciPy、Statsmodels、SymPy
- 自動警告過濾
- 錯誤訊息友善化

### 2. 程式碼編輯
- VS Code 同款 Monaco 編輯器
- 語法高亮
- 自動完成
- 程式碼摺疊

### 3. 視覺化支援
- Matplotlib 圖表捕獲
- 圖表下載功能
- 多圖表顯示

### 4. 學習追蹤
- 自動儲存程式碼修改
- 學習進度記錄
- 完成狀態標記

### 5. PWA 功能
- 離線可用
- 可安裝到桌面/手機
- 快速載入
- 背景同步

### 6. 穩定性與強健性 (New)
- **自動重試機制**：Pyodide 載入失敗時自動重試
- **記憶體管理**：自動清理 Matplotlib 圖表與執行垃圾回收
- **執行超時保護**：防止無窮迴圈導致瀏覽器卡死 (預設 30秒)
- **自動更新檢查**：Service Worker 定期檢查更新
- **儲存空間監控**：IndexedDB 容量預警

## 🧪 測試

### 測試 Pyodide
訪問 `http://localhost:5173/test-pyodide.html` 測試 Python 執行環境。

### 測試 PWA
```bash
npm run build
npm run preview
```

使用 Chrome DevTools > Lighthouse 測試 PWA 功能。

## 📊 效能指標

- 首次載入: < 6 秒
- 後續載入: < 1 秒
- Lighthouse Performance: > 90
- Lighthouse PWA: > 90

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

與原書籍相同的授權條款。

## 👥 作者

- **姜偉生** - 博士，FRM
- **塗升** - 博士，FRM

## 📞 需要幫助？

- 查看文檔目錄中的各種指南
- 檢查 `TROUBLESHOOTING.md` 常見問題
- 訪問測試頁面進行除錯

---

**版本**: 1.0.3
**最後更新**: 2026-02-10
