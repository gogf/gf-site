---
title: Go 1.8 (2017-02-16)
sidebar_position: 208
---

Go 1.8 版本于 2017 年 2 月发布，改进了 GC 延迟和 HTTP/2 支持。

## 主要变化

### 运行时与性能

- **GC 延迟**: 垃圾回收器的停顿时间进一步缩短，通常在 100 微秒以下。
- **Defer**: `defer` 的开销减少了一半。

### 工具链

- **Plugins (插件)**: 引入了对 Go 插件的初步支持（仅限 Linux）。允许动态加载共享库。
- **默认 GOPATH**: 如果未设置 `GOPATH`，默认值为 `$HOME/go` (Unix) 或 `%USERPROFILE%\go` (Windows)。

### 标准库

- **HTTP/2 Push**: `net/http` 服务器现在支持 HTTP/2 Server Push。
- **`sort.Slice`**: 新增 `sort.Slice` 函数，使得对切片排序更加方便，无需定义新的类型。
- **`context`**: `database/sql` 和 `net/http` 包增加了对 `context.Context` 的支持，用于取消操作和超时控制。

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.8 Release Notes](https://go.dev/doc/go1.8)
