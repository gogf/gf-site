---
title: Nacos
slug: /examples/registry/nacos
keywords: [注册中心, nacos, 服务发现, goframe]
description: GoFrame框架中的Nacos服务注册与发现集成
hide_title: true
sidebar_position: 1
---

# 注册中心 - `Nacos` 集成

Code Source: https://github.com/gogf/examples/tree/main/registry/nacos


## 简介

本示例演示了如何在 `GoFrame` 应用程序中集成 `Nacos` 服务注册中心。主要展示：
- 使用 `Nacos` 注册服务
- 使用 `Nacos` 发现服务
- 实现服务健康检查
- 构建分布式系统

## 目录结构

```text
.
├── docker-compose/      # Docker配置文件
│   ├── docker-compose.yml  # Docker编排配置
│   └── env/               # 环境变量配置
│       └── nacos.env      # Nacos环境配置
├── grpc/                # gRPC服务示例
│   ├── client/          # gRPC客户端实现
│   ├── controller/      # gRPC服务控制器
│   ├── protobuf/        # Protocol buffer定义
│   └── server/          # gRPC服务器实现
│       ├── main.go      # 服务器启动代码
│       └── config.yaml  # 服务器配置
├── http/                # HTTP服务示例
│   ├── client/          # HTTP客户端实现
│   └── server/          # HTTP服务器实现
├── go.mod               # Go模块文件
└── go.sum               # Go模块校验和
```

## 功能特性

本示例展示了以下功能：

1. 服务注册
   - 自动服务注册
   - 健康检查配置
   - 元数据管理
   - 命名空间和分组管理

2. 服务发现
   - 动态服务发现
   - 负载均衡
   - 故障转移支持
   - 服务订阅机制

3. 协议支持
   - `HTTP` 服务注册与发现
   - `gRPC` 服务注册与发现

## 环境要求

- `Go` 1.22 或更高版本
- `Docker` (用于运行 `Nacos`)
- `Nacos` 2.1.2+

## 使用说明

1. 启动 `Nacos` 服务：
   ```bash
   cd docker-compose
   docker-compose up -d
   ```

2. `HTTP` 服务示例：
   ```bash
   # 启动HTTP服务器
   cd http/server
   go run server.go

   # 运行HTTP客户端
   cd http/client
   go run client.go
   ```

3. `gRPC` 服务示例：
   ```bash
   # 启动gRPC服务器
   cd grpc/server
   go run server.go

   # 运行gRPC客户端
   cd grpc/client
   go run client.go
   ```

## 实现说明

1. `HTTP` 服务实现
   - 服务器使用 `g.Server` 创建 `HTTP` 服务
   - 通过 `gsvc.SetRegistry` 设置 `Nacos` 注册中心
   - 客户端使用 `g.Client()` 自动发现并访问服务
   - 支持自动的健康检查和服务发现

2. `gRPC` 服务实现
   - 服务器使用 `grpc.Server` 创建 `gRPC` 服务
   - 通过 `gsvc.SetRegistry` 设置 `Nacos` 注册中心
   - 客户端使用 `grpc.Client` 自动发现并访问服务
   - 支持自动的健康检查和服务发现
