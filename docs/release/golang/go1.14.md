---
title: Go 1.14 (2020-02-25)
sidebar_position: 214
---

Go 1.14 版本于 2020 年 2 月发布，标志着 Go Modules 可以在生产环境中使用了。

## 主要变化

### 语言变化

- **接口重叠**: 允许嵌入的接口定义重叠的方法。

    ```go
    type ReadWriteCloser interface {
        io.ReadCloser
        io.WriteCloser
    }
    // 即使 ReadCloser 和 WriteCloser 都包含 Close() 方法，现在也是合法的。
    ```

### 工具链

- **Modules 生产就绪**: Go Modules 的实现已经足够成熟，官方鼓励在生产环境中使用。
- **`go mod vendor`**: 改进了 vendor 目录的处理。

### 运行时与性能

- **Defer 性能**: `defer` 语句的开销大幅降低，现在几乎可以忽略不计，鼓励在需要资源清理的地方放心使用。
- **Goroutine 抢占**: 实现了基于信号的异步抢占调度。这意味着紧密循环（tight loops）不再会阻塞 GC 或调度器，大大减少了 STW (Stop-The-World) 的延迟。

### 标准库

- **`hash/maphash`**: 新增 `hash/maphash` 包，提供用于哈希表的高性能哈希函数。
- **`testing`**: `go test -v` 现在支持流式输出。

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.14 Release Notes](https://go.dev/doc/go1.14)
