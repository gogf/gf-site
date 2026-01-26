---
title: Go 1.21 (2023-08-08)
sidebar_position: 179
---

Go 1.21 was released in August 2023, bringing built-in functions, structured logging, and official support for PGO.

## Major Changes

### Language

- **Built-in Functions**: Added `min`, `max`, and `clear` built-in functions.
  - `min`/`max`: Compute the minimum and maximum values of ordered types.
  - `clear`: Clears a map or slice (sets elements to zero values).
- **Generic Type Inference**: Improved type inference for generic functions, supporting argument inference for partially instantiated functions, etc.
- **Package Initialization Order**: More precisely specified the package initialization order algorithm.

### Toolchain

- **PGO (Profile-guided Optimization)**: PGO is now generally available. Compiling with a production profile (defaulting to `default.pgo`) can significantly improve program performance (typically 2-7%).
- **Backward Compatibility & GODEBUG**: Improved handling of GODEBUG to better manage version compatibility.
- **Go Versioning**: Adopted a new version numbering scheme (e.g., Go 1.21.0) and strengthened version constraints in the `go` directive of `go.mod`.
- **WASI**: Preliminary support for WASI (WebAssembly System Interface) preview1 (`GOOS=wasip1`, `GOARCH=wasm`).

### Standard Library

- **`log/slog`**: Introduced the structured logging package `log/slog`, providing a high-performance, structured logging API.
- **`slices`**: Added `slices` package, providing generic operations for slices (such as `Sort`, `Contains`, `Clone`, `Index`, etc.).
- **`maps`**: Added `maps` package, providing generic operations for maps (such as `Keys`, `Values`, `Clone`, `Copy`, etc.).
- **`cmp`**: Added `cmp` package, defining the `Ordered` constraint and comparison functions.
- **`testing`**: Added `-test.fullpath` option; added `testing.Testing()` function.
- **`context`**: Added `WithoutCancel`, `WithDeadlineCause`, `WithTimeoutCause`, `AfterFunc`, etc.

## References

For more details, please refer to the official release notes: [Go 1.21 Release Notes](https://go.dev/doc/go1.21)
