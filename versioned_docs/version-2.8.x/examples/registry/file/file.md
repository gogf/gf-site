---
title: File
slug: /examples/registry/file
keywords: [注册中心, 文件, 服务发现, goframe]
description: GoFrame框架中基于文件的服务注册与发现集成
hide_title: true
sidebar_position: 1
---

# 注册中心 - 文件系统集成

Github Source: https://github.com/gogf/examples/tree/main/registry/file


## 简介

本示例演示了如何在 `GoFrame` 应用程序中使用基于文件系统的服务注册中心。主要展示：
- 使用文件系统注册服务
- 从文件中发现服务
- 实现简单的服务发现
- 构建基础的分布式系统

## 目录结构

```text
.
├── client/            # 客户端示例
│   └── client.go      # 基于文件的服务发现客户端实现
├── server/            # 服务器示例
│   └── server.go      # 基于文件的服务注册服务器实现
├── go.mod             # Go模块文件
└── go.sum             # Go模块校验和
```

## 功能特性

本示例展示了以下功能：

1. 服务注册
   - 基于文件的服务注册
   - 简单的元数据存储
   - 本地文件系统集成
   - 自动的文件管理

2. 服务发现
   - 基于文件的服务发现
   - 本地服务查找
   - 基础负载均衡
   - 简单的故障转移支持

3. 协议支持
   - `HTTP` 服务支持
   - 可扩展支持其他协议

## 环境要求

- `Go` `1.22` 或更高版本
- 本地文件系统读写权限

## 使用说明

1. 启动服务器：
   ```bash
   cd server
   go run server.go
   ```

2. 运行客户端：
   ```bash
   cd client
   go run client.go
   ```

## 实现说明

1. 服务器实现
   - 使用 `g.Server` 创建 `HTTP` 服务
   - 通过 `gsvc.SetRegistry` 设置文件注册中心
   - 服务信息存储在系统临时目录
   - 自动管理服务注册文件

2. 客户端实现
   - 使用相同的临时目录路径
   - 监控文件变化自动更新
   - 支持基本的负载均衡
   - 实现简单的故障转移


## 注意事项

1. 确保服务器和客户端使用相同的注册目录
2. 适合开发和测试环境，不建议用于生产环境
3. 服务信息存储在本地文件系统，需要确保读写权限
4. 支持基本的服务发现和负载均衡功能
