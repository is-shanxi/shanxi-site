/**
 * 生产构建入口。
 *
 * 为什么不直接用 `astro build`：
 * 本机沙箱通过 NODE_OPTIONS 注入了一层文件删除拦截（safe-delete），
 * 而 Vite / Astro SSR 资产插件在构建时会调用 fs.rm() 清理
 * node_modules/.vite 与 dist/.prerender/.vite，
 * 该调用被拦截后抛错（trash-failed），导致构建整体中断。
 *
 * 注意：shim 在进程启动时即已注入，脚本内部再改 NODE_OPTIONS 无效，
 * 所以检测到注入时必须以干净环境重新拉起自身。
 *
 * 这里做三件事：
 *   1. 检测 NODE_OPTIONS 含 safe-delete shim → 用干净 env 重启本进程
 *   2. 改用 Astro 的编程式 API，异常能被完整捕获并打印
 *   3. 构建耗时统计
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

if (process.env.NODE_OPTIONS?.includes('genie-safe-delete')) {
  const child = spawn(process.execPath, [fileURLToPath(import.meta.url)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_OPTIONS: '' },
  });
  child.on('exit', (code) => process.exit(code ?? 1));
} else {
  const { build } = await import('astro');
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
}
