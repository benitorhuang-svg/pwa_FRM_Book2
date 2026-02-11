// pyodide-loader.js (Book2)
import { BASE_ENV_SETUP, PYMOO_SHIM, QUANTLIB_SHIM, PANDAS_DATAREADER_SHIM, SCIPY_RVS_SHIM, DATASET_SHIM, MCINT_SHIM, SCIPY_STUB } from './python-shims';

let pyodideInstance = null;
let initializationPromise = null;

class SmoothProgress {
    constructor(onProgress) {
        this.onProgress = onProgress;
        this.current = 0;
        this.target = 0;
        this.message = '';
        this.interval = null;
    }

    start() {
        if (this.interval) return;
        this.interval = setInterval(() => {
            if (this.current < this.target) {
                const diff = this.target - this.current;
                const dynamicStep = diff > 20 ? 3.5 : (diff > 5 ? 1.5 : 0.5);
                this.current = Math.min(this.current + dynamicStep, this.target);
                this.onProgress(Math.floor(this.current), this.message);
            } else if (this.target < 99) {
                this.current = Math.min(this.current + 0.08, 99.9);
                this.onProgress(Math.floor(this.current), this.message);
            }
        }, 100);
    }

    update(target, message) {
        this.target = target;
        if (message) this.message = message;
    }

    async yieldToUI() {
        return new Promise(resolve => setTimeout(resolve, 30));
    }

    finish(message = 'Ready!') {
        if (this.interval) clearInterval(this.interval);
        this.current = 100;
        this.onProgress(100, message);
    }
}

async function ensurePyodideScript() {
    if (window.loadPyodide) return;
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Pyodide script'));
        document.head.appendChild(script);
    });
}

// Dataset Registry: Maps chapter IDs (lowercase) to their required files
const DATASET_REGISTRY = {
    'b2_ch1': [{ filename: 'SPX_Option.csv', displayPath: 'B2_Ch1/SPX_Option.csv' }],
    'b2_ch4': [
        { filename: 'BankTeleCompaign.csv', displayPath: 'B2_Ch4/BankTeleCompaign.csv' },
        { filename: 'HazardRate.csv', displayPath: 'B2_Ch4/HazardRate.csv' },
        { filename: 'LassoRegrData.csv', displayPath: 'B2_Ch4/LassoRegrData.csv' },
        { filename: 'MultiLrRegrData.csv', displayPath: 'B2_Ch4/MultiLrRegrData.csv' },
        { filename: 'PolyRegrData.csv', displayPath: 'B2_Ch4/PolyRegrData.csv' },
        { filename: 'RidgeRegrData.csv', displayPath: 'B2_Ch4/RidgeRegrData.csv' },
        { filename: 'WTI.csv', displayPath: 'B2_Ch4/WTI.csv' },
        { filename: 'outliersimpact.csv', displayPath: 'B2_Ch4/outliersimpact.csv' }
    ],
    'b2_ch9': [{ filename: 'cs-training.csv', displayPath: 'B2_Ch9/cs-training.csv' }],
    'b2_ch11': [
        { filename: 'Data_portfolio_1.xlsx', displayPath: 'B2_Ch11/Data_portfolio_1.xlsx' },
        { filename: 'Data_portfolio_2.xlsx', displayPath: 'B2_Ch11/Data_portfolio_2.xlsx' }
    ],
    'b2_ch12': [
        { filename: 'Data_portfolio_1.xlsx', displayPath: 'B2_Ch12/Data_portfolio_1.xlsx' },
        { filename: 'Data_portfolio_2.xlsx', displayPath: 'B2_Ch12/Data_portfolio_2.xlsx' }
    ]
};

/**
 * Lazy load datasets for a specific chapter
 */
export async function loadChapterDatasets(pyodide, chapterId) {
    if (!pyodide || !chapterId) return;
    const normalizedId = chapterId.toLowerCase();
    const files = DATASET_REGISTRY[normalizedId];
    if (!files || files.length === 0) return;

    for (const file of files) {
        const { filename, displayPath } = file;
        const virtualPath = `/data/${displayPath}`;
        try {
            if (pyodide.FS.analyzePath(virtualPath).exists) continue;
        } catch { /* proceed */ }

        try {
            const fetchUrl = `${import.meta.env.BASE_URL}data/datasets/${normalizedId}/${filename}`;
            const response = await fetch(fetchUrl);
            if (!response.ok) continue;

            const arrayBuffer = await response.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);
            const dir = virtualPath.substring(0, virtualPath.lastIndexOf('/'));
            const dirs = dir.split('/').filter(p => p);
            let currentPath = '';
            for (const d of dirs) {
                currentPath += '/' + d;
                try { pyodide.FS.mkdir(currentPath); } catch (e) { /* ignore */ }
            }
            pyodide.FS.writeFile(virtualPath, data);
        } catch (err) {
            console.error(`[Dataset] Failed to load ${filename}:`, err);
        }
    }
}

