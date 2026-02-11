import { useState, useEffect } from 'react'
import { Play, Copy, X, GripVertical } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './CodePreviewPanel.css'

function CodePreviewPanel({
  script,
  onClose,
  onRun,
  isRunning,
  isLoading,
  darkMode,
  onResize
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })

  const showLocalToast = (message, type = 'info') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 1000)
  }

  if (!script) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(script.code)
    setCopied(true)
    showLocalToast('程式碼已複製到剪貼簿', 'success')
    setTimeout(() => setCopied(false), 1000)
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && onResize) {
        const newWidth = window.innerWidth - e.clientX
        if (newWidth > 300 && newWidth < window.innerWidth * 0.8) {
          onResize(newWidth)
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, onResize])

  return (
    <>
      {isDragging && <div className="resizer-overlay" />}
      <div
        className={`resizer ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <div className="resizer-handle">
          <GripVertical size={12} />
        </div>
      </div>
      <div className="code-preview-panel">
        <div className="preview-content">
          <div className="code-section">
            <div className="code-header">
              <div className="header-left">
                <span>程式碼</span>
              </div>

              <div className="header-right">
                <button
                  className={`btn ${copied ? 'btn-success' : 'btn-secondary'} btn-sm`}
                  onClick={handleCopy}
                  title="複製程式碼"
                >
                  <Copy size={16} />
                  <span>{copied ? '已複製' : '複製'}</span>
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    if (isLoading) {
                      showLocalToast('請等待引擎初始化完成...', 'info')
                      return
                    }
                    showLocalToast('開始執行程式...', 'success')
                    onRun(script.code)
                  }}
                  disabled={isRunning || isLoading}
                  title={isLoading ? "核心引擎初始化中..." : "執行程式碼"}
                >
                  <Play size={16} />
                  {isRunning ? '執行中...' : (isLoading ? '引擎啟動中' : '執行')}
                </button>

                <div className="divider-vertical"></div>

                <button className="icon-btn close-btn" onClick={onClose} title="關閉">
                  <X size={16} />
                </button>

                {toast.show && (
                  <div className={`local-toast toast-${toast.type}`}>
                    {toast.message}
                  </div>
                )}
              </div>
            </div>

            <div className="code-display">
              <SyntaxHighlighter
                language="python"
                style={darkMode ? vscDarkPlus : vs}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  background: 'transparent',
                  whiteSpace: 'pre-wrap',       /* Enable wrapping */
                  wordBreak: 'break-word'       /* Prevent overflow */
                }}
                showLineNumbers
              >
                {script.code}
              </SyntaxHighlighter>
            </div>
          </div>
          {/* Output Section Removed (Moved to FloatingOutput) */}
        </div>
      </div >
    </>
  )
}

export default CodePreviewPanel
