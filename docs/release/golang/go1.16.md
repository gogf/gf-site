---
title: Go 1.16 (2021-02-16)
sidebar_position: 216
---

Go 1.16 版本于 2021 年 2 月发布，引入了文件嵌入 (`embed`) 支持，并默认启用了 Go Modules。

## 主要变化

### 语言变化

- **`embed` 包**: 支持将静态文件和目录嵌入到 Go 二进制文件中。

    ```go
    import "embed"

    //go:embed hello.txt
    var s string
    ```

### 工具链

- **Modules 默认启用**: `GO111MODULE` 环境变量默认为 `on`。无论是否存在 `go.mod` 文件，`go` 命令现在默认在模块感知模式下运行。
- **`go install`**: `go install` 现在可以接受带有版本后缀的参数（例如 `go install example.com/cmd@v1.0.0`），用于安装二进制文件，而不影响主模块的 `go.mod`。

### 运行时与性能

- **Apple Silicon (M1) 支持**: 添加了对 macOS ARM64 (`darwin/arm64`) 的原生支持。
- **内存管理**: 运行时现在更积极地将未使用的内存归还给操作系统。

### 标准库

- **`io/fs`**: 新增 `io/fs` 包，定义了只读文件系统的抽象接口。标准库中的 `os`, `net/http`, `html/template` 等包已更新以支持此接口。
- **`runtime/metrics`**: 新增 `runtime/metrics` 包，提供更丰富的运行时指标。

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.16 Release Notes](https://go.dev/doc/go1.16)
