---
title: Go 1.11 (2018-08-24)
sidebar_position: 211
---

Go 1.11 版本于 2018 年 8 月发布，引入了 Go Modules 和 WebAssembly 的实验性支持。

## 主要变化

### 工具链

- **Go Modules (实验性)**: 引入了新的依赖管理系统 Go Modules。通过 `go.mod` 文件管理依赖，不再强制要求代码必须在 `GOPATH` 下。
- **WebAssembly (实验性)**: 添加了对 `js/wasm` 架构的支持，允许 Go 程序编译为 WebAssembly 并在浏览器中运行。

### 语言变化

- **无变化**: Go 1.11 没有语言规范的变更。

### 运行时

- **调试**: 改进了调试器支持，特别是对于优化后的二进制文件。

### 标准库

- **`syscall/js`**: 新增 `syscall/js` 包，用于与 JavaScript 环境交互（仅在 wasm 架构下可用）。

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.11 Release Notes](https://go.dev/doc/go1.11)
