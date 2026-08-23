---
title: 用 Astro 从零搭一个治愈系个人站
description: 记录本站的搭建思路：内容集合、纯 CSS 动效、双主题，以及为什么我坚持不用任何动画库。
published: 2026-08-01
category: 前端
tags: [Astro, 前端, 设计]
pinned: false
---

这个站点本身就是一篇「可运行的笔记」。下面聊聊几个关键决策。

## 为什么是 Astro

- **零 JS 默认**：组件是 `.astro`，只在需要交互的地方才注水（island）；
- **内容优先**：`glob` loader + zod schema，写错字段名构建期就报错；
- **可扩展**：想加页面、加集合、加 i18n，结构都现成。

## 动效全部交给 CSS

我没有引入 GSAP 或 Framer Motion。滚动揭示用的是 CSS scroll-driven animations：

```css
.reveal {
  animation: reveal-in linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 26%;
}
```

不支持的浏览器（比如某些 Firefox 版本）由一段 ~20 行的 `IntersectionObserver` 兜底。结果：首屏几乎零脚本，Lighthouse 动效项轻松绿。

## 双主题用 class 策略

我没有用 `prefers-color-scheme` 直接驱动，而是 `.dark` 类 + 一段阻塞式内联脚本在首屏前设好，避免「先白后黑」的闪烁。

## 便签组件是灵魂

`Sticky.astro` 一张组件复用了四五处：碎碎念墙、技能展示、文章 callout、公告位。倾斜角和配色都按内容哈希稳定派生，所以 SSR 和水合不会出现视觉抖动。

如果你也想做类似的东西，从 `src/config.ts` 一个文件改起就行 —— 全站的身份、导航、开关都在那里。
