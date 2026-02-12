/* eslint-disable no-console */
/**
 * 效能監控工具
 */

export class PerformanceMonitor {
  constructor() {
    this.metrics = {}
    this.enabled = true
  }

  /**
   * 開始計時
   * @param {string} label - 計時標籤
   */
  start(label) {
    if (!this.enabled) return

    this.metrics[label] = {
      start: performance.now(),
      end: null,
      duration: null
    }
  }

  /**
   * 結束計時
   * @param {string} label - 計時標籤
   * @returns {number} 執行時間（毫秒）
   */
  end(label) {
    if (!this.enabled || !this.metrics[label]) return 0

    const end = performance.now()
    const start = this.metrics[label].start
    const duration = end - start

    this.metrics[label].end = end
    this.metrics[label].duration = duration

    // 輸出到控制台
    this.log(label, duration)

    return duration
  }

  /**
   * 記錄效能指標
   * @param {string} label - 標籤
   * @param {number} duration - 時間
   */
  log(label, duration) {
    const emoji = duration < 100 ? '⚡' : duration < 1000 ? '⏱️' : '🐌'
    const color = duration < 100 ? 'color: green' : duration < 1000 ? 'color: orange' : 'color: red'

    console.warn(
      `%c${emoji} ${label}: ${duration.toFixed(2)}ms`,
      color
    )

    // 如果太慢，發出警告
    if (duration > 1000) {
      console.warn(`⚠️ ${label} 執行時間過長: ${duration.toFixed(2)}ms`)
    }
  }

  /**
   * 測量函數執行時間
   * @param {string} label - 標籤
   * @param {Function} fn - 要測量的函數
   * @returns {Promise<any>} 函數執行結果
   */
  async measure(label, fn) {
    this.start(label)
    try {
      const result = await fn()
      return result
    } finally {
      this.end(label)
    }
  }

  /**
   * 取得指定標籤的指標
   * @param {string} label - 標籤
   * @returns {Object|null} 指標資料
   */
  getMetric(label) {
    return this.metrics[label] || null
  }

  /**
   * 取得所有指標
   * @returns {Object} 所有指標
   */
  getMetrics() {
    return { ...this.metrics }
  }

  /**
   * 取得統計資訊
   * @returns {Object} 統計資訊
   */
  getStats() {
    const durations = Object.values(this.metrics)
      .filter(m => m.duration !== null)
      .map(m => m.duration)

    if (durations.length === 0) {
      return {
        count: 0,
        total: 0,
        average: 0,
        min: 0,
        max: 0
      }
    }

    return {
      count: durations.length,
      total: durations.reduce((a, b) => a + b, 0),
      average: durations.reduce((a, b) => a + b, 0) / durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations)
    }
  }

  /**
   * 清除指定標籤的指標
   * @param {string} label - 標籤
   */
  clear(label) {
    if (label) {
      delete this.metrics[label]
    } else {
      this.metrics = {}
    }
  }

  /**
   * 啟用/停用監控
   * @param {boolean} enabled - 是否啟用
   */
  setEnabled(enabled) {
    this.enabled = enabled
  }

  /**
   * 輸出效能報告
   */
  report() {
    const stats = this.getStats()

    console.group('📊 效能報告')
    console.warn(`總計測量: ${stats.count} 次`)
    console.warn(`總時間: ${stats.total.toFixed(2)}ms`)
    console.warn(`平均時間: ${stats.average.toFixed(2)}ms`)
    console.warn(`最快: ${stats.min.toFixed(2)}ms`)
    console.warn(`最慢: ${stats.max.toFixed(2)}ms`)
    console.groupEnd()

    // 列出所有指標
    console.group('📋 詳細指標')
    Object.entries(this.metrics).forEach(([label, metric]) => {
      if (metric.duration !== null) {
        console.warn(`${label}: ${metric.duration.toFixed(2)}ms`)
      }
    })
    console.groupEnd()
  }
}

// 建立全域實例
export const perfMonitor = new PerformanceMonitor()

// 在開發環境啟用，生產環境停用
if (import.meta.env.PROD) {
  perfMonitor.setEnabled(false)
}

/**
 * 測量 React 組件渲染時間
 * @param {string} componentName - 組件名稱
 * @returns {Function} useEffect 回調函數
 */
export function measureRender(componentName) {
  return () => {
    perfMonitor.start(`${componentName}-render`)
    return () => {
      perfMonitor.end(`${componentName}-render`)
    }
  }
}

let isVitalsReporting = false

/**
 * Web Vitals 監控
 */
export function reportWebVitals() {
  if (isVitalsReporting) return
  isVitalsReporting = true

  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      console.warn('🎨 LCP:', lastEntry.renderTime || lastEntry.loadTime)
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        console.warn('⚡ FID:', entry.processingStart - entry.startTime)
      })
    })
    fidObserver.observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift (CLS)
    let clsScore = 0
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value
        }
      })
      console.warn('📐 CLS:', clsScore)
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })
  }
}
