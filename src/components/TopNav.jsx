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
        const content = currentChapter?.content
        if (!content) return []

        let targetText = ""
        const intro = content.intro

        // Handle intro as string (legacy)
        if (typeof intro === 'string') {
            targetText = intro
        } else if (intro && typeof intro === 'object') {
            // Handle structured intro - might have headers in roadmap or implementation
            if (intro.body) {
                targetText += typeof intro.body === 'string' ? intro.body : Object.values(intro.body).join('\n')
            }
        }

        // Always include main body content (new format)
        const body = content.body
        if (body) {
            if (typeof body === 'string') {
                targetText += '\n' + body
            } else if (Array.isArray(body)) {
                targetText += '\n' + body.join('\n')
            } else if (typeof body === 'object') {
                targetText += '\n' + Object.values(body).join('\n')
            }
        }

        if (!targetText) return []

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
                            const examples = currentChapter?.examples || currentChapter?.content?.examples
                            if (examples) {
                                const script = examples.find(s => s.filename === e.target.value)
                                if (script) onScriptSelect(script)
                            }
                        }}
                        disabled={!currentChapter || !(currentChapter.examples || currentChapter.content?.examples) || ((currentChapter.examples || currentChapter.content?.examples) || []).length === 0}
                        className="custom-select"
                    >
                        <option value="" disabled>💻 程式代碼</option>
                        {(() => {
                            const examples = currentChapter?.examples || currentChapter?.content?.examples || [];
                            // Create a sorted copy of examples
                            const sortedExamples = [...examples].sort((a, b) => {
                                return a.filename.localeCompare(b.filename, undefined, { numeric: true, sensitivity: 'base' });
                            });

                            return sortedExamples.map(ex => (
                                <option key={ex.filename} value={ex.filename}>
                                    {ex.filename}
                                </option>
                            ));
                        })()}
                    </select>
                    <ChevronDown className="select-icon" size={16} />
                </div>
            </div>
        </div>
    )
}

export default TopNav
