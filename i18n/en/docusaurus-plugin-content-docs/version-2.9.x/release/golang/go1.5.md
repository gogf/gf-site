---
title: Go 1.5 (2015-08-19)
sidebar_position: 195
---

Go 1.5 was released in August 2015, a milestone release. In this version, the Go compiler and runtime were completely rewritten in Go (achieving bootstrapping), and a brand new concurrent garbage collector was introduced.

## Major Changes

### Language

- **Map Literal Simplification**: When the key or value type of a Map is known, the type name can be omitted in the literal.

  ```go
  // Before Go 1.5
  m := map[Point]string{
      Point{29.935523, 52.891566}:   "Persepolis",
  }
  // Go 1.5 and later
  m := map[Point]string{
      {29.935523, 52.891566}:   "Persepolis",
  }
  ```

### Toolchain

- **Vendor Support**: The `go` command introduced experimental support for the `vendor` directory. Enabled by setting the environment variable `GO15VENDOREXPERIMENT=1`. When enabled, the `go` command prioritizes looking for dependencies in the `vendor` directory.
- **Internal Packages**: Packages in a directory named `internal` can only be imported by code in the directory tree rooted at the parent of `internal`. This allows library authors to hide implementation details within a project.
- **Trace Tool**: Added the `go tool trace` command for fine-grained program execution tracing and visualization.
- **Go Doc**: Added the `go doc` command (distinct from `godoc`), designed for command-line use, providing a cleaner documentation viewing experience.
- **Build Modes**: `go build` added the `-buildmode` option, supporting building shared libraries and plugins, among other modes.

### Runtime

- **Self-hosting**: Removed all C code; the compiler, linker, and runtime are now written entirely in Go and a small amount of assembly. Building Go 1.5 requires Go 1.4 (or another Go version) installed as a bootstrap compiler.
- **Concurrent Garbage Collection**: The new garbage collector aims to reduce latency. Through concurrent execution and better scheduling, STW (Stop-The-World) pause times are typically under 10 milliseconds, often much lower.
- **GOMAXPROCS**: The default value changed from 1 to the number of available CPU cores. This may change the behavior of some concurrent programs but generally improves performance on multi-core machines.

### Standard Library

- **`flag`**: Improved the output format of `PrintDefaults` to make it more readable.
- **`math/big`**: Added `Float` type, supporting arbitrary-precision floating-point arithmetic.
- **`net`**: On Unix systems, the DNS resolver no longer relies on cgo and defaults to a pure Go implementation (if configuration allows), reducing thread consumption.

## References

For more details, please refer to the official release notes: [Go 1.5 Release Notes](https://go.dev/doc/go1.5)
