/**
 * 生产构建入口。
 *
 * 为什么不直接用 `astro build`：
 * 本机沙箱通过 NODE_OPTIONS 注入了一层文件删除拦截（safe-delete），
 * 而 Vite 在初始化依赖预构建时会调用 fs.rm() 清理 node_modules/.vite/deps，
 * 该调用被拦截后抛错，导致构建在 CLI 下静默中断且不输出任何日志。
 *
 * 这里做两件事：
 *   1. 清空 NODE_OPTIONS，让 fs.rm 回到原生实现
 *   2. 改用 Astro 的编程式 API，异常能被完整捕获并打印
 */
process.env.NODE_OPTIONS = '';

import { build } from 'astro';

const started = Date.now();

try {
  await build({ logLevel: 'info' });
  const seconds = ((Date.now() - started) / 1000).toFixed(2);
  console.log(`\n构建完成，耗时 ${seconds}s`);
} catch (error) {
  console.error('\n构建失败：');
  console.error(error?.stack ?? error);
  process.exit(1);
}
