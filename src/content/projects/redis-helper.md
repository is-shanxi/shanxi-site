---
title: redis-helper
description: 一个小巧的 Go 缓存工具库，封装了穿透 / 击穿 / 雪崩的常用解法，已在两个项目里跑了一年。
period: 2025.11 – 至今
status: active
stack: [Go, Redis]
role: 独立开发
highlights:
  - 单 flight 互斥回源，天然防击穿
  - TTL 自动加抖动，根绝雪崩
  - 空值缓存可配置，防穿透
featured: false
order: 3
accent: lemon
repo: https://github.com/is-shanxi/redis-helper
---

把那次 P0 告警里学到的东西，沉淀成了一个不到 300 行的库。

API 故意做得像标准库的 `sync` 一样直白：

```go
val, err := rh.Get(ctx, key, func() (string, error) {
    return loadFromDB(key)
})
```

一个回调解决回源、锁、空值、抖动。用了一年，再没为缓存踩过坑。
