// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// 站点绝对地址：仅构建期使用（sitemap / RSS / canonical）。
// 运行时的站点元信息统一在 src/config.ts 中维护。
const SITE_URL = process.env.SITE_URL ?? 'https://mu-shanxi.cn';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
  },

  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'night-owl',
      },
      wrap: true,
    },
  },

  devToolbar: {
    enabled: false,
  },

  image: {
    // 允许远程占位图（mock 阶段用），后续替换为本地资源即可移除
    domains: ['images.unsplash.com'],
  },

  build: {
    // 跨境访问场景下，外链 CSS 每次都是一次 300ms+ RTT 的渲染阻塞请求；
    // 全量内联（~52KB，gzip 后更小）直接消除这次往返。
    inlineStylesheets: 'always',
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
