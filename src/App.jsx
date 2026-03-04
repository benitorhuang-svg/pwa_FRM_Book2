import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import TopNav from './components/TopNav'
import ContentPanel from './components/ContentPanel'
const CodePreviewPanel = lazy(() => import('./components/CodePreviewPanel'))
import PythonRunner from './components/PythonRunner'
import ReloadPrompt from './components/ReloadPrompt'
import useBodyContent from './hooks/useBodyContent'
import { Book, Moon, Sun } from 'lucide-react'
import { loadPyodide, cleanupPyodide, runPythonWithTimeout, loadChapterDatasets, preloadHeavyPackages } from './utils/pyodide-loader'
import { captureAllPlots, initMatplotlib, ensurePlotsShown } from './utils/matplotlib-handler.js'

// Module to package/wheel mapping for lazy loading
const MODULE_MAPPING = {
  'QuantLib': 'QuantLib',
  'arch': 'arch',
  'autograd': 'autograd',
  'chart_studio': 'chart-studio',
  'datetime': 'datetime',
  'lxml': 'lxml',
  'math': 'math',
  'matplotlib': 'matplotlib',
  'mcint': 'mcint',
  'mibian': 'mibian',
  'mpl_toolkits': 'matplotlib',
  'numpy': 'numpy',
  'numpy_financial': 'wheels/numpy_financial-1.0.0-py3-none-any.whl',
  'openpyxl': 'openpyxl',
  'pandas': 'pandas',
  'pandas_datareader': 'wheels/pandas_datareader-0.10.0-py3-none-any.whl',
  'plotly': 'plotly',
  'prettytable': 'prettytable',
  'pylab': 'matplotlib',
  'pymoo': 'wheels/pymoo-0.4.1-py3-none-any.whl',
  'pyodide_http': 'wheels/pyodide_http-0.2.2-py3-none-any.whl',
  'qpsolvers': 'qpsolvers',
  'requests': 'requests',
  'scikit-learn': 'scikit-learn',
  'scipy': 'scipy',
  'seaborn': 'wheels/seaborn-0.13.2-py3-none-any.whl',
  'sklearn': 'scikit-learn',
  'statsmodels': 'statsmodels',
  'sympy': 'sympy',
  'tabulate': 'tabulate',
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
import { PANDAS_DATAREADER_SHIM, QUANTLIB_SHIM } from './utils/python-shims'
import './App.css'

// Version-check + update flow: fetch manifest and trigger SW update/skipWaiting
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  (async () => {
    try {
      // Prefer a precise assets manifest if available, otherwise fall back to web manifest
      const assetsUrl = `${import.meta.env.BASE_URL}assets-manifest.json?t=${Date.now()}`
      const fallbackUrl = `${import.meta.env.BASE_URL}manifest.webmanifest?t=${Date.now()}`
      let manifestText = null

      try {
        const ar = await fetch(assetsUrl, { cache: 'no-store' })
        if (ar && ar.ok) {
          manifestText = await ar.text()
        }
      } catch {
        // ignore
      }

      if (!manifestText) {
        try {
          const fr = await fetch(fallbackUrl, { cache: 'no-store' })
          if (!fr || !fr.ok) return
          manifestText = await fr.text()
        } catch {
            return
          }
      }

      const prev = localStorage.getItem('app_assets_manifest_text')
      if (prev && prev === manifestText) return // no change
      // store new manifest snapshot
      localStorage.setItem('app_assets_manifest_text', manifestText)

      // New version detected — attempt smooth SW update
      const regs = await navigator.serviceWorker.getRegistrations()
      if (!regs || regs.length === 0) {
        // no SW registered; reload to get new assets
        if (!localStorage.getItem('app_manifest_reload_done')) {
          localStorage.setItem('app_manifest_reload_done', '1')
          location.reload()
        }
        return
      }

      // Try to update registrations and request skipWaiting on waiting workers
      for (const reg of regs) {
        try {
          await reg.update()
          if (reg.waiting) {
            reg.waiting.postMessage({ type: 'SKIP_WAITING' })
          }
        } catch (err) {
          console.warn('SW update attempt failed:', err)
        }
      }

      // When the new worker takes control, reload once (guard with flag)
      const onControllerChange = () => {
        if (localStorage.getItem('app_manifest_reload_done')) return
        localStorage.setItem('app_manifest_reload_done', '1')
        window.location.reload()
      }
      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)
    } catch (err) {
      console.warn('Version check/update failed:', err)
    }
  })()
}

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

  // Lazily fetch modular body sections for the current chapter
  const { bodyContent } = useBodyContent(currentChapter)

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
  const backgroundInitLoggedRef = useRef(false)

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
      } catch {
        // Fallback: attempt to recover from common "bad escaped character" issues
        try {
          // Heuristic: escape stray backslashes that are not part of a valid JSON escape
          const sanitized = rawText.replace(/\\(?!["\\/bfnrtu])/g, "\\\\")
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
        .then(() => {
          if (!backgroundInitLoggedRef.current) {
            backgroundInitLoggedRef.current = true
            console.warn('Background initialization complete')
          }
        })
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

    // On-demand shims (avoid blocking initial Pyodide startup)
    if (/^\s*(?:from|import)\s+QuantLib\b/m.test(code) && !installedPackages.has('QuantLib')) {
      try {
        if (!isSilent) setOutput(prev => prev + '正在啟用 QuantLib 相容性墊片...\n')
        await pyodide.runPythonAsync(QUANTLIB_SHIM)
        installedPackages.add('QuantLib')
        if (!isSilent) setOutput(prev => prev + '✅ QuantLib 墊片已啟用。\n')
      } catch (e) {
        console.warn('QuantLib shim injection failed:', e)
        if (!isSilent) setOutput(prev => prev + '⚠️ QuantLib 墊片啟用失敗，將嘗試繼續執行...\n')
      }
    }

    const stdLibs = ['sys', 'os', 'io', 'time', 'timeit', 'base64', 'json', 'datetime', 'math', 're', 'warnings', 'builtins', 'types', 'random', 'csv', 'copy', 'collections', 'itertools', 'functools', 'pathlib', 'fractions', 'struct', 'operator', 'string', 'decimal', 'abc', 'enum', 'typing', 'textwrap']
    // 移除 scipy, statsmodels, sympy, lxml，讓它們變成動態載入
    // 注意：arch/mibian/mcint/QuantLib 都是以 shim/stub 在核心初始化階段注入，不需要再用 micropip 安裝
    const coreLibs = ['numpy', 'pandas', 'matplotlib', 'micropip', 'js', 'builtins', 'QuantLib', 'mcint', 'arch', 'mibian']

    const neededModules = [...new Set(imports.map(line => {
      const parts = line.trim().split(/\s+/)
      return parts[0] === 'from' ? parts[1].split('.')[0] : parts[1].split('.')[0]
    }))].filter(mod => !stdLibs.includes(mod) && !coreLibs.includes(mod))
      .filter(mod => !installedPackages.has(mod) && !window.failedPackages?.has(mod))

    if (neededModules.length === 0) return

    const toLoadPackage = []
    const toMicropip = []
    const wheelsBase = new URL(import.meta.env.BASE_URL || '/', window.location.origin).href

    // Packages that should be loaded via pyodide.loadPackage (binary/compiled, not via micropip)
    const PYODIDE_BUILTINS = new Set(['scipy', 'statsmodels', 'scikit-learn', 'sympy'])

    const addTarget = (target) => {
      if (!target) return
      // Local wheels / remote URLs must go through micropip
      if (typeof target === 'string' && (target.endsWith('.whl') || target.startsWith('http'))) {
        toMicropip.push(target)
        return
      }
      if (PYODIDE_BUILTINS.has(target)) {
        toLoadPackage.push(target)
      } else {
        toMicropip.push(target)
      }
    }

    // 定義額外的依賴關係 (Explicit Dependencies)
    const EXTRA_DEPS = {
      'sklearn': ['scipy', 'scikit-learn'],
      'scikit-learn': ['scipy'],
      'statsmodels': ['scipy'],
      'sympy': [], // mpmath is usually handled by micropip, but good to be safe if needed
      'seaborn': ['matplotlib', 'pandas', 'scipy', 'statsmodels'],
      // pandas_datareader in browser: prefer our shim + requests; lxml frequently fails in Pyodide
      'pandas_datareader': ['requests']
    }

    neededModules.forEach(mod => {
      const target = MODULE_MAPPING[mod]

      // 1. Add the module itself
      if (target) {
        addTarget(target.endsWith('.whl') ? wheelsBase + target : target)

        // 2. Add dependencies from MODULE_DEPS (Wheel dependencies)
        const deps = MODULE_DEPS[mod] || []
        deps.forEach(dep => {
          const depTarget = MODULE_DEPS[dep] || dep
          addTarget(depTarget.endsWith('.whl') ? wheelsBase + depTarget : depTarget)
        })

      } else {
        addTarget(mod)
      }

      // 3. Add explicit package dependencies (Heavy libs)
      if (EXTRA_DEPS[mod]) {
        EXTRA_DEPS[mod].forEach(dep => {
          // Only add if not already installed (optimization)
          if (!installedPackages.has(dep) && !coreLibs.includes(dep)) {
            const depTarget = MODULE_MAPPING[dep] || dep
            addTarget(depTarget.endsWith('.whl') ? wheelsBase + depTarget : depTarget)
          }
        })
      }
    })

    if (toLoadPackage.length > 0 || toMicropip.length > 0) {
      try {
        const uniqueLoad = [...new Set(toLoadPackage)]
        const uniqueMicropip = [...new Set(toMicropip)]
        if (!isSilent) {
          setOutput(prev => prev + `正在動態載入所需套件 [${neededModules.join(', ')}]...\n`)
        }

        // Load compiled packages via pyodide (fast + reliable)
        for (const pkg of uniqueLoad) {
          await pyodide.loadPackage(pkg)
        }

        if (uniqueMicropip.length > 0) {
          await pyodide.loadPackage('micropip')
          await pyodide.runPythonAsync(`
import micropip
await micropip.install(${JSON.stringify(uniqueMicropip)}, keep_going=True)
        `)
        }

        if (neededModules.includes('pandas_datareader')) {
          await pyodide.runPythonAsync(PANDAS_DATAREADER_SHIM)
        }

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
      // Normalize common absolute dataset paths to the virtual /data mounted by the loader.
      // This avoids requiring edits to the stored examples and supports local Windows paths present in examples.
      try {
        code = code.replace(/pd\.read_csv\(r?['"][^'"]*SPX_Option\.csv['"]\)/g, "pd.read_csv('/data/datasets/b2_ch1/SPX_Option.csv')")
      } catch { /* ignore regex errors */ }

      // Ensure chapter datasets are available before executing code that reads local files
      if (currentChapter && currentChapter.id) {
        await loadChapterDatasets(pyodide, currentChapter.id)
      }

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
            bodyContent={bodyContent}
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
              bodyContent={bodyContent}
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
