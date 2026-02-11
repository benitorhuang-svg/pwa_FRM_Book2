import { useState, useEffect, lazy, Suspense } from 'react'
import TopNav from './components/TopNav'
import ContentPanel from './components/ContentPanel'
const CodePreviewPanel = lazy(() => import('./components/CodePreviewPanel'))
import PythonRunner from './components/PythonRunner'
import ReloadPrompt from './components/ReloadPrompt'
import { Book, Moon, Sun } from 'lucide-react'
import { loadPyodide, cleanupPyodide, runPythonWithTimeout, loadChapterDatasets, preloadHeavyPackages } from './utils/pyodide-loader'
import { captureAllPlots, initMatplotlib, ensurePlotsShown } from './utils/matplotlib-handler.js'

// Module to package/wheel mapping for lazy loading
const MODULE_MAPPING = {
  // Common scientific packages (Pyodide built-ins)
  'pandas': 'pandas',
  'matplotlib': 'matplotlib',
  'scipy': 'scipy',
  'statsmodels': 'statsmodels',
  'sympy': 'sympy',
  'autograd': 'autograd',
  'lxml': 'lxml',
  'openpyxl': 'openpyxl',
  'requests': 'requests',
  'sklearn': 'scikit-learn',
  'scikit-learn': 'scikit-learn',
  // Micropip-installable packages (from PyPI)
  'arch': 'arch',
  'plotly': 'plotly',
  'chart_studio': 'chart-studio',
  'mcint': 'mcint',
  'mibian': 'mibian',
  'prettytable': 'prettytable',
  'qpsolvers': 'qpsolvers',
  'tabulate': 'tabulate',
  // Local wheel files
  'numpy_financial': 'wheels/numpy_financial-1.0.0-py3-none-any.whl',
  'seaborn': 'wheels/seaborn-0.13.2-py3-none-any.whl',
  'pymoo': 'wheels/pymoo-0.4.1-py3-none-any.whl',
  'pandas_datareader': 'wheels/pandas_datareader-0.10.0-py3-none-any.whl',
  'pyodide_http': 'wheels/pyodide_http-0.2.2-py3-none-any.whl',
  'mpl_toolkits': 'matplotlib',
  'pylab': 'matplotlib'
}

// Dependencies for local wheels
const MODULE_DEPS = {
  'requests': ['certifi', 'charset_normalizer', 'idna', 'urllib3'],
  'certifi': 'wheels/certifi-2026.1.4-py3-none-any.whl',
  'charset_normalizer': 'wheels/charset_normalizer-3.4.4-py3-none-any.whl',
  'idna': 'wheels/idna-3.11-py3-none-any.whl',
  'urllib3': 'wheels/urllib3-2.6.3-py3-none-any.whl'
}
import { formatPythonError } from './utils/error-handler'
import { perfMonitor, reportWebVitals } from './utils/performance'
import './App.css'

