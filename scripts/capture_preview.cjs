/* eslint-env node */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const outDir = path.resolve(__dirname, '../.capture');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const url = process.argv[2] || 'http://localhost:4173/pwa_FRM_Book2_python/';
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleLogs = [];
  const networkLogs = [];

  page.on('console', (msg) => {
    const text = `[${msg.type()}] ${msg.text()}`;
    consoleLogs.push(text);
  });

  page.on('request', (req) => {
    networkLogs.push({
      type: 'request',
      url: req.url(),
      method: req.method(),
      headers: req.headers(),
      timestamp: Date.now()
    });
  });

  page.on('response', async (res) => {
    try {
      const req = res.request();
      networkLogs.push({
        type: 'response',
        url: res.url(),
        status: res.status(),
        statusText: res.statusText(),
        requestMethod: req.method(),
        headers: res.headers(),
        timestamp: Date.now()
      });
    } catch {
      // ignore
    }
  });

  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

  // wait a bit for dynamic content
  await page.waitForTimeout(1500);

  const screenshotPath = path.join(outDir, 'preview_screenshot.png');
  const htmlPath = path.join(outDir, 'preview_page.html');
  const consolePath = path.join(outDir, 'console_log.txt');
  const networkPath = path.join(outDir, 'network_log.json');

  await page.screenshot({ path: screenshotPath, fullPage: true });
  const html = await page.content();
  fs.writeFileSync(htmlPath, html, 'utf8');

  fs.writeFileSync(consolePath, consoleLogs.join('\n'), 'utf8');
  fs.writeFileSync(networkPath, JSON.stringify(networkLogs, null, 2), 'utf8');

  console.log('Saved:', screenshotPath);
  console.log('Saved:', htmlPath);
  console.log('Saved:', consolePath);
  console.log('Saved:', networkPath);

  await browser.close();
})();