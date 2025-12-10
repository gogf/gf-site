---
title: Go 1.10 (2018-02-16)
sidebar_position: 190
---

Go 1.10 was released on February 16, 2018. This release focuses on toolchain improvements, specifically introducing build caching and test caching, which significantly improve daily development efficiency.

## Major Changes

### Toolchain

- **Build Cache**: The `go build` command now maintains a cache of recently built packages.
  - **Mechanism**: The build system now detects if a package is out of date based purely on the content of source files, build flags, and compilation metadata, rather than relying on file modification times.
  - **Effect**: Incremental build speeds are significantly improved. Caching is utilized even when switching branches or changing build flags.
  - **Configuration**: The cache is stored in the system temporary directory by default and can be controlled via the `GOCACHE` environment variable.
- **Test Cache**: The `go test` command now caches successful test results.
  - **Mechanism**: If the test executable, command-line arguments, environment variables, and relevant source files have not changed, `go test` will directly output the previous successful result (marked as `(cached)`) instead of re-running the test.
  - **Limitation**: Only successful test results are cached.
  - **Bypass**: Use `go test -count=1` to force re-running tests.
- **Cgo Improvements**: Cgo now allows C code to directly access Go strings.
  - **`_GoString_`**: The `_GoString_` type can be used in C code to receive Go string arguments.
  - **Functions**: `_GoStringLen` and `_GoStringPtr` are provided to get the string length and pointer.
- **Default GOROOT**: If `GOROOT` is not set, the `go` tool now attempts to deduce `GOROOT` based on the path of its own executable, making it easier to move Go installation directories.
- **Test Failfast**: `go test` added the `-failfast` flag to stop running immediately after the first test failure.

### Runtime

- **GOMAXPROCS**: No longer limited to an upper bound of 1024.
- **Unicode**: Upgraded to Unicode 10.0.

### Standard Library

- **`strings.Builder`**: Introduced the `strings.Builder` type for efficiently building strings. Similar to `bytes.Buffer`, but the `String()` method does not perform memory copying when returning the string, resulting in higher performance.

  ```go
  var b strings.Builder
  b.WriteString("Hello, ")
  b.WriteString("World!")
  s := b.String() // "Hello, World!"
  ```

- **`bytes` Package**: Slices returned by `Fields`, `Split`, etc., now have a capacity equal to their length to prevent append operations from overwriting original array data.
- **`math/round`**: Added `Round` and `RoundToEven` functions.
- **`encoding/json`**: `Decoder` added the `DisallowUnknownFields` method to report an error when JSON contains unknown fields.

## References

For more details, please refer to the official release notes: [Go 1.10 Release Notes](https://go.dev/doc/go1.10)
