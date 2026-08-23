---
title: K8s HPA 不扩容？先看看这几个被忽略的指标
description: 配置了 HPA 却永远停在 1 副本？大多数时候问题不在配置，而在「指标根本没上来」。
published: 2026-04-10
category: 后端
tags: [Kubernetes, 云原生, 运维]
pinned: false
---

HPA（Horizontal Pod Autoscaler）看起来配置很简单，但「明明 CPU 打满了却不变」的情况，我至少见过三次。

## 最常见的坑：metrics-server 没装

HPA 默认读的是 `metrics.k8s.io` 这个 API，它由 **metrics-server** 提供。很多新手集群只装了核心组件，忘了它：

```bash
kubectl get apiservices | grep metrics.k8s.io
# 如果没看到 Available，HPA 永远拿不到数据
```

## 资源配置没设 limit，HPA 算不了

HPA 基于「当前使用量 / requests」算百分比。如果你的 Pod 没设 `resources.requests.cpu`，HPA 直接跳过：

```yaml
resources:
  requests:
    cpu: 100m # 必须有，HPA 才能算比例
  limits:
    cpu: 500m
```

## 用自定义指标才灵活

CPU 不是所有服务的瓶颈。对 IO 密集的服务，用 QPS 或队列长度更合理：

```yaml
metrics:
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "100"
```

## 一句话总结

HPA 不扩容，**九成是「指标没上来」而不是「阈值不对」**。先 `kubectl describe hpa` 看 `Metrics` 那一行是不是 `<unknown>`，能省下大把瞎调的时间。
