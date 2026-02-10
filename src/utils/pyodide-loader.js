let pyodideInstance = null
let initializationPromise = null
import { BASE_ENV_SETUP, QUANTLIB_SHIM, PYMOO_SHIM, PANDAS_DATAREADER_SHIM } from './python-shims'

export async function loadPyodide(onProgress) {
    if (pyodideInstance) {
        if (onProgress) onProgress(100, 'Ready')
        return pyodideInstance
    }

    if (initializationPromise) {
        return initializationPromise.then(py => {
            if (onProgress) onProgress(100, 'Ready')
            return py
        })
    }

    initializationPromise = (async () => {

        const updateProgress = (ver, msg) => {
            if (onProgress) onProgress(ver, msg)
        }

        try {
            updateProgress(0, 'Initialize Pyodide (v0.26.4)...')

            // Retry logic for loading Pyodide
            let pyodide = null;
            let retries = 3;
            while (retries > 0) {
                try {
                    pyodide = await window.loadPyodide({
                        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
                    });
                    break;
                } catch (e) {
                    console.warn(`Failed to load Pyodide (attempts left: ${retries - 1}):`, e);
                    console.warn(`載入 Pyodide 失敗 (剩餘嘗試次數: ${retries - 1}):`, e);
                    retries--;
                    if (retries === 0) throw e;
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            updateProgress(20, '載入核心套件中...')

            // 為了效能進行並行載入
            const corePackages = ['micropip', 'numpy', 'pandas', 'matplotlib', 'scipy'];
            updateProgress(30, '平行載入核心套件中...');
            await Promise.all(corePackages.map(pkg => pyodide.loadPackage(pkg)));


            // 延遲載入：其他套件已移動至 App.jsx 中按需載入
            updateProgress(70, '初始化核心環境...')

            // 等待 micropip 完全就緒
            await pyodide.loadPackage('micropip');

            updateProgress(75, '配置環境中...')
            await pyodide.runPythonAsync(BASE_ENV_SETUP);

            // Pymoo 相容層
            await pyodide.runPythonAsync(PYMOO_SHIM);

            // QuantLib 相容層
            await pyodide.runPythonAsync(QUANTLIB_SHIM);

            // Pandas DataReader 相容層
            await pyodide.runPythonAsync(PANDAS_DATAREADER_SHIM);

            // 直接在 Python 層面覆蓋 input 函數，這是最穩健的方法
            await pyodide.runPythonAsync(`
import builtins
import js

def custom_input(prompt = ""):
    try:
        val = js.window.prompt(prompt if prompt else "")
        return val if val is not None else ""
    except Exception:
        return ""

builtins.input = custom_input
print("✅ Python input() function hooked to window.prompt")
        `);

            pyodideInstance = pyodide
            initializationPromise = null // Clear once settled
            updateProgress(100, 'Ready!')
            return pyodide
        } catch (error) {
            initializationPromise = null // Clear on error to allow retry
            console.error('Failed to load Pyodide:', error)
            throw error
        }
    })();

    return initializationPromise;
}

export function getPyodide() {
    return pyodideInstance
}

/**
 * Execute Python code with a timeout
 * @param {Object} pyodide - Pyodide instance
 * @param {string} code - Python code to execute
 * @param {number} timeout - Timeout in milliseconds (default 30000)
 * @returns {Promise<any>}
 */
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

/**
 * Cleanup Pyodide memory and state
 * @param {Object} pyodide - Pyodide instance
 */
export async function cleanupPyodide(pyodide) {
    if (!pyodide) return;
    try {
        // Quick cleanup: only clear plots and collect GC
        await pyodide.runPythonAsync(`
            import gc
import matplotlib.pyplot as plt
            plt.close('all')
            gc.collect()
                `);
    } catch {
        // Silent fail for cleanup
    }
}
