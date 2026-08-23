import { createRequire } from 'module';
const require = createRequire('C:/Users/15102/.workbuddy/binaries/node/workspace/package.json');
const { chromium } = require('playwright');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

// 检查所有 .reveal 元素的初始计算样式（不滚动）
const before = await page.$$eval('.reveal', (els) =>
  els.slice(0, 12).map((el) => {
    const s = getComputedStyle(el);
    return {
      cls: el.className.split(' ').filter((c) => c.startsWith('reveal')).join('.'),
      opacity: s.opacity,
      filter: s.filter,
      transform: s.transform,
      animationName: s.animationName,
      animationDuration: s.animationDuration,
    };
  })
);

// 滚动到中部，再检查靠下进入视口的 .reveal 是否已清晰、无模糊
await page.evaluate(() => window.scrollTo({ top: 1400, behavior: 'instant' }));
await page.waitForTimeout(600);

const after = await page.$$eval('.reveal', (els) =>
  els.slice(0, 12).map((el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return {
      cls: el.className.split(' ').filter((c) => c.startsWith('reveal')).join('.'),
      inViewport: r.top < window.innerHeight && r.bottom > 0,
      opacity: s.opacity,
      filter: s.filter,
      animationName: s.animationName,
    };
  })
);

await page.screenshot({ path: 'D:/WorkBuddy_code/2026-08-10-21-51-43/screenshots/verify-scrolled.png', fullPage: false });
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.waitForTimeout(200);
await page.screenshot({ path: 'D:/WorkBuddy_code/2026-08-10-21-51-43/screenshots/verify-top.png', fullPage: false });

await browser.close();

const anyBlur = [...before, ...after].some((e) => e.filter && e.filter !== 'none');
const anyHidden = [...before, ...after].some((e) => parseFloat(e.opacity) < 0.99);
const anyAnim = [...before, ...after].some((e) => e.animationName && e.animationName !== 'none');

console.log('=== BEFORE SCROLL (samples) ===');
console.log(JSON.stringify(before.slice(0, 6), null, 0));
console.log('=== AFTER SCROLL (samples) ===');
console.log(JSON.stringify(after.slice(0, 6), null, 0));
console.log('--- SUMMARY ---');
console.log('anyBlur:', anyBlur);
console.log('anyHidden(opacity<0.99):', anyHidden);
console.log('anyAnimation:', anyAnim);
console.log('consoleErrors:', errors.length ? errors : 'none');
