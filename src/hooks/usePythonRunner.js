import { useState, useCallback } from 'react';
import { runPythonWithTimeout } from '../utils/pyodide-loader';
import { formatPythonError } from '../utils/error-handler';
import { captureAllPlots, ensurePlotsShown } from '../utils/matplotlib-handler.js';

export function usePythonRunner(pyodide) {
    const [output, setOutput] = useState('');
    const [plotImages, setPlotImages] = useState([]);
    const [isRunning, setIsRunning] = useState(false);

    const runCode = useCallback(async (code) => {
        if (!pyodide) return;

        setIsRunning(true);
        setOutput('🚀 程式啟動中...\n');
        setPlotImages([]);

        try {
            const result = await runPythonWithTimeout(pyodide, code, 30000);

            // Capture any plots generated
            const plots = await captureAllPlots(pyodide);
            setPlotImages(plots);

            setOutput(result?.stdout || (typeof result === 'string' ? result : '✅ 執行完成 (無輸出內容)'));

            // Ensure plots are visible if generated but not captured
            await ensurePlotsShown(pyodide);
        } catch (err) {
            setOutput(formatPythonError(err));
        } finally {
            setIsRunning(false);
        }
    }, [pyodide]);

    return { output, setOutput, plotImages, setPlotImages, isRunning, runCode };
}
