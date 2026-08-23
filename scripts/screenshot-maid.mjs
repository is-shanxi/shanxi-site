import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire('C:/Users/15102/.workbuddy/binaries/node/workspace/package.json');
const { chromium } = require('playwright');

const outDir = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  process.env.PLAYWRIGHT_BROWSERS_PATH = process.env.PLAYWRIGHT_BROWSERS_PATH ||
    `${process.env.LOCALAPPDATA || 'C:/Users/15102/AppData/Local'}/ms-playwright`;

  const browser = await chromium.launch({ headless: true });

  // 1) Search dialog open in dark mode
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    // press "/" to open search
    await page.keyboard.press('/');
    await page.waitForTimeout(700);
    const out = path.resolve(outDir, '../screenshot-search-bow.png');
    await page.screenshot({ path: out, fullPage: false });
    console.log('saved:', out);
    await ctx.close();
  }

  // 2) Light mode home (full page) — verify 奶白昼间
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.setItem('shanxi-theme', 'light'));
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const out = path.resolve(outDir, '../screenshot-home-light.png');
    await page.screenshot({ path: out, fullPage: true });
    console.log('saved:', out);
    await ctx.close();
  }

  // 3) Blog page in dark (to verify prose + code blocks in new theme)
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:4321/blog/2026-writing-as-a-backender', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const out = path.resolve(outDir, '../screenshot-blog-dark.png');
    await page.screenshot({ path: out, fullPage: true });
    console.log('saved:', out);
    await ctx.close();
  }

  await browser.close();
})();
