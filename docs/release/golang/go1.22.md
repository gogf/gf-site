---
title: Go 1.22 (2024-02-06)
sidebar_position: 178
---

Go 1.22 版本于 2024 年 2 月发布，主要解决了长期存在的循环变量问题，并增强了 HTTP 路由功能。

## 主要变化

### 语言变化

- **循环变量作用域**: `for` 循环中声明的变量现在每次迭代都会创建新的实例。这解决了常见的闭包捕获循环变量的问题。
- **Range over integers**: `for range` 现在支持整数，例如 `for i := range 10` 将迭代 0 到 9。
- **Range-over-function (预览)**: 引入了 `range-over-function` 迭代器的预览支持（通过 `GOEXPERIMENT=rangefunc` 启用）。

### 工具链

- **Go 命令**:
  - 工作区（Workspaces）现在支持 `vendor` 目录。
  - `go get` 在非模块的 legacy `GOPATH` 模式下不再受支持。
  - `go test -cover` 现在可以报告没有测试文件的包的覆盖率（为 0%）。
- **Trace**: `trace` 工具的 Web UI 进行了更新，改进了可读性和线程导向的视图。
- **Vet**:
  - 适应了新的循环变量语义，不再报告不再是问题的循环变量引用。
  - 新增检查：`append` 后缺少值、`defer` 中直接调用 `time.Since`、`log/slog` 键值对不匹配。

### 运行时与编译器

- **性能优化**: 运行时将基于类型的 GC 元数据保持在堆对象附近，提高了 CPU 性能（1-3%）并减少了内存开销。
- **PGO 增强**: PGO 构建现在可以去虚拟化更多调用，性能提升通常在 2-14% 之间。
- **内联增强 (预览)**: 引入了增强的内联阶段预览（通过 `GOEXPERIMENT=newinliner` 启用）。

### 标准库

- **`math/rand/v2`**: 引入了 `math/rand/v2` 包，提供了更快、更标准的随机数生成器（如 ChaCha8, PCG），并清理了旧 API。
- **`net/http` 路由增强**: `http.ServeMux` 现在支持方法匹配（如 `GET /items`）和通配符（如 `/items/{id}`, `/files/{path...}`）。
- **`go/version`**: 新增 `go/version` 包，用于解析和比较 Go 版本字符串。
- **`slices`**: 新增 `Concat` 函数用于连接切片；`Delete` 等缩减切片的函数现在会将被删除的元素置零。
- **`cmp`**: 新增 `Or` 函数，返回序列中第一个非零值。
- **`database/sql`**: 新增 `Null[T]` 类型，用于扫描任何列类型的可空列。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.22 Release Notes](https://go.dev/doc/go1.22)
