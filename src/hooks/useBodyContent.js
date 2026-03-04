import { useState, useEffect, useRef } from 'react'

/**
 * Lazily fetches modular body sections for a chapter.
 *
 * When the chapter JSON contains a `bodyRef` array (e.g. ["12.1","12.2",...]),
 * body content is loaded on-demand from /data/modular/{chapterId}/{sectionId}.json.
 * If the chapter still has an inline `body` object, it is returned as-is (backward compat).
 *
 * Returns { bodyContent, bodyLoading }
 *   - bodyContent: object keyed by section id, values are markdown strings
 *   - bodyLoading: true while any section is still being fetched
 */
export default function useBodyContent(chapter) {
  const [bodyContent, setBodyContent] = useState(null)
  const [bodyLoading, setBodyLoading] = useState(false)
  const cacheRef = useRef({}) // { "b2_ch12/12.1": "markdown..." }

  useEffect(() => {
    if (!chapter) {
      setBodyContent(null)
      return
    }

    const content = chapter.content
    const chapterId = chapter.id // e.g. "b2_ch12"

    // ── Backward compat: inline body still present → use it directly ──
    if (content?.body && !content?.bodyRef) {
      setBodyContent(content.body)
      return
    }

    const refs = content?.bodyRef
    if (!refs || !Array.isArray(refs) || refs.length === 0) {
      setBodyContent(null)
      return
    }

    let cancelled = false
    setBodyLoading(true)

    const fetchAll = async () => {
      const result = {}

      await Promise.all(
        refs.map(async (sectionId) => {
          const cacheKey = `${chapterId}/${sectionId}`

          if (cacheRef.current[cacheKey] !== undefined) {
            result[sectionId] = cacheRef.current[cacheKey]
            return
          }

          try {
            const url = `${import.meta.env.BASE_URL}data/modular/${chapterId}/${sectionId}.json`
            const res = await fetch(url)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()
            const markdown = data.content || ''
            cacheRef.current[cacheKey] = markdown
            result[sectionId] = markdown
          } catch (err) {
            console.warn(`[useBodyContent] Failed to load ${chapterId}/${sectionId}:`, err)
            result[sectionId] = ''
          }
        })
      )

      if (!cancelled) {
        setBodyContent(result)
        setBodyLoading(false)
      }
    }

    fetchAll()

    return () => { cancelled = true }
  }, [chapter])

  return { bodyContent, bodyLoading }
}
