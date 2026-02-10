import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Star } from 'lucide-react'
import './ChapterNav.css'

function ChapterNav({ onChapterSelect, bookmarkedChapters, onToggleBookmark, showBookmarksOnly }) {
  const [chapters, setChapters] = useState([])
  const [expandedChapters, setExpandedChapters] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // 使用相對路徑，Vite 會自動處理 base
    const url = `${import.meta.env.BASE_URL}data/chapters.json?t=${Date.now()}`

    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        if (data && data.length > 0) {
          setChapters(data)
          setExpandedChapters(new Set([data[0].id]))
        } else {
          setError('沒有找到章節資料')
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('載入章節資料失敗:', err)
        setError(`載入失敗: ${err.message}`)
        setLoading(false)
      })
  }, [])

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => {
      const next = new Set(prev)
      if (next.has(chapterId)) {
        next.delete(chapterId)
      } else {
        next.add(chapterId)
      }
      return next
    })
  }

  const handleChapterClick = (chapter) => {
    onChapterSelect(chapter)
  }

  const handleBookmarkClick = (e, chapterId) => {
    e.stopPropagation()
    onToggleBookmark(chapterId)
  }

  const visibleChapters = showBookmarksOnly
    ? chapters.filter(ch => bookmarkedChapters.has(ch.id))
    : chapters

  return (
    <nav className="chapter-nav">
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>載入章節中...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>❌ {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="chapter-list">
          {visibleChapters.map(chapter => {
            const isExpanded = expandedChapters.has(chapter.id)
            const isBookmarked = bookmarkedChapters.has(chapter.id)

            return (
              <div key={chapter.id} className="chapter-item">
                <button
                  className="chapter-header"
                  data-chapter-number={`CH${chapter.number}`}
                  onClick={() => {
                    toggleChapter(chapter.id)
                    handleChapterClick(chapter)
                  }}
                  title={chapter.full_title || chapter.title}
                >
                  <span
                    className={`bookmark-icon ${isBookmarked ? 'bookmarked' : ''}`}
                    onClick={(e) => handleBookmarkClick(e, chapter.id)}
                  >
                    <Star size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                  </span>
                  <span className="chapter-title">{chapter.full_title || chapter.title}</span>
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {!loading && !error && visibleChapters.length === 0 && (
        <div className="empty-state">
          {showBookmarksOnly ? '尚未加入收藏' : '無章節'}
        </div>
      )}
    </nav>
  )
}

export default ChapterNav
