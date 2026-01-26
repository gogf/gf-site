---
title: Go 1.7 (2016-08-15)
sidebar_position: 193
---

Go 1.7 was released in August 2016, introducing the `context` package, the SSA compiler backend, and significant improvements to the testing framework.

## Major Changes

### Toolchain

- **Vendor**: Vendor directory support is now enabled by default, no longer requiring `GO15VENDOREXPERIMENT`.

### Runtime

- **SSA Compiler**: A new SSA (Static Single Assignment) compiler backend was enabled for the x86-64 architecture, generating more efficient code and smaller binaries.
  - **Performance**: Generated code typically runs 5-35% faster.
  - **Size**: Binary size typically reduced by 20-30%.
- **Runtime**: GC pause times remain low even with a large number of idle Goroutines.

### Standard Library

- **Context Package**: `golang.org/x/net/context` was moved into the standard library as the `context` package, becoming a core component of Go concurrency patterns. It defines the `Context` type for carrying deadlines, cancellation signals, and other request-scoped values across API boundaries and between processes.
  - **Integration**: Standard library packages like `net`, `net/http`, `os/exec` have been updated to support `Context`.
  - **http.Request**: `http.Request` added `Context()` and `WithContext()` methods.
- **HTTP Tracing**: Added the `net/http/httptrace` package for tracing HTTP request lifecycle events. Users can register callbacks to capture events like DNS resolution, connection establishment, TLS handshake, etc.
- **Reflection**: `reflect.StructOf` allows dynamic construction of struct types at runtime.

### Testing Framework

- **Subtests and Sub-benchmarks**: The `testing` package introduced the `Run` method, allowing the creation of hierarchical tests and benchmarks.

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

  This makes table-driven tests more elegant and allows running specific subtests individually.

## References

For more details, please refer to the official release notes: [Go 1.7 Release Notes](https://go.dev/doc/go1.7)
