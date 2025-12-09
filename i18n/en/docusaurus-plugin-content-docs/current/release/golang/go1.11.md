---
title: Go 1.11 (2018-08-24)
sidebar_position: 189
---

Go 1.11 was released in August 2018. This is a significant release that introduces two major experimental features: **Go Modules** (module support) and **WebAssembly** support.

## Major Changes

### Toolchain

- **Go Modules (Experimental)**: Go 1.11 introduces preliminary support for modules, a new dependency management system intended to replace `GOPATH`.
  - **go.mod**: Defines the module path and dependency versions.
  - **GO111MODULE**: Environment variable to control module support (`off`, `on`, `auto`).
  - **Versioning**: Supports Semantic Versioning.
  - **No longer dependent on GOPATH**: Allows development in directories outside of `GOPATH`.
- **WebAssembly (Experimental)**: Go 1.11 adds experimental support for WebAssembly (`js/wasm`).
  - **GOOS=js GOARCH=wasm**: Sets the compilation target to WebAssembly.
  - **Binary Size**: The generated `.wasm` file includes the Go runtime, with a minimum size of about 2MB (500KB compressed).
- **Debugging Optimization**: The compiler now generates more accurate debug information (variable locations, line numbers, breakpoints) for optimized binaries, making debugging release binaries more feasible.
- **DWARF Compression**: DWARF debug information compression is enabled by default, reducing binary size.
- **go run**: Now allows passing package paths, e.g., `go run .` or `go run pkg/path`.
- **go vet**: `go vet` now reports a fatal error if the package fails type checking.

### Runtime

- **Sparse Heap**: The runtime now uses a sparse heap layout, eliminating the previous 512GiB heap size limit. This also resolves address space conflicts when mixing Go/C binaries or using `-race`.
- **macOS/iOS**: The runtime now uses `libSystem.dylib` instead of direct kernel calls, improving future compatibility.
- **Performance Improvements**: Compiler optimizations bring better bounds check elimination, more efficient `append` operations, and optimizations for `map` clearing (`delete` loops).

### Standard Library

- **`syscall/js`**: New package supporting WebAssembly. Used for Go code to interact with JavaScript environments (like browsers).
- **`runtime/trace`**: Added user annotation APIs (`UserTask`, `UserRegion`) to record application-level information in execution traces.
- **`time`**: Supports parsing time zones with signs and offsets (e.g., `+03`).
- **`net/http`**: `Transport` added `MaxConnsPerHost` option; `Cookie` supports `SameSite` attribute.
- **`crypto/tls`**: Supports RFC 5705 key exporters.
- **`math/big`**: Multiple performance improvements for `GOARCH=arm64`.

## References

For more details, please refer to the official release notes: [Go 1.11 Release Notes](https://go.dev/doc/go1.11)
