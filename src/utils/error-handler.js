/**
 * 將 Python 錯誤轉換為友善的錯誤訊息
 * @param {Error} error - Python 錯誤物件
 * @returns {string} 友善的錯誤訊息
 */
export function formatPythonError(error) {
  const message = error.message || String(error)

  // 常見錯誤的友善提示
  const errorPatterns = [
    {
      pattern: /NameError: name '(.+)' is not defined/,
      format: (match) => `❌ 變數錯誤：'${match[1]}' 未定義`
    },
    {
      pattern: /ModuleNotFoundError: No module named '(.+)'/,
      format: (match) => `❌ 模組錯誤：找不到模組 '${match[1]}'`
    },
    {
      pattern: /SyntaxError/,
      format: () => `❌ 語法錯誤`
    },
    {
      pattern: /IndentationError/,
      format: () => `❌ 縮排錯誤`
    },
    {
      pattern: /TypeError: (.+)/,
      format: (match) => `❌ 型別錯誤：${match[1]}`
    },
    {
      pattern: /IndexError: (.+)/,
      format: (match) => `❌ 索引錯誤：${match[1]}`
    },
    {
      pattern: /KeyError: (.+)/,
      format: (match) => `❌ 鍵值錯誤：${match[1]}`
    },
    {
      pattern: /ValueError: (.+)/,
      format: (match) => `❌ 數值錯誤：${match[1]}`
    },
    {
      pattern: /ZeroDivisionError/,
      format: () => `❌ 除以零錯誤`
    },
    {
      pattern: /ImportError:?\s*(.*)/,
      format: (match) => `❌ 匯入錯誤${match[1] ? '：' + match[1].trim() : ''}`
    }
  ]

  // 嘗試匹配錯誤模式
  for (const { pattern, format } of errorPatterns) {
    const match = message.match(pattern)
    if (match) {
      return format(match)
    }
  }

  // 預設錯誤訊息
  return `❌ 執行錯誤

${message}`
}

/**
 * 檢查錯誤是否為網路錯誤
 */
export function isNetworkError(error) {
  return error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('Failed to load')
}

/**
 * 檢查錯誤是否為 Pyodide 載入錯誤
 */
export function isPyodideLoadError(error) {
  return error.message.includes('pyodide') ||
    error.message.includes('loadPyodide')
}
