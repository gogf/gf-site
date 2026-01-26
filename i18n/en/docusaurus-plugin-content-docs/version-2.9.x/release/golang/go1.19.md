---
title: Go 1.19 (2022-08-02)
sidebar_position: 181
---

Go 1.19 was released in August 2022, mainly refining generics support, improving doc comments, and introducing important memory management features.

## Major Changes

### Language

- **Memory Model**: Updated the Go memory model documentation to clarify the behavior of atomic operations, aligning with the memory models of C++20, Java, Rust, etc. Go only provides sequentially consistent atomic operations.
- **Generics**: Fixed some bugs and limitations related to generics found in Go 1.18. Made a minor correction to the scope of type parameters in method declarations.

### Toolchain

- **Doc Comments**: Supports richer doc comment formats, including headings, lists, and links. `gofmt` now reformats doc comments.

  ```go
  // Package json implements encoding and decoding of JSON as defined in
  // [RFC 7159].
  ```

- **Build Constraints**: Added the `unix` build constraint, which is satisfied when `GOOS` is a Unix-like system (such as linux, darwin, freebsd, etc.).
- **Go Command**: Build information injected by `go build` now includes the `-trimpath` flag (if set).

### Runtime

- **GC Soft Memory Limit**: Introduced the `GOMEMLIMIT` environment variable and `runtime/debug.SetMemoryLimit` function, allowing a soft memory limit to be set. This helps the GC better utilize available memory and avoid OOM, especially in container environments.
- **Dynamic Stack Sizing**: Improved the initial stack sizing strategy for goroutines, allocating based on historical average usage to reduce stack copying and expansion overhead.
- **File Descriptor Limit**: On Unix systems, importing the `os` package automatically raises the soft limit on open file descriptors to the maximum of the hard limit.

### Standard Library

- **`sync/atomic`**: Added typed atomic types (`Bool`, `Int32`, `Int64`, `Uint32`, `Uint64`, `Uintptr`, `Pointer`), making them more convenient and safe to use, avoiding manual `unsafe.Pointer` conversions.
- **`net/url`**: Introduced `JoinPath` function and `URL.JoinPath` method for safely joining URL paths.
- **`os/exec`**: `Command` and `LookPath` no longer look for executables in the current directory by default (for security). Added `Cmd.Environ` method.
- **`sort`**: Sorting algorithm rewritten to pattern-defeating quicksort, which is faster in many scenarios. Added `Find` function.
- **`time`**: Added `Duration.Abs` to get the absolute value, and `Time.ZoneBounds` to get the time zone bounds.
- **`fmt`**: Added `Append`, `Appendf`, `Appendln` functions to append formatted data to a byte slice.
- **`flag`**: Added `TextVar` function, allowing flags to bind to custom types implementing the `encoding.TextUnmarshaler` interface.

### Platform Support

- **LoongArch**: Added support for LoongArch 64-bit (`linux/loong64`).
- **RISC-V**: The `riscv64` port now supports passing function arguments and results via registers, improving performance by about 10%.

## References

For more details, please refer to the official release notes: [Go 1.19 Release Notes](https://go.dev/doc/go1.19)
