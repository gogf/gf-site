---
title: 使用Polaris实现负载均衡
slug: /examples/balancer/polaris
keywords: [负载均衡, polaris, 服务发现, goframe]
description: GoFrame 中使用 Polaris 实现负载均衡的示例
hide_title: true
---

# Polaris 负载均衡示例

Code Source: https://github.com/gogf/examples/tree/main/balancer/polaris


## 介绍

本示例展示了如何在 `GoFrame` 中使用 `Polaris` 实现负载均衡。主要演示：
- `Polaris` 负载均衡集成
- 服务发现机制
- 动态路由配置
- 故障转移实现

## 目录结构

```text
.
├── server/         # HTTP 服务器
├── client/         # HTTP 客户端
├── go.mod          # Go 模块文件
└── go.sum          # Go 模块校验
```

## 环境要求

- [Go](https://golang.org/dl/) 1.22 或更高版本
- [Git](https://git-scm.com/downloads)
- [GoFrame](https://goframe.org)
- [GoFrame Polaris Registry](https://github.com/gogf/gf/tree/master/contrib/registry/polaris)

## 配置说明

1. `Polaris` 配置示例：
   ```yaml
   balancer:
     polaris:
       address: "localhost:8091"
       namespace: "default"
       service:
         name: "demo-service"
         metadata:
           version: "1.0.0"
       loadbalancer:
         type: "weighted_random"
         weights:
           "instance-1": 3
           "instance-2": 2
       circuit_breaker:
         enabled: true
         error_rate: 0.5
         min_request: 10
   ```

## 使用说明

1. 启动 `Polaris`：
   ```bash
   docker run -d --name polaris \
      -p 8090:8090 -p 8091:8091 -p 8093:8093 -p 9090:9090 -p 9091:9091 \
      polarismesh/polaris-standalone:v1.17.2
   ```

2. 启动服务：
   ```bash
   go run main.go
   ```
