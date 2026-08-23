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
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  try {
    // 1) About page (light)
    await page.goto('http://127.0.0.1:4321/about', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const about = path.resolve(outDir, '../screenshot-about-light.png');
    await page.screenshot({ path: about, fullPage: true });
    console.log('saved:', about);

    // 2) Home in dark mode: set localStorage + reload
    await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.setItem('shanxi-theme', 'dark'));
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const darkHome = path.resolve(outDir, '../screenshot-home-dark.png');
    await page.screenshot({ path: darkHome, fullPage: true });
    console.log('saved:', darkHome);

    // 3) Home in light, full page shorter
    await page.evaluate(() => localStorage.setItem('shanxi-theme', 'light'));
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const homeFold = path.resolve(outDir, '../screenshot-home-fold.png');
    await page.screenshot({ path: homeFold, fullPage: false });
    console.log('saved:', homeFold);

    // 4) Mobile viewport
    await context.close();
    const mobileCtx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
    });
    const mobilePage = await mobileCtx.newPage();
    await mobilePage.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(800);
    const mobile = path.resolve(outDir, '../screenshot-home-mobile.png');
    await mobilePage.screenshot({ path: mobile, fullPage: false });
    console.log('saved:', mobile);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
