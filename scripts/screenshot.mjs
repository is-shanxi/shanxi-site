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
    await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    const fullPath = path.resolve(outDir, '../screenshot-home.png');
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log('saved:', fullPath);

    // 截左侧边栏
    const sideLeft = await page.locator('.side-left').first();
    if (await sideLeft.isVisible().catch(() => false)) {
      await sideLeft.screenshot({ path: path.resolve(outDir, '../screenshot-side-left.png') });
      console.log('saved side-left');
    }

    // 截右侧边栏——先滚动到 notes-card 确保它进入视图
    const notesCard = await page.locator('.side-right .notes-card').first();
    if (await notesCard.isVisible().catch(() => false)) {
      await notesCard.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await notesCard.screenshot({ path: path.resolve(outDir, '../screenshot-notes-card.png') });
      console.log('saved notes-card');
    }

    // 截右侧边栏上半部分（运行状态/站点信息/日历）
    const runtimeCard = await page.locator('.side-right .runtime-card').first();
    if (await runtimeCard.isVisible().catch(() => false)) {
      await runtimeCard.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await runtimeCard.screenshot({ path: path.resolve(outDir, '../screenshot-runtime-card.png') });
      console.log('saved runtime-card');
    }

    // 截站点信息卡片特写
    const siteInfoCard = await page.locator('.side-right .siteinfo-card').first();
    if (await siteInfoCard.isVisible().catch(() => false)) {
      await siteInfoCard.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await siteInfoCard.screenshot({ path: path.resolve(outDir, '../screenshot-siteinfo-card.png') });
      console.log('saved siteinfo-card');
    }
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
