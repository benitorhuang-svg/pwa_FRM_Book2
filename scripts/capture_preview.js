import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'

const OUT = path.resolve(process.cwd(), '.capture')
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

const URL = process.argv[2] || 'http://localhost:4173/pwa_FRM_Book2_python/'
;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  const consoleLines = []
  page.on('console', msg => {
    consoleLines.push(`${msg.type().toUpperCase()}: ${msg.text()}`)
  })

  const network = []
  page.on('requestfinished', async (req) => {
    try {
      const res = req.response()
      network.push({
        url: req.url(),
        method: req.method(),
        status: res ? res.status() : null,
        headers: res ? res.headers() : {},
        requestHeaders: req.headers(),
        timing: res ? (res.timing ? res.timing() : null) : null
      })
    } catch (e) {
      // ignore
    }
  })

  console.log('navigating to', URL)
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1200)

  const screenshotPath = path.join(OUT, 'preview_screenshot.png')
  await page.screenshot({ path: screenshotPath, fullPage: true })

  const html = await page.content()
  fs.writeFileSync(path.join(OUT, 'preview_page.html'), html, 'utf8')

  fs.writeFileSync(path.join(OUT, 'console_log.txt'), consoleLines.join('\n'), 'utf8')
  fs.writeFileSync(path.join(OUT, 'network_log.json'), JSON.stringify(network, null, 2), 'utf8')

  console.log('captured to', OUT)
  await browser.close()
})().catch(err => {
  console.error(err)
  process.exit(2)
})