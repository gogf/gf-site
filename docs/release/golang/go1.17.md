---
title: Go 1.17 (2021-08-16)
sidebar_position: 183
---

Go 1.17 版本于 2021 年 8 月发布，带来了编译器性能提升、模块图修剪以及新的构建标签语法。

## 主要变化

### 编译器与性能

- **基于寄存器的调用约定 (Register-based calling convention)**: 在 x86-64 (amd64) 架构上，Go 函数调用现在使用寄存器传递参数和结果，而不是堆栈。这带来了约 5% 的性能提升和 2% 的二进制文件大小缩减。
- **边界检查消除**: 改进了边界检查消除逻辑，进一步提升性能。

### 语言变化

- **Slice 转换**: 支持将切片转换为数组指针。如果切片长度小于数组长度，转换会在运行时 panic。

  ```go
  s := []int{1, 2, 3}
  p := (*[3]int)(s)
  ```

- **`unsafe` 包**: 新增 `unsafe.Add` 和 `unsafe.Slice` 函数，简化了指针运算和切片创建，使代码更符合 `unsafe.Pointer` 的安全规则。

### 工具链

- **修剪模块图 (Pruned module graphs)**: 如果模块指定 `go 1.17` 或更高版本，模块图仅包含其他 `go 1.17` 模块的直接依赖，不再加载完整的传递依赖图。这显著提高了大型项目的模块加载速度。
- **`//go:build` 语法**: 引入了新的构建标签语法 `//go:build`，替代旧的 `// +build`，支持布尔表达式，更加易读。

  ```go
  //go:build linux || darwin
  ```

- **`go get` 弃用安装功能**: `go get` 安装可执行文件的功能被弃用（并将在未来版本移除），应使用 `go install cmd@version`。

### 标准库

- **`time`**: 新增 `Time.UnixMilli` 和 `Time.UnixMicro` 方法；新增 `Time.IsDST` 方法检查是否处于夏令时。
- **`testing`**: 新增 `-shuffle` 标志，用于随机打乱测试执行顺序；新增 `T.Setenv` 和 `B.Setenv` 方法，用于在测试期间设置环境变量。
- **`sync/atomic`**: `atomic.Value` 新增 `Swap` 和 `CompareAndSwap` 方法。
- **`net/http`**: URL 查询参数中不再允许使用分号 `;` 作为分隔符。
- **`runtime/cgo`**: 新增 `Handle` 机制，用于在 C 和 Go 之间安全地传递 Go 值。
