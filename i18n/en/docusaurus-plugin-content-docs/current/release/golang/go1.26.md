---
title: Go 1.26 (2026-02-10)
sidebar_position: 174
---

Go 1.26 brings significant improvements to the toolchain, runtime, and standard library, while maintaining Go 1 compatibility. We expect almost all Go programs to continue to compile and run as before.

## Language Changes

### Enhanced `new` Function

The built-in `new` function now allows its operand to be an expression specifying an initial value for the variable. This is particularly useful when working with serialization packages such as `encoding/json` or protocol buffers, simplifying assignment of optional fields.

Previously:

```go
v := "hello"
field := &v
```

Now:

```go
field := new("hello")
```

### Self-Referential Generic Types

Generic types can now reference themselves in their type parameter lists. This enables more powerful type constraints, for example:

```go
type Adder[A Adder[A]] interface {
    Add(A) A
}
```

## Toolchain

### Go Command

- **Revamped `go fix`**: The `go fix` command has been completely rewritten as a collection of Go modernization tools. Built on the `go vet` analysis framework, it provides automated code updates to leverage the latest language features and library APIs.

- **`go mod init` Default Version Change**: Newly created `go.mod` files now default to a Go version one minor version below the toolchain version (e.g., Go 1.26 toolchain creates modules with `go 1.25.0`) to encourage module compatibility.

- **Documentation Tool Removal**: `cmd/doc` and `go tool doc` have been removed. Use `go doc` instead.

### Pprof

The Web UI (enabled via `-http`) now defaults to the flame graph view. The previous graph view is still accessible from the menu.

## Runtime

### Green Tea GC Enabled by Default

The Green Tea garbage collector, previously experimental in Go 1.25, is now the default.

- **Performance Improvements**: Improved marking and scanning performance for small objects through better locality and CPU scalability. Expect a 10–40% reduction in GC overhead for real-world programs, with an additional ~10% reduction on newer AMD64 platforms (`Intel Ice Lake` or `AMD Zen 4` and later) through vector instructions.
- **Disabling**: Can be disabled with `GOEXPERIMENT=nogreenteagc`, but this option is expected to be removed in Go 1.27.

### Faster CGO Calls

The base runtime overhead of `cgo` calls has been reduced by approximately 30%.

### Heap Base Randomization

On 64-bit platforms, the runtime now randomizes the heap base address at startup to enhance security, making it harder for attackers to predict memory addresses. Can be disabled with `GOEXPERIMENT=norandomizedheapbase64`.

### Experimental Goroutine Leak Detection

A new `goroutineleak` profile type is introduced (enabled via `GOEXPERIMENT=goroutineleakprofile`). It detects goroutines that can never be woken up because they are blocked on unreachable concurrency primitives (such as channels or mutexes). Default enablement is planned for Go 1.27.

## Compiler

### Slice Stack Allocation Optimization

The compiler can now allocate slice backing stores on the stack in even more situations, improving performance.

## Linker

- **Windows ARM64 Internal Linking**: On the `windows/arm64` port, the linker now supports internal linking mode for `cgo` programs.
- **Executable Format Changes**: Several binary details have been modified, including `moduledata`, `pcHeader`, symbols, and ELF section header ordering. This primarily affects tools that analyze Go executables or use custom linker scripts.

## Bootstrap

Go 1.26 now requires Go 1.24.6 or later to bootstrap.

## Standard Library

### New Packages

#### crypto/hpke

The new [crypto/hpke](https://go.dev/pkg/crypto/hpke/) package implements [RFC 9180](https://www.rfc-editor.org/rfc/rfc9180.html) Hybrid Public Key Encryption (HPKE), with support for post-quantum hybrid KEMs.

#### Experimental simd/archsimd

Enabled via `GOEXPERIMENT=simd`, the new `simd/archsimd` package provides architecture-specific SIMD operations (currently supporting `amd64`).

#### Experimental runtime/secret

Enabled via `GOEXPERIMENT=runtimesecret`, the new `runtime/secret` package provides secure erasure of sensitive information (registers, stack, heap allocations) to promote forward secrecy.

### Cryptographic Randomness Improvements

Multiple cryptographic packages (`crypto/dsa`, `crypto/ecdh`, `crypto/ecdsa`, `crypto/ed25519`, `crypto/rand`, `crypto/rsa`, etc.) now ignore the passed-in random parameter in `GenerateKey` and related functions, always using a secure cryptographic random source instead. Tests can use the new `testing/cryptotest.SetGlobalRandom`.

### Other Standard Library Changes

**Cryptography and Security**:

- **crypto/tls**: Hybrid `SecP256r1MLKEM768` and `SecP384r1MLKEM1024` post-quantum key exchanges are now enabled by default. Several legacy `GODEBUG` settings (such as `tls10server`, `tls3des`, etc.) are announced for removal in Go 1.27.

**I/O and Logging**:

- **io**: `ReadAll` performance improved with reduced memory allocations, approximately 2x faster.
- **log/slog**: New `NewMultiHandler` allows invoking multiple handlers simultaneously.

**Networking and HTTP**:

- **net/http**: New `HTTP2Config.StrictMaxConcurrentRequests` and `Transport.NewClientConn`. The insecure `ReverseProxy.Director` is now deprecated.

**Operating System**:

- **os**: `OpenFile` on Windows now supports Windows-specific file flags (such as `FILE_FLAG_OVERLAPPED`).

**Reflection and Testing**:

- **reflect**: New iterator methods such as `Type.Fields`, `Value.Fields`, etc., for iterating over struct fields and methods.
- **testing**: New `T.ArtifactDir()` for writing output files (artifacts) during tests.

## Platform Support

### Darwin (macOS)

Go 1.26 is the last release to support macOS 12 Monterey. Go 1.27 will require macOS 13 Ventura or later.

### Windows

The `windows/arm` (32-bit) port has been removed.

### FreeBSD

The `freebsd/riscv64` port has been marked as broken.

### PowerPC

Go 1.26 is the last release to support the ELFv1 ABI on Linux `ppc64` (big-endian). Go 1.27 will switch to ELFv2.

### RISC-V

The `linux/riscv64` port now supports the race detector.

### WebAssembly

The compiler now unconditionally uses sign extension and non-trapping float-to-int conversion instructions, significantly reducing memory footprint for small-heap WebAssembly applications.

## References

For more details, see the official release notes: [Go 1.26 Release Notes](https://go.dev/doc/go1.26)
