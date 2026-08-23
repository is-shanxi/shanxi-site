/**
 * Hero 重构 + 侧边栏便签字色验证：
 *   1. desktop 1440: light hero / dark hero / light notes-card / dark notes-card
 *   2. mobile 390:   light hero / dark hero
 *
 * 验证点：
 *   - Hero 无 maid-l / maid-r / scroll-hint 元素，文字居中显示
 *   - 打字机 4 句英文（第一次打印 "See the world through code."）
 *   - 便签内的文字清晰可读（ff-card 内浅底配深字 / 深底配浅字）
 */
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire('C:/Users/15102/.workbuddy/binaries/node/workspace/package.json');
const { chromium } = require('playwright');

const outDir = path.dirname(fileURLToPath(import.meta.url));

const BASE = 'http://127.0.0.1:4321/';

async function setTheme(page, theme) {
  await page.addInitScript((t) => {
    try {
      localStorage.setItem('shanxi-theme', t);
    } catch {}
  }, theme);
}

async function captureView(browser, label, viewport, theme) {
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
  });
  await setTheme(ctx, theme);
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const heroPath = path.resolve(outDir, `../verify-${label}-hero.png`);
  const hero = page.locator('.hero').first();
  await hero.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await hero.screenshot({ path: heroPath });
  console.log('saved', heroPath);

  const notesPath = path.resolve(outDir, `../verify-${label}-notes-card.png`);
  const card = page.locator('.side-right .notes-card').first();
  if (await card.isVisible().catch(() => false)) {
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await card.screenshot({ path: notesPath });
    console.log('saved', notesPath);
  }

  const announcePath = path.resolve(outDir, `../verify-${label}-announce-card.png`);
  const ann = page.locator('.side-left .ann').first();
  if (await ann.isVisible().catch(() => false)) {
    await ann.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await ann.screenshot({ path: announcePath });
    console.log('saved', announcePath);
  }

  await ctx.close();
}

(async () => {
  process.env.PLAYWRIGHT_BROWSERS_PATH =
    process.env.PLAYWRIGHT_BROWSERS_PATH ||
    `${process.env.LOCALAPPDATA || 'C:/Users/15102/AppData/Local'}/ms-playwright`;

  const browser = await chromium.launch({ headless: true });
  try {
    await captureView(browser, 'desktop-light', { width: 1440, height: 900 }, 'light');
    await captureView(browser, 'desktop-dark', { width: 1440, height: 900 }, 'dark');
    await captureView(browser, 'mobile-light', { width: 390, height: 844 }, 'light');
    await captureView(browser, 'mobile-dark', { width: 390, height: 844 }, 'dark');
  } finally {
    await browser.close();
  }
})();
