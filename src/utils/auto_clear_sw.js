// Auto-clean service worker caches and IndexedDB on first controlled load
// This runs client-side in the browser. It attempts to unregister SWs,
// delete CacheStorage entries, clear IndexedDB databases, and clear local/session storage.
export async function autoClearSWOnce() {
    try {
        if (!('serviceWorker' in navigator)) return;

        const FLAG = 'frm_sw_cleanup_done_v1';
        if (localStorage.getItem(FLAG)) return;

        // Only run if the page is controlled by a service worker (likely stale)
        if (!navigator.serviceWorker.controller) {
            // still mark as done to avoid running repeatedly
            localStorage.setItem(FLAG, '1');
            return;
        }

        console.info('[AUTO-CLEAN] Detected active Service Worker — cleaning caches and storage.');

        // Unregister service workers
        try {
            const regs = await navigator.serviceWorker.getRegistrations();
            await Promise.all(regs.map(r => r.unregister().catch(() => { })));
            console.info('[AUTO-CLEAN] serviceWorker registrations unregistered.');
        } catch (e) {
            console.warn('[AUTO-CLEAN] Failed to unregister service workers', e);
        }

        // Clear Cache Storage
        try {
            if ('caches' in window) {
                const keys = await caches.keys();
                await Promise.all(keys.map(k => caches.delete(k).catch(() => { })));
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
                const candidates = ['pyodide', 'emscripten-archives', 'idb-filesystem', 'file_storage'];
                await Promise.all(candidates.map(n => indexedDB.deleteDatabase(n).catch(() => { })));
                console.info('[AUTO-CLEAN] IndexedDB fallback delete attempted for candidates.');
            }
        } catch (e) {
            console.warn('[AUTO-CLEAN] Failed to clear IndexedDB', e);
        }

        // Clear local/session storage
        try {
            localStorage.clear();
            sessionStorage.clear();
            console.info('[AUTO-CLEAN] localStorage and sessionStorage cleared.');
        } catch (e) {
            console.warn('[AUTO-CLEAN] Failed to clear storage', e);
        }

        // Mark as done so this only runs once per client
        try { localStorage.setItem(FLAG, '1'); } catch (e) { }

        // Optionally reload to ensure fresh assets are fetched
        try {
            console.info('[AUTO-CLEAN] Reloading page to load fresh assets.');
            window.location.reload(true);
        } catch (e) {
            console.info('[AUTO-CLEAN] Reload skipped.', e);
        }

    } catch (err) {
        console.warn('[AUTO-CLEAN] Unexpected error', err);
    }
}

export default autoClearSWOnce;
