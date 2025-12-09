---
title: Go 1.7 (2016-08-15)
sidebar_position: 193
---

Go 1.7 于 2016 年 8 月发布，引入了 `context` 包、SSA 编译器后端以及测试框架的重大改进。

## 主要变化

### 标准库

- **Context 包**: `golang.org/x/net/context` 被移入标准库 `context` 包，成为 Go 并发模式的核心组件。它定义了 `Context` 类型，用于在 API 边界和进程之间传递截止日期、取消信号和其他请求范围的值。
  - **集成**: `net`, `net/http`, `os/exec` 等标准库包已更新以支持 `Context`。
  - **http.Request**: `http.Request` 增加了 `Context()` 和 `WithContext()` 方法。
- **HTTP Tracing**: 新增 `net/http/httptrace` 包，用于跟踪 HTTP 请求的生命周期事件。用户可以注册回调函数来捕获如 DNS 解析、连接建立、TLS 握手等事件。
- **反射**: `reflect.StructOf` 允许在运行时动态构造结构体类型。

### 编译器与运行时

- **SSA 编译器**: x86-64 架构启用了全新的 SSA（静态单赋值）编译器后端，生成的代码更高效，二进制文件更小。
  - **性能**: 生成的代码通常运行速度提高 5-35%。
  - **体积**: 二进制文件大小通常减少 20-30%。
- **运行时**: 即使在大量空闲 Goroutine 的情况下，GC 停顿时间也保持在低水平。

### 测试框架

- **子测试与子基准测试**: `testing` 包引入了 `Run` 方法，允许创建层级化的测试和基准测试。

  ```go
  func TestFoo(t *testing.T) {
      t.Run("SubTest1", func(t *testing.T) {
          // ...
      })
      t.Run("SubTest2", func(t *testing.T) {
          // ...
      })
  }
  ```

  这使得表驱动测试更加优雅，并且可以单独运行特定的子测试。

### 工具链

- **Vendor**: Vendor 目录支持现在默认启用，不再需要设置 `GO15VENDOREXPERIMENT`。

## 参考资源

更多详细信息请参考官方发布说明：[Go 1.7 Release Notes](https://go.dev/doc/go1.7)
