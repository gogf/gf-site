---
title: Go 1.20 (2023-02-01)
sidebar_position: 180
---

Go 1.20 版本于 2023 年 2 月发布，主要关注性能优化、编译器改进以及标准库的增强。

## 主要变化

### 语言变化

- **Slice 转 Array**: 支持将 slice 直接转换为数组（Go 1.17 已支持转换为数组指针）。

  ```go
  s := []int{1, 2, 3}
  a := [3]int(s) // copy
  ```

- **`unsafe` 包**: 新增 `SliceData`, `String`, `StringData` 函数，提供了不依赖具体实现的构建和解构 slice/string 的能力。
- **Comparable 约束**: `comparable` 约束现在可以由普通接口（ordinary interfaces）满足，即使类型参数不是严格可比较的（比较可能在运行时 panic）。

### 工具链

- **PGO (Preview)**: 引入了 Profile-guided Optimization (PGO) 的预览版支持。通过 `-pgo` 标志，编译器可以利用运行时 profile 信息进行特定优化（如更积极的内联），性能提升约 3-4%。
- **`go build -cover`**: 支持对二进制文件进行代码覆盖率收集，不仅限于测试。

  ```bash
  go build -cover -o myapp
  GOCOVERDIR=covdata ./myapp
  ```

- **不再预编译标准库**: `$GOROOT/pkg` 不再存储标准库的预编译归档文件。标准库包现在像其他包一样按需构建并缓存，减少了 Go 发行版的大小。
- **`vet` 工具**: 改进了对循环变量捕获的检测（针对嵌套函数），以及增加了对时间格式错误的检测。

### 标准库

- **`errors`**: 支持多重错误包装。
  - `fmt.Errorf` 支持多个 `%w`。
  - 新增 `errors.Join` 函数用于组合多个错误。
- **`context`**: 新增 `WithCancelCause` 和 `Cause`，允许在取消 context 时传递并获取具体的取消原因。
- **`crypto/ecdh`**: 新增 `crypto/ecdh` 包，提供对 NIST 曲线和 Curve25519 的显式支持。
- **`net/http`**:
  - 新增 `ResponseController` 类型，用于访问 `ResponseWriter` 的扩展功能（如 `SetReadDeadline`, `SetWriteDeadline`）。
  - `httputil.ReverseProxy` 新增 `Rewrite` 钩子，取代了 `Director`，提供了更强大的请求重写能力。
- **`time`**: 新增常量 `DateTime`, `DateOnly`, `TimeOnly`。新增 `Time.Compare` 方法。

### 平台支持

- **Windows**: Go 1.20 是最后一个支持 Windows 7, 8, Server 2008, Server 2012 的版本。
- **macOS**: Go 1.20 是最后一个支持 macOS 10.13 High Sierra 和 10.14 Mojave 的版本。
- **FreeBSD/RISC-V**: 新增对 `GOOS=freebsd`, `GOARCH=riscv64` 的实验性支持。

### 性能

- **编译器**: 优化了内联和边界检查消除，提升了代码执行效率。构建速度比 Go 1.19 提升约 10%。
- **内存管理**: 优化了垃圾回收的内部数据结构，减少内存开销并提升 CPU 性能。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.20 Release Notes](https://go.dev/doc/go1.20)
