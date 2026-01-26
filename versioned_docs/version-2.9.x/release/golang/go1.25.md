---
title: Go 1.25 (2025-08-12)
sidebar_position: 175
---

Go 1.25 版本在 2025 年 8 月发布。此版本在工具链、运行时和标准库方面进行了大量改进，同时保持了 Go 1 的兼容性承诺。

## 语言变化

Go 1.25 没有影响 Go 程序的语言级变化。但在[语言规范](https://go.dev/ref/spec)中，核心类型(core types)的概念已被移除，改为专门的描述性文本。

## 工具链

### Go 命令

- **ASan 内存泄漏检测**: `go build -asan` 选项现在默认在程序退出时进行泄漏检测。如果由 C 分配的内存未被释放且未被任何其他 C 或 Go 分配的内存引用，将报告错误。可通过设置环境变量 `ASAN_OPTIONS=detect_leaks=0` 禁用此功能。

- **工具依赖优化**: Go 发行版将包含更少的预构建工具二进制文件。编译器和链接器等核心工具链二进制文件仍将包含，但不由构建或测试操作调用的工具将由 `go tool` 按需构建和运行。

- **ignore 指令**: 新的 `go.mod` `ignore` 指令可用于指定 `go` 命令应忽略的目录。这些目录及其子目录中的文件在匹配包模式时将被忽略，但仍将包含在模块 zip 文件中。

- **go doc 增强**: 新的 `go doc -http` 选项将启动文档服务器，显示请求对象的文档，并在浏览器窗口中打开文档。

- **go version 改进**: 新的 `go version -m -json` 选项将以 JSON 格式打印嵌入在给定 Go 二进制文件中的 `runtime/debug.BuildInfo` 结构体编码。

- **模块子目录支持**: `go` 命令现在支持使用存储库子目录作为模块根路径，使用 `<meta name="go-import" content="root-path vcs repo-url subdir">` 语法表示 `root-path` 对应于 `repo-url` 的 `subdir`。

- **work 包模式**: 新的 `work` 包模式匹配工作模块中的所有包（在模块模式下为单个工作模块，在工作区模式下为工作区模块集合）。

- **工具链行移除**: `go` 命令更新 `go.mod` 或 `go.work` 文件中的 `go` 行时，不再添加指定命令当前版本的工具链行。

### Vet 工具

- 新增分析器：
  - **waitgroup**: 报告对 `sync.WaitGroup.Add` 的错误位置调用。
  - **hostport**: 报告使用 `fmt.Sprintf("%s:%d", host, port)` 为 `net.Dial` 构造地址的用法，因为这对 IPv6 不起作用。建议使用 `net.JoinHostPort`。

## 运行时

### 容器感知的 GOMAXPROCS

Go 1.25 改变了 `GOMAXPROCS` 的默认行为：

- **Linux cgroup 感知**: 在 Linux 上，运行时现在考虑进程所在 cgroup 的 CPU 带宽限制。如果 CPU 带宽限制低于可用的逻辑 CPU 数，`GOMAXPROCS` 将默认为较低的限制。在 Kubernetes 等容器运行时系统中，cgroup CPU 带宽限制通常对应于"CPU 限制"选项。

- **动态更新**: 在所有操作系统上，运行时会在可用逻辑 CPU 数或 cgroup CPU 带宽限制变化时定期更新 `GOMAXPROCS`。为支持读取更新的 cgroup 限制，运行时将在进程的整个生命周期内保留 cgroup 文件的缓存文件描述符。

- **禁用机制**: 如果通过 `GOMAXPROCS` 环境变量或 `runtime.GOMAXPROCS` 调用手动设置 `GOMAXPROCS`，这两个行为都会自动禁用。也可通过 `containermaxprocs=0` 和 `updatemaxprocs=0` GODEBUG 设置显式禁用。

### 新的实验性垃圾收集器

- 新垃圾收集器现作为实验提供。该设计通过更好的局部性和 CPU 可扩展性改进了小对象的标记和扫描性能。基准测试结果各不相同，但预期重度使用垃圾收集器的实际程序的垃圾收集开销可减少 10-40%。

- 可通过在构建时设置 `GOEXPERIMENT=greenteagc` 启用新垃圾收集器。设计预计将继续演进和改进。鼓励 Go 开发者尝试并报告反馈。详见 [GitHub issue](https://go.dev/issue/73581)。

### Trace 飞行记录器

- 新的 [runtime/trace.FlightRecorder](https://go.dev/pkg/runtime/trace#FlightRecorder) API 提供了一种轻量级方式来捕获运行时执行 trace，通过连续将 trace 记录到内存环形缓冲区。当发生重要事件时，程序可调用 `FlightRecorder.WriteTo` 将过去几秒的 trace 快照写入文件。此方法通过使应用仅捕获相关 trace 而生成更小的 trace。

- [FlightRecorderConfig](https://go.dev/pkg/runtime/trace#FlightRecorderConfig) 可配置 [FlightRecorder](https://go.dev/pkg/runtime/trace#FlightRecorder) 捕获的时间长度和数据量。

### 未处理 panic 输出变化

- 程序因恢复然后重新 panic 的未处理 panic 而退出时打印的消息不再重复 panic 值的文本。

之前：
```
panic: PANIC [recovered]
  panic: PANIC
```

现在：
```
panic: PANIC [recovered, repanicked]
```

### Linux VMA 名称

- 在支持匿名虚拟内存区域(VMA)名称的 Linux 系统上（`CONFIG_ANON_VMA_NAME`），Go 运行时将使用上下文注解匿名内存映射，例如 `[anon: Go: heap]` 表示堆内存。可通过 GODEBUG 设置 `decoratemappings=0` 禁用此功能。

## 编译器

### nil 指针 bug 修复

- 修复了 Go 1.21 中引入的编译器 bug，该 bug 可能会不当延迟 nil 指针检查。以下程序之前会错误地执行成功（违反 Go 规范），现在将正确地 panic：

```go
package main

import "os"

func main() {
    f, err := os.Open("nonExistentFile")
    name := f.Name()  // 如果 err 非 nil，则 f 为 nil，应该 panic
    if err != nil {
        return
    }
    println(name)
}
```

如果此改变影响你的代码，解决方案是将非 nil 错误检查提前到代码中，最好紧接在错误生成语句之后。

### DWARF 5 支持

- Go 1.25 中的编译器和链接器现在使用 [DWARF version 5](https://dwarfstd.org/dwarf5std.html) 生成调试信息。较新的 DWARF 版本显著减少了 Go 二进制文件中调试信息所需的空间，并缩短了链接时间，特别是对于大型 Go 二进制文件。DWARF 5 生成可通过在构建时设置环境变量 `GOEXPERIMENT=nodwarf5` 禁用（此回退在未来 Go 版本中可能被移除）。

### 更快的切片

- 编译器现在可在更多情况下在栈上分配切片的后备存储，提高了性能。此改变可能会放大不正确 `unsafe.Pointer` 使用的影响（见 [issue 73199](https://go.dev/issue/73199)）。可使用 [bisect tool](https://pkg.go.dev/golang.org/x/tools/cmd/bisect) 的 `-compile=variablemake` 标志找到造成问题的分配。所有新的栈分配也可通过 `-gcflags=all=-d=variablemakehash=n` 关闭。

## 链接器

链接器现在接受 `-funcalign=N` 命令行选项，指定函数条目的对齐。默认值取决于平台，在此版本中保持不变。

## 标准库

### 新的 testing/synctest 包

- 新的 [testing/synctest](https://go.dev/pkg/testing/synctest) 包为并发代码测试提供支持。

- [Test](https://go.dev/pkg/testing/synctest#Test) 函数在隔离的"气泡"中运行测试函数。在气泡内，时间被虚拟化：`time` 包函数对虚拟时钟进行操作，如果气泡内所有 goroutine 都被阻止，时钟立即向前移动。

- [Wait](https://go.dev/pkg/testing/synctest#Wait) 函数等待当前气泡中所有 goroutine 阻止。

此包首先在 Go 1.24 中作为 `GOEXPERIMENT=synctest` 可用，API 略有不同。实验现已普遍可用。如果设置 `GOEXPERIMENT=synctest`，旧 API 仍然存在，但将在 Go 1.26 中移除。

### 新的实验性 encoding/json/v2 包

- Go 1.25 包含新的实验性 JSON 实现，可通过在构建时设置环境变量 `GOEXPERIMENT=jsonv2` 启用。

启用后，两个新包可用：

- [encoding/json/v2](https://go.dev/pkg/encoding/json/v2) 包是 `encoding/json` 包的重大修订。
- [encoding/json/jsontext](https://go.dev/pkg/encoding/json/jsontext) 包提供较低级别的 JSON 语法处理。

另外，启用"jsonv2" GOEXPERIMENT 时：

- [encoding/json](https://go.dev/pkg/encoding/json) 包使用新 JSON 实现。序列化和反序列化行为不变，但包函数返回的错误文本可能会改变。
- [encoding/json](https://go.dev/pkg/encoding/json) 包包含许多新选项可用于配置序列化器和反序列化器。

新实现在许多场景下性能显著更好。一般而言，编码性能在两种实现之间相当，解码在新实现中明显更快。详见 [github.com/go-json-experiment/jsonbench](https://github.com/go-json-experiment/jsonbench)。

鼓励 `encoding/json` 用户使用启用的 `GOEXPERIMENT=jsonv2` 测试他们的程序以帮助检测新实现的任何兼容性问题。

### 标准库的其他改进

**归档和编码**:

- **archive/tar**: `Writer.AddFS` 实现现在对实现 `io/fs.ReadLinkFS` 的文件系统支持符号链接。

- **encoding/asn1**: `Unmarshal` 和 `UnmarshalWithParams` 现在更一致地解析 ASN.1 类型 T61String 和 BMPString，可能导致一些之前被接受的格式错误的编码现在被拒绝。

**密码学和安全**:

- **crypto**: 新增 `MessageSigner` 签名接口和 `SignMessage` 函数，用于支持需要自己对被签名消息进行哈希的签名者。修改 `fips140` GODEBUG 设置后现在为无操作。SHA-1、SHA-256 和 SHA-512 在 amd64 上没有 AVX2 指令时现在性能更差。

- **crypto/ecdsa**: 新增低级编码函数 `ParseRawPrivateKey`、`ParseUncompressedPublicKey`、`PrivateKey.Bytes` 和 `PublicKey.Bytes`。FIPS 140-3 模式下签名速度提升 4 倍。

- **crypto/ed25519**: FIPS 140-3 模式下签名速度提升 4 倍。

- **crypto/elliptic**: 移除了隐藏的未文档化的 `Inverse` 和 `CombinedMult` 方法。

- **crypto/rsa**: `PublicKey` 不再声称模数值被视为机密。RSA 密钥生成速度提升 3 倍。

- **crypto/sha1**: amd64 上有 SHA-NI 指令时，哈希速度提升 2 倍。

- **crypto/sha3**: Apple M 处理器上哈希速度提升 2 倍。新增 `SHA3.Clone` 方法。

- **crypto/tls**: 新增 `ConnectionState.CurveID` 字段表示密钥交换机制；新增 `Config.GetEncryptedClientHelloKeys` 回调。SHA-1 签名算法在 TLS 1.2 握手中现已禁用（RFC 9155），可通过 `tlssha1=1` GODEBUG 设置重新启用。FIPS 140-3 模式下，TLS 1.2 现要求扩展主密钥，且允许 Ed25519 和 X25519MLKEM768。TLS 服务器现优先选择最高支持的协议版本。TLS 客户端和服务器现在更严格地遵循规范，拒绝不符合规范的行为。

- **crypto/x509**: `CreateCertificate`、`CreateCertificateRequest` 和 `CreateRevocationList` 现在支持 `crypto.MessageSigner` 签名接口。`CreateCertificate` 现在使用截断 SHA-256 填充缺失的 `SubjectKeyId`（可通过 `x509sha256skid=0` GODEBUG 设置回退到 SHA-1）。`ParseCertificate` 现在拒绝包含负值 pathLenConstraint 的 BasicConstraints 扩展的证书，以及处理 ASN.1 T61String 和 BMPString 类型时更加一致。

**调试和分析**:

- **debug/elf**: 新增 `PT_RISCV_ATTRIBUTES` 和 `SHT_RISCV_ATTRIBUTES` 常量用于 RISC-V ELF 解析。

**代码分析和编译**:

- **go/ast**: `FilterPackage`、`PackageExports` 和 `MergePackageFiles` 函数已弃用。新增 `PreorderStack` 函数，提供 AST 遍历和节点堆栈。

- **go/parser**: `ParseDir` 函数已弃用。

- **go/token**: 新增 `FileSet.AddExistingFiles` 方法，可向 FileSet 添加现有 File，或为任意 File 集合构造 FileSet。

- **go/types**: `Var` 新增 `Kind` 方法用于分类变量（包级、接收器、参数、结果、局部变量或结构字段）。新增 `LookupSelection` 函数，类似 `LookupFieldOrMethod` 但返回 `Selection` 形式的结果。

**哈希和日志**:

- **hash**: 新增 `XOF` 接口用于实现可扩展输出函数（如 SHAKE）。所有标准库 Hash 实现现都实现 `Cloner` 接口，可通过该接口获得 Hash 状态的拷贝。

- **hash/maphash**: 新增 `Hash.Clone` 方法实现 `hash.Cloner` 接口。

- **log/slog**: 新增 `GroupAttrs` 函数从 Attr 切片创建组 Attr。`Record` 新增 `Source` 方法返回源位置或 nil。

**MIME 和网络**:

- **mime/multipart**: 新增 `FileContentDisposition` 辅助函数用于构建 multipart Content-Disposition 头字段。

- **net**: `LookupMX` 和 `Resolver.LookupMX` 现在返回看起来像有效 IP 地址的 DNS 名称以及有效域名（根据规范之前会丢弃 IP 地址，但实际中某些名称服务器会返回 IP 地址）。Windows 上 `ListenMulticastUDP` 现支持 IPv6 地址。Windows 上实现了 `FileConn`、`FilePacketConn` 和 `FileListener` 函数用于 os.File 和网络连接的相互转换，同时 `TCPConn`、`UDPConn`、`UnixConn`、`IPConn`、`TCPListener` 和 `UnixListener` 的 `File` 方法也已实现。

- **net/http**: 新增 `CrossOriginProtection` 实现 CSRF 防护，使用现代浏览器 Fetch 元数据，无需 token 或 cookie，支持基于来源和模式的绕过。

**操作系统和文件系统**:

- **io/fs**: 新增 `ReadLinkFS` 接口提供读取符号链接的能力。

- **os**: Windows 上 `NewFile` 现支持为异步 I/O 打开的句柄（`FILE_FLAG_OVERLAPPED`），通过关联到运行时的 I/O 完成端口提供好处。`DirFS` 和 `Root.FS` 实现 `io/fs.ReadLinkFS` 接口。`CopyFS` 支持在复制实现 `io/fs.ReadLinkFS` 的文件系统时复制符号链接。`Root` 新增多个方法：`Chmod`、`Chown`、`Chtimes`、`Lchown`、`Link`、`MkdirAll`、`ReadFile`、`Readlink`、`RemoveAll`、`Rename`、`Symlink`、`WriteFile`。

**反射和模式**:

- **reflect**: 新增 `TypeAssert` 函数用于将 Value 直接转换为给定类型的 Go 值，避免不必要的内存分配。

- **regexp/syntax**: `\p{name}` 和 `\P{name}` 现接受更多名称（Any、ASCII、Assigned、Cn、LC）和 Unicode 类别别名（如 `\p{Letter}` 代表 `\pL`）。遵循 Unicode TR18，现在使用不区分大小写的名称查找。

**运行时和测试**:

- **runtime**: `AddCleanup` 清理函数现并发和并行执行。新增 `SetDefaultGOMAXPROCS` 函数重置为运行时默认值。新增 `checkfinalizers=1` GODEBUG 设置用于诊断 finalizers 和 cleanups 相关问题。

- **runtime/pprof**: mutex 竞争配置文件现在正确指向导致延迟的临界区末尾。`runtimecontentionstacks` GODEBUG 设置已移除。

- **sync**: 新增 `WaitGroup.Go` 方法简化 goroutine 创建和计数。

- **testing**: 新增 `T.Attr`、`B.Attr` 和 `F.Attr` 方法向测试日志发送属性（以 "attr" action 形式出现在 `-json` 标志输出中）。新增 `Output` 方法提供 `io.Writer` 写入测试输出流（与 `TB.Log` 相同但不包括文件和行号）。`AllocsPerRun` 在并行测试运行时现在 panic（此行为帮助捕获这类 bug）。

- **testing/fstest**: `MapFS` 实现 `io/fs.ReadLinkFS` 接口。`TestFS` 验证 `io/fs.ReadLinkFS` 接口功能（如已实现），并不再跟随符号链接以避免无限递归。

**Unicode 和值实习**:

- **unicode**: 新增 `CategoryAliases` 映射提供访问类别别名（如"Letter"代表"L"）。新增 `Cn`（未分配码点）和 `LC`（大小写字母）类别（这些之前虽由 Unicode 定义但在 Go 早期版本中误被省略）。`C` 类别现在包括 `Cn`，包括所有未分配的码点。

- **unique**: 更积极、高效且并行地回收实习值，防止大量唯一值实习时的内存爆炸。`Make` 的值包含 Handle 链时，现在在单个垃圾回收周期内快速收集，无需多个周期。

## 平台支持

### Darwin (macOS)

- Go 1.25 要求 macOS 12 Monterey 或更高版本。对之前版本的支持已停止。

### Windows

- Go 1.25 是包含损坏的 32 位 windows/arm 端口的最后一个版本。它将在 Go 1.26 中移除。

### AMD64

- 在 `GOAMD64=v3` 模式或更高模式下，编译器现在使用融合乘加指令使浮点运算更快更准确。这可能会改变程序生成的精确浮点值。为避免融合，可使用显式的 `float64` 强制转换，如 `float64(a*b)+c`。

### Loong64

- linux/loong64 端口现支持竞态检测器，可使用 `runtime.SetCgoTraceback` 从 C 代码收集回溯信息，支持内部链接模式链接 cgo 程序。

### RISC-V

- linux/riscv64 端口现支持 `plugin` 构建模式。
- `GORISCV64` 环境变量现接受新值 `rva23u64`，用于选择 RVA23U64 用户模式应用配置。

## 兼容性说明

Go 1.25 继续遵循 [Go 1 兼容性承诺](https://go.dev/doc/go1compat)。几乎所有 Go 程序都应继续按预期编译和运行。

### 弃用

以下内容已弃用，计划在未来版本中移除：

- **go/ast**: `FilterPackage`、`PackageExports`、`MergePackageFiles` 函数和 `MergeMode` 类型，仅用于已弃用的 `Object` 和 `Package` 机制。
- **go/parser**: `ParseDir` 函数已弃用。
- **testing/synctest**: 如设置 `GOEXPERIMENT=synctest`，旧 API 仍然存在，但将在 Go 1.26 中移除。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.25 Release Notes](https://go.dev/doc/go1.25)
