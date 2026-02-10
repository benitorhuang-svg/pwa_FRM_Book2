import { useState, useEffect } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import './ContentPanel.css'

function ContentPanel({ chapter, onCodeClick, output, isRunning, plotImages }) {
  const [content, setContent] = useState('')

  useEffect(() => {
    if (chapter) {
      // 如果有 content.intro，使用它
      if (chapter.content?.intro) {
        // 1. 移除 "應用場景清單" 區塊
        // 匹配從 "## 💻 應用場景清單" 開始，直到下一個 "##" 標題或文件結束
        let rawMarkdown = chapter.content.intro.replace(
          /##\s*💻\s*應用場景清單[\s\S]*?(?=##|$)/g,
          ''
        )

        const rawHtml = marked.parse(rawMarkdown)
        const cleanHtml = DOMPurify.sanitize(rawHtml)

        let processedHtml = cleanHtml

        // 2. 使用 chapter.examples 來生成代碼連結
        const scripts = chapter.examples || []

        // 先按長度排序，避免部分匹配（雖然後綴.py應該能避免）
        const sortedScripts = [...scripts].sort((a, b) => b.filename.length - a.filename.length)

        sortedScripts.forEach((script) => {
          // 轉義特殊字符用於正則
          const escapedName = script.filename.replace('.', '\\.')
          // 匹配完整單詞
          const regex = new RegExp(`(?<!['"\\w\\.])(${escapedName})(?!['"\\w\\.])`, 'g')

          processedHtml = processedHtml.replace(
            regex,
            `<span class="code-link" data-filename="${script.filename}">${script.filename}</span>`
          )
        })

        setContent(processedHtml)
      }
      // 否則，生成簡單的章節介紹
      else {
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

        setContent(html)
      }
    } else {
      setContent(`
        <div class="welcome-screen">
          <h2>👈 請從上方選擇章節開始學習</h2>
          <p>選擇章節後，可以查看內容並執行程式碼</p>
        </div>
      `)
    }
  }, [chapter])

  useEffect(() => {
    const handleCodeLinkClick = (e) => {
      if (e.target.classList.contains('code-link')) {
        const filename = e.target.dataset.filename
        let script = null

        // 從 examples 中獲取腳本
        if (chapter?.examples) {
          script = chapter.examples.find(s => s.filename === filename)

          if (script) {
            // 確保 metadata 存在
            if (!script.metadata) {
              script.metadata = { description: script.title }
            }
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

  // Auto-scroll to output when it updates
  useEffect(() => {
    if (output || (plotImages && plotImages.length > 0)) {
      const scrollContainer = document.querySelector('.content-scroll')
      const outputElement = document.getElementById('execution-output')
      if (scrollContainer && outputElement) {
        // Smooth scroll to the output section
        outputElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [output, plotImages])

  return (
    <div className="content-panel">
      <div className="content-scroll">
        {/* Exclusive View: Show Output OR Markdown Content */}
        {(output || (plotImages && plotImages.length > 0) || isRunning) ? (
          <div id="execution-output" className="execution-output-section">
            <h3 className="output-title">執行結果</h3>

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
          <div
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  )
}

export default ContentPanel
