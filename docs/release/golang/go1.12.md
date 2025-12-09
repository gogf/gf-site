---
title: Go 1.12 (2019-02-25)
sidebar_position: 212
---

Go 1.12 版本于 2019 年 2 月发布，主要改进了运行时性能和模块支持。

## 主要变化

### 工具链

- **Go Modules**: `go.mod` 现在支持 `go` 指令来指定 Go 版本。
- **Build Cache**: 改进了构建缓存，现在是必需的。

### 运行时与性能

- **GC 改进**: 垃圾回收器在处理大堆内存时更加激进地将内存归还给操作系统。
- **Timer 性能**: 优化了定时器的性能，减少了 CPU 开销。

### 标准库

- **TLS 1.3**: `crypto/tls` 现在支持 TLS 1.3 协议（默认启用，但在 Go 1.12 中是可选的，可以通过 GODEBUG 禁用）。
- **`strings.ReplaceAll`**: 新增 `strings.ReplaceAll` 函数，比 `strings.Replace(s, old, new, -1)` 更易读。

### 调试

- **DWARF**: 改进了 DWARF 调试信息的生成，支持更多调试器功能。

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.12 Release Notes](https://go.dev/doc/go1.12)
