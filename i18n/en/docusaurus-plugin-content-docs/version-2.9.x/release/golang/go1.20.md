---
title: Go 1.20 (2023-02-01)
sidebar_position: 180
---

Go 1.20 was released in February 2023, focusing on performance optimization, compiler improvements, and standard library enhancements.

## Major Changes

### Language

- **Slice to Array Conversion**: Support for converting slices directly to arrays (Go 1.17 already supported conversion to array pointers).

  ```go
  s := []int{1, 2, 3}
  a := [3]int(s) // copy
  ```

- **`unsafe` Package**: Added `SliceData`, `String`, and `StringData` functions, providing implementation-independent capabilities for constructing and deconstructing slices/strings.
- **Comparable Constraint**: The `comparable` constraint can now be satisfied by ordinary interfaces, even if the type arguments are not strictly comparable (comparison may panic at runtime).

### Toolchain

- **PGO (Preview)**: Introduced preview support for Profile-guided Optimization (PGO). Using the `-pgo` flag, the compiler can use runtime profile information for specific optimizations (such as more aggressive inlining), improving performance by about 3-4%.
- **`go build -cover`**: Support for collecting code coverage for binaries, not just tests.

  ```bash
  go build -cover -o myapp
  GOCOVERDIR=covdata ./myapp
  ```

- **No Precompiled Standard Library**: `$GOROOT/pkg` no longer stores precompiled archive files for the standard library. Standard library packages are now built and cached on demand like other packages, reducing the size of the Go distribution.
- **`vet` Tool**: Improved detection of loop variable capture (for nested functions) and added detection for time format errors.

### Performance

- **Compiler**: Optimized inlining and bounds check elimination, improving code execution efficiency. Build speed improved by about 10% compared to Go 1.19.
- **Memory Management**: Optimized internal data structures for garbage collection, reducing memory overhead and improving CPU performance.

### Standard Library

- **`errors`**: Support for wrapping multiple errors.
  - `fmt.Errorf` supports multiple `%w`.
  - Added `errors.Join` function for combining multiple errors.
- **`context`**: Added `WithCancelCause` and `Cause`, allowing specific cancellation causes to be passed and retrieved when cancelling a context.
- **`crypto/ecdh`**: Added `crypto/ecdh` package, providing explicit support for NIST curves and Curve25519.
- **`net/http`**:
  - Added `ResponseController` type for accessing extended features of `ResponseWriter` (such as `SetReadDeadline`, `SetWriteDeadline`).
  - `httputil.ReverseProxy` added `Rewrite` hook, replacing `Director`, providing more powerful request rewriting capabilities.
- **`time`**: Added constants `DateTime`, `DateOnly`, `TimeOnly`. Added `Time.Compare` method.

### Platform Support

- **Windows**: Go 1.20 is the last version to support Windows 7, 8, Server 2008, and Server 2012.
- **macOS**: Go 1.20 is the last version to support macOS 10.13 High Sierra and 10.14 Mojave.
- **FreeBSD/RISC-V**: Added experimental support for `GOOS=freebsd`, `GOARCH=riscv64`.

## References

For more details, please refer to the official release notes: [Go 1.20 Release Notes](https://go.dev/doc/go1.20)
