---
title: Go 1.26 (2026-02-10)
sidebar_position: 174
---

Go 1.26 版本于 2026 年 2 月发布，距离 [Go 1.25](https://go.dev/doc/go1.25) 发布已过去六个月。大多数变化在工具链、运行时和库的实现中。Go 1.26 继续维持 [Go 1 兼容性承诺](https://go.dev/doc/go1compat)。我们预期几乎所有 Go 程序都能继续正常编译和运行。

## 语言变化

### `new` 函数增强

内置的 `new` 函数现在允许其操作数是一个表达式，用于指定变量的初始值。这在处理序列化包（如 `encoding/json` 或 `protocol buffers`）时特别有用，可以简化可选字段的赋值。

例如，之前需要这样写：

```go
v := "hello"
field := &v
```

现在可以简化为：

```go
field := new("hello")
```

### 泛型类型自引用限制解除

泛型类型现在可以在其类型参数列表中引用自身。这允许定义更强大的类型约束，例如：

```go
type Adder[A Adder[A]] interface {
    Add(A) A
}
```

## 工具链

### Go 命令

- **`go fix` 重构**: `go fix` 命令已彻底重写，现作为 Go 现代化工具的集合。它基于 `go vet` 的分析框架，提供了自动更新代码以符合最新语言特性和库 API 的方法。

- **`go mod init` 默认版本变更**: 新创建的 `go.mod` 文件默认使用的 Go 版本将比工具链版本低一个次要版本（例如，Go 1.26 工具链创建的模块将默认为 `go 1.25.0`），以鼓励模块兼容性。

- **文档工具移除**: `cmd/doc` 和 `go tool doc` 已被删除，请改用 `go doc`。

### Pprof

Web UI（通过 `-http` 启用）现在默认显示火焰图视图。之前的图形视图可在菜单中找到。

## 运行时

### Green Tea GC 默认启用

此前在 Go 1.25 中作为实验性的 Green Tea 垃圾回收器现已成为默认选项。

- **性能提升**: 通过更好的局部性和 CPU 可扩展性，改善了小对象的标记和扫描性能。预计现实世界程序的 GC 开销将减少 10–40%，在较新的 AMD64 平台上（`Intel Ice Lake` 或 `AMD Zen 4` 及更新版本）利用向量指令可再减少约 10% 的开销。
- **禁用方式**: 可通过 `GOEXPERIMENT=nogreenteagc` 禁用，但该选项预计在 Go 1.27 中移除。

### 更快的 CGO 调用

`cgo` 调用的基本运行时开销减少了约 30%。

### 堆基址随机化

在 64 位平台上，运行时现在会在启动时随机化堆基址，以增强安全性，使攻击者更难预测内存地址。可通过 `GOEXPERIMENT=norandomizedheapbase64` 禁用。

### 实验性 Goroutine 泄漏检测

引入了新的 `goroutineleak` 配置文件类型（通过 `GOEXPERIMENT=goroutineleakprofile` 启用）。它可以检测那些因阻塞在不可达的并发原语（如 `channel`、`mutex`）上而永远无法唤醒的 `goroutine`。默认启用计划在 Go 1.27。

## 编译器

### 切片栈分配优化

编译器现在能在更多情况下将切片的底层存储分配在栈上，从而提高性能。

## 链接器

- **Windows ARM64 内部链接**: 在 `windows/arm64` 端口上，链接器现在支持 `cgo` 程序的内部链接模式。
- **可执行文件格式变更**: 对 `moduledata`、`pcHeader`、符号和 ELF 节头顺序等多个二进制细节进行了修改，主要影响分析 Go 可执行文件的工具或使用自定义链接脚本的情况。

## Bootstrap

Go 1.26 现在需要 Go 1.24.6 或更高版本来 Bootstrap。

## 标准库

### 新增包

#### crypto/hpke

新的 [crypto/hpke](https://go.dev/pkg/crypto/hpke/) 包实现 [RFC 9180](https://www.rfc-editor.org/rfc/rfc9180.html) 混合公钥加密（HPKE），支持后量子混合 KEM。

#### 实验性 simd/archsimd

通过 `GOEXPERIMENT=simd` 启用，新的 `simd/archsimd` 包提供特定于架构的 SIMD 操作（目前支持 `amd64`）。

#### 实验性 runtime/secret

通过 `GOEXPERIMENT=runtimesecret` 启用，新的 `runtime/secret` 包用于安全擦除敏感信息（如寄存器、栈、堆分配），以促进前向保密。

### 加密随机性改进

多个加密包（`crypto/dsa`、`crypto/ecdh`、`crypto/ecdsa`、`crypto/ed25519`、`crypto/rand`、`crypto/rsa` 等）中的 `GenerateKey` 和相关函数现在忽略传入的随机参数，改为始终使用安全的加密随机源。测试可使用新的 `testing/cryptotest.SetGlobalRandom`。

### 标准库其他重要变化

**密码学和安全**:

- **crypto/tls**: 默认启用混合 `SecP256r1MLKEM768` 和 `SecP384r1MLKEM1024` 后量子密钥交换。宣布将在 Go 1.27 移除多个旧的 `GODEBUG` 设置（如 `tls10server`、`tls3des` 等）。

**I/O 和日志**:

- **io**: `ReadAll` 性能提升，内存分配减少，速度提高约 2 倍。
- **log/slog**: 新增 `NewMultiHandler`，可同时调用多个处理器。

**网络和 HTTP**:

- **net/http**: 新增 `HTTP2Config.StrictMaxConcurrentRequests` 和 `Transport.NewClientConn`。弃用不安全的 `ReverseProxy.Director`。

**操作系统**:

- **os**: Windows 上的 `OpenFile` 现在支持 Windows 特定文件标志（如 `FILE_FLAG_OVERLAPPED`）。

**反射和测试**:

- **reflect**: 新增迭代器方法，如 `Type.Fields`、`Value.Fields` 等，用于遍历结构字段和方法。
- **testing**: 新增 `T.ArtifactDir()`，用于在测试中写入输出文件（工件）。

## 平台支持

### Darwin (macOS)

Go 1.26 是支持 macOS 12 Monterey 的最后一个版本。Go 1.27 将需要 macOS 13 Ventura 或更高版本。

### Windows

`windows/arm`（32 位）端口已被移除。

### FreeBSD

`freebsd/riscv64` 端口已被标记为损坏。

### PowerPC

Go 1.26 是支持 Linux `ppc64`（大端）上 ELFv1 ABI 的最后一个版本，Go 1.27 将切换到 ELFv2。

### RISC-V

`linux/riscv64` 端口现在支持竞态检测器。

### WebAssembly

编译器现在无条件使用符号扩展和非陷阱浮点转整数转换指令，显著减少了小内存堆应用的内存占用。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.26 Release Notes](https://go.dev/doc/go1.26)
