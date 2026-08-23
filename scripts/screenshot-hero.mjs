import { createRequire } from 'module';
const require = createRequire('C:/Users/15102/.workbuddy/binaries/node/workspace/package.json');
const { chromium } = require('playwright');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

const hero = await page.locator('.hero').first();
if (await hero.isVisible().catch(() => false)) {
  await hero.screenshot({ path: 'D:/WorkBuddy_code/2026-08-10-21-51-43/screenshots/hero-after.png' });
}

await page.screenshot({ path: 'D:/WorkBuddy_code/2026-08-10-21-51-43/screenshots/home-after.png', fullPage: true });
await browser.close();
console.log('screenshots saved');
