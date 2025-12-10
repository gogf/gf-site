---
title: Go 1.24 (2025-02-11)
sidebar_position: 176
---

Go 1.24 includes a significant number of improvements to the toolchain, runtime, and libraries.

## Major Changes

### Language

- **Generic Type Aliases**: Go 1.24 now fully supports [generic type aliases](https://go.dev/issue/46477). Type aliases can be parameterized just like defined types.

### Toolchain

- **Go Command**:
  - **Tool Dependencies**: Go modules can now track executable dependencies using `tool` directives in `go.mod`. This eliminates the previous workaround of using "tools.go" files.
  - **JSON Output**: The `go build` and `go install` commands now accept a `-json` flag to report build output and failures in structured JSON format.
  - **Build Version**: The `go build` command now sets the main module's version in the compiled binary based on version control system tags and/or commits.
- **Cgo**: Supports new annotations `#cgo noescape` and `#cgo nocallback` to improve runtime performance.

### Runtime

- **Performance Improvements**: Several performance improvements have been made to the runtime, reducing average CPU overhead by 2-3%. This includes a new built-in `map` implementation based on [Swiss Tables](https://abseil.io/about/design/swisstables), more efficient memory allocation for small objects, and a new runtime internal mutex implementation.

### Standard Library

- **`os`**: Added `os.Root` type, providing the ability to perform file system operations within a specific directory (directory-scoped file system access).
- **`testing`**:
  - Added `testing.B.Loop` method for faster and less error-prone benchmark loops.
  - Added experimental `testing/synctest` package to support testing of concurrent code (enabled via `GOEXPERIMENT=synctest`).
- **`runtime`**: Added `runtime.AddCleanup` function as a more flexible, efficient, and less error-prone finalization mechanism than `runtime.SetFinalizer`.
- **`weak`**: Added `weak` package providing weak pointer support.
- **`crypto`**:
  - Added `crypto/mlkem` package implementing ML-KEM-768 and ML-KEM-1024 (post-quantum key exchange mechanisms).
  - Added `crypto/hkdf`, `crypto/pbkdf2`, and `crypto/sha3` packages.
  - Introduced a new mechanism to facilitate FIPS 140-3 compliance.
- **`encoding/json`**: Added `omitzero` option to struct field tags, omitting the field if its value is the zero value.
- **`bytes` and `strings`**: Added several functions to work with iterators (such as `Lines`, `SplitSeq`, etc.).

## References

For more details, please refer to the official release notes: [Go 1.24 Release Notes](https://go.dev/doc/go1.24)
