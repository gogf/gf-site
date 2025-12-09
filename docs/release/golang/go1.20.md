---
title: Go 1.20 (2023-02-01)
sidebar_position: 220
---

Go 1.20 版本于 2023 年 2 月发布，主要关注性能优化和编译器改进。

## 主要变化

### 语言变化

- **Slice 转 Array**: 支持将 slice 直接转换为数组或数组指针。

    ```go
    s := []int{1, 2, 3}
    a := [3]int(s)
    ```

- **`unsafe` 包**: 新增 `SliceData`, `String`, `StringData` 函数，方便底层操作。

### 工具链

- **PGO (Preview)**: 引入了 Profile-guided Optimization (PGO) 的预览版支持。
- **`go build -cover`**: 支持对二进制文件进行代码覆盖率收集，不仅限于测试。

### 标准库

- **`errors`**: 支持多重错误包装 (`Join`, `Unwrap` 返回 `[]error`)。
- **`context`**: 新增 `WithCancelCause`，允许在取消 context 时传递原因。
- **`crypto/ecdh`**: 新增椭圆曲线 Diffie-Hellman 密钥交换支持。

### 性能

- **编译器**: 优化了内联和边界检查消除，提升了代码执行效率。
- **内存管理**: 优化了垃圾回收的内存开销。

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.20 Release Notes](https://go.dev/doc/go1.20)