/**
 * Initialize Light-weight Pyodide (Core Only)
 */
export async function loadPyodide(onProgress) {
    if (pyodideInstance) {
        if (onProgress) onProgress(100, 'Ready');
        return pyodideInstance;
    }
    if (initializationPromise) return initializationPromise;

    initializationPromise = (async () => {
        const smoother = new SmoothProgress(onProgress);
        smoother.start();

        try {
            smoother.update(10, '正在啟動 Python 直譯器 (v0.26.4)...');
            await ensurePyodideScript();

            let pyodide = null;
            let retries = 3;
            while (retries > 0) {
                try {
                    const indexURL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
                    pyodide = await window.loadPyodide({ indexURL });
                    break;
                } catch (e) {
                    console.warn(`Failed to load Pyodide (attempts left: ${retries - 1}):`, e);
                    retries--;
                    if (retries === 0) throw e;
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            smoother.update(30, '引擎啟動完成，正在檢查本地暫存環境...')
            await smoother.yieldToUI();

            try {
                pyodide.FS.mkdir('/mnt');
                pyodide.FS.mount(pyodide.FS.filesystems.IDBFS, {}, '/mnt');
                await new Promise((resolve, reject) => {
                    pyodide.FS.syncfs(true, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            } catch (e) {
                console.warn('IDBFS mount skipped:', e);
            }

            smoother.update(50, '📦 核心：正在下載基礎運算模組 (Numpy, Pandas)...')
            await smoother.yieldToUI();

            const corePackages = ['numpy', 'pandas', 'matplotlib', 'micropip'];
            for (const pkg of corePackages) {
                await pyodide.loadPackage(pkg);
            }

            smoother.update(90, '🐍 核心：正在注入 Python 相容性墊片...')
            await pyodide.runPythonAsync(`
import sys
import os
import builtins
import js

if not os.path.exists('/data'):
    os.makedirs('/data')
sys.path.append('/data')

def custom_input(prompt = ""):
    try:
        val = js.window.prompt(prompt if prompt else "")
        return val if val is not None else ""
    except Exception: return ""
builtins.input = custom_input
            `);
            await smoother.yieldToUI();

            // Load essential shims
            await Promise.all([
                pyodide.runPythonAsync(BASE_ENV_SETUP),
                pyodide.runPythonAsync(DATASET_SHIM),
                // Lightweight stubs for immediate use
                pyodide.runPythonAsync(SCIPY_STUB) // We will load full scipy later
            ]);

            pyodideInstance = pyodide;
            initializationPromise = null;
            smoother.finish('基礎核心載入完成！');
            return pyodide;
        } catch (error) {
            initializationPromise = null;
            if (smoother.interval) clearInterval(smoother.interval);
            console.error('Failed to load Pyodide:', error);
            throw error;
        }
    })();

    return initializationPromise;
}

// Track heavy loading state
let isHeavyLoaded = false;
let heavyLoadingPromise = null;

/**
 * Background load heavy packages (SciPy, Scikit-learn, etc.)
 */
export async function preloadHeavyPackages(pyodide) {
    if (isHeavyLoaded || heavyLoadingPromise) return heavyLoadingPromise;

    heavyLoadingPromise = (async () => {
        try {
            const heavyCore = ['scipy', 'statsmodels', 'scikit-learn'];
            for (const pkg of heavyCore) {
                await pyodide.loadPackage(pkg);
            }

            const pipPackages = ['arch', 'seaborn', 'numpy-financial', 'pandas-datareader', 'pyodide-http', 'chart_studio', 'mibian', 'plotly', 'prettytable', 'qpsolvers', 'tabulate'];
            const micropip = pyodide.pyimport('micropip');
            for (const pkg of pipPackages) {
                await micropip.install(pkg);
            }

            await Promise.all([
                pyodide.runPythonAsync(SCIPY_RVS_SHIM),
                pyodide.runPythonAsync(PYMOO_SHIM),
                pyodide.runPythonAsync(QUANTLIB_SHIM),
                pyodide.runPythonAsync(PANDAS_DATAREADER_SHIM),
                pyodide.runPythonAsync(MCINT_SHIM)
            ]);

            isHeavyLoaded = true;
        } catch (e) {
            console.error("⚠️ [Background] Heavy package preload failed:", e);
            heavyLoadingPromise = null;
        }
    })();

    return heavyLoadingPromise;
}

export function getPyodide() {
    return pyodideInstance;
}

export async function runPythonWithTimeout(pyodide, code, timeout = 30000) {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error(`Execution timed out after ${timeout / 1000} seconds`));
        }, timeout);
    });

    try {
        const result = await Promise.race([
            pyodide.runPythonAsync(code),
            timeoutPromise
        ]);
        return result;
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function cleanupPyodide(pyodide) {
    if (!pyodide) return;
    try {
        await pyodide.runPythonAsync(`
import gc
import matplotlib.pyplot as plt
plt.close('all')
gc.collect()
        `);
    } catch { /* ignore */ }
}
