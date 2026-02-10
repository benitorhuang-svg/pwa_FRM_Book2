# 專案結構

## 目錄組織

```
pwa_Book2_python/
├── public/                     # 靜態資源（直接提供）
│   ├── data/
│   │   └── chapters.json       # 自動生成的章節資料
│   ├── icons/                  # PWA 圖示（72x72 到 512x512）
│   ├── wheels/                 # 離線套件的 Python wheel 檔案
│   ├── coi-serviceworker.js    # 跨來源隔離 worker
│   └── _headers                # Netlify 標頭配置
├── src/                        # React 應用程式原始碼
│   ├── components/             # React 元件
│   ├── hooks/                  # 自訂 React hooks
│   ├── utils/                  # 工具函數
│   ├── App.jsx                 # 主應用程式元件
│   ├── App.css                 # 應用程式樣式
│   ├── main.jsx                # React 入口點
│   ├── index.css               # 全域樣式
│   └── config.js               # 應用程式配置
├── scripts/                    # 建置和工具腳本
│   ├── build-chapters.py       # 生成 chapters.json
│   └── generate-icons.py       # 生成 PWA 圖示
├── SDD/                        # 軟體設計文件
│   ├── principles.md           # 專案原則
│   ├── spec.md                 # 功能規格
│   └── tech_plan.md            # 技術計畫
├── dist/                       # 生產建置輸出（自動生成）
├── node_modules/               # NPM 相依套件（自動生成）
├── package.json                # NPM 配置
├── vite.config.js              # Vite 建置配置
├── eslint.config.js            # ESLint 配置
├── ruff.toml                   # Python 檢查工具配置
└── README.md                   # 專案文件
```

## 元件架構

### 核心元件 (`src/components/`)

- **TopNav.jsx** - 頂部導航列，包含章節/腳本選擇
- **ChapterNav.jsx** - 章節導航側邊欄（舊版，目前已從 UI 移除）
- **ContentPanel.jsx** - 主要內容區域，顯示章節 markdown 和範例
- **CodePreviewPanel.jsx** - 程式碼編輯器和執行面板（延遲載入）
- **CodeEditor.jsx** - Monaco 編輯器封裝
- **OutputPanel.jsx** - Python 執行輸出顯示
- **FloatingOutput.jsx** - 互動模式的浮動輸出視窗
- **PythonRunner.jsx** - 管理 Pyodide 實例的隱藏元件
- **LoadingProgress.jsx** - 載入指示器與進度條
- **Skeleton.jsx** - 載入骨架元件

### 工具模組 (`src/utils/`)

- **pyodide-loader.js** - Pyodide 初始化、套件載入、超時保護
- **matplotlib-handler.js** - Matplotlib 圖表捕獲和顯示
- **storage.js** - 透過 localforage 進行 IndexedDB 操作
- **error-handler.js** - Python 錯誤格式化和使用者友善訊息
- **performance.js** - 效能監控和 Web Vitals 報告

### 自訂 Hooks (`src/hooks/`)

- **useAutoSave.js** - 程式碼編輯器的防抖自動儲存

## 關鍵架構模式

### 狀態管理

- 使用 React hooks（useState、useEffect）管理本地狀態
- 無全域狀態函式庫（Redux/Context）- 保持簡單
- LocalStorage 用於主題偏好
- IndexedDB 用於持久化資料（進度、程式碼）

### 程式碼分割

- CodePreviewPanel 延遲載入（減少初始包大小）
- Vite 自動按供應商區塊進行程式碼分割
- Pyodide 中的動態套件載入（按需載入）

### 錯誤處理

- 所有非同步操作都使用 try-catch 區塊
- 透過 `formatPythonError()` 提供使用者友善的錯誤訊息
- Pyodide 載入的重試邏輯（3 次嘗試）
- 程式碼執行的超時保護（預設 30 秒）

### 記憶體管理

- 程式碼執行前自動清理
- Matplotlib 圖表清理（`plt.close('all')`）
- 執行後垃圾回收
- 儲存配額監控

### 效能最佳化

- 預測性套件載入（掃描章節範例）
- 後端快取（AGG vs 互動式）
- 最小化 Matplotlib 重新初始化
- Service Worker 快取 CDN 資源

## 檔案命名慣例

### 元件

- 元件檔案使用 PascalCase：`ComponentName.jsx`
- 對應的 CSS 檔案：`ComponentName.css`
- 舊版元件加上前綴：`legacy_ComponentName.jsx`

### 工具

- 工具檔案使用 kebab-case：`utility-name.js`
- 描述性名稱表明用途

### 配置

- 小寫加副檔名：`vite.config.js`、`eslint.config.js`
- Python 腳本：`script-name.py`

## 匯入模式

### 絕對匯入

未配置 - 從 `src/` 使用相對匯入

### 相對匯入

```javascript
import Component from './components/Component'
import { utility } from './utils/utility-name'
```

### 外部函式庫

```javascript
import React from 'react'
import localforage from 'localforage'
```

## CSS 架構

### 樣式方法

- 元件範圍的 CSS 檔案
- `index.css` 中的全域樣式
- 使用 CSS 自訂屬性進行主題設定
- 使用 `data-theme` 屬性切換深色/淺色模式

### 主題變數

在 CSS 自訂屬性中定義，透過 `data-theme="dark"` 或 `data-theme="light"` 切換

## 資料流

1. **章節載入**：`App.jsx` 取得 `chapters.json` → 傳遞給 `TopNav` 和 `ContentPanel`
2. **程式碼選擇**：使用者點擊範例 → `ContentPanel` 呼叫 `onCodeClick` → `App.jsx` 設定 `currentScript`
3. **程式碼執行**：`CodePreviewPanel` 呼叫 `onRun` → `App.jsx` 透過 `handleRunCode` 處理 → Pyodide 執行 → 更新輸出/圖表
4. **自動儲存**：`CodeEditor` 變更 → `useAutoSave` hook → `storage.js` 儲存到 IndexedDB

## 建置產物

### 開發環境

- Vite 開發伺服器，支援 HMR
- 啟用 source maps
- 無壓縮

### 生產環境 (`dist/`)

- 壓縮的 JS/CSS 包
- 程式碼分割的供應商區塊
- PWA 的 Service Worker
- 可安裝性的 Manifest.json
- 預快取資源，包含 .whl 檔案
