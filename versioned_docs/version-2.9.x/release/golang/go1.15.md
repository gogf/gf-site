---
title: Go 1.15 (2020-08-11)
sidebar_position: 185
---

Go 1.15 版本于 2020 年 8 月发布，主要改进了链接器和运行时性能，并对工具链进行了一些优化。

## 主要变化

### 工具链

- **链接器改进**: Go 1.15 对链接器进行了重大改进，显著减少了资源使用并提高了代码的健壮性。
  - **性能提升**: 对于大型 Go 程序，链接速度提高了 20%，内存使用减少了 30%。
  - **二进制大小**: 通过消除未使用的类型元数据，生成的二进制文件大小平均减少了 5%。
- **GOPROXY 增强**: `GOPROXY` 环境变量现在支持跳过返回错误的代理。
  - 使用管道符 `|` 分隔（如 `https://proxy1|https://proxy2`）：如果前一个代理返回任何错误，尝试下一个。
  - 使用逗号 `,` 分隔：仅在返回 404/410 时尝试下一个。
- **GOMODCACHE**: 新增 `GOMODCACHE` 环境变量，允许用户自定义模块缓存的位置（默认为 `$GOPATH/pkg/mod`）。
- **Vet 检查**:
  - **string(int)**: `vet` 现在会对 `string(x)` 形式的转换发出警告，如果 `x` 是整数类型（非 `rune`/`byte`）。建议使用 `string(rune(x))` 或 `strconv.Itoa(x)`。
  - **接口转换**: 检查不可能成功的接口类型断言。

### 运行时

- **小对象分配**: 改进了高核心数下的小对象分配性能，降低了最坏情况下的延迟。
- **Panic 输出**: `panic` 现在可以打印更多类型（如布尔值、复数、整数、字符串）的值，而不仅仅是地址。
- **信号处理**: 在 Unix 系统上，如果程序收到 `SIGSEGV`, `SIGBUS`, `SIGFPE` 且未被处理，现在会可靠地崩溃并打印堆栈跟踪。

### 标准库

- **嵌入式时区数据 (time/tzdata)**: 新增了 `time/tzdata` 包，允许将时区数据库嵌入到程序中。
  - **使用方法**: 导入 `import _ "time/tzdata"` 或使用 `-tags timetzdata` 构建。
  - **作用**: 使程序在没有系统时区数据库的环境中（如某些容器镜像）也能正确处理时区信息。但这会使二进制文件增加约 800 KB。
- **X.509 CommonName 弃用**: `crypto/x509` 包现在默认将 `CommonName` 字段视为过时。
  - **行为变更**: 如果证书中没有 Subject Alternative Names (SANs)，Go 将不再把 `CommonName` 作为主机名进行验证。
  - **临时恢复**: 可以通过设置环境变量 `GODEBUG=x509ignoreCN=0` 来临时恢复旧行为。
- **`testing`**:
  - `t.TempDir()`: 自动创建并清理临时目录。
  - `t.Deadline()`: 获取测试超时的截止时间。
- **`sync`**:
  - `Map.LoadAndDelete`: 原子地加载并删除键值。
- **`net/url`**:
  - `URL.Redacted()`: 返回隐藏了密码的 URL 字符串。
- **`time`**:
  - `Ticker.Reset()`: 允许重置 Ticker 的时间间隔。
- **`database/sql`**:
  - `DB.SetConnMaxIdleTime`: 设置连接在连接池中的最大空闲时间。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.15 Release Notes](https://go.dev/doc/go1.15)
