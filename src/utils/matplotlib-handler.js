/**
 * Matplotlib 圖表處理工具
 */

/**
 * 捕獲 Matplotlib 圖表並轉換為 base64 圖片
 * @param {Object} pyodide - Pyodide 實例
 * @returns {Promise<string|null>} base64 圖片資料或 null
 */
export async function capturePlot(pyodide) {
  try {
    // 檢查是否有圖表
    const hasFigures = await pyodide.runPythonAsync(`
import matplotlib.pyplot as plt
len(plt.get_fignums()) > 0
    `)

    if (!hasFigures) {
      return null
    }

    // 將圖表轉換為 base64
    const plotData = await pyodide.runPythonAsync(`
import matplotlib.pyplot as plt
import io
import base64

# 取得當前圖表
buf = io.BytesIO()
plt.savefig(buf, format='png', dpi=150, bbox_inches='tight', facecolor='white')
buf.seek(0)

# 轉換為 base64
img_base64 = base64.b64encode(buf.read()).decode('utf-8')
plt.close('all')  # 清除所有圖表
img_base64
    `)

    return `data:image/png;base64,${plotData}`
  } catch (error) {
    console.error('Failed to capture plot:', error)
    return null
  }
}

/**
 * 捕獲所有 Matplotlib 圖表
 * @param {Object} pyodide - Pyodide 實例
 * @returns {Promise<string[]>} base64 圖片陣列
 */
export async function captureAllPlots(pyodide) {
  try {
    // 取得圖表數量
    const figCount = await pyodide.runPythonAsync(`
import matplotlib.pyplot as plt
len(plt.get_fignums())
    `)

    if (figCount === 0) {
      return []
    }

    const plots = []

    // 逐一捕獲每個圖表
    for (let i = 0; i < figCount; i++) {
      const plotData = await pyodide.runPythonAsync(`
import matplotlib.pyplot as plt
import io
import base64

# 取得指定的圖表
fig = plt.figure(${i + 1})
buf = io.BytesIO()
fig.savefig(buf, format='png', dpi=150, bbox_inches='tight', facecolor='white')
buf.seek(0)

# 轉換為 base64
img_base64 = base64.b64encode(buf.read()).decode('utf-8')
img_base64
      `)

      plots.push(`data:image/png;base64,${plotData}`)
    }

    // 清除所有圖表
    await pyodide.runPythonAsync('import matplotlib.pyplot as plt; plt.close("all")')

    return plots
  } catch (error) {
    console.error('Failed to capture plots:', error)
    return []
  }
}

/**
 * 下載圖表
 * @param {string} dataUrl - base64 圖片資料
 * @param {string} filename - 檔案名稱
 */
export function downloadPlot(dataUrl, filename = 'plot.png') {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 複製圖表到剪貼簿
 * @param {string} dataUrl - base64 圖片資料
 */
export async function copyPlotToClipboard(dataUrl) {
  try {
    // 將 base64 轉換為 Blob
    const response = await fetch(dataUrl)
    const blob = await response.blob()

    // 複製到剪貼簿
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ])

    return true
  } catch (error) {
    console.error('Failed to copy plot:', error)
    return false
  }
}

/**
 * 初始化 Matplotlib 設定
 * @param {Object} pyodide - Pyodide 實例
 * @param {boolean} interactive - 是否使用互動式模式
 */
export async function initMatplotlib(pyodide, interactive = false) {
  try {
    // 在 Pyodide 中，'module://matplotlib_pyodide.wasm_backend' 是預設的 HTML5 Canvas 後端
    const backend = interactive ? 'module://matplotlib_pyodide.wasm_backend' : 'AGG'
    await pyodide.runPythonAsync(`
import matplotlib
import matplotlib.pyplot as plt
matplotlib.use('${backend}')
if plt.style.available and 'default' in plt.style.available:
    plt.style.use('default')
    `)

    // Matplotlib initialized successfully
  } catch (error) {
    console.error('✗ Matplotlib 初始化失敗:', error)
  }
}

/**
 * 確保所有圖表都已顯示（針對互動式模式）
 * @param {Object} pyodide - Pyodide 實例
 */
export async function ensurePlotsShown(pyodide) {
  try {
    await pyodide.runPythonAsync(`
import matplotlib.pyplot as plt
if len(plt.get_fignums()) > 0:
    plt.show()
    `)
  } catch (error) {
    console.error('Failed to show plots:', error)
  }
}

/**
 * 設定互動式圖表的目標容器
 * @param {HTMLElement} target - 目標 DOM 元素
 */
export function setupInteractiveTarget(target) {
  if (target) {
    window.document.pyodideMplTarget = target
  }
}
