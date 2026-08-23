---
title: 实时协作白板（WebSocket）
description: 一个支持多人同时绘制与光标高亮的白板，WebSocket 全双工推送 + 操作冲突合并。
period: 2026.05 – 2026.06
status: wip
stack: [Go, WebSocket, Canvas, SQLite]
role: 独立开发
highlights:
  - 基于 operation 的增量同步，断线重连自动补帧
  - 在线用户光标实时广播，延迟感知
  - 房间状态落 SQLite，重启可恢复
featured: false
order: 4
accent: peach
repo: https://github.com/is-shanxi/ws-whiteboard
---

为了搞懂「实时协作」到底难在哪，从零写了个白板。

最大的坑不是画图，而是**冲突**：两个人同时移动同一个图形怎么办？最终用「最后写优先 + 操作快照」的折中方案，虽然不完美，但体感足够顺。等哪天有空了，想去啃真正的 CRDT。
