# HTTP负载均衡

Github Source: https://github.com/gogf/examples/tree/main/balancer/http

## 介绍

本示例展示了如何在 `GoFrame` 应用程序中实现 HTTP 服务的负载均衡。主要演示：
- 使用 `etcd` 配置负载均衡器
- 服务注册和服务发现
- 请求路由和负载分发

## 目录结构

```text
.
├── server/         # HTTP 服务器
├── client/         # HTTP 客户端
├── go.mod          # Go 模块文件
└── go.sum          # Go 模块校验
```

## 环境要求

- [Go](https://golang.org/dl/) `1.22` 或更高版本
- [Git](https://git-scm.com/downloads)
- [GoFrame](https://goframe.org)

## 使用说明

1. 启动服务器：
   ```bash
   go run server/main.go
   ```

2. 在另一个终端启动客户端：
   ```bash
   go run client/main.go
   ```

> 页面: https://goframe.org/examples/balancer/http
