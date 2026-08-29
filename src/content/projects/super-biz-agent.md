---
title: 智能运维 Agent
description: 基于 Spring AI 的运维 Agent，用 Planner-Executor-Replanner 架构自动分析告警、查询日志并生成诊断报告；另含一套 RAG 智能问答模块。
period: 2026.08 – 至今
status: active
stack: [Java, Spring Boot, Spring AI, Milvus, DashScope]
role: 独立开发
highlights:
  - Planner-Executor-Replanner 架构，告警拆解成步骤逐步执行
  - 文档检索 / 告警查询 / 日志分析 / 时间工具四类 Agent 工具
  - RAG 问答基于 Milvus 向量检索，多轮对话 + 流式输出
repo: https://github.com/is-shanxi/super-biz-agent
featured: false
order: 3
accent: lilac
---

想解决的问题很直接：告警半夜响了，能不能让 Agent 先把现场翻一遍，再把结论交给人。

核心是 **Planner-Executor-Replanner** 这条链路 —— 拿到告警先拆成步骤，逐步调用工具执行（查文档、查指标、查日志），每步结果回看一遍，再决定要不要重新规划。比起「一条 prompt 让模型自己猜」，这种架构在运维场景里可靠得多。

另一半是 RAG 问答：Milvus 存向量，DashScope 负责生成，多轮对话走流式输出。两个模块共用一套会话上下文管理，历史自动清理。
