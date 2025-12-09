---
title: Go 1.6 (2016-02-17)
sidebar_position: 206
---

Go 1.6 版本于 2016 年 2 月发布，默认启用了 HTTP/2。

## 主要变化

### 标准库

- **HTTP/2**: `net/http` 包现在默认支持 HTTP/2 协议（通过 HTTPS）。
- **`text/template`**: 模板引擎现在支持去除空白符的语法 `{{- ... -}}`。

### 运行时

- **Map 并发检测**: 运行时现在会检测对 Map 的并发读写操作，如果发现竞争条件会 panic。这有助于发现潜在的 bug。

### 工具链

- **Vendor**: 进一步完善了对 vendor 目录的支持。

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.6 Release Notes](https://go.dev/doc/go1.6)
