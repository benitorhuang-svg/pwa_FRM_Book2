// 應用程式設定

export const config = {
  // Pyodide 設定
  pyodide: {
    version: '0.26.4',
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
    packages: ['numpy', 'matplotlib', 'pandas']
  },

  // 儲存設定
  storage: {
    dbName: 'frm-python-pwa-book2',
    progressStore: 'progress',
    codeStore: 'code'
  },

  // UI 設定
  ui: {
    defaultTheme: 'light', // 'light' or 'dark'
    editorFontSize: 14,
    outputMaxLines: 1000
  },

  // 功能開關
  features: {
    autoSave: true,
    autoSaveDelay: 2000, // ms
    showLineNumbers: true,
    enableMinimap: false
  }
}

export default config
