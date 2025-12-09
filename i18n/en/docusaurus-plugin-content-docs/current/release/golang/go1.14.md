---
title: Go 1.14 (2020-02-25)
sidebar_position: 186
---

Go 1.14 was released in February 2020, marking that Go Modules are ready for production use, and bringing significant runtime performance improvements.

## Major Changes

### Language

- **Overlapping Interfaces**: Allows embedded interfaces to define overlapping methods. This solves common problems in complex interface embedding structures (such as diamond inheritance).

  ```go
  type ReadWriteCloser interface {
      io.ReadCloser
      io.WriteCloser
  }
  // Even though both ReadCloser and WriteCloser contain the Close() method, this is now legal.
  ```

### Toolchain

- **Modules Production Ready**: The implementation of Go Modules is mature enough that the official recommendation is for all users to use it for dependency management in production environments.
  - **Vendor Behavior**: If the main module contains a `vendor` directory, the `go` command now defaults to using `-mod=vendor`.
  - **GOINSECURE**: Added the `GOINSECURE` environment variable to fetch modules via HTTP without certificate validation (mainly for internal private repositories).

### Runtime

- **Defer Performance**: The overhead of `defer` statements has been drastically reduced and is now almost negligible. Developers can confidently use `defer` for resource cleanup in performance-sensitive code.
- **Goroutine Asynchronous Preemption**: Implemented signal-based asynchronous preemption scheduling. This means tight loops (e.g., `for` loops without any function calls) will no longer block the GC or scheduler, greatly reducing STW (Stop-The-World) latency and avoiding potential deadlocks.
- **Timer Efficiency**: More efficient internal timer implementation, reducing lock contention and context switching.

### Standard Library

- **`hash/maphash`**: Added `hash/maphash` package, providing high-performance hash functions for hash tables (Note: generated hash values are not consistent across processes and should not be persisted).
- **`testing`**:
  - `T.Cleanup` / `B.Cleanup`: Register cleanup functions to be executed after the test or benchmark finishes (similar to `defer`, but more flexible).
- **`math`**:
  - `math.FMA`: Added Fused Multiply-Add (x*y+z) operation, utilizing hardware instructions to improve precision and performance.
- **`sync`**:
  - `Mutex`: Improved `Mutex` performance under high contention by directly yielding the CPU to waiting Goroutines.
- **TLS**: Removed support for SSLv3. TLS 1.3 can no longer be disabled via `GODEBUG`.
- **HTTP/2**: `net/http`'s test server (`httptest`) now supports HTTP/2.

---

## References

For more details, please refer to the official release notes: [Go 1.14 Release Notes](https://go.dev/doc/go1.14)
