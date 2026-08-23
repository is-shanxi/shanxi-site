---
title: Gin 博客引擎
description: 基于 Gin 的多用户博客后端，JWT 鉴权 + 文章版本管理 + 全文检索，部署在自有服务器。
period: 2026.03 – 2026.07
status: archived
stack: [Go, Gin, GORM, MySQL, Redis]
role: 后端 + 部署
highlights:
  - 文章草稿 / 历史版本，支持一键回滚
  - 基于 Redis 的热榜与阅读量计数，写穿透有空值缓存兜底
  - Docker Compose 一键起全套依赖
featured: false
order: 2
accent: sky
repo: https://github.com/is-shanxi/gin-blog
---

练手用的「正经后端项目」。从路由组织、中间件链，到数据库迁移脚本，都按生产级的要求写。

最有价值的部分是**文章版本管理**：每次保存生成一条 diff 友好的快照，前端能像看 git log 一样回看。搞明白这件事之后，我才真正理解为什么编辑器都要做「撤销栈」。
