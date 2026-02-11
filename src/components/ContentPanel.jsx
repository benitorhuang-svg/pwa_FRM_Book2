import { useEffect, useMemo, memo } from 'react'
import { Marked } from 'marked'
import markedKatex from 'marked-katex-extension'
import DOMPurify from 'dompurify'
import './ContentPanel.css'
import './WelcomeScreen.css'

// Configure KaTeX extension with proper delimiters
// Create a dedicated Marked instance to avoid global state pollution and HMR issues
const marked = new Marked(
  markedKatex({
    throwOnError: false,
    output: 'html',
    nonStandard: true // Ensure $ delimiters are enabled
  })
)

const ContentPanel = memo(({ chapter, onCodeClick, selectedTopicId, output, isRunning, plotImages }) => {
  // Use useMemo to prevent expensive markdown parsing on every re-render (like when resizing)
  const renderedContent = useMemo(() => {
    if (!chapter) return null

    const intro = chapter.content?.intro
    if (intro) {
      let rawMarkdown = ""

      if (typeof intro === 'string') {
        rawMarkdown = intro
      } else if (typeof intro === 'object') {
        // Reconstruct markdown from structured object
        rawMarkdown = `# ${intro.title || ''}\n\n`

        // Roadmap
        if (intro.roadmap) {
          if (intro.roadmap.guide) rawMarkdown += `## 📌 章節導覽\n${intro.roadmap.guide}\n\n`
          if (intro.roadmap.objectives) rawMarkdown += `## 🎯 學習目標\n${intro.roadmap.objectives}\n\n`
          if (intro.roadmap.topics) rawMarkdown += `## 📋 章節重點分明\n${intro.roadmap.topics}\n\n`
        }

        // Value
        if (intro.value) {
          if (intro.value.practical) rawMarkdown += `## 💼 FRM 考試與實務連結\n${intro.value.practical}\n\n`
          if (intro.value.theory) rawMarkdown += `## 🏛️ 財金理論深度解析\n${intro.value.theory}\n\n`
          if (intro.value.further_reading) rawMarkdown += `## 🚀 延伸閱讀與進階議題\n${intro.value.further_reading}\n\n`
        }

        // Implementation
        if (intro.implementation) {
          if (intro.implementation.python) rawMarkdown += `## 🐍 Python 實踐價值\n${intro.implementation.python}\n\n`
          if (intro.implementation.logic) rawMarkdown += `## ⚙️ 代碼核心邏輯\n${intro.implementation.logic}\n\n`
          if (intro.implementation.scenarios) rawMarkdown += `## 💻 應用場景清單\n${intro.implementation.scenarios}\n\n`
        }

        // Detailed Content
        if (intro.body) {
          rawMarkdown += `\n## 📝 章節重點解說 ( 內容由AI產生，非原書本提供 )\n`
          if (typeof intro.body === 'string') {
            rawMarkdown += intro.body
          } else if (Array.isArray(intro.body)) {
            rawMarkdown += intro.body.join('\n\n')
          } else if (typeof intro.body === 'object') {
            // Order entries logically (e.g., numerically by key if possible)
            const entries = Object.entries(intro.body)
            rawMarkdown += entries.map(([_, content]) => content).join('\n\n')
          }
        }
      }

      // Hide Scenarios from main flow as they might be handled differently or just kept here
      rawMarkdown = rawMarkdown.replace(
        /##\s*💻\s*應用場景清單[\s\S]*?(?=##|$)/g,
        ''
      )

      // Pre-process for KaTeX: Ensure proper spacing around math delimiters
      rawMarkdown = rawMarkdown
        .replace(/\s*\$\$\s*/g, '\n$$\n')
        .replace(/(?<!\$)\$(?!\$)\s*([\s\S]*?)\s*(?<!\$)\$(?!\$)/g, '$$$1$')

      let rawHtml = marked.parse(rawMarkdown)

      // Inject IDs into <h3> tags for anchoring
      rawHtml = rawHtml.replace(/<h3>(.*?)<\/h3>/g, (match, title) => {
        const textOnly = title.replace(/<[^>]*>/g, '').trim()
        const id = 'topic-' + textOnly.replace(/\s+/g, '-').toLowerCase()
        return `<h3 id="${id}">${title}</h3>`
      })

      const cleanHtml = DOMPurify.sanitize(rawHtml, {
        ADD_TAGS: [
          'math', 'annotation', 'semantics', 'mrow', 'msub', 'msup', 'msubsup', 'mover', 'munder', 'munderover',
          'mmultiscripts', 'mprec', 'mnext', 'mtable', 'mtr', 'mtd', 'mfrac', 'msqrt', 'mroot', 'mstyle', 'merror',
          'mpadded', 'mphantom', 'mfenced', 'menclose', 'ms', 'mglyph', 'maligngroup', 'malignmark', 'maction',
          'svg', 'path', 'use', 'span', 'div'
        ],
        ADD_ATTR: ['id', 'target', 'xlink:href', 'class', 'style', 'aria-hidden', 'viewBox', 'd', 'fill', 'stroke', 'stroke-width', 'data-filename']
      })

      let processedHtml = cleanHtml
      const scripts = chapter.examples || []
      const sortedScripts = [...scripts].sort((a, b) => b.filename.length - a.filename.length)

      sortedScripts.forEach((script) => {
        const escapedName = script.filename.replace('.', '\\.')
        const regex = new RegExp(`(?<!['".\\w])(${escapedName})(?!['".\\w])`, 'g')

        processedHtml = processedHtml.replace(
          regex,
          `<span class="code-link" data-filename="${script.filename}">${script.filename}</span>`
        )
      })

      return processedHtml
    } else {
      const examples = chapter.examples || []
      let html = `
        <div class="chapter-intro">
          <h2>${chapter.title}</h2>
          <p>本章包含 ${examples.length} 個程式範例</p>
          <div class="example-grid">
      `

      examples.forEach((example, index) => {
        html += `
          <div class="example-card">
            <div class="example-number">${index + 1}</div>
            <div class="example-info">
              <h3>${example.title}</h3>
              <span class="code-link" data-filename="${example.filename}">${example.filename}</span>
            </div>
          </div>
        `
      })

      html += `
          </div>
        </div>
      `
      return html
    }
  }, [chapter])

  useEffect(() => {
    const handleCodeLinkClick = (e) => {
      if (e.target.classList.contains('code-link')) {
        const filename = e.target.dataset.filename
        let script = null

        if (chapter?.examples) {
          script = chapter.examples.find(s => s.filename === filename)
          if (script && !script.metadata) {
            script.metadata = { description: script.title }
          }
        }

        if (script) {
          onCodeClick(script)
        }
      }
    }

    document.addEventListener('click', handleCodeLinkClick)
    return () => document.removeEventListener('click', handleCodeLinkClick)
  }, [chapter, onCodeClick])

  // Auto-scroll to top when chapter changes
  useEffect(() => {
    const scrollContainer = document.querySelector('.content-scroll')
    if (scrollContainer) {
      scrollContainer.scrollTop = 0
    }
  }, [chapter])

  // Auto-scroll to topic when selectedTopicId changes
  useEffect(() => {
    if (selectedTopicId) {
      const element = document.getElementById(selectedTopicId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [selectedTopicId])

  // Auto-scroll to top when output result appears
  useEffect(() => {
    if (output || (plotImages && plotImages.length > 0) || isRunning) {
      const scrollContainer = document.querySelector('.content-scroll')
      if (scrollContainer) {
        // Use scrollTo for smooth or instant reset
        scrollContainer.scrollTo({ top: 0, behavior: 'instant' })
      }
    }
  }, [output, plotImages, isRunning])

  return (
    <div className="content-panel">
      <div className="content-scroll">
        {/* We keep Markdown content ALWAYS rendered if it exists, 
            but hide it when output is shown to maintain scroll position if needed,
            OR just exclusive view as before but now memoized. */}
        {(output || (plotImages && plotImages.length > 0) || isRunning) ? (
          <div id="execution-output" className="execution-output-section">
            {isRunning && (
              <div className="running-indicator">
                <div className="spinner"></div>
                <span>程式執行中...</span>
              </div>
            )}

            {output && (
              <pre className="output-text">{output}</pre>
            )}

            {plotImages && plotImages.length > 0 && (
              <div className="output-images">
                {plotImages.map((img, index) => (
                  <div key={index} className="output-image">
                    <img src={img} alt={`Plot ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          renderedContent ? (
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
          ) : (
            <div className="welcome-screen">
              <div className="welcome-card premium-welcome">
                <div className="welcome-brand">
                  <img src="welcome.jpg" alt="FRM Python 理論與實戰" className="welcome-book-img" />
                  <a
                    href="https://deepwisdom.com.tw/product/%e6%89%8b%e8%a1%93%e5%88%80%e8%88%ac%e7%b2%be%e6%ba%96%e7%9a%84frm-%e7%94%a8python%e7%a7%91%e5%ad%b8%e7%ae%a1%e6%8e%a7%e8%b2%a1%e9%87%91%e9%a2%a8%e9%9a%aa%e5%af%a6%e6%88%b0%e7%af%87dm2308/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="welcome-purchase-btn"
                  >
                    [ 本書官網購買連結 ]
                  </a>
                </div>
                <div className="welcome-content">
                  <h2 className="welcome-title">Python 金融風險管理：<br />數學模型與應用 (實戰篇)</h2>
                  <div className="welcome-slogan">☆★☆★【有如手術刀般精準！利用Python幫你管控財金風險！】★☆★☆</div>

                  <div className="welcome-text-scroll">
                    <p>在上一本基礎篇的學習完備，能善用Python程式語言及常用的工具套件之後，接下來就是開始對金融風險進行評估了。</p>
                    <p>本書接續介紹了各種數學模型，包括波動性、隨機過程及相當重要的馬可夫過程、馬丁格爾、隨機漫步、維納過程等，另外也包含蒙地卡羅等數學模型的應用。</p>
                    <p>而統計科學中最常用的回歸，本書也有涉獵。另外包括了二元樹、BSM選擇權、希臘字母，市場風險等，都有最完整的Python程式和數學公式供讀者計算、運用。</p>
                    <p>金融商品龐大且複雜，需要像使用手術刀般精準、細緻地切割每一個細節，畢竟賠錢事事小，沒辦法掌握到大盤的迅速波動與走勢，才是一大損失。</p>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
})

export default ContentPanel
