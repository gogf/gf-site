---
title: Go 1.24 (2025-02-11)
sidebar_position: 176
---

Go 1.24 版本在工具链、运行时和标准库方面进行了大量改进。

## 主要变化

### 语言变化

- **泛型类型别名**: Go 1.24 现在完全支持[泛型类型别名](https://go.dev/issue/46477)。类型别名可以像定义类型一样进行参数化。

### 工具链

- **Go 命令**:
  - **工具依赖管理**: Go 模块现在可以使用 `go.mod` 中的 `tool` 指令来跟踪可执行依赖项。这消除了以前使用 "tools.go" 文件的变通方法。
  - **JSON 输出**: `go build` 和 `go install` 命令现在接受 `-json` 标志，以结构化 JSON 格式报告构建输出和失败。
  - **构建版本**: `go build` 命令现在会根据版本控制系统标签和/或提交，在编译的二进制文件中设置主模块的版本。
- **Cgo**: 支持新的注解 `#cgo noescape` 和 `#cgo nocallback` 以提高运行时性能。

### 运行时

- **性能提升**: 运行时进行了多项性能改进，平均 CPU 开销降低了 2-3%。这包括基于 [Swiss Tables](https://abseil.io/about/design/swisstables) 的新内置 `map` 实现、更高效的小对象内存分配以及新的运行时内部互斥锁实现。

### 标准库

- **`os`**: 新增 `os.Root` 类型，提供在特定目录内执行文件系统操作的能力（受目录限制的文件系统访问）。
- **`testing`**:
  - 新增 `testing.B.Loop` 方法，用于更快速、更不易出错的基准测试循环。
  - 新增实验性的 `testing/synctest` 包，支持并发代码的测试（需通过 `GOEXPERIMENT=synctest` 启用）。
- **`runtime`**: 新增 `runtime.AddCleanup` 函数，作为一种比 `runtime.SetFinalizer` 更灵活、更高效且不易出错的终结机制。
- **`weak`**: 新增 `weak` 包，提供弱指针支持。
- **`crypto`**:
  - 新增 `crypto/mlkem` 包，实现 ML-KEM-768 和 ML-KEM-1024（后量子密钥交换机制）。
  - 新增 `crypto/hkdf`、`crypto/pbkdf2` 和 `crypto/sha3` 包。
  - 引入了一套新机制以促进 FIPS 140-3 合规性。
- **`encoding/json`**: 结构体字段标签新增 `omitzero` 选项，如果字段值为零值则省略该字段。
- **`bytes` 和 `strings`**: 新增了多个与迭代器配合使用的函数（如 `Lines`, `SplitSeq` 等）。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.24 Release Notes](https://go.dev/doc/go1.24)
