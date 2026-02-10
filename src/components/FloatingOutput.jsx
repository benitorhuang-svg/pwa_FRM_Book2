import { X } from 'lucide-react'
import './FloatingOutput.css'

function FloatingOutput({ output, images, isInteractive, onClose }) {
    if (!output && images.length === 0 && !isInteractive) return null

    return (
        <div className="floating-output-overlay">
            <div className="floating-output-container">
                <div className="floating-header">
                    <h3>執行結果 Execution Result</h3>
                    <button className="icon-btn close-btn" onClick={onClose} title="關閉輸出">
                        <X size={18} />
                    </button>
                </div>

                <div className="floating-content">
                    {output && (
                        <pre className="output-text">{output}</pre>
                    )}

                    {/* Interactive Plot */}
                    <div
                        id="pyodide-plot-container"
                        className={`interactive-plot-container ${isInteractive ? 'active' : ''}`}
                        style={{ display: isInteractive ? 'block' : 'none' }}
                    />

                    {/* Static Images */}
                    {images.length > 0 && !isInteractive && (
                        <div className="output-images">
                            {images.map((img, index) => (
                                <div key={index} className="output-image">
                                    <img src={img} alt={`Plot ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FloatingOutput
