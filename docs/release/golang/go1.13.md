---
title: Go 1.13 (2019-09-03)
sidebar_position: 187
---

Go 1.13 于 2019 年 9 月发布，改进了数字字面量和错误处理，并对 Modules 机制进行了完善。

## 主要变化

### 语言变化

- **错误处理增强 (Error Wrapping)**: Go 1.13 引入了标准的错误包装机制，使得错误处理更加灵活和强大。
  - **`fmt.Errorf`**: 支持 `%w` 动词，用于包装错误。
  - **`errors` 包新增函数**:
    - `errors.Is(err, target)`: 判断错误链中是否包含特定错误。
    - `errors.As(err, target)`: 将错误链中的某个错误转换为特定类型。
    - `errors.Unwrap(err)`: 解包错误，返回被包装的错误。

  ```go
  if errors.Is(err, os.ErrNotExist) {
      // 处理文件不存在错误
  }
  ```

- **数字字面量改进**:
  - **二进制字面量**: 使用 `0b` 或 `0B` 前缀 (例如 `0b1011`)。
  - **八进制字面量**: 新增 `0o` 或 `0O` 前缀 (例如 `0o660`)，旧的 `0` 前缀仍有效。
  - **十六进制浮点数**: 使用 `0x` 前缀和 `p` 指数 (例如 `0x1.0p-1021`)。
  - **数字分隔符**: 允许在数字字面量中使用下划线 `_` 提高可读性 (例如 `1_000_000`, `3.1415_9265`)。
- **有符号移位计数**: 移位操作符 `<<` 和 `>>` 的右操作数现在可以是任何有符号整数类型，不再局限于无符号整数。

### 工具链

- **GOPROXY 默认值**: `GOPROXY` 环境变量默认设置为 `https://proxy.golang.org,direct`。这意味着 Go 默认使用 Google 维护的模块镜像。
- **GOSUMDB**: 默认启用 `sum.golang.org` 校验和数据库，用于验证模块内容的完整性。
- **GOPRIVATE**: 新增 `GOPRIVATE` 环境变量，用于指定不应通过代理或校验和数据库访问的私有模块路径。
- **go env -w**: `go env` 命令现在支持 `-w` 标志，用于设置并持久化环境变量（例如 `go env -w GOPROXY=direct`）。

### 运行时

- **Panic 信息**: 运行时 panic 消息现在包含导致越界的索引值和切片长度/容量，便于调试。
- **Defer 性能**: `defer` 语句的性能提高了约 30%。
- **sync.Pool**: `sync.Pool` 不再在每次垃圾回收 (GC) 时清除所有对象，而是保留部分对象，从而减少了 GC 后的分配峰值。

### 标准库

- **TLS 1.3**: 默认启用 TLS 1.3。
- **`crypto/ed25519`**: 新增 `crypto/ed25519` 包，实现 Ed25519 签名算法。
- **`time`**: `Duration` 新增 `Microseconds` 和 `Milliseconds` 方法。
- **`os`**: 新增 `UserConfigDir` 函数。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.13 Release Notes](https://go.dev/doc/go1.13)
