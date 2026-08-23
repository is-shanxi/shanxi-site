---
title: 缓存穿透、击穿、雪崩：一次线上告警的复盘
description: 三个长得很像的词，处理方式完全不同。把那次 P0 告警拆开讲清楚。
published: 2026-06-15
category: 后端
tags: [Redis, 缓存, 高可用]
pinned: false
---

那天凌晨两点，告警群炸了：数据库 CPU 99%，接口大面积超时。复盘下来，是三个经典问题的「组合拳」。

## 先分清三个概念

| 问题 | 触发 | 解法 |
| --- | --- | --- |
| 穿透 | 查不存在的 key | 空值缓存 / 布隆过滤器 |
| 击穿 | 热点 key 过期瞬间 | 互斥锁 / 逻辑过期 |
| 雪崩 | 大量 key 同时过期 | 过期时间加随机抖动 |

我们那次，**击穿叠了雪崩**：一批热点商品缓存是同一时刻批量写入的，TTL 也相同，到点一起失效，瞬时请求全压到库上。

## 热点 key 的互斥重建

```go
func getWithLock(key string) (string, error) {
    if v, ok := cache.Get(key); ok {
        return v, nil
    }
    // 只允许一个 goroutine 回源
    if !mutex.TryLock(key) {
        time.Sleep(20 * time.Millisecond)
        return getWithLock(key) // 简单重试
    }
    defer mutex.Unlock(key)

    v := loadFromDB(key)
    cache.Set(key, v, ttlWithJitter())
    return v, nil
}
```

## 雪崩的真正解药

不是更复杂的锁，而是**给 TTL 加抖动**：

```go
func ttlWithJitter() time.Duration {
    base := 30 * time.Minute
    jitter := time.Duration(rand.Intn(600)) * time.Second
    return base + jitter
}
```

写完后那一周，同类告警再没出现过。缓存这东西，八成的问题都出在「时间」上。
