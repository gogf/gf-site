---
title: Go 1.4 (2014-12-10)
sidebar_position: 196
---

Go 1.4 于 2014 年 12 月发布，主要关注于实现方面的改进，包括垃圾回收器的优化和运行时的 C 代码重写（为 Go 1.5 的自举做准备）。此外，还增加了对 Android 的官方支持。

## 主要变化

### 语言变化

- **For-range 循环**: 以前必须写成 `for _ = range x`，现在可以简写为 `for range x`。

  ```go
  // Go 1.4 之前
  for _ = range ch { ... }
  // Go 1.4 及之后
  for range ch { ... }
  ```

### 工具链与运行时

- **Android 支持**: Go 1.4 可以构建运行在 Android ARM 处理器上的二进制文件。配合 `golang.org/x/mobile` 库，可以编写 Android 应用。
- **连续栈**: 运行时现在使用连续栈。当栈空间不足时，会分配一个更大的新栈并复制数据，而不是像以前那样链接一个新的栈段。这消除了"热分裂"（hot stack split）性能问题，并允许 goroutine 以更小的栈（2KB）启动。
- **Canonical Import Paths**: 包声明可以包含注释来指定其规范导入路径。如果用户尝试通过其他路径导入该包，`go` 命令会拒绝编译。

  ```go
  package pdf // import "rsc.io/pdf"
  ```

- **go generate**: 新增 `go generate` 子命令，用于扫描源代码中的 `//go:generate` 指令并执行相应的命令。这通常用于自动生成代码（如 Stringer 方法、Yacc 解析器等）。
- **Internal 包**: 引入了 `internal` 目录的概念。任何名为 `internal` 的目录下的包，只能被以 `internal` 父目录为根的目录树中的代码导入。虽然在 Go 1.4 中主要在主仓库中强制执行，但它为 Go 1.5 全面推广此特性奠定了基础。

### 标准库

- **`testing`**: 支持 `TestMain` 函数，允许在测试运行前后执行全局的设置和清理工作。

  ```go
  func TestMain(m *testing.M) {
      setup()
      code := m.Run()
      teardown()
      os.Exit(code)
  }
  ```

- **`sync/atomic`**: 新增 `Value` 类型，用于原子地存储和加载任意类型的值（通常用于配置加载等场景）。
- **`syscall`**: `syscall` 包被冻结，不再添加新的系统调用。新的系统调用开发转移到了 `golang.org/x/sys` 子仓库。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.4 Release Notes](https://go.dev/doc/go1.4)
