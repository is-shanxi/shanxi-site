import { createRequire } from 'module';
const require = createRequire('C:/Users/15102/.workbuddy/binaries/node/workspace/package.json');
const { chromium } = require('playwright');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

await page.screenshot({ path: 'D:/WorkBuddy_code/2026-08-10-21-51-43/screenshots/hero-normal.png' });

await page.addStyleTag({ content: '.hero-overlay { display: none !important; }' });
await page.waitForTimeout(300);
await page.screenshot({ path: 'D:/WorkBuddy_code/2026-08-10-21-51-43/screenshots/hero-no-overlay.png' });

await page.addStyleTag({ content: '.hero-bg { background: url("/hero-banner.png") center 65% / cover no-repeat !important; background-color: var(--bg) !important; }' });
await page.waitForTimeout(300);
await page.screenshot({ path: 'D:/WorkBuddy_code/2026-08-10-21-51-43/screenshots/hero-img-only.png' });

await browser.close();
console.log('done');
