import { ChevronDown } from 'lucide-react'
import './TopNav.css'

function TopNav({
    chapters,
    currentChapter,
    onChapterSelect,
    currentScript,
    onScriptSelect,
    loading
}) {
    return (
        <div className="top-nav-container">
            {/* Chapter Dropdown */}
            <div className="nav-group">
                <label className="nav-label" htmlFor="chapter-select">章節 Selection</label>
                <div className="custom-select-wrapper">
                    <select
                        id="chapter-select"
                        name="chapter-select"
                        value={currentChapter?.id || ''}
                        onChange={(e) => {
                            const ch = chapters.find(c => c.id === e.target.value)
                            if (ch) onChapterSelect(ch)
                        }}
                        disabled={loading || chapters.length === 0}
                        className="custom-select"
                    >
                        <option value="" disabled>
                            {loading ? '載入中...' : '請選擇章節...'}
                        </option>
                        {chapters.map(ch => (
                            <option key={ch.id} value={ch.id}>
                                {ch.title}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="select-icon" size={16} />
                </div>
            </div>

            {/* Script Dropdown (Only if chapter selected) */}
            <div className={`nav-group ${!currentChapter ? 'disabled' : ''}`}>
                <label className="nav-label" htmlFor="script-select">代碼 Code</label>
                <div className="custom-select-wrapper">
                    <select
                        id="script-select"
                        name="script-select"
                        value={currentScript?.filename || ''}
                        onChange={(e) => {
                            if (currentChapter?.examples) {
                                const script = currentChapter.examples.find(s => s.filename === e.target.value)
                                if (script) onScriptSelect(script)
                            }
                        }}
                        disabled={!currentChapter || !currentChapter.examples}
                        className="custom-select"
                    >
                        <option value="" disabled>選擇程式碼...</option>
                        {currentChapter?.examples?.map(ex => (
                            <option key={ex.filename} value={ex.filename}>
                                {ex.filename}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="select-icon" size={16} />
                </div>
            </div>
        </div>
    )
}

export default TopNav
