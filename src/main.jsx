import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'katex/dist/katex.min.css'
import autoClearSWOnce from './utils/auto_clear_sw'

// Attempt an automatic service-worker/cache cleanup once when the page
// is controlled by an old service worker (helps users get the new build).
autoClearSWOnce().catch(() => { });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
