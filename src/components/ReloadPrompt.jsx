import { useRegisterSW } from 'virtual:pwa-register/react'
import 'react'
import './ReloadPrompt.css'

function ReloadPrompt() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(swUrl, r) {
            console.log(`Service Worker at: ${swUrl}`)
            if (r) {
                setInterval(() => {
                    r.update()
                }, 60 * 60 * 1000) // Check for updates every hour
            }
        },
        onRegisterError(error) {
            console.log('SW registration error', error)
        },
    })

    const close = () => {
        setOfflineReady(false)
        setNeedRefresh(false)
    }

    // Auto-update if configured (optional, but safer to prompt user)
    // useEffect(() => {
    //   if (needRefresh) {
    //     console.log('New content available, auto-updating...')
    //     updateServiceWorker(true)
    //   }
    // }, [needRefresh])

    return (
        <div className="ReloadPrompt-container">
            {(offlineReady || needRefresh) && (
                <div className="ReloadPrompt-toast">
                    <div className="ReloadPrompt-message">
                        {offlineReady
                            ? 'App ready to work offline'
                            : 'New content available, click on reload button to update.'}
                    </div>
                    {needRefresh && (
                        <button className="ReloadPrompt-toast-button" onClick={() => updateServiceWorker(true)}>
                            Reload
                        </button>
                    )}
                    <button className="ReloadPrompt-toast-button" onClick={close}>
                        Close
                    </button>
                </div>
            )}
        </div>
    )
}

export default ReloadPrompt
