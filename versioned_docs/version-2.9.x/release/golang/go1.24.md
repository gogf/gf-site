---
title: Go 1.24 (2025-02-11)
sidebar_position: 176
---

Go 1.24 版本于 2025 年 2 月发布，距离 [Go 1.23](https://go.dev/doc/go1.23) 发布已过去六个月。大多数变化在工具链、运行时和库的实现中。Go 1.24 继续维持 [Go 1 兼容性承诺](https://go.dev/doc/go1compat)。我们预期几乎所有 Go 程序都能继续正常编译和运行。

## 语言变化

Go 1.24 现在完全支持[泛型类型别名](https://go.dev/issue/46477)。类型别名可以像定义类型一样进行参数化。详见[语言规范](https://go.dev/ref/spec#Alias_declarations)。目前该特性可以通过设置 `GOEXPERIMENT=noaliastypeparams` 禁用，但这个设置将在 Go 1.25 中移除。

## 工具链

### Go 命令

- **工具依赖管理**: Go 模块现在可以使用 `go.mod` 中的 `tool` 指令来跟踪可执行依赖项，并通过 `go tool` 命令运行这些工具。这消除了以前使用 "tools.go" 文件的变通方法。更多信息请参阅[文档](https://go.dev/doc/modules/managing-dependencies#tools)。
  - 新增 `go get` 的 `-tool` 标志，用于添加 tool 指令到当前模块。
  - 新增 `tool` 元模式，用于引用当前模块中的所有工具。可以使用 `go get tool` 升级所有工具或使用 `go install tool` 将其安装到 GOBIN 目录。

- **缓存改进**: 由 `go run` 和新的 `go tool` 行为创建的可执行文件现在被缓存在 Go 构建缓存中，使重复执行更快。参见 [#69290](https://go.dev/issue/69290)。

- **JSON 输出**: 
  - `go build` 和 `go install` 命令现在接受 `-json` 标志，以结构化 JSON 格式报告构建输出和失败。详细的报告格式请参阅 `go help buildjson`。
  - `go test -json` 现在以 JSON 格式报告构建输出和失败，与测试结果 JSON 交织。这些通过新的 `Action` 类型进行区分。如果需要恢复文本构建输出，可以设置 [GODEBUG](https://go.dev/doc/godebug) 的 `gotestjsonbuildtext=1`。

- **私有模块认证**: 新增 `GOAUTH` 环境变量，提供灵活的方式来认证私有模块获取。更多信息请参阅 `go help goauth`。

- **版本信息**: `go build` 命令现在根据版本控制系统标签和/或提交在编译的二进制文件中设置主模块的版本。如有未提交的更改，会附加 `+dirty` 后缀。使用 `-buildvcs=false` 标志可以省略版本控制信息。

- **工具链跟踪**: 新增 [GODEBUG](https://go.dev/doc/godebug) 设置 [toolchaintrace=1](https://go.dev/doc/toolchain#select)，用于跟踪 `go` 命令的工具链选择过程。

### Cgo

Cgo 支持新的注解来提高运行时性能：

- `#cgo noescape cFunctionName`: 告诉编译器传递给 C 函数的内存不会逃逸。
- `#cgo nocallback cFunctionName`: 告诉编译器该 C 函数不会调用任何 Go 函数。

更多信息请参阅 [cgo 文档](https://go.dev/pkg/cmd/cgo#hdr-Optimizing_calls_of_C_code)。

Cgo 现在能更好地检测不同文件中 C 函数的多个不兼容声明。例如，如果 `f` 同时声明为 `void f(int)` 和 `void f(double)`，cgo 会报告错误而不是可能为 `f(0)` 生成不正确的调用序列。参见 [#67699](https://go.dev/issue/67699)。

### Objdump

[objdump](https://go.dev/cmd/objdump) 工具现在支持 64 位 LoongArch (`GOARCH=loong64`)、RISC-V (`GOARCH=riscv64`) 和 S390X (`GOARCH=s390x`) 架构的反汇编。

### Vet

- **新的 `tests` 分析器**: 报告测试、模糊测试、基准测试和示例的常见错误，如名称格式错误、签名不正确或文档化非存在标识符的示例。某些这些错误可能导致测试不运行。此分析器在 `go test` 运行的分析器子集中。

- **`printf` 分析器改进**: 现在报告 `fmt.Printf(s)` 形式的调用，其中 `s` 是非常量格式字符串，没有其他参数。这种调用通常是错误的，因为 `s` 的值可能包含 `%` 符号；应该使用 `fmt.Print` 代替。参见 [#60529](https://go.dev/issue/60529)。此检查会在现有代码中产生很多发现，因此只在语言版本（由 go.mod 的 `go` 指令或 `//go:build` 注释指定）至少为 Go 1.24 时应用，以避免在更新到 1.24 工具链时导致持续集成失败。

- **`buildtag` 分析器改进**: 当 `//go:build` 指令中存在无效的 Go [主版本构建约束](https://go.dev/pkg/cmd/go#hdr-Build_constraints)时报告诊断。例如，`//go:build go1.23.1` 指的是点版本；应该使用 `//go:build go1.23` 代替。参见 [#64127](https://go.dev/issue/64127)。

- **`copylock` 分析器改进**: 当三子句 "for" 循环中声明的变量（如 `for i := iter(); done(i); i = next(i) { ... }`）包含 `sync.Locker`（例如 `sync.Mutex`）时报告诊断。[Go 1.22](https://go.dev/doc/go1.22#language) 改变了这些循环的行为，为每次迭代创建一个新变量，从前一次迭代复制该值；对于锁来说，这种复制操作是不安全的。参见 [#66387](https://go.dev/issue/66387)。

### GOCACHEPROG

`cmd/go` 内部二进制和测试缓存机制现在可以由实现 `cmd/go` 工具和由 `GOCACHEPROG` 环境变量命名的子进程之间 JSON 协议的子进程实现。这之前需要 GOEXPERIMENT。有关协议详情，请参阅[文档](https://go.dev/cmd/go/internal/cacheprog)。

## 运行时

运行时进行了多项性能改进，CPU 开销平均降低了 2–3%，具体取决于应用程序。这些改进包括：

- **新的 map 实现**: 基于 [Swiss Tables](https://abseil.io/about/design/swisstables) 的新内置 `map` 实现
- **高效的内存分配**: 更高效的小对象内存分配
- **新的互斥锁实现**: 新的运行时内部互斥锁实现

新的 map 实现和新的互斥锁实现可以分别通过在构建时设置 `GOEXPERIMENT=noswissmap` 和 `GOEXPERIMENT=nospinbitmutex` 禁用。

## 编译器

编译器已经禁止定义新方法的接收器类型为 cgo 生成的类型，但可以通过别名类型绕过该限制。Go 1.24 现在总是报告错误，如果接收器直接或间接（通过别名类型）表示 cgo 生成的类型。

## 链接器

链接器现在在 ELF 平台上默认生成 GNU Build ID（ELF `NT_GNU_BUILD_ID` 笔记），在 macOS 上生成 UUID（Mach-O `LC_UUID` 加载命令）。Build ID 或 UUID 从 Go Build ID 派生。可以通过 `-B none` 链接器标志禁用，或通过 `-B 0xNNNN` 链接器标志用用户指定的十六进制值覆盖。

## Bootstrap

Go 1.24 现在需要 Go 1.22.6 或更高版本来 Bootstrap。预计 Go 1.26 将需要 Go 1.24 或更高版本的点版本来 Bootstrap。

## 标准库

### 目录限制文件系统访问

新增 [os.Root](https://go.dev/pkg/os#Root) 类型，提供在特定目录内执行文件系统操作的能力。

[os.OpenRoot](https://go.dev/pkg/os#OpenRoot) 函数打开一个目录并返回 [os.Root](https://go.dev/pkg/os#Root)。[os.Root](https://go.dev/pkg/os#Root) 上的方法在目录内运行，不允许引用目录外的路径，包括跟踪符号链接到目录外的路径。`os.Root` 上的方法镜像了 `os` 包中的大多数文件系统操作，包括例如 [os.Root.Open](https://go.dev/pkg/os#Root.Open)、[os.Root.Create](https://go.dev/pkg/os#Root.Create)、[os.Root.Mkdir](https://go.dev/pkg/os#Root.Mkdir) 和 [os.Root.Stat](https://go.dev/pkg/os#Root.Stat)。

### 新的基准测试函数

基准可以现在使用更快且不易出错的 [testing.B.Loop](https://go.dev/pkg/testing#B.Loop) 方法执行基准迭代，形式为 `for b.Loop() { ... }` 代替涉及 `b.N` 的典型循环结构，如 `for range b.N`。这提供两个显著优势：

- 基准函数对每个 `-count` 执行一次，因此昂贵的设置和清理步骤只执行一次。
- 函数调用参数和结果保活，防止编译器完全优化掉循环体。

### 改进的 Finalizers

新的 [runtime.AddCleanup](https://go.dev/pkg/runtime#AddCleanup) 函数是一个比 [runtime.SetFinalizer](https://go.dev/pkg/runtime#SetFinalizer) 更灵活、更高效且不易出错的终结机制。`AddCleanup` 附加一个清理函数到对象上，一旦对象不再可达就会运行。然而，与 `SetFinalizer` 不同，多个清理函数可以附加到单个对象，清理函数可以附加到内部指针，当对象形成循环时清理函数通常不会导致泄漏，并且清理函数不会延迟对象或其指向的对象的释放。新代码应优先使用 `AddCleanup` 而不是 `SetFinalizer`。

### 新的 weak 包

新的 [weak](https://go.dev/pkg/weak/) 包提供弱指针支持。

弱指针是一个低级原语，用于启用内存高效结构的创建，例如用于关联值的弱映射、用于 [unique](https://go.dev/pkg/unique/) 包未涵盖的任何内容的规范化映射和各种类型的缓存。为了支持这些用例，此版本还提供 [runtime.AddCleanup](https://go.dev/pkg/runtime/#AddCleanup) 和 [maphash.Comparable](https://go.dev/pkg/maphash/#Comparable)。

### 新的加密包

#### crypto/mlkem

新的 [crypto/mlkem](https://go.dev/pkg/crypto/mlkem/) 包实现 ML-KEM-768 和 ML-KEM-1024。

ML-KEM 是一个后量子密钥交换机制，原称为 Kyber，在 [FIPS 203](https://doi.org/10.6028/NIST.FIPS.203) 中指定。

#### crypto/hkdf、crypto/pbkdf2 和 crypto/sha3

- **crypto/hkdf**: 新的 [crypto/hkdf](https://go.dev/pkg/crypto/hkdf/) 包实现 HMAC-based Extract-and-Expand 密钥导出函数 (HKDF)，定义在 [RFC 5869](https://www.rfc-editor.org/rfc/rfc5869.html) 中。

- **crypto/pbkdf2**: 新的 [crypto/pbkdf2](https://go.dev/pkg/crypto/pbkdf2/) 包实现密码基于密钥导出函数 (PBKDF2)，定义在 [RFC 8018](https://www.rfc-editor.org/rfc/rfc8018.html) 中。

- **crypto/sha3**: 新的 [crypto/sha3](https://go.dev/pkg/crypto/sha3/) 包实现 SHA-3 哈希函数和 SHAKE 及 cSHAKE 可扩展输出函数，定义在 [FIPS 202](http://doi.org/10.6028/NIST.FIPS.202) 中。

这三个包都基于预先存在的 `golang.org/x/crypto/...` 包。

### FIPS 140-3 合规性

此版本包含[一套新的机制以促进 FIPS 140-3 合规性](https://go.dev/doc/security/fips140)。

**Go Cryptographic Module** 是一套内部标准库包，透明地用于实现 FIPS 140-3 批准的算法。应用程序无需更改即可使用 Go Cryptographic Module 用于批准的算法。

- **GOFIPS140**: 新环境变量用于在构建中选择 Go Cryptographic Module 版本。
- **fips140 GODEBUG**: 用于在运行时启用 FIPS 140-3 模式的新 [GODEBUG](https://go.dev/doc/godebug) 设置。

Go 1.24 包含 Go Cryptographic Module 版本 v1.0.0，目前正在与 CMVP 认可实验室进行测试。

### 新的实验性 testing/synctest 包

新的实验性 [testing/synctest](https://go.dev/pkg/testing/synctest/) 包提供对并发代码测试的支持。

- **[synctest.Run](https://go.dev/pkg/testing/synctest/#Run)**: 在隔离的 "气泡" 中启动一组 goroutine。在气泡内，[time](https://go.dev/pkg/time) 包函数在假时钟上运行。
- **[synctest.Wait](https://go.dev/pkg/testing/synctest#Wait)**: 等待当前气泡中的所有 goroutine 阻塞。

`synctest` 包是实验性的，必须通过在构建时设置 `GOEXPERIMENT=synctest` 启用。包 API 在未来版本中可能会更改。更多信息和反馈请参阅 [issue #67434](https://go.dev/issue/67434)。

### 标准库其他重要变化

#### encoding/json

在编组时，结构体字段中带有新的 `omitzero` 选项的字段将在其值为零时被省略。如果字段类型有 `IsZero() bool` 方法，将使用该方法来确定值是否为零。否则，值为零如果它是[其类型的零值](https://go.dev/ref/spec#The_zero_value)。`omitzero` 字段标签比 `omitempty` 更清晰且更不易出错，当意图是省略零值时。特别是，与 `omitempty` 不同，`omitzero` 省略零值 [time.Time](https://go.dev/pkg/time#Time) 值，这是一个常见的摩擦来源。

如果 `omitempty` 和 `omitzero` 都被指定，字段将在值为空或零（或两者）时被省略。

[UnmarshalTypeError.Field](https://go.dev/pkg/encoding/json#UnmarshalTypeError.Field) 现在包括嵌入式结构以提供更详细的错误消息。

#### bytes 和 strings

[bytes](https://go.dev/pkg/bytes) 和 [strings](https://go.dev/pkg/strings) 包添加了几个与迭代器配合使用的函数：

- **Lines**: 返回字节切片/字符串中按换行符分隔的行的迭代器。
- **SplitSeq**: 返回字节切片/字符串的所有子切片/子字符串的迭代器，围绕分隔符拆分。
- **SplitAfterSeq**: 返回字节切片/字符串的子切片/子字符串的迭代器，在分隔符后拆分。
- **FieldsSeq** 和 **FieldsFuncSeq**: 返回字节切片/字符串的子切片/子字符串的迭代器，围绕空格运行或满足谓词的 Unicode 代码点拆分。

#### crypto/aes

[NewCipher](https://go.dev/pkg/crypto/aes#NewCipher) 返回的值不再实现 `NewCTR`、`NewGCM`、`NewCBCEncrypter` 和 `NewCBCDecrypter` 方法。这些方法是未文档化的，不是在所有架构上都可用。相反，[Block](https://go.dev/pkg/crypto/cipher#Block) 值应该直接传递给相关的 [crypto/cipher](https://go.dev/pkg/crypto/cipher/) 函数。目前，`crypto/cipher` 仍然检查 `Block` 值上的那些方法，即使它们不再被标准库使用。

#### crypto/cipher

- **[NewGCMWithRandomNonce](https://go.dev/pkg/crypto/cipher#NewGCMWithRandomNonce)**: 新函数返回一个 [AEAD](https://go.dev/pkg/crypto/cipher#AEAD) 实现 AES-GCM，通过在 Seal 期间生成随机 nonce 并将其前缀到密文。

- **[NewCTR](https://go.dev/pkg/crypto/cipher#NewCTR)**: 与 [crypto/aes](https://go.dev/pkg/crypto/aes/) 一起使用时返回的 [Stream](https://go.dev/pkg/crypto/cipher#Stream) 实现现在在 amd64 和 arm64 上快几倍。

- **弃用**: [NewOFB](https://go.dev/pkg/crypto/cipher#NewOFB)、[NewCFBEncrypter](https://go.dev/pkg/crypto/cipher#NewCFBEncrypter) 和 [NewCFBDecrypter](https://go.dev/pkg/crypto/cipher#NewCFBDecrypter) 现已弃用。OFB 和 CFB 模式未经身份验证，通常启用主动攻击来操纵和恢复明文。建议应用程序改用 [AEAD](https://go.dev/pkg/crypto/cipher#AEAD) 模式。如果需要未经身份验证的 [Stream](https://go.dev/pkg/crypto/cipher#Stream) 模式，请改用 [NewCTR](https://go.dev/pkg/crypto/cipher#NewCTR)。

#### crypto/ecdsa

[PrivateKey.Sign](https://go.dev/pkg/crypto/ecdsa#PrivateKey.Sign) 现在在随机源为 nil 时根据 [RFC 6979](https://www.rfc-editor.org/rfc/rfc6979.html) 生成确定性签名。

#### crypto/rand

- **[Read](https://go.dev/pkg/crypto/rand#Read)**: 函数现在保证不会失败。它将始终返回 `nil` 作为 `error` 结果。如果 `Read` 在从 [Reader](https://go.dev/pkg/crypto/rand#Reader) 读取时遇到错误，程序将不可恢复地崩溃。注意，平台 API 由默认 `Reader` 使用都是文档化为始终成功，所以这个改变应该只影响覆盖 `Reader` 变量的程序。一个例外是 Linux 3.17 之前的内核，其中默认 `Reader` 仍然打开 `/dev/urandom` 并可能失败。

- **Linux 6.11+ 优化**: 在 Linux 6.11 及更高版本上，`Reader` 现在通过 vDSO 使用 `getrandom` 系统调用。这快几倍，特别是对于小读取。

- **OpenBSD 优化**: 在 OpenBSD 上，`Reader` 现在使用 `arc4random_buf(3)`。

- **[Text](https://go.dev/pkg/crypto/rand#Text)**: 新函数可用于生成密码安全的随机文本字符串。

#### crypto/rsa

- **密钥大小限制**: [GenerateKey](https://go.dev/pkg/crypto/rsa#GenerateKey) 现在在请求少于 1024 位的密钥时返回错误。所有 Sign、Verify、Encrypt 和 Decrypt 方法现在在用小于 1024 位的密钥时返回错误。这样的密钥是不安全的，不应该使用。[GODEBUG 设置](https://go.dev/doc/godebug) `rsa1024min=0` 恢复旧行为，但我们建议仅在必要时和仅在测试中这样做，例如通过向测试文件添加 `//go:debug rsa1024min=0` 行。新的 GenerateKey [例子](https://go.dev/pkg/crypto/rsa#example-GenerateKey-TestKey)提供一个易于使用的标准 2048 位测试密钥。

- **Precompute 改进**: 现在可以在 [PrivateKey.Validate](https://go.dev/pkg/crypto/rsa#PrivateKey.Validate) 之前安全且更高效地调用 [PrivateKey.Precompute](https://go.dev/pkg/crypto/rsa#PrivateKey.Precompute)。当从 JSON 解编时，`Precompute` 现在在部分填充的 [PrecomputedValues](https://go.dev/pkg/crypto/rsa#PrecomputedValues) 存在时更快。

- **密钥验证增强**: 包现在拒绝更多无效密钥，即使不调用 `Validate`，并且 [GenerateKey](https://go.dev/pkg/crypto/rsa#GenerateKey) 可能对断裂的随机源返回新错误。[PrivateKey](https://go.dev/pkg/crypto/rsa#PrivateKey) 的 [Primes](https://go.dev/pkg/crypto/rsa#PrivateKey.Primes) 和 [Precomputed](https://go.dev/pkg/crypto/rsa#PrivateKey.Precomputed) 字段现在被使用和验证，即使某些值丢失。另见下面描述的对 `crypto/x509` 解析和编组 RSA 密钥的改变。

- **签名算法扩展**: [SignPKCS1v15](https://go.dev/pkg/crypto/rsa#SignPKCS1v15) 和 [VerifyPKCS1v15](https://go.dev/pkg/crypto/rsa#VerifyPKCS1v15) 现在支持 SHA-512/224、SHA-512/256 和 SHA-3。

- **私有指数生成**: [GenerateKey](https://go.dev/pkg/crypto/rsa#GenerateKey) 现在使用略微不同的方法来生成私有指数（卡迈克尔的欧拉函数而不是欧拉的欧拉函数）。仅从质因数外部重新生成密钥的罕见应用可能产生不同但兼容的结果。

- **wasm 性能**: 公钥和私钥操作现在在 wasm 上快两倍。

#### crypto/tls

- **加密客户端 Hello (ECH)**: TLS 服务器现在支持加密客户端 Hello。此功能可以通过填充 [Config.EncryptedClientHelloKeys](https://go.dev/pkg/crypto/tls#Config.EncryptedClientHelloKeys) 字段启用。

- **后量子密钥交换**: 新的后量子 [X25519MLKEM768](https://go.dev/pkg/crypto/tls#X25519MLKEM768) 密钥交换机制现在被支持并在 [Config.CurvePreferences](https://go.dev/pkg/crypto/tls#Config.CurvePreferences) 为 nil 时默认启用。[GODEBUG 设置](https://go.dev/doc/godebug) `tlsmlkem=0` 恢复默认。在处理对大记录处理不当的有缺陷 TLS 服务器时这可能很有用，导致握手期间超时（参见 [TLS post-quantum TL;DR fail](https://tldr.fail/)）。

- **移除实验特性**: 移除了对实验性 `X25519Kyber768Draft00` 密钥交换的支持。

- **密钥交换排序**: 密钥交换排序现在完全由 `crypto/tls` 包处理。[Config.CurvePreferences](https://go.dev/pkg/crypto/tls#Config.CurvePreferences) 的顺序现在被忽略，内容仅用于在填充字段时确定哪些密钥交换启用。

- **客户端 Hello 扩展**: 新的 [ClientHelloInfo.Extensions](https://go.dev/pkg/crypto/tls#ClientHelloInfo.Extensions) 字段列出客户端 Hello 消息中接收的扩展 ID。这对于指纹识别 TLS 客户端可能很有用。

#### crypto/x509

- **移除 SHA-1 支持**: `x509sha1` [GODEBUG 设置](https://go.dev/doc/godebug)已被移除。[Certificate.Verify](https://go.dev/pkg/crypto/x509#Certificate.Verify) 不再支持基于 SHA-1 的签名。

- **接口实现**: [OID](https://go.dev/pkg/crypto/x509#OID) 现在实现 [encoding.BinaryAppender](https://go.dev/pkg/encoding#BinaryAppender) 和 [encoding.TextAppender](https://go.dev/pkg/encoding#TextAppender) 接口。

- **证书策略**: 默认证书策略字段已从 [Certificate.PolicyIdentifiers](https://go.dev/pkg/crypto/x509#Certificate.PolicyIdentifiers) 更改为 [Certificate.Policies](https://go.dev/pkg/crypto/x509#Certificate.Policies)。解析证书时，两个字段都将被填充，但创建证书时策略现在将从 `Certificate.Policies` 字段而不是 `Certificate.PolicyIdentifiers` 字段获取。此改变可以用 [GODEBUG 设置](https://go.dev/doc/godebug) `x509usepolicies=0` 恢复。

- **序列号生成**: [CreateCertificate](https://go.dev/pkg/crypto/x509#CreateCertificate) 现在在传递一个 nil [Certificate.SerialNumber](https://go.dev/pkg/crypto/x509#Certificate.SerialNumber) 字段的模板时使用符合 RFC 5280 的方法生成序列号，而不是失败。

- **策略验证**: [Certificate.Verify](https://go.dev/pkg/crypto/x509#Certificate.Verify) 现在支持策略验证，定义在 RFC 5280 和 RFC 9618 中。新的 [VerifyOptions.CertificatePolicies](https://go.dev/pkg/crypto/x509#VerifyOptions.CertificatePolicies) 字段可以设置为可接受的策略 [OID](https://go.dev/pkg/crypto/x509#OID) 集合。只有具有有效策略图的证书链将从 [Certificate.Verify](https://go.dev/pkg/crypto/x509#Certificate.Verify) 返回。

- **密钥编组改进**: [MarshalPKCS8PrivateKey](https://go.dev/pkg/crypto/x509#MarshalPKCS8PrivateKey) 现在在编组无效 RSA 密钥时返回错误而不是进行编组。（[MarshalPKCS1PrivateKey](https://go.dev/pkg/crypto/x509#MarshalPKCS1PrivateKey) 没有错误返回，其在给定无效密钥时的行为继续未定义。）

- **密钥解析改进**: [ParsePKCS1PrivateKey](https://go.dev/pkg/crypto/x509#ParsePKCS1PrivateKey) 和 [ParsePKCS8PrivateKey](https://go.dev/pkg/crypto/x509#ParsePKCS8PrivateKey) 现在使用和验证编码的 CRT 值，因此可能拒绝之前接受的无效 RSA 密钥。使用 [GODEBUG 设置](https://go.dev/doc/godebug) `x509rsacrt=0` 恢复为重新计算 CRT 值。

#### debug/elf

[debug/elf](https://go.dev/pkg/debug/elf) 包添加了对处理动态 ELF（可执行和可链接格式）文件中符号版本的支持。

- 新的 [File.DynamicVersions](https://go.dev/pkg/debug/elf#File.DynamicVersions) 方法返回在 ELF 文件中定义的动态版本列表。
- 新的 [File.DynamicVersionNeeds](https://go.dev/pkg/debug/elf#File.DynamicVersionNeeds) 方法返回此 ELF 文件所需的、在其他 ELF 对象中定义的动态版本列表。
- 新的 [Symbol.HasVersion](https://go.dev/pkg/debug/elf#Symbol) 和 [Symbol.VersionIndex](https://go.dev/pkg/debug/elf#Symbol) 字段表示符号的版本。

#### encoding

两个新接口 [TextAppender](https://go.dev/pkg/encoding#TextAppender) 和 [BinaryAppender](https://go.dev/pkg/encoding#BinaryAppender) 已被引入以附加对象的文本或二进制表示到字节切片。这些接口提供与 [TextMarshaler](https://go.dev/pkg/encoding#TextMarshaler) 和 [BinaryMarshaler](https://go.dev/pkg/encoding#BinaryMarshaler) 相同的功能，但不是每次分配新切片，它们直接附加数据到现有切片。这些接口现在由已经实现 `TextMarshaler` 和/或 `BinaryMarshaler` 的标准库类型实现。

#### go/types

所有 `go/types` 数据结构现在公开使用一对方法如 `Len() int` 和 `At(int) T` 的序列，现在也有返回迭代器的方法，允许你简化代码：

```go
// 旧方式
params := fn.Type.(*types.Signature).Params()
for i := 0; i < params.Len(); i++ {
   use(params.At(i))
}

// 新方式
for param := range fn.Signature().Params().Variables() {
   use(param)
}
```

这些方法包括：[Interface.EmbeddedTypes](https://go.dev/pkg/go/types#Interface.EmbeddedTypes)、[Interface.ExplicitMethods](https://go.dev/pkg/go/types#Interface.ExplicitMethods)、[Interface.Methods](https://go.dev/pkg/go/types#Interface.Methods)、[MethodSet.Methods](https://go.dev/pkg/go/types#MethodSet.Methods)、[Named.Methods](https://go.dev/pkg/go/types#Named.Methods)、[Scope.Children](https://go.dev/pkg/go/types#Scope.Children)、[Struct.Fields](https://go.dev/pkg/go/types#Struct.Fields)、[Tuple.Variables](https://go.dev/pkg/go/types#Tuple.Variables)、[TypeList.Types](https://go.dev/pkg/go/types#TypeList.Types)、[TypeParamList.TypeParams](https://go.dev/pkg/go/types#TypeParamList.TypeParams) 等。

#### hash 包

以下 hash 包的函数现在实现 [encoding.BinaryAppender](https://go.dev/pkg/encoding#BinaryAppender) 接口：

- [hash/adler32.New](https://go.dev/pkg/hash/adler32#New)
- [hash/crc32.New](https://go.dev/pkg/hash/crc32#New) 和 [hash/crc32.NewIEEE](https://go.dev/pkg/hash/crc32#NewIEEE)
- [hash/crc64.New](https://go.dev/pkg/hash/crc64#New)
- [hash/fnv.New32](https://go.dev/pkg/hash/fnv#New32)、[hash/fnv.New32a](https://go.dev/pkg/hash/fnv#New32a)、[hash/fnv.New64](https://go.dev/pkg/hash/fnv#New64)、[hash/fnv.New64a](https://go.dev/pkg/hash/fnv#New64a)、[hash/fnv.New128](https://go.dev/pkg/hash/fnv#New128) 和 [hash/fnv.New128a](https://go.dev/pkg/hash/fnv#New128a)

#### hash/maphash

新的 [Comparable](https://go.dev/pkg/hash/maphash#Comparable) 和 [WriteComparable](https://go.dev/pkg/hash/maphash#WriteComparable) 函数可以计算任何可比较值的哈希。这使得可以对任何可用作 Go map 键的内容进行哈希处理。

#### log/slog

- 新的 [DiscardHandler](https://go.dev/pkg/log/slog#DiscardHandler) 是一个处理器，从未启用且总是丢弃其输出。
- [Level](https://go.dev/pkg/log/slog#Level) 和 [LevelVar](https://go.dev/pkg/log/slog#LevelVar) 现在实现 [encoding.TextAppender](https://go.dev/pkg/encoding#TextAppender) 接口。

#### math/big

[Float](https://go.dev/pkg/math/big#Float)、[Int](https://go.dev/pkg/math/big#Int) 和 [Rat](https://go.dev/pkg/math/big#Rat) 现在实现 [encoding.TextAppender](https://go.dev/pkg/encoding#TextAppender) 接口。

#### math/rand

对弃用顶级 [Seed](https://go.dev/pkg/math/rand#Seed) 函数的调用不再有任何效果。为了恢复旧行为，使用 [GODEBUG 设置](https://go.dev/doc/godebug) `randseednop=0`。更多背景信息请参阅 [proposal #67273](https://go.dev/issue/67273)。

#### math/rand/v2

[ChaCha8](https://go.dev/pkg/math/rand/v2#ChaCha8) 和 [PCG](https://go.dev/pkg/math/rand/v2#PCG) 现在实现 [encoding.BinaryAppender](https://go.dev/pkg/encoding#BinaryAppender) 接口。

#### net

- **MPTCP 支持**: [ListenConfig](https://go.dev/pkg/net#ListenConfig) 现在在支持的系统上默认使用 MPTCP（目前仅在 Linux 上）。
- **IP 接口**: [IP](https://go.dev/pkg/net#IP) 现在实现 [encoding.TextAppender](https://go.dev/pkg/encoding#TextAppender) 接口。

#### net/http

- **1xx 信息响应处理**: [Transport](https://go.dev/pkg/net/http#Transport) 对请求收到的 1xx 信息响应的限制已改变。之前在接收超过 5 个 1xx 响应后中止请求并返回错误。现在在所有 1xx 响应的总大小超过 [Transport.MaxResponseHeaderBytes](https://go.dev/pkg/net/http#Transport.MaxResponseHeaderBytes) 配置设置时返回错误。此外，当请求有 [net/http/httptrace.ClientTrace.Got1xxResponse](https://go.dev/pkg/net/http/httptrace#ClientTrace.Got1xxResponse) 跟踪钩子时，现在对 1xx 响应总数没有限制。`Got1xxResponse` 钩子可能返回错误以中止请求。

- **HTTP/2 配置**: [Transport](https://go.dev/pkg/net/http#Transport) 和 [Server](https://go.dev/pkg/net/http#Server) 现在有一个 HTTP2 字段，允许配置 HTTP/2 协议设置。

- **协议配置**: 新的 [Server.Protocols](https://go.dev/pkg/net/http#Server.Protocols) 和 [Transport.Protocols](https://go.dev/pkg/net/http#Transport.Protocols) 字段提供了一个简单的方式来配置服务器或客户端使用什么 HTTP 协议。

- **未加密 HTTP/2**: 服务器和客户端可能被配置为支持未加密 HTTP/2 连接。当 [Server.Protocols](https://go.dev/pkg/net/http#Server.Protocols) 包含 UnencryptedHTTP2 时，服务器将接受在未加密端口上的 HTTP/2 连接。服务器可以在同一端口上接受 HTTP/1 和未加密 HTTP/2。当 [Transport.Protocols](https://go.dev/pkg/net/http#Transport.Protocols) 包含 UnencryptedHTTP2 且不包含 HTTP1 时，传输将为 http:// URL 使用未加密 HTTP/2。如果传输被配置为使用 HTTP/1 和未加密 HTTP/2 两者，它将使用 HTTP/1。

- **RFC 9113 支持**: 未加密 HTTP/2 支持使用 "HTTP/2 with Prior Knowledge"（RFC 9113，第 3.3 节）。弃用的 "Upgrade: h2c" 头不被支持。

#### net/netip

[Addr](https://go.dev/pkg/net/netip#Addr)、[AddrPort](https://go.dev/pkg/net/netip#AddrPort) 和 [Prefix](https://go.dev/pkg/net/netip#Prefix) 现在实现 [encoding.BinaryAppender](https://go.dev/pkg/encoding#BinaryAppender) 和 [encoding.TextAppender](https://go.dev/pkg/encoding#TextAppender) 接口。

#### net/url

[URL](https://go.dev/pkg/net/url#URL) 现在也实现 [encoding.BinaryAppender](https://go.dev/pkg/encoding#BinaryAppender) 接口。

#### os/user

- **Windows Nano Server 支持**: 在 Windows 上，[Current](https://go.dev/pkg/os/user#Current) 现在可以在 Windows Nano Server 中使用。实现已更新为避免使用 `NetApi32` 库中的函数，该库在 Nano Server 中不可用。

- **服务账户支持**: 在 Windows 上，[Current](https://go.dev/pkg/os/user#Current)、[Lookup](https://go.dev/pkg/os/user#Lookup) 和 [LookupId](https://go.dev/pkg/os/user#LookupId) 现在支持以下内置服务用户账户：
  - `NT AUTHORITY\SYSTEM`
  - `NT AUTHORITY\LOCAL SERVICE`
  - `NT AUTHORITY\NETWORK SERVICE`

- **性能改进**: 在 Windows 上，[Current](https://go.dev/pkg/os/user#Current) 在当前用户加入缓慢域时已大大加快，这是许多公司用户的常见情况。新实现性能现在以毫秒为单位，相比之下，以前的实现可能需要几秒甚至几分钟才能完成。

- **模拟用户支持**: 在 Windows 上，[Current](https://go.dev/pkg/os/user#Current) 现在在当前线程模拟另一个用户时返回进程所有者用户。以前，它返回错误。

#### regexp

[Regexp](https://go.dev/pkg/regexp#Regexp) 现在实现 [encoding.TextAppender](https://go.dev/pkg/encoding#TextAppender) 接口。

#### runtime

[GOROOT](https://go.dev/pkg/runtime#GOROOT) 函数现已弃用。在新代码中，更倾向于使用系统路径来定位 "go" 二进制，并使用 `go env GOROOT` 来查找其 GOROOT。

#### sync

[sync.Map](https://go.dev/pkg/sync#Map) 的实现已改变，改进性能，特别是对于 map 修改。例如，对不相交的键集合的修改不太可能在较大的映射上争夺，并且不再需要任何加热时间即可从映射实现低竞争负载。

如果你遇到任何问题，在构建时设置 `GOEXPERIMENT=nosynchashtriemap` 以切换回旧实现，并请[提交问题](https://go.dev/issue/new)。

#### testing

- **[T.Context](https://go.dev/pkg/testing#T.Context) 和 [B.Context](https://go.dev/pkg/testing#B.Context)**: 新方法返回在测试完成后和测试清理函数运行之前取消的上下文。

- **[T.Chdir](https://go.dev/pkg/testing#T.Chdir) 和 [B.Chdir](https://go.dev/pkg/testing#B.Chdir)**: 新方法可以在测试或基准期间用于改变工作目录。

#### text/template

模板现在支持 range-over-func 和 range-over-int。

#### time

[Time](https://go.dev/pkg/time#Time) 现在实现 [encoding.BinaryAppender](https://go.dev/pkg/encoding#BinaryAppender) 和 [encoding.TextAppender](https://go.dev/pkg/encoding#TextAppender) 接口。

#### crypto 包

[crypto/sha1.New](https://go.dev/pkg/crypto/sha1#New)、[crypto/sha256.New](https://go.dev/pkg/crypto/sha256#New)、[crypto/sha256.New224](https://go.dev/pkg/crypto/sha256#New224)、[crypto/sha512.New](https://go.dev/pkg/crypto/sha512#New)、[crypto/sha512.New384](https://go.dev/pkg/crypto/sha512#New384)、[crypto/sha512.New512_224](https://go.dev/pkg/crypto/sha512#New512_224) 和 [crypto/sha512.New512_256](https://go.dev/pkg/crypto/sha512#New512_256) 现在也实现 [encoding.BinaryAppender](https://go.dev/pkg/encoding#BinaryAppender) 接口。

#### crypto/subtle

[WithDataIndependentTiming](https://go.dev/pkg/crypto/subtle#WithDataIndependentTiming) 新函数允许用户运行一个函数，其中启用了架构特定特性，确保特定指令是数据值计时不变的。这可用于确保设计为在恒定时间内运行的代码不被 CPU 级别特性优化，使其以可变时间运行。目前，`WithDataIndependentTiming` 在 arm64 上使用 PSTATE.DIT 位，在所有其他架构上都是无操作。[GODEBUG 设置](https://go.dev/doc/godebug) `dataindependenttiming=1` 为整个 Go 程序启用 DIT 模式。

[XORBytes](https://go.dev/pkg/crypto/subtle#XORBytes) 输出必须完全重叠或完全不与输入重叠。以前，行为是未定义的，现在 `XORBytes` 将 panic。

#### archive

`archive/zip` 和 `archive/tar` 中的 `(*Writer).AddFS` 实现现在为空目录写入一个目录头。

## 平台支持

### Linux

Go 1.24 需要 Linux 内核 3.2 或更高版本。正如 [Go 1.23 发布说明](https://go.dev/doc/go1.23#linux) 中宣布的那样。

### macOS (Darwin)

Go 1.24 是最后一个在 macOS 11 Big Sur 上运行的版本。Go 1.25 将需要 macOS 12 Monterey 或更高版本。

### WebAssembly

- **go:wasmexport**: 新增 `go:wasmexport` 编译器指令，允许 Go 程序向 WebAssembly 主机导出函数。

- **WASI Preview 1 reactor/library**: 在 WebAssembly System Interface Preview 1 (`GOOS=wasip1 GOARCH=wasm`) 上，Go 1.24 支持通过指定 `-buildmode=c-shared` 构建标志将 Go 程序构建为 [reactor/library](https://github.com/WebAssembly/WASI/blob/63a46f61052a21bfab75a76558485cf097c0dbba/legacy/application-abi.md#current-unstable-abi)。

- **更多类型支持**: 更多类型现在被允许作为 `go:wasmimport` 和 `go:wasmexport` 函数的参数或返回类型。具体来说，`bool`、`string`、`uintptr` 和指向某些类型的指针现在被允许（详见[文档](https://go.dev/pkg/cmd/compile#hdr-WebAssembly_Directives)），以及 32 位和 64 位整数和浮点类型，以及 `unsafe.Pointer`，这些已经被允许。这些类型也被允许作为 `go:wasmexport` 函数的参数或返回类型。

- **支持文件位置变更**: WebAssembly 支持文件已从 `misc/wasm` 移到 `lib/wasm`。

- **初始内存优化**: 初始内存大小显著减少，特别是对于小型 WebAssembly 应用程序。

### Windows

32 位 windows/arm 端口 (`GOOS=windows GOARCH=arm`) 已标记为损坏。参见 [issue #70705](https://go.dev/issue/70705) 获取详情。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.24 Release Notes](https://go.dev/doc/go1.24)
