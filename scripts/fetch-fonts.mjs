/**
 * 一次性脚本：将 Google Fonts 上的三个装饰衬线字族自托管化。
 *
 * 背景：站点受众是大陆用户，fonts.googleapis.com 的 CSS 以
 * <link rel=stylesheet> 渲染阻塞方式加载，且大陆可达性不稳定。
 *
 * 做法：
 *   1. 用 Chrome UA 请求 css2 接口，拿到按 unicode-range 切分的 woff2 子集
 *   2. 全部下载到 public/fonts/
 *   3. 把 CSS 里的远程 URL 重写为 /fonts/ 本地路径，写入 src/styles/fonts.css
 *
 * 浏览器只会按需下载命中的子集，Noto Serif SC 的 100+ 个分片
 * 不会全部被用户加载。
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';

const CSS_URL =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Noto+Serif+SC:wght@500;600;700&display=swap';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const FONTS_DIR = new URL('../public/fonts/', import.meta.url);
const OUT_CSS = new URL('../public/fonts.css', import.meta.url);

const res = await fetch(CSS_URL, { headers: { 'User-Agent': UA } });
if (!res.ok) {
  console.error(`css2 请求失败: ${res.status}`);
  process.exit(1);
}
let css = await res.text();

const urls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map(
  (m) => m[1],
);
console.log(`共 ${urls.length} 个 woff2 子集`);

await mkdir(FONTS_DIR, { recursive: true });

let done = 0;
let failed = 0;
for (const url of urls) {
  // 文件名形如 playfairdisplay.woff2 / notoserifsc.woff2，同族同重名——
  // Google 的 URL 路径里带版本哈希，用路径最后两段拼出唯一名。
  const parts = url.split('/').filter(Boolean);
  const familyPart = parts[parts.length - 2]; // 如 notoserifsc
  const filePart = parts[parts.length - 1]; // 如 KFgAcP4jH7OXk.woff2 或 mtex4KbVKaU.woff2
  const localName = `${familyPart}-${filePart}`;

  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) {
    console.error(`下载失败 ${url}: ${r.status}`);
    failed++;
    continue;
  }
  const buf = Buffer.from(await r.arrayBuffer());
  await writeFile(new URL(localName, FONTS_DIR), buf);
  css = css.split(url).join(`/fonts/${localName}`);
  done++;
  if (done % 20 === 0) console.log(`  进度 ${done}/${urls.length}`);
}

await writeFile(OUT_CSS, css);
console.log(`完成：${done} 成功 / ${failed} 失败`);
console.log(`CSS 已写入 src/styles/fonts.css`);
