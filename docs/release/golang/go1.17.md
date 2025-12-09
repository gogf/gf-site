---
title: Go 1.17 (2021-08-16)
sidebar_position: 217
---

Go 1.17 版本于 2021 年 8 月发布，带来了编译器性能提升和模块图修剪。

## 主要变化

### 语言变化

- **Slice 转换**: 支持将切片转换为数组指针。

    ```go
    s := []int{1, 2, 3}
    p := (*[3]int)(s)
    ```

- **`unsafe.Add` 和 `unsafe.Slice`**: 新增了 `unsafe.Add` 和 `unsafe.Slice` 函数，简化了指针运算和切片创建。

### 编译器与性能

- **基于寄存器的调用约定 (Register-based calling convention)**: 在 x86-64 架构上，Go 函数调用现在使用寄存器传递参数和结果，而不是堆栈。这带来了约 5% 的性能提升和 2% 的二进制文件大小缩减。
- **边界检查消除**: 改进了边界检查消除逻辑。

### 工具链

- **Pruned module graphs (修剪模块图)**: `go.mod` 文件现在包含更多关于传递依赖的信息，允许 `go` 命令在不加载完整依赖图的情况下加载模块。这显著提高了大型项目的模块加载速度。

### 标准库

- **`time`**: 新增 `Time.UnixMilli` and `Time.UnixMicro` 方法。
- **`net/url`**: 新增 `Values.Has` 方法。

## 详细说明

更多详细信息请参考官方发布说明：[Go 1.17 Release Notes](https://go.dev/doc/go1.17)
