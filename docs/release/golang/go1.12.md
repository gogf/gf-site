---
title: Go 1.12 (2019-02-25)
sidebar_position: 188
---

Go 1.12 于 2019 年 2 月发布，主要改进了运行时性能、模块支持以及 TLS 1.3 的初步支持。

## 主要变化

### 工具链

- **Go Modules 改进**:
  - **`go` 指令**: `go.mod` 文件现在支持 `go` 指令（例如 `go 1.12`），用于指定模块代码所使用的语言版本。
  - **并发下载**: `go` 命令现在可以并发下载和提取模块。
  - **模块感知**: 当 `GO111MODULE=on` 时，即使在模块目录之外，`go` 命令也支持模块感知操作。
- **`go vet` 重写**: `go vet` 命令已基于新的 `golang.org/x/tools/go/analysis` 框架重写，更加模块化和强大。
- **构建缓存**: 构建缓存现在是强制启用的，以加速构建过程。
- **Godoc**: `godoc` 不再提供命令行接口，仅作为 Web 服务器运行。命令行帮助请使用 `go doc`。

### 运行时

- **内存释放**: 运行时现在更积极地将未使用的内存归还给操作系统。在 Linux 上，默认使用 `MADV_FREE`，这可能会导致 RSS 看起来较高，但实际上内存是可被系统回收的。如果需要恢复旧行为，可设置 `GODEBUG=madvdontneed=1`。
- **GC 扫描**: 显著改进了堆内存大部分存活时的扫描性能，减少了 GC 后的分配延迟。
- **Timer 优化**: 优化了定时器和截止时间（deadline）的处理性能，特别是在高并发场景下。

### 标准库

- **TLS 1.3 支持 (可选)**: Go 1.12 引入了对 TLS 1.3 的可选支持。默认禁用，可以通过设置环境变量 `GODEBUG=tls13=1` 来启用。它将在 Go 1.13 中默认启用。
- **`strings` / `bytes`**: 新增 `ReplaceAll` 函数，用于替换所有出现的子串，比 `Replace(s, old, new, -1)` 更简洁。
- **`os`**: 新增 `UserHomeDir` 函数，用于获取当前用户的主目录。
- **`fmt`**: Map 的打印顺序现在是固定的（按键排序），便于测试。
- **`runtime/debug`**: 新增 `BuildInfo` 类型和 `ReadBuildInfo` 函数，用于读取二进制文件的构建信息（模块版本等）。

### 平台支持

- **Windows/ARM**: 支持在 Windows 10 IoT Core (如 Raspberry Pi 3) 上运行 Go。
- **AIX**: 支持 AIX 7.2 及更高版本 (`aix/ppc64`)。
- **macOS**: Go 1.12 是最后一个支持 macOS 10.10 Yosemite 的版本。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.12 Release Notes](https://go.dev/doc/go1.12)
