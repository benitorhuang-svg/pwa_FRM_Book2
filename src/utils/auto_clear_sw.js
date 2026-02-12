// Auto-clean service worker caches and IndexedDB on first controlled load
// This runs client-side in the browser. It attempts to unregister SWs,
// delete CacheStorage entries, clear IndexedDB databases, and clear local/session storage.
export async function autoClearSWOnce() {
    try {
        if (!('serviceWorker' in navigator)) return;

        const FLAG = 'frm_sw_cleanup_done_v3';
        if (localStorage.getItem(FLAG)) return;

        // Only run if the page is controlled by a service worker (likely stale)
        if (!navigator.serviceWorker.controller) {
            // still mark as done to avoid running repeatedly
            localStorage.setItem(FLAG, '1');
            return;
        }

        console.warn('[AUTO-CLEAN] STALE SERVICE WORKER DETECTED! Starting emergency cleanup.');

        // Unregister service workers
        try {
            const regs = await navigator.serviceWorker.getRegistrations();
            await Promise.all(regs.map(r => {
                console.log('[AUTO-CLEAN] Unregistering:', r.scope);
                return r.unregister().catch(() => { });
            }));
            console.info('[AUTO-CLEAN] serviceWorker registrations unregistered.');
        } catch (e) {
            console.warn('[AUTO-CLEAN] Failed to unregister service workers', e);
        }

        // Clear Cache Storage
        try {
            if ('caches' in window) {
                const keys = await caches.keys();
                await Promise.all(keys.map(k => {
                    console.log('[AUTO-CLEAN] Deleting Cache:', k);
                    return caches.delete(k).catch(() => { });
                }));
                console.info('[AUTO-CLEAN] CacheStorage cleared:', keys);
            }
        } catch (e) {
            console.warn('[AUTO-CLEAN] Failed to clear CacheStorage', e);
        }

        // Clear IndexedDB databases (where supported)
        try {
            if ('databases' in indexedDB) {
                const dbs = await indexedDB.databases();
                await Promise.all(dbs.map(d => indexedDB.deleteDatabase(d.name).catch(() => { })));
                console.info('[AUTO-CLEAN] IndexedDB databases deleted:', dbs.map(d => d.name));
            } else {
                // Fallback: attempt to delete common names used by Pyodide/emscripten
                const candidates = ['pyodide', 'emscripten-archives', 'idb-filesystem', 'file_storage', 'workbox-precache-v2'];
                await Promise.all(candidates.map(n => indexedDB.deleteDatabase(n).catch(() => { })));
                console.info('[AUTO-CLEAN] IndexedDB fallback delete attempted for candidates.');
            }
        } catch (e) {
            console.warn('[AUTO-CLEAN] Failed to clear IndexedDB', e);
        }

        // Clear local/session storage (except the MUST-HAVE flags if any)
        try {
            const theme = localStorage.getItem('theme');
            localStorage.clear();
            sessionStorage.clear();
            if (theme) localStorage.setItem('theme', theme);
            console.info('[AUTO-CLEAN] localStorage and sessionStorage cleared (theme preserved).');
        } catch (e) {
            console.warn('[AUTO-CLEAN] Failed to clear storage', e);
        }

        // Mark as done so this only runs once per client
        try { localStorage.setItem(FLAG, '1'); } catch { /* ignore */ }

        // Optionally reload to ensure fresh assets are fetched
        try {
            console.error('[AUTO-CLEAN] CLEANUP COMPLETE. FORCING RELOAD FROM SERVER.');
            window.location.reload(true);
        } catch (e) {
            window.location.replace(window.location.href); // Double fallback
        }

    } catch (err) {
        console.warn('[AUTO-CLEAN] Unexpected error', err);
    }
}

export default autoClearSWOnce;
