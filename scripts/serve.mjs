/**
 * 极简静态预览服务器。
 *
 * Astro 的 preview CLI 在当前沙箱里无法直接调起（CLI 包装脚本静默失败），
 * 所以这里自己起一个只有几十行的静态服务：
 *   - 支持目录索引（/blog → /blog/index.html）
 *   - 404 时回落到 dist/404.html，行为与真实静态托管一致
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';

const ROOT = join(process.cwd(), 'dist');
const PORT = Number(process.env.PORT ?? 4321);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
};

async function resolveFile(pathname) {
  // 防目录穿越
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(ROOT, safe);

  try {
    const info = await stat(file);
    if (info.isDirectory()) file = join(file, 'index.html');
    return file;
  } catch {
    // 无扩展名时尝试目录索引
    if (!extname(file)) {
      const candidate = join(file, 'index.html');
      try {
        await stat(candidate);
        return candidate;
      } catch {
        /* fallthrough */
      }
    }
    return null;
  }
}

createServer(async (req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  const file = await resolveFile(pathname);

  if (file) {
    try {
      const body = await readFile(file);
      res.writeHead(200, {
        'content-type': MIME[extname(file)] ?? 'application/octet-stream',
        'cache-control': 'no-cache',
      });
      res.end(body);
      return;
    } catch {
      /* fallthrough to 404 */
    }
  }

  try {
    const body = await readFile(join(ROOT, '404.html'));
    res.writeHead(404, { 'content-type': MIME['.html'] });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`预览服务已启动： http://127.0.0.1:${PORT}/`);
});
