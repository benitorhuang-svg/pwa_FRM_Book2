import { useEffect, useMemo, memo } from 'react'
import { Marked } from 'marked'
import markedKatex from 'marked-katex-extension'
import DOMPurify from 'dompurify'
import './ContentPanel.css'

// Configure KaTeX extension with proper delimiters
// Create a dedicated Marked instance to avoid global state pollution and HMR issues
const marked = new Marked(
  markedKatex({
    throwOnError: false,
    output: 'html',
    nonStandard: true // Ensure $ delimiters are enabled
  })
)

const ContentPanel = memo(({ chapter, onCodeClick, output, isRunning, plotImages }) => {
  // Use useMemo to prevent expensive markdown parsing on every re-render (like when resizing)
  const renderedContent = useMemo(() => {
    if (!chapter) return null

    if (chapter.content?.intro) {
      let rawMarkdown = chapter.content.intro.replace(
        /##\s*💻\s*應用場景清單[\s\S]*?(?=##|$)/g,
        ''
      )

      // Pre-process for KaTeX: Ensure proper spacing around math delimiters
      // Fix display math blocks ($$) and inline math ($)
      rawMarkdown = rawMarkdown
        // Ensure display math blocks have proper newlines
        .replace(/\s*\$\$\s*/g, '\n$$\n')
        // Remove extra spaces inside inline math delimiters, but assume $$ is display math
        // Use lookbehind (?<!$) and lookahead (?!$) to ensure we only target single $
        .replace(/(?<!\$)\$(?!\$)\s*(.*?)\s*(?<!\$)\$(?!\$)/g, '$$$1$')

      const rawHtml = marked.parse(rawMarkdown)

      const cleanHtml = DOMPurify.sanitize(rawHtml, {
        ADD_TAGS: [
          'math', 'annotation', 'semantics', 'mrow', 'msub', 'msup', 'msubsup', 'mover', 'munder', 'munderover',
          'mmultiscripts', 'mprec', 'mnext', 'mtable', 'mtr', 'mtd', 'mfrac', 'msqrt', 'mroot', 'mstyle', 'merror',
          'mpadded', 'mphantom', 'mfenced', 'menclose', 'ms', 'mglyph', 'maligngroup', 'malignmark', 'maction',
          'svg', 'path', 'use', 'span', 'div' // Add div for KaTeX block display
        ],
        ADD_ATTR: ['target', 'xlink:href', 'class', 'style', 'aria-hidden', 'viewBox', 'd', 'fill', 'stroke', 'stroke-width', 'data-filename']
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
              <h2>👈 請從上方選擇章節開始學習</h2>
              <p>選擇章節後，可以查看內容並執行程式碼</p>
            </div>
          )
        )}
      </div>
    </div>
  )
})

export default ContentPanel
