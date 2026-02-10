/* eslint-disable no-undef */
import { precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

self.skipWaiting()
clientsClaim()

// 1. Workbox 預先快取 (Pre-caching)
// ---------------------------------
// 自動快取由 VitePWA 生成的清單中的資源
precacheAndRoute(self.__WB_MANIFEST)

// 2. 跨來源隔離 (Cross-Origin Isolation, COI) 處理器
// ------------------------------------------------
// 這允許 SharedArrayBuffer 通過從 Service Worker 為子資源提供 COOP/COEP 標頭來工作。
// 注意：為了達到完全效果，初始 HTML 文件仍需由伺服器提供這些標頭，
// 但這有助於處理範圍內的資源。
self.addEventListener("fetch", (event) => {
    // 我們只需要在想要對獲取的資源設置標頭時，
    // 或者如果我們處於 "credentialless" 模式時進行干預。
    // 然而，workbox 的 `precacheAndRoute` 通常會處理回應。
    // 若要向 Workbox 回應添加標頭，我們可能需要自定義插件或包裝器。

    // 目前，我們依賴 Workbox 進行快取。
    // COI "標頭注入" 主要是在主機（如 GitHub Pages）不支援標頭時，
    // 針對 *Document* 本身需要的。
    // `coi-serviceworker.js` 腳本會執行 `self.registration.unregister()` 循環來強制重載並帶上標頭。

    // 如果我們嚴格遵循 `coi-serviceworker` 的邏輯，它會這樣做：
    if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") {
        return;
    }

    // 我們將 `coi-serviceworker.js` 保留在 `index.html` 中以進行標頭 hack，
    // 但確保留此 Service Worker 不會發生衝突。
    // "衝突" 通常發生在此 SW 聲明控制權但不處理 COI 標頭時，導致頁面失去隔離。

    // 為了支援 COI，我們需要確保由此 SW 提供的任何回應都包含 COOP/COEP 標頭。
});

// COI 標頭注入邏輯 (簡化版)
// 包裝預設的 fetch 處理器以添加標頭。
const originalRespondWith = FetchEvent.prototype.respondWith;
FetchEvent.prototype.respondWith = function (r) {
    if (r instanceof Promise) {
        originalRespondWith.call(this, r.then(addHeaders));
    } else {
        originalRespondWith.call(this, addHeaders(r));
    }
};

function addHeaders(response) {
    if (!response) return response;

    const newHeaders = new Headers(response.headers);
    newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
    });
}
