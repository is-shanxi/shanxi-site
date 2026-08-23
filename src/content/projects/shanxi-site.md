---
title: 山兮的小屋
description: 你正在看的这个站点。Astro 从零搭建的纯静态个人站，治愈系配色 + 双主题 + 便签组件。
period: 2026.08 – 至今
status: active
stack: [Astro, TypeScript, Tailwind CSS, Pagefind]
role: 独立开发
highlights:
  - 纯静态零后端，首屏近乎零脚本，Lighthouse 动效项全绿
  - 滚动揭示 / 阅读进度 / 视差全部用 CSS 原生实现
  - 一套 Sticky 组件复用于碎碎念、技能、callout、公告
featured: true
order: 1
accent: mint
repo: https://github.com/is-shanxi/shanxi-site
demo: https://shanxi.dev
---

一个把「代码、生活、二次元」装进同一栋房子的尝试。

技术上的执念是**克制**：不引入任何动画库，动效全部交给 CSS scroll-driven animations；主题切换用 `.dark` 类 + 阻塞式预置脚本，杜绝闪烁；搜索用 Pagefind 在构建期生成静态索引。

如果你也想做类似的东西，整个站点的身份、导航、功能开关都集中在 `src/config.ts` 一个文件里，改它就能改全站。
