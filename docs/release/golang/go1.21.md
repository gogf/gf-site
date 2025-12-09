---
title: Go 1.21 (2023-08-08)
sidebar_position: 179
---

Go 1.21 版本于 2023 年 8 月发布，带来了内置函数、结构化日志以及 PGO 的正式支持。

## 主要变化

### 语言变化

- **内置函数**: 新增了 `min`, `max` 和 `clear` 内置函数。
  - `min`/`max`: 计算有序类型的最小值和最大值。
  - `clear`: 清空 map 或 slice（将元素置为零值）。
- **泛型类型推断**: 改进了泛型函数的类型推断能力，支持部分实例化函数的参数推断等。
- **包初始化顺序**: 更精确地指定了包初始化顺序算法。

### 工具链

- **PGO (Profile-guided Optimization)**: PGO 功能正式发布（General Availability）。通过使用生产环境的 profile 文件（默认为 `default.pgo`）指导编译，可以显著提升程序性能（通常 2-7%）。
- **向后兼容性与 GODEBUG**: 改进了 GODEBUG 的处理方式，以便更好地管理版本兼容性。
- **Go 版本号**: 采用了新的版本号方案（如 Go 1.21.0），并加强了 `go.mod` 中 `go` 指令的版本约束。
- **WASI**: 初步支持 WASI (WebAssembly System Interface) preview1 (`GOOS=wasip1`, `GOARCH=wasm`)。

### 标准库

- **`log/slog`**: 引入了结构化日志包 `log/slog`，提供了高性能、结构化的日志记录 API。
- **`slices`**: 新增 `slices` 包，提供了针对切片的通用操作函数（如 `Sort`, `Contains`, `Clone`, `Index` 等）。
- **`maps`**: 新增 `maps` 包，提供了针对映射的通用操作函数（如 `Keys`, `Values`, `Clone`, `Copy` 等）。
- **`cmp`**: 新增 `cmp` 包，定义了 `Ordered` 约束和比较函数。
- **`testing`**: 新增 `-test.fullpath` 选项；新增 `testing.Testing()` 函数。
- **`context`**: 新增 `WithoutCancel`, `WithDeadlineCause`, `WithTimeoutCause`, `AfterFunc` 等函数。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.21 Release Notes](https://go.dev/doc/go1.21)
