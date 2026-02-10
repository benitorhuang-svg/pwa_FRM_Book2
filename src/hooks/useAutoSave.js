import { useEffect, useRef } from 'react'
import { saveCode } from '../utils/storage'

/**
 * 自動儲存 Hook
 * @param {string} chapterId - 章節 ID
 * @param {string} exampleId - 範例 ID
 * @param {string} code - 程式碼內容
 * @param {number} delay - 延遲時間（毫秒）
 */
export function useAutoSave(chapterId, exampleId, code, delay = 2000) {
  const timeoutRef = useRef(null)
  const savedCodeRef = useRef(code)

  useEffect(() => {
    // 如果沒有章節或範例 ID，不儲存
    if (!chapterId || !exampleId) return

    // 如果程式碼沒變，不儲存
    if (code === savedCodeRef.current) return

    // 清除之前的計時器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // 設定新的計時器（防抖動）
    timeoutRef.current = setTimeout(async () => {
      try {
        await saveCode(chapterId, exampleId, code)
        savedCodeRef.current = code
      } catch (error) {
        console.error('✗ 自動儲存失敗:', error)
      }
    }, delay)

    // 清理函數
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [chapterId, exampleId, code, delay])
}
