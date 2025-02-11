---
title: Prometheus集成
slug: /examples/observability/metric/prometheus
keywords: [指标, prometheus, 直接集成, goframe]
description: GoFrame中直接集成Prometheus（不使用OpenTelemetry）
hide_title: true
sidebar_position: 1
---

# 指标收集 - Prometheus直接集成

Code Source: https://github.com/gogf/examples/tree/main/observability/metric/prometheus


## 简介

本示例演示了如何在 `GoFrame` 中直接集成 `Prometheus` 指标，而不使用 `OpenTelemetry`。主要展示：
- 直接创建Prometheus指标
- 向Prometheus注册表注册指标
- 通过HTTP端点暴露指标
- 动态更新指标值

## 目录结构

```text
.
├── go.mod            # Go模块文件
├── go.sum            # Go模块校验和
└── prometheus.go     # 主程序，演示Prometheus直接集成
```

## 功能特性

本示例展示了以下功能：

1. 指标类型
   - 计数器（Counter）：单调递增的值
   - 仪表盘（Gauge）：可上下变化的值

2. 指标操作
   - 指标注册
   - 值更新
   - HTTP暴露
   - 随机值生成

3. HTTP端点
   - `/`: 触发指标更新
   - `/metrics`: 暴露Prometheus指标

## 环境要求

- `Go` 1.22 或更高版本
- `GoFrame` 框架
- `Prometheus` 客户端库

## 使用说明

1. 运行示例：
   ```bash
   go run prometheus.go
   ```

2. 测试应用：
   ```bash
   # 生成一些指标值
   curl http://localhost:8000/
   
   # 查看指标
   curl http://localhost:8000/metrics
   ```

3. 指标输出示例：
   ```text
   # HELP demo_counter 这是一个演示计数器
   # TYPE demo_counter counter
   demo_counter 1
   
   # HELP demo_gauge 这是一个演示仪表盘
   # TYPE demo_gauge gauge
   demo_gauge 42
   ```

## 实现说明

1. 定义指标变量
   ```go
   // 创建计数器类型指标
   metricCounter = promauto.NewCounter(
       prometheus.CounterOpts{
           Name: "demo_counter", // Prometheus格式的指标名称
           Help: "这是一个演示计数器", // 指标描述
       },
   )

   // 创建仪表盘类型指标
   metricGauge = promauto.NewGauge(
       prometheus.GaugeOpts{
           Name: "demo_gauge", // Prometheus格式的指标名称
           Help: "这是一个演示仪表盘", // 指标描述
       },
   )
   ```

2. 注册指标
   ```go
   // 创建Prometheus注册表
   registry := prometheus.NewRegistry()

   // 注册指标
   registry.MustRegister(
       metricCounter, // 注册计数器指标
       metricGauge,   // 注册仪表盘指标
   )
   ```

3. 配置HTTP服务器
   ```go
   s := g.Server()

   // 更新指标的处理器
   s.BindHandler("/", func(r *ghttp.Request) {
       metricCounter.Add(1)                       // 增加计数器
       metricGauge.Set(float64(grand.N(1, 100))) // 设置随机仪表盘值
       r.Response.Write("fake ok")
   })

   // 暴露指标的处理器
   s.BindHandler("/metrics", ghttp.WrapH(promhttp.Handler()))
   ```
