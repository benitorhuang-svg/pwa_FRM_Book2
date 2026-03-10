import { useEffect, useMemo, memo, useRef } from 'react'
import { Marked } from 'marked'
import katex from 'katex'
import DOMPurify from 'dompurify'
import './ContentPanel.css'

// Create a dedicated Marked instance
const marked = new Marked()


const ContentPanel = memo(({ chapter, bodyContent, onCodeClick, selectedTopicId, output, isRunning, plotImages, pyodideReady }) => {
  const containerRef = useRef(null)

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

        // Detailed Content — from modular bodyContent prop (or legacy inline body)
        const resolvedBody = bodyContent || chapter.content?.body || intro.body
        if (resolvedBody) {
          rawMarkdown += `\n## 📝 章節重點解說 ( 內容由AI產生，非原書本提供 )\n`
          if (typeof resolvedBody === 'string') {
            let parsedBody = null
            try {
              if (resolvedBody.trim().startsWith('{')) {
                parsedBody = JSON.parse(resolvedBody)
              }
            } catch {
              // Ignore parse error, treat as regular string
            }

            if (parsedBody && typeof parsedBody === 'object') {
              rawMarkdown += Object.values(parsedBody).join('\n\n')
            } else {
              rawMarkdown += resolvedBody
            }
          } else if (Array.isArray(resolvedBody)) {
            rawMarkdown += resolvedBody.join('\n\n')
          } else if (typeof resolvedBody === 'object') {
            rawMarkdown += Object.values(resolvedBody).join('\n\n')
          }
        }
      }

      // Hide Scenarios from main flow as they might be handled differently or just kept here
      rawMarkdown = rawMarkdown.replace(
        /##\s*💻\s*應用場景清單[\s\S]*?(?=##|$)/g,
        ''
      )

      // Pre-process for KaTeX: Recover from corrupted escapes and standardize delimiters
      /* eslint-disable no-control-regex */
      rawMarkdown = rawMarkdown
        // 1. Recover from "eaten" backslashes that became control characters
        .replace(/\x08(?![e\\])/g, '\\b')
        .replace(/\x0c(?![r\\])/g, '\\f')
        .replace(/\x0b/g, '\\v')
        .replace(/\r(?![ \n])/g, '\\r')

        // 2. Idempotent recovery for common LaTeX commands
        .replace(/[\x08]egin\{/g, '\\begin{')
        .replace(/[\x08]eta/g, '\\beta')
        .replace(/[\x0c]rac\{/g, '\\frac{')
        .replace(/[\x09]ext\{/g, '\\text{')
        .replace(/[\x09]heta/g, '\\theta')
        .replace(/[\x09]au(?=\s|$|[^a-z])/g, '\\tau')
      /* eslint-enable no-control-regex */

      // 3. Normalize literal \n strings to real newlines (Defensive rendering for corrupted data)
      rawMarkdown = rawMarkdown.replace(/\\n/g, '\n')

      // ── Protect math blocks from marked parsing ──
      const mathBlocks = []

      // 1. Display math: $$ ... $$ or \[ ... \]
      rawMarkdown = rawMarkdown.replace(/\$\$([\s\S]*?)\$\$/g, (match, inner) => {
        const idx = mathBlocks.length
        mathBlocks.push({ type: 'display', content: inner })
        return ` @@MATH_BLOCK_${idx}@@ `
      })
      rawMarkdown = rawMarkdown.replace(/\\+\[([\s\S]*?)\\+\]/g, (match, inner) => {
        const idx = mathBlocks.length
        mathBlocks.push({ type: 'display', content: inner })
        return ` @@MATH_BLOCK_${idx}@@ `
      })

      // 2. Aligned environments: \begin{aligned} ... \end{aligned}
      // Match one or more backslashes before begin/end to handle JSON escaping layers
      rawMarkdown = rawMarkdown.replace(/\\+begin\{aligned\}([\s\S]*?)\\+end\{aligned\}/g, (match, inner) => {
        const idx = mathBlocks.length
        mathBlocks.push({ type: 'display', content: `\\begin{aligned}${inner}\\end{aligned}` })
        return ` @@MATH_BLOCK_${idx}@@ `
      })

      // 3. Inline math: $ ... $ or \( ... \)
      rawMarkdown = rawMarkdown.replace(/(?<!\\)\$([^$\n]+?)\$/g, (match, inner) => {
        const idx = mathBlocks.length
        mathBlocks.push({ type: 'inline', content: inner })
        return ` @@MATH_BLOCK_${idx}@@ `
      })
      rawMarkdown = rawMarkdown.replace(/\\+\(([\s\S]*?)\\+\)/g, (match, inner) => {
        const idx = mathBlocks.length
        mathBlocks.push({ type: 'inline', content: inner })
        return ` @@MATH_BLOCK_${idx}@@ `
      })

      // 4. Strip leading indentation from HTML/SVG tags to prevent 'marked' from treating them as code blocks
      rawMarkdown = rawMarkdown.replace(/^[ \t]+(?=<)/gm, '')

      const rawHtml = marked.parse(rawMarkdown)

      // Inject IDs into <h3> tags for anchoring
      let htmlWithIds = rawHtml.replace(/<h3>(.*?)<\/h3>/g, (match, title) => {
        const textOnly = title.replace(/<[^>]*>/g, '').trim()
        const id = 'topic-' + textOnly.replace(/\s+/g, '-').toLowerCase()
        return `<h3 id="${id}">${title}</h3>`
      })

      // Sanitize the HTML first, while it still contains the placeholders
      const cleanHtml = DOMPurify.sanitize(htmlWithIds, {
        USE_PROFILES: { html: true, mathml: true, svg: true },
        ADD_TAGS: [
          'math', 'annotation', 'semantics', 'mrow', 'msub', 'msup', 'msubsup', 'mover', 'munder', 'munderover',
          'mmultiscripts', 'mprec', 'mnext', 'mtable', 'mtr', 'mtd', 'mfrac', 'msqrt', 'mroot', 'mstyle', 'merror',
          'mpadded', 'mphantom', 'mfenced', 'menclose', 'ms', 'mglyph', 'maligngroup', 'malignmark', 'maction',
          'svg', 'path', 'use', 'span', 'div', 'g', 'text', 'rect', 'circle', 'line', 'polyline', 'polygon', 'defs', 'marker', 'symbol', 'linearGradient', 'stop', 'radialGradient', 'clipPath', 'foreignObject'
        ],
        ADD_ATTR: [
          'id', 'target', 'xlink:href', 'class', 'style', 'aria-hidden', 'viewBox', 'd', 'fill', 'stroke',
          'stroke-width', 'data-filename', 'encoding', 'display', 'x', 'y', 'cx', 'cy', 'r', 'width', 'height',
          'text-anchor', 'font-size', 'font-family', 'font-weight', 'transform', 'marker-end', 'refX', 'refY', 'orient', 'stroke-dasharray', 'fill-opacity', 'opacity', 'stop-color', 'stop-opacity', 'offset', 'gradientUnits', 'rx', 'ry', 'clip-path'
        ]
      })

      // ── Re-insert math blocks after all other processing ──
      const scripts = chapter.examples || []
      const sortedScripts = [...scripts].sort((a, b) => b.filename.length - a.filename.length)

      let finalHtml = cleanHtml
      sortedScripts.forEach((script) => {
        const escapedName = script.filename.replace('.', '\\.')
        const regex = new RegExp(`(?<!['".\\w])(${escapedName})(?!['".\\w])`, 'g')

        finalHtml = finalHtml.replace(
          regex,
          `<span class="code-link" data-filename="${script.filename}">${script.filename}</span>`
        )
      })

      // Restoration happens last to ensure LaTeX integrity
      const processedHtml = finalHtml.replace(/@@MATH_BLOCK_(\d+)@@/g, (match, idx) => {
        const block = mathBlocks[parseInt(idx)]
        try {
          return katex.renderToString(block.content.trim(), {
            displayMode: block.type === 'display',
            throwOnError: false
          })
        } catch (e) {
          console.error('[KaTeX] Error rendering block:', e)
          return block.type === 'display' ? `\\[ ${block.content} \\]` : `\\( ${block.content} \\)`
        }
      })

      // ── Premium SVG Diagram Injection (Chapter 5 Specific) ──
      let enrichedHtml = processedHtml

      // Define Payoff Svg Templates
      const svgTemplates = {
        'long_call': `
          <div class="payoff-diagram-container">
            <svg viewBox="0 0 400 200" class="payoff-svg">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#666"/></marker>
              </defs>
              <!-- Axes -->
              <line x1="20" y1="180" x2="380" y2="180" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
              <line x1="40" y1="190" x2="40" y2="20" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
              <text x="360" y="195" font-size="12" fill="#666">S_T</text>
              <text x="15" y="35" font-size="12" fill="#666" transform="rotate(-90, 15, 35)">價值</text>
              <!-- Payoff Line -->
              <path d="M 40,180 L 180,180 L 340,60" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" />
              <circle cx="180" cy="180" r="4" fill="#3b82f6" />
              <text x="175" y="195" font-size="10" fill="#3b82f6" font-weight="bold">K</text>
              <!-- Label -->
              <text x="210" y="80" font-size="14" fill="#3b82f6" font-weight="bold">Long Call Payoff</text>
            </svg>
          </div>`,
        'short_call': `
          <div class="payoff-diagram-container">
            <svg viewBox="0 0 400 200" class="payoff-svg">
              <defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#666"/></marker></defs>
              <line x1="20" y1="100" x2="380" y2="100" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
              <line x1="40" y1="180" x2="40" y2="20" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
              <path d="M 40,100 L 180,100 L 340,195" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" />
              <circle cx="180" cy="100" r="4" fill="#ef4444" />
              <text x="360" y="115" font-size="12" fill="#666">S_T</text>
              <text x="210" y="160" font-size="14" fill="#ef4444" font-weight="bold">Short Call Payoff</text>
            </svg>
          </div>`,
        'long_put': `
          <div class="payoff-diagram-container">
            <svg viewBox="0 0 400 200" class="payoff-svg">
              <defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#666"/></marker></defs>
              <line x1="20" y1="180" x2="380" y2="180" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
              <line x1="40" y1="190" x2="40" y2="20" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
              <path d="M 40,60 L 180,180 L 360,180" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" />
              <circle cx="180" cy="180" r="4" fill="#10b981" />
              <text x="360" y="195" font-size="12" fill="#666">S_T</text>
              <text x="60" y="80" font-size="14" fill="#10b981" font-weight="bold">Long Put Payoff</text>
            </svg>
          </div>`,
        'short_put': `
          <div class="payoff-diagram-container">
            <svg viewBox="0 0 400 200" class="payoff-svg">
              <defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#666"/></marker></defs>
              <line x1="20" y1="100" x2="380" y2="100" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
              <line x1="40" y1="180" x2="40" y2="20" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
              <path d="M 40,195 L 180,100 L 360,100" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" />
              <circle cx="180" cy="100" r="4" fill="#f59e0b" />
              <text x="360" y="115" font-size="12" fill="#666">S_T</text>
              <text x="60" y="160" font-size="14" fill="#f59e0b" font-weight="bold">Short Put Payoff</text>
            </svg>
          </div>`
      }

      enrichedHtml = enrichedHtml.replace(/<strong>1\. 買入看漲選擇權 \(Long Call\)<\/strong>/g, (m) => m + svgTemplates.long_call)
      enrichedHtml = enrichedHtml.replace(/<strong>2\. 賣出看漲選擇權 \(Short Call\)<\/strong>/g, (m) => m + svgTemplates.short_call)
      enrichedHtml = enrichedHtml.replace(/<strong>3\. 買入看跌選擇權 \(Long Put\)<\/strong>/g, (m) => m + svgTemplates.long_put)
      enrichedHtml = enrichedHtml.replace(/<strong>4\. 賣出看跌選擇權 \(Short Put\)<\/strong>/g, (m) => m + svgTemplates.short_put)

      return enrichedHtml
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
  }, [chapter, bodyContent, pyodideReady])

  // 使用 JSON.stringify 來穩定化 bodyContent 的比較
  const bodyContentKey = useMemo(() =>
    bodyContent ? JSON.stringify(Object.keys(bodyContent).sort()) : null
    , [bodyContent])

  useEffect(() => {
    const handleCodeLinkClick = (e) => {
      if (e.target.classList.contains('code-link')) {
        if (!pyodideReady) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
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
  }, [chapter, onCodeClick, pyodideReady, bodyContentKey])

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
              ref={containerRef}
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

                  {!pyodideReady && (
                    <div className="py-loading-hint">
                      <span className="loading-spinner-small"></span>
                      <span>Python 引擎正在背景載入中...</span>
                    </div>
                  )}

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
