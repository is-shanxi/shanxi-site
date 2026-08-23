import { createRequire } from 'module';
const require = createRequire('C:/Users/15102/.workbuddy/binaries/node/workspace/package.json');
const { chromium } = require('playwright');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/about', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const res = await page.$$eval('.sticky-note', (els) => els.slice(0,4).map((el) => ({
  cls: el.className,
  transform: getComputedStyle(el).transform,
  opacity: getComputedStyle(el).opacity,
  filter: getComputedStyle(el).filter,
})));
console.log(JSON.stringify(res, null, 2));
await browser.close();
