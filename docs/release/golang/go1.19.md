---
title: Go 1.19 (2022-08-02)
sidebar_position: 181
---

Go 1.19 版本于 2022 年 8 月发布，主要完善了泛型支持、改进了文档注释，并引入了重要的内存管理特性。

## 主要变化

### 语言变化

- **内存模型**: 更新了 Go 内存模型文档，明确了原子操作的行为，与 C++20、Java、Rust 等语言的内存模型保持一致。Go 仅提供顺序一致（sequentially consistent）的原子操作。
- **泛型**: 修复了 Go 1.18 中发现的一些泛型相关的 bug 和限制。对方法声明中类型参数的作用域做了一个微小的修正。

### 工具链

- **Doc Comments**: 支持更丰富的文档注释格式，包括标题、列表和链接。`gofmt` 现在会重新格式化文档注释。

  ```go
  // Package json implements encoding and decoding of JSON as defined in
  // [RFC 7159].
  ```

- **构建约束**: 新增 `unix` 构建约束，当 `GOOS` 为类 Unix 系统（如 linux, darwin, freebsd 等）时满足。
- **Go Command**: `go build` 注入的构建信息现在包含 `-trimpath` 标志（如果设置了的话）。

### 运行时与性能

- **GC 软内存限制**: 引入 `GOMEMLIMIT` 环境变量和 `runtime/debug.SetMemoryLimit` 函数，允许设置软内存限制。这有助于 GC 更好地利用可用内存，避免 OOM，特别是在容器环境中。
- **动态栈大小**: 提高了 goroutine 初始栈的大小调整策略，基于历史平均使用情况分配，减少栈复制和扩容开销。
- **文件描述符限制**: 在 Unix 系统上，导入 `os` 包会自动将打开文件描述符的软限制提高到硬限制的最大值。

### 标准库

- **`sync/atomic`**: 新增了类型化的原子类型（`Bool`, `Int32`, `Int64`, `Uint32`, `Uint64`, `Uintptr`, `Pointer`），使用更加方便安全，避免了手动转换 `unsafe.Pointer`。
- **`net/url`**: 引入 `JoinPath` 函数和 `URL.JoinPath` 方法，方便安全地拼接 URL 路径。
- **`os/exec`**: `Command` 和 `LookPath` 不再默认在当前目录下查找可执行文件（为了安全）。新增 `Cmd.Environ` 方法。
- **`sort`**: 排序算法重写为 pattern-defeating quicksort，在多种场景下速度更快。新增 `Find` 函数。
- **`time`**: 新增 `Duration.Abs` 获取绝对值，`Time.ZoneBounds` 获取时区范围。
- **`fmt`**: 新增 `Append`, `Appendf`, `Appendln` 函数，将格式化数据追加到字节切片。
- **`flag`**: 新增 `TextVar` 函数，允许 flag 绑定实现了 `encoding.TextUnmarshaler` 接口的自定义类型。

### 平台支持

- **LoongArch**: 新增对 LoongArch 64-bit (`linux/loong64`) 的支持。
- **RISC-V**: `riscv64` 端口现在支持通过寄存器传递函数参数和结果，性能提升约 10%。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.19 Release Notes](https://go.dev/doc/go1.19)
