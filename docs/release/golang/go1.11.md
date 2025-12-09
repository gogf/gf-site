---
title: Go 1.11 (2018-08-24)
sidebar_position: 189
---

Go 1.11 于 2018 年 8 月发布，这是一个重要的版本，引入了两个重大的实验性功能：**Go Modules**（模块支持）和 **WebAssembly** 支持。

## 主要变化

### 工具链

- **Go Modules (实验性)**: Go 1.11 引入了对模块（Modules）的初步支持，这是一种新的依赖管理系统，旨在替代 `GOPATH`。
  - **go.mod**: 定义模块路径和依赖版本。
  - **GO111MODULE**: 环境变量用于控制模块支持的开启（`off`, `on`, `auto`）。
  - **版本控制**: 支持语义化版本（Semantic Versioning）。
  - **不再依赖 GOPATH**: 允许在 `GOPATH` 之外的目录中进行开发。
- **WebAssembly (实验性)**: Go 1.11 增加了对 WebAssembly (`js/wasm`) 的实验性支持。
  - **GOOS=js GOARCH=wasm**: 编译目标设置为 WebAssembly。
  - **二进制大小**: 生成的 `.wasm` 文件包含 Go 运行时，最小约为 2MB（压缩后 500KB）。
- **调试优化**: 编译器现在为优化后的二进制文件生成更准确的调试信息（变量位置、行号、断点），使得调试发布版二进制文件变得更加可行。
- **DWARF 压缩**: 默认启用 DWARF 调试信息压缩，减小了二进制文件的大小。
- **go run**: 现在允许传递包路径，例如 `go run .` 或 `go run pkg/path`。
- **go vet**: 如果包无法通过类型检查，`go vet` 现在会报告致命错误。

### 运行时

- **稀疏堆 (Sparse Heap)**: 运行时现在使用稀疏堆布局，消除了之前 512GiB 的堆大小限制。这也解决了混合 Go/C 二进制文件或使用 `-race` 时的地址空间冲突问题。
- **macOS/iOS**: 运行时现在使用 `libSystem.dylib` 而不是直接调用内核，提高了未来的兼容性。
- **性能提升**: 编译器优化带来了更好的边界检查消除，更高效的 `append` 操作，以及对 `map` 清除操作（`delete` 循环）的优化。

### 标准库

- **`syscall/js`**: 新增包，支持 WebAssembly。用于 Go 代码与 JavaScript 环境（如浏览器）进行交互。
- **`runtime/trace`**: 新增用户注解 API (`UserTask`, `UserRegion`)，用于在执行跟踪中记录应用层面的信息。
- **`time`**: 支持解析带符号和偏移量的时区（如 `+03`）。
- **`net/http`**: `Transport` 新增 `MaxConnsPerHost` 选项；`Cookie` 支持 `SameSite` 属性。
- **`crypto/tls`**: 支持 RFC 5705 密钥导出。
- **`math/big`**: 针对 `GOARCH=arm64` 的多项性能改进。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.11 Release Notes](https://go.dev/doc/go1.11)
