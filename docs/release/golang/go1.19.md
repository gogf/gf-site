---
title: Go 1.19 (2022-08-02)
sidebar_position: 219
---

Go 1.19 版本于 2022 年 8 月发布，主要完善了泛型支持并改进了文档注释。

## 主要变化

### 语言变化

- **内存模型**: 更新了 Go 内存模型文档，明确了原子操作的行为，与 C++20 原子操作保持一致。
- **泛型**: 修复了 Go 1.18 中发现的一些泛型相关的 bug 和限制。

### 文档

- **Doc Comments**: 支持更丰富的文档注释格式，包括标题、列表和链接。

    ```go
    // Package json implements encoding and decoding of JSON as defined in
    // [RFC 7159].
    ```

### 运行时与性能

- **GC 软内存限制**: 引入 `GOMEMLIMIT` 环境变量，允许设置软内存限制，帮助 GC 更好地利用可用内存并避免 OOM。
- **动态栈大小**: 提高了 goroutine 初始栈的大小调整策略，减少栈复制。

### 标准库

- **`sync/atomic`**: 新增了类型化的原子类型（如 `atomic.Int64`, `atomic.Pointer[T]`），使用更加方便安全。
- **`net/url`**: 引入 `JoinPath` 等辅助函数。

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.19 Release Notes](https://go.dev/doc/go1.19)