function App() {
  const [pyodide, setPyodide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState('初始化中...')

  // Chapter Data State
  const [chapters, setChapters] = useState([])
  const [chaptersLoading, setChaptersLoading] = useState(true)
  const [currentChapter, setCurrentChapter] = useState(null)
  const [currentScript, setCurrentScript] = useState(null)
  const [selectedTopicId, setSelectedTopicId] = useState('')
  const [chapterCache, setChapterCache] = useState({}) // Cache for loaded chapters

  const [output, setOutput] = useState('')
  const [plotImages, setPlotImages] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [isInteractive, setIsInteractive] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved === 'dark' || (!saved && false) // Default to Light Mode (false)
  })

  const [previewPanelWidth, setPreviewPanelWidth] = useState(600) // Start visible and centered
  const [installedPackages] = useState(new Set())
  const [currentMplBackend, setCurrentMplBackend] = useState(null)

  // Fetch Chapters Index (Lightweight)
  useEffect(() => {
    setChaptersLoading(true)
    const url = `${import.meta.env.BASE_URL}data/chapters_index.json?t=${Date.now()}`
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setChapters(data)
        }
        setChaptersLoading(false)
      })
      .catch(err => {
        console.error('Failed to load chapters index:', err)
        setChaptersLoading(false)
      })
  }, [])

  const fetchChapterData = async (chapterId) => {
    // Return from cache if available
    if (chapterCache[chapterId]) {
      return chapterCache[chapterId]
    }

    try {
      setChaptersLoading(true)
      const response = await fetch(`${import.meta.env.BASE_URL}data/chapters_${chapterId}.json?t=${Date.now()}`)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      // Read the response as text once to avoid "body stream already read" error
      const rawText = await response.text()
      let fullData = null

      try {
        // Try to parse as JSON first
        fullData = JSON.parse(rawText)
      } catch (jsonErr) {
        // Fallback: attempt to recover from common "bad escaped character" issues
        try {
          // Heuristic: escape stray backslashes that are not part of a valid JSON escape
          const sanitized = rawText.replace(/\\(?!["\\\/bfnrtu])/g, "\\\\")
          fullData = JSON.parse(sanitized)
        } catch (e) {
          throw new Error(`Failed to parse chapter data: ${e.message}`)
        }
      }

      setChapterCache(prev => ({
        ...prev,
        [chapterId]: fullData
      }))

      setChaptersLoading(false)
      return fullData
    } catch (error) {
      console.error(`Failed to load chapter ${chapterId}:`, error)
      setChaptersLoading(false)
      return null
    }
  }

  useEffect(() => {
    loadPyodide((progress, message) => {
      setLoadingProgress(progress)
      setLoadingMessage(message)
    }).then(py => {
      setPyodide(py)
      setLoading(false)
      perfMonitor.end('pyodide-init')
    })

    reportWebVitals()

    // Service Worker & Storage Quota Checks
    const cleanups = []

    if ('serviceWorker' in navigator) {
      // Check for updates periodically
      const updateInterval = setInterval(() => {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => registration.update())
        })
      }, 60 * 60 * 1000) // Check every hour

      // Listen for controller change (new worker activated)
      const handleControllerChange = () => {
        // New Service Worker activated - no action needed
      }
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)

      cleanups.push(() => {
        clearInterval(updateInterval)
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
      })
    }

    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const checkQuota = async () => {
        try {
          const estimate = await navigator.storage.estimate()
          if (estimate.usage && estimate.quota) {
            const percentUsed = (estimate.usage / estimate.quota) * 100
            if (percentUsed > 80) {
              console.warn('Storage usage is high (>80%). Consider cleaning up.')
            }
          }
        } catch (e) {
          console.warn('Failed to check storage quota:', e)
        }
      }

      // Check initially and every 5 minutes
      checkQuota()
      const quotaInterval = setInterval(checkQuota, 5 * 60 * 1000)

      cleanups.push(() => clearInterval(quotaInterval))
    }

    return () => {
      cleanups.forEach(fn => fn())
    }
  }, [])

  // Background Loading for Heavy Packages
  useEffect(() => {
    if (pyodide && !loading) {
      // Start loading heavy dependencies in the background
      // This won't block the UI, but will ensure they are ready when needed later
      preloadHeavyPackages(pyodide)
        .then(() => console.log('Background initialization complete'))
        .catch(err => console.error('Background loaded failed', err))
    }
  }, [pyodide, loading])

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const ensureDependencies = async (code, isSilent = false) => {
    if (!pyodide) return
    const imports = code.match(/^\s*(?:from|import)\s+([a-zA-Z0-9_]+)/gm)
    if (!imports) return

    const stdLibs = ['sys', 'os', 'io', 'time', 'timeit', 'base64', 'json', 'datetime', 'math', 're', 'warnings', 'builtins', 'types', 'random', 'csv', 'copy', 'collections', 'itertools', 'functools', 'pathlib', 'fractions', 'struct', 'operator', 'string', 'decimal', 'abc', 'enum', 'typing', 'textwrap']
    const coreLibs = ['numpy', 'pandas', 'matplotlib', 'scipy', 'statsmodels', 'sympy', 'lxml', 'micropip', 'js', 'builtins', 'QuantLib', 'mcint']

    const neededModules = [...new Set(imports.map(line => {
      const parts = line.trim().split(/\s+/)
      return parts[0] === 'from' ? parts[1].split('.')[0] : parts[1].split('.')[0]
    }))].filter(mod => !stdLibs.includes(mod) && !coreLibs.includes(mod))
      .filter(mod => !installedPackages.has(mod) && !window.failedPackages?.has(mod))

    if (neededModules.length === 0) return

    const toInstall = []
    const wheelsBase = new URL(import.meta.env.BASE_URL || '/', window.location.origin).href

    neededModules.forEach(mod => {
      const target = MODULE_MAPPING[mod]
      if (target) {
        toInstall.push(target.endsWith('.whl') ? wheelsBase + target : target)
        const deps = MODULE_DEPS[mod] || []
        deps.forEach(dep => {
          const depTarget = MODULE_DEPS[dep] || dep
          toInstall.push(depTarget.endsWith('.whl') ? wheelsBase + depTarget : depTarget)
        })
      } else {
        toInstall.push(mod)
      }
    })

    if (toInstall.length > 0) {
      try {
        const uniqueInstall = [...new Set(toInstall)]
        if (!isSilent) {
          setOutput(prev => prev + `正在動態載入所需套件 [${neededModules.join(', ')}]...\n`)
        }

        await pyodide.loadPackage('micropip')
        await pyodide.runPythonAsync(`
import micropip
await micropip.install(${JSON.stringify(uniqueInstall)}, keep_going=True)
        `)

        if (neededModules.includes('matplotlib')) {
          await initMatplotlib(pyodide)
          if (!currentMplBackend) setCurrentMplBackend('AGG')
        }

        neededModules.forEach(mod => {
          // Mark both the requested module and its mapped package as installed
          installedPackages.add(mod)
          const mappedPackage = MODULE_MAPPING[mod]
          if (mappedPackage && !mappedPackage.endsWith('.whl')) {
            installedPackages.add(mappedPackage)
          }
        })
        if (!isSilent) {
          setOutput(prev => prev + `✅ 套件載入完成。\n`)
        }
      } catch (e) {
        console.warn('Dependency loading failed:', e)
        if (!window.failedPackages) window.failedPackages = new Set();
        neededModules.forEach(mod => window.failedPackages.add(mod));

        if (!isSilent) {
          const errorMsg = e.message || String(e)
          if (errorMsg.includes("Can't find a pure Python 3 wheel")) {
            const packageName = errorMsg.match(/for: '([^']+)'/)?.[1] || 'unknown'
            setOutput(prev => prev + `⚠️ 套件 "${packageName}" 無法載入（可能不支援瀏覽器環境），嘗試繼續執行...\n`)
          } else {
            setOutput(prev => prev + `⚠️ 套件載入出現問題，嘗試直接執行...\n`)
          }
        }
      }
    }
  }

  const handleRunCode = async (code) => {
    if (!pyodide || isRunning || !code) return

    setIsRunning(true)
    setOutput('執行中...\n')
    setPlotImages([])

    try {
      // 1. Detect and load missing dependencies
      // Move performance timer after dependency loading to measure ACTUAL code execution
      await ensureDependencies(code)
      perfMonitor.start('run-code')

      // Robustness: Cleanup before run
      await cleanupPyodide(pyodide)

      const interactive = code.includes('matplotlib.widgets') || code.includes('Slider') || code.includes('Button')
      setIsInteractive(interactive)

      // Optimize: Only re-init Matplotlib if backend changed or it's the first time
      const targetBackend = interactive ? 'module://matplotlib_pyodide.wasm_backend' : 'AGG'
      if (currentMplBackend !== targetBackend) {
        // Initial AGG init is already done in pyodide-loader.js, but we ensure it here if backend changes
        await initMatplotlib(pyodide, interactive)
        setCurrentMplBackend(targetBackend)
      }

      await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `)

      if (interactive) {
        const target = document.getElementById('pyodide-plot-container')
        if (target) {
          target.innerHTML = ''
          window.document.pyodideMplTarget = target
        }
      }

      try {
        // Robustness: Use timeout wrapper
        await runPythonWithTimeout(pyodide, code)
      } catch (error) {
        const partialStdout = await pyodide.runPythonAsync('sys.stdout.getvalue()')
        const formattedError = formatPythonError(error)
        setOutput((partialStdout ? partialStdout + '\n' : '') + formattedError)
        setIsRunning(false)
        perfMonitor.end('run-code')
        return
      }

      const stdout = await pyodide.runPythonAsync('sys.stdout.getvalue()')
      setOutput(stdout || '執行完成（無文字內容輸出 ）')

      if (isInteractive) {
        await ensurePlotsShown(pyodide)
      } else {
        const images = await captureAllPlots(pyodide)
        setPlotImages(images)
      }

    } catch (error) {
      const friendlyError = formatPythonError(error)
      setOutput(friendlyError)
      console.error(error)
    } finally {
      setIsRunning(false)
      perfMonitor.end('run-code')
    }
  }

  const handleChapterSelect = async (chapterMeta) => {
    // chapterMeta might be just the index item (id, title, number) OR full data if cached/monolith
    // We need to ensure we have the full data (content, examples)

    let fullChapter = chapterMeta

    // If it's a lightweight index item (no 'content' property), fetch full data
    if (chapterMeta && !chapterMeta.content) {
      fullChapter = await fetchChapterData(chapterMeta.id)
    }

    if (!fullChapter) return // Error or loading failed

    setCurrentChapter(fullChapter)
    setCurrentScript(null)
    setSelectedTopicId('') // Reset topic when chapter changes
    setOutput('')
    setPlotImages([])

    // Predictive Load: Scan all examples in the chapter for dependencies and trigger background load
    if (fullChapter && fullChapter.examples && pyodide) {
      const allCode = fullChapter.examples.map(ex => ex.code).join('\n')
      ensureDependencies(allCode, true) // Silent background load
    }
  }

  // Lazy Load Datasets for Current Chapter
  useEffect(() => {
    if (pyodide && currentChapter && currentChapter.id) {
      loadChapterDatasets(pyodide, currentChapter.id)
        .catch(err => console.error("Dataset lazy load failed", err))
    }
  }, [pyodide, currentChapter])

  const handleCodeClick = (script) => {
    setCurrentScript(script)
    setOutput('')
    setPlotImages([])
  }

  const handleScriptSelect = (script) => {
    setCurrentScript(script)
    setOutput('')
    setPlotImages([])
  }

  const handleClosePreview = () => {
    setCurrentScript(null)
    setOutput('')
    setPlotImages([])
  }

  const isLoadingEnvironment = loading;

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <div className="main-content">
        <div className="top-bar">
          <div className="top-bar-left">
            <Book size={20} className="logo-icon" />
            <span className="app-title">FRM_Book2 (實戰篇)</span>
          </div>

          <TopNav
            chapters={chapters}
            currentChapter={currentChapter}
            onChapterSelect={handleChapterSelect}
            currentScript={currentScript}
            onScriptSelect={handleScriptSelect}
            selectedTopicId={selectedTopicId}
            onTopicSelect={setSelectedTopicId}
            loading={chaptersLoading}
          />

          <div className="top-bar-right">
            <button
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? '切換到亮色模式' : '切換到暗色模式'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>



        {/* Premium Hydration Dashboard (Center Overlay) */}
        {isLoadingEnvironment && (
          <div className="hydration-overlay">
            <div className="hydration-card">
              <div className="hydration-header">
                <div className="hydration-title">FRM Python 引擎啟動中</div>
                <div className="hydration-subtitle">Financial Risk Management</div>
              </div>

              <div className="hydration-progress-container">
                <div className="hydration-progress-bar" style={{ width: `${loadingProgress}%` }}></div>
              </div>

              <div className="hydration-status">
                <span>{loadingMessage}</span>
                <span>{loadingProgress}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="panes-container">
          <div className="content-pane">
            <ContentPanel
              chapter={currentChapter}
              onCodeClick={handleCodeClick}
              selectedTopicId={selectedTopicId}
              darkMode={darkMode}
              output={output}
              isRunning={isRunning}
              plotImages={plotImages}
              onClearOutput={() => {
                setOutput('')
                setPlotImages([])
              }}
            />
          </div>

          {currentScript && (
            <div className="preview-pane" style={{ width: `${previewPanelWidth}px` }}>
              <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#888' }}>Loading Editor...</div>}>
                <CodePreviewPanel
                  script={currentScript}
                  onClose={handleClosePreview}
                  onRun={handleRunCode}
                  isRunning={isRunning}
                  isLoading={loading}
                  output={output}
                  images={plotImages}
                  isInteractive={isInteractive}
                  darkMode={darkMode}
                  width={previewPanelWidth}
                  onResize={setPreviewPanelWidth}
                />
              </Suspense>
            </div>
          )}
        </div>
      </div>

      <PythonRunner pyodide={pyodide} />
      <ReloadPrompt />
    </div>
  )
}

export default App
