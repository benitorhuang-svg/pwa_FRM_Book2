import './OutputPanel.css'

function OutputPanel({ output, images = [], isInteractive = false }) {
  return (
    <div className="output-panel">
      <pre className="output-content">
        {output || (images.length === 0 && !isInteractive ? '執行程式碼後，結果會顯示在這裡...' : '')}
      </pre>

      {/* 互動式圖表容器 */}
      <div
        id="pyodide-plot-container"
        className={`interactive-plot-container ${isInteractive ? 'active' : ''}`}
        style={{ display: isInteractive ? 'block' : 'none' }}
      ></div>

      {images.length > 0 && !isInteractive && (
        <div className="output-images">
          {images.map((img, index) => (
            <div key={index} className="output-image-container">
              <img src={img} alt={`Plot Output ${index + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OutputPanel
