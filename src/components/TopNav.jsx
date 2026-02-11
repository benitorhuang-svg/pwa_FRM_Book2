import { useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import './TopNav.css'

function TopNav({
    chapters,
    currentChapter,
    onChapterSelect,
    currentScript,
    onScriptSelect,
    selectedTopicId,
    onTopicSelect,
    loading,

}) {
    // Extract H3 topics for the dropdown
    const topics = useMemo(() => {
        const intro = currentChapter?.content?.intro
        if (!intro) return []

        let targetText = ""
        if (typeof intro === 'string') {
            targetText = intro
        } else if (typeof intro === 'object' && intro.body) {
            if (typeof intro.body === 'string') {
                targetText = intro.body
            } else if (Array.isArray(intro.body)) {
                targetText = intro.body.join('\n')
            } else {
                // Handle object with numeric/string keys
                targetText = Object.values(intro.body).join('\n')
            }
        } else {
            return []
        }

        const h3Regex = /^###\s+(.+)$/gm
        const matches = []
        let match
        while ((match = h3Regex.exec(targetText)) !== null) {
            const title = match[1].trim()
            // Generic ID based on title for anchoring
            const id = 'topic-' + title.replace(/\s+/g, '-').toLowerCase()
            matches.push({ id, title })
        }
        return matches
    }, [currentChapter])

    return (
        <div className="top-nav-container">
            {/* Chapter Dropdown */}
            <div className="nav-group">
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
                            {loading ? '載入中...' : '📖 章節選擇'}
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

            {/* Topic Dropdown (H3 Anchors) */}
            <div className={`nav-group ${!currentChapter || topics.length === 0 ? 'disabled' : ''}`}>
                <div className="custom-select-wrapper">
                    <select
                        id="topic-select"
                        name="topic-select"
                        value={selectedTopicId}
                        onChange={(e) => onTopicSelect(e.target.value)}
                        disabled={!currentChapter || topics.length === 0}
                        className="custom-select"
                    >
                        <option value="">💡 重點導覽</option>
                        {topics.map(topic => (
                            <option key={topic.id} value={topic.id}>
                                {topic.title}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="select-icon" size={16} />
                </div>
            </div>

            {/* Script Dropdown (Only if chapter selected) */}
            <div className={`nav-group ${!currentChapter ? 'disabled' : ''}`}>
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
                        disabled={!currentChapter || !currentChapter.examples || currentChapter.examples.length === 0}
                        className="custom-select"
                    >
                        <option value="" disabled>💻 程式代碼</option>
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
