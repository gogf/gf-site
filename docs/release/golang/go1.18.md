---
title: Go 1.18 (2022-03-15)
sidebar_position: 182
---

Go 1.18 版本于 2022 年 3 月发布，是 Go 语言历史上最重要的版本之一，引入了泛型、模糊测试和工作区模式。

## 主要变化

### 语言

- **泛型 (Generics)**: 引入了参数化多态支持，允许编写适用于多种类型的函数和数据结构。
- **Type Parameters**: 函数和类型声明现在支持类型参数。
- **Constraints**: 接口现在可以定义类型集合，用作类型约束。
- **`any`**: 新增预定义标识符 `any`，作为 `interface{}` 的别名。
- **`comparable`**: 新增预定义标识符 `comparable`，表示所有可比较类型的集合。
- **`~` 操作符**: 用于表示底层类型集合。

```go
func Min[T constraints.Ordered](x, y T) T {
    if x < y {
        return x
    }
    return y
}
```

### 工具链

- **Fuzzing (模糊测试)**: `go test` 命令内置了模糊测试支持，帮助发现边缘情况下的 bug。

  ```bash
  go test -fuzz=FuzzMyFunc
  ```

- **Workspaces (工作区)**: 引入 `go.work` 文件和 `go work` 命令，支持多模块工作区开发模式，方便同时修改多个相互依赖的模块，而无需修改 `go.mod` 的 replace 指令。
- **`go get`**: `go get` 不再构建或安装包（现在专用于管理 `go.mod` 依赖）。安装可执行文件应使用 `go install`。
- **`GOAMD64`**: 引入 `GOAMD64` 环境变量，允许选择 AMD64 架构的微架构级别 (v1-v4)，以利用更新的指令集提升性能。

### 性能

- **性能提升**: 在 Apple M1, ARM64 和 PowerPC64 架构上有显著的性能提升（高达 20%）。
- **编译器**: 由于引入泛型，编译速度可能略有下降（约 15%），但生成的代码执行效率不受影响。

### 标准库

- **`net/netip`**: 新增 `net/netip` 包，定义了新的 IP 地址类型 `Addr`，比 `net.IP` 更小、更高效、且不可变，支持作为 map 的 key。
- **`strings` / `bytes`**:
  - 新增 `Cut` 函数，简化字符串分割操作。
  - 新增 `Clone` 函数，用于复制字符串或字节切片。

  ```go
    before, after, found := strings.Cut("hello,world", ",")
    ```

- **`debug/buildinfo`**: 新增包，用于读取嵌入在 Go 二进制文件中的构建信息（模块版本、VCS 信息、构建 flag 等）。
- **`sync`**: `Mutex` 和 `RWMutex` 新增 `TryLock` 方法。
- **`tls`**: 客户端默认禁用 TLS 1.0 和 1.1。
- **`crypto/x509`**: 默认拒绝 SHA-1 签名的证书。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.18 Release Notes](https://go.dev/doc/go1.18)
