import localforage from 'localforage'

// 初始化 storage
const progressStore = localforage.createInstance({
  name: 'frm-python-pwa',
  storeName: 'progress'
})

const codeStore = localforage.createInstance({
  name: 'frm-python-pwa',
  storeName: 'code'
})

// 學習進度相關
export async function saveProgress(chapterId, exampleId) {
  const key = `${chapterId}_${exampleId}`
  await progressStore.setItem(key, {
    completed: true,
    timestamp: Date.now()
  })
}

export async function getProgress(chapterId, exampleId) {
  const key = `${chapterId}_${exampleId}`
  return await progressStore.getItem(key)
}

export async function getAllProgress() {
  const keys = await progressStore.keys()
  const progress = {}
  
  for (const key of keys) {
    progress[key] = await progressStore.getItem(key)
  }
  
  return progress
}

// 程式碼儲存相關
export async function saveCode(chapterId, exampleId, code) {
  const key = `${chapterId}_${exampleId}`
  await codeStore.setItem(key, {
    code,
    timestamp: Date.now()
  })
}

export async function getCode(chapterId, exampleId) {
  const key = `${chapterId}_${exampleId}`
  const data = await codeStore.getItem(key)
  return data?.code
}

export async function clearAllData() {
  await progressStore.clear()
  await codeStore.clear()
}
