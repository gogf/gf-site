---
title: Go 1.18 (2022-03-15)
sidebar_position: 182
---

Go 1.18 was released in March 2022 and is one of the most significant releases in the history of the Go language, introducing Generics, Fuzzing, and Workspaces.

## Major Changes

### Language

- **Generics**: Introduced support for parametric polymorphism, allowing functions and data structures to be written for multiple types.
- **Type Parameters**: Functions and type declarations now support type parameters.
- **Constraints**: Interfaces can now define sets of types to be used as type constraints.
- **`any`**: Added the predefined identifier `any` as an alias for `interface{}`.
- **`comparable`**: Added the predefined identifier `comparable`, representing the set of all comparable types.
- **`~` Operator**: Used to represent the underlying type set.

```go
func Min[T constraints.Ordered](x, y T) T {
    if x < y {
        return x
    }
    return y
}
```

### Toolchain

- **Fuzzing**: The `go test` command now has built-in support for fuzzing to help discover bugs in edge cases.

  ```bash
  go test -fuzz=FuzzMyFunc
  ```

- **Workspaces**: Introduced `go.work` files and the `go work` command, supporting a multi-module workspace development mode. This facilitates simultaneous modification of multiple interdependent modules without modifying `go.mod` replace directives.
- **`go get`**: `go get` no longer builds or installs packages (it is now dedicated to managing `go.mod` dependencies). Use `go install` to install executables.
- **`GOAMD64`**: Introduced the `GOAMD64` environment variable, allowing the selection of the AMD64 architecture microarchitecture level (v1-v4) to leverage newer instruction sets for improved performance.

### Performance

- **Performance Improvements**: Significant performance improvements (up to 20%) on Apple M1, ARM64, and PowerPC64 architectures.
- **Compiler**: Compilation speed may be slightly slower (about 15%) due to the introduction of generics, but the execution efficiency of the generated code is unaffected.

### Standard Library

- **`net/netip`**: Added `net/netip` package, defining a new IP address type `Addr`, which is smaller, more efficient, immutable, and supports being used as a map key compared to `net.IP`.
- **`strings` / `bytes`**:
  - Added `Cut` function to simplify string splitting operations.
  - Added `Clone` function to copy strings or byte slices.

  ```go
    before, after, found := strings.Cut("hello,world", ",")
    ```

- **`debug/buildinfo`**: Added package for reading build information embedded in Go binaries (module version, VCS info, build flags, etc.).
- **`sync`**: `Mutex` and `RWMutex` added `TryLock` method.
- **`tls`**: TLS 1.0 and 1.1 are disabled by default for clients.
- **`crypto/x509`**: SHA-1 signed certificates are rejected by default.

## References

For more details, please refer to the official release notes: [Go 1.18 Release Notes](https://go.dev/doc/go1.18)
