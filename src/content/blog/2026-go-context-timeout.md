---
title: Go 里被低估的 context：超时不是你想的那样
description: 很多人以为给 context 设了 timeout 就万事大吉，但 goroutine 泄漏往往就藏在这行代码背后。
published: 2026-07-22
category: 后端
tags: [Go, 并发, 踩坑]
pinned: false
---

`context.WithTimeout` 几乎每个 Go 后端都写过，但真正理解它「不替你取消 goroutine」的人，可能没那么多。

## 一个常见的误用

```go
func fetch(ctx context.Context) (string, error) {
    ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
    defer cancel() // 注意：只是释放 timer 资源

    ch := make(chan string, 1)
    go func() {
        ch <- slowWork() // 即便超时，这个 goroutine 仍会跑完
    }()

    select {
    case r := <-ch:
        return r, nil
    case <-ctx.Done():
        return "", ctx.Err()
    }
}
```

`ctx.Done()` 触发后，外层的 `fetch` 确实返回了，但 `slowWork()` 所在的 goroutine **不会被自动杀死**。如果 `slowWork` 是个会一直阻塞的网络调用，这个 goroutine 就泄漏了。

## 正确的姿势

让被调用的函数**主动监听** ctx：

```go
func slowWork(ctx context.Context) (string, error) {
    select {
    case <-time.After(10 * time.Second):
        return "done", nil
    case <-ctx.Done():
        return "", ctx.Err() // 及时退出
    }
}
```

并配合 `errgroup`，一次性把一组任务和一个 ctx 绑在一起。

## 几个我记得住的结论

- `cancel()` 只负责停止 timer，**不负责杀 goroutine**；
- 永远假设上游会取消你，在你的每一层都检查 `ctx.Done()`；
- 用 `context` 传递的是「取消信号」和「截止时间」，不是普通的业务参数。

把这些想清楚之后，线上那几次莫名其妙的 goroutine 暴涨，终于不再出现了。
