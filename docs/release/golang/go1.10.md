---
title: Go 1.10 (2018-02-16)
sidebar_position: 190
---

Go 1.10 于 2018 年 2 月 16 日发布。此版本主要关注工具链的改进，特别是引入了构建缓存和测试缓存，显著提升了日常开发的效率。

## 主要变化

### 工具链

- **构建缓存 (Build Cache)**: `go build` 命令现在会维护一个最近构建包的缓存。
  - **机制**：构建系统现在纯粹基于源码内容、构建标志和编译元数据来检测包是否过期，而不再依赖文件修改时间。
  - **效果**：增量构建速度大幅提升。即使切换分支或更改构建标志，也能利用缓存。
  - **配置**：缓存默认存储在系统临时目录中，可以通过 `GOCACHE` 环境变量控制。
- **测试缓存 (Test Cache)**: `go test` 命令现在会缓存成功的测试结果。
  - **机制**：如果测试的可执行文件、命令行参数、环境变量和相关源文件都没有变化，`go test` 会直接输出之前的成功结果（标记为 `(cached)`），而不再重新运行测试。
  - **限制**：仅缓存成功的测试结果。
  - **绕过**：使用 `go test -count=1` 可以强制重新运行测试。
- **Cgo 改进**: Cgo 现在允许 C 代码直接访问 Go 字符串。
  - **`_GoString_`**：在 C 代码中可以使用 `_GoString_` 类型来接收 Go 字符串参数。
  - **函数**：提供了 `_GoStringLen` 和 `_GoStringPtr` 来获取字符串的长度和指针。
- **默认 GOROOT**：如果未设置 `GOROOT`，`go` 工具现在会尝试根据自身可执行文件的路径推导 `GOROOT`，这使得移动 Go 安装目录变得更容易。
- **Test Failfast**：`go test` 新增 `-failfast` 标志，在第一个测试失败后立即停止运行。

### 标准库

- **`strings.Builder`**: 引入了 `strings.Builder` 类型，用于高效地构建字符串。与 `bytes.Buffer` 类似，但 `String()` 方法在返回字符串时不会进行内存拷贝，性能更高。

  ```go
  var b strings.Builder
  b.WriteString("Hello, ")
  b.WriteString("World!")
  s := b.String() // "Hello, World!"
  ```

- **`bytes` 包**：`Fields`, `Split` 等函数返回的切片现在容量等于长度，防止追加操作覆盖原数组数据。
- **`math/round`**：新增 `Round` 和 `RoundToEven` 函数。
- **`encoding/json`**：`Decoder` 新增 `DisallowUnknownFields` 方法，当 JSON 包含未知字段时报错。

### 运行时

- **GOMAXPROCS**：不再有 1024 的上限限制。
- **Unicode**：升级到 Unicode 10.0。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.10 Release Notes](https://go.dev/doc/go1.10)
