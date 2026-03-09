import { useState, useEffect } from 'react';
import { loadPyodide, preloadHeavyPackages } from '../utils/pyodide-loader';
import { perfMonitor } from '../utils/performance';

export function usePyodide() {
    const [pyodide, setPyodide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('初始化中...');
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        loadPyodide((p, msg) => {
            if (isMounted) {
                setProgress(p);
                setMessage(msg);
            }
        }).then(py => {
            if (isMounted) {
                setPyodide(py);
                setLoading(false);
                perfMonitor.end('pyodide-init');

                // Background load heavy packages
                preloadHeavyPackages(py).catch(err => {
                    console.warn('[Background] Package preload error:', err);
                });
            }
        }).catch(err => {
            if (isMounted) {
                setError(err);
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return { pyodide, loading, progress, message, error };
}
