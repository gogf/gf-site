---
title: Go 1.9 (2017-08-24)
sidebar_position: 191
---

Go 1.9 was released on August 24, 2017. This release includes two language changes (type aliases), introduces important new features in the standard library such as `sync.Map` and `math/bits`, and improves `time` package support for monotonic time.

## Major Changes

### Language

- **Type Aliases**: Go 1.9 introduces type alias syntax, primarily to support large-scale code refactoring (such as moving a type from one package to another) and enable smooth transitions.
  - **Syntax**: `type T1 = T2`. Declares `T1` as an alias for `T2`, meaning they denote the **same type**.
  - **Difference**: This is different from a type definition (`type T1 T2`), which creates a new, distinct type.

### Toolchain

- **Parallel Compilation**: The Go compiler now supports parallel compilation of functions **within a package**. This significantly speeds up compilation by utilizing multi-core CPUs. This is an optimization on top of the existing package-level parallel compilation.
- **Test Helper**: The `testing` package introduces the `Helper` method. `t.Helper()` marks the current function as a test helper function. When a test fails and prints logs, Go will skip this function and display the line number of the test code that called the helper function, making it easier to locate issues.
- **`go test -list`**: Added the `-list` flag, which accepts a regular expression and lists matching tests, benchmarks, or examples without running them.
- **`./...` Matching Rule**: The `./...` pattern no longer matches packages in the `vendor` directory. To match the vendor directory, you must explicitly use `./vendor/...`.

### Runtime

- **GC Performance**: Performance of large object allocation is significantly improved, and `runtime.ReadMemStats` latency with large heaps is greatly reduced (< 100µs).

### Standard Library

- **`sync.Map`**: The standard library adds `sync.Map`, a concurrent-safe Map implementation.
  - **Use Case**: Caching scenarios where keys are stable and reads far outnumber writes; or when multiple goroutines read, write, and overwrite entries for disjoint sets of keys.
  - **Features**: Safe for concurrent use without additional locking or coordination.

  ```go
  var m sync.Map
  m.Store("key", "value")
  v, ok := m.Load("key")
  ```

- **Monotonic Time**: The `time` package now transparently supports Monotonic Time.
  - **Improvement**: `Time` values returned by `time.Now()` contain a monotonic clock reading in addition to the wall clock time.
  - **Impact**: Calculating the duration between two time points (`t2.Sub(t1)`) is now always positive and accurate, even if the system time is adjusted (e.g., via NTP synchronization).
- **`math/bits` Package**: Added the `math/bits` package, providing bit manipulation functions for unsigned integers. The compiler treats many functions in this package (such as `Len`, `OnesCount`, `RotateLeft`, etc.) as intrinsics, compiling them directly to underlying CPU instructions for maximum performance.

## References

For more details, please refer to the official release notes: [Go 1.9 Release Notes](https://go.dev/doc/go1.9)
