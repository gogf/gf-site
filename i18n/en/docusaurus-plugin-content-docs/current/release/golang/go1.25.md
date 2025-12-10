---
title: Go 1.25 (2025-08-12)
sidebar_position: 175
---

Go 1.25 brings significant improvements to the toolchain, runtime, and standard library, while maintaining Go 1 compatibility.

## Language Changes

Go 1.25 introduces no language-level changes affecting Go programs. However, the concept of core types has been removed from the [language specification](https://go.dev/ref/spec) in favor of descriptive prose.

## Toolchain

### Go Command

- **ASan Leak Detection**: The `go build -asan` option now defaults to detecting memory leaks at program exit. Memory allocated by C that is not freed and not referenced by other memory will be reported as an error. Disable this feature by setting `ASAN_OPTIONS=detect_leaks=0`.

- **Optimized Tool Dependencies**: The Go distribution now includes fewer prebuilt tool binaries. Core toolchain binaries like the compiler and linker remain included, but other tools are built on demand by `go tool`.

- **ignore Directive**: The new `ignore` directive in `go.mod` specifies directories that the `go` command should ignore. Files in these directories are excluded during package matching but included in module zip files.

- **Enhanced go doc**: The `go doc -http` option starts a documentation server and opens it in a browser window.

- **Improved go version**: The `go version -m -json` option outputs JSON-encoded `runtime/debug.BuildInfo` structures embedded in Go binaries.

- **Module Subdirectory Support**: The `go` command now supports using repository subdirectories as module root paths with `<meta name="go-import" content="root-path vcs repo-url subdir">` syntax.

- **work Package Pattern**: A new `work` package pattern matches all packages in the work module(s).

- **Toolchain Line Removal**: The `go` command no longer adds a toolchain line when updating the `go` line in `go.mod` or `go.work`.

### Vet Tool

New analyzers:

- **waitgroup**: Reports misplaced calls to `sync.WaitGroup.Add`.
- **hostport**: Reports uses of `fmt.Sprintf("%s:%d", host, port)` for constructing addresses for `net.Dial`, suggesting `net.JoinHostPort` instead.

## Runtime

### Container-Aware GOMAXPROCS

- **Linux cgroup Awareness**: On Linux, the runtime considers the CPU bandwidth limit of the cgroup containing the process. If the limit is lower than the number of logical CPUs, `GOMAXPROCS` defaults to the lower limit.

- **Dynamic Updates**: The runtime periodically updates `GOMAXPROCS` when the number of available CPUs or cgroup limits change.

- **Disable Mechanism**: These behaviors are automatically disabled if `GOMAXPROCS` is set explicitly or can be disabled with `containermaxprocs=0` and `updatemaxprocs=0` GODEBUG settings.

### Experimental Garbage Collector

- A new garbage collector is available as an experiment. This design improves performance of marking and scanning small objects through better locality and CPU scalability. Benchmark results vary, but expect 10-40% reduction in garbage collection overhead.

- Enable with `GOEXPERIMENT=greenteagc` at build time.

### Trace Flight Recorder

- The new [runtime/trace.FlightRecorder](https://go.dev/pkg/runtime/trace#FlightRecorder) API provides a lightweight way to capture runtime execution traces by continuously recording into an in-memory ring buffer.

- When a significant event occurs, call `FlightRecorder.WriteTo` to snapshot the last few seconds of the trace to a file.

### Panic Output Change

- When a program exits due to an unhandled panic that was recovered and repanicked, the message no longer repeats the panic text.

Previously: `panic: PANIC [recovered]\n  panic: PANIC`

Now: `panic: PANIC [recovered, repanicked]`

### VMA Names on Linux

- On Linux systems with kernel support for anonymous VMA names, the Go runtime annotates anonymous memory mappings with context about their purpose (e.g., `[anon: Go: heap]`). Can be disabled with `decoratemappings=0` GODEBUG setting.

## Compiler

### nil Pointer Bug Fix

- Fixes a compiler bug from Go 1.21 that incorrectly delayed nil pointer checks. Programs that relied on this bug will now correctly panic.

### DWARF 5 Support

- The compiler and linker now generate debug information using [DWARF version 5](https://dwarfstd.org/dwarf5std.html). This reduces the space required for debugging information and linking time. Can be disabled with `GOEXPERIMENT=nodwarf5`.

### Faster Slices

- The compiler can now allocate slice backing stores on the stack in more situations, improving performance. All new stack allocations can be turned off with `-gcflags=all=-d=variablemakehash=n`.

## Linker

- The linker now accepts a `-funcalign=N` command line option to specify function entry alignment.

## Standard Library

### New testing/synctest Package

- The new [testing/synctest](https://go.dev/pkg/testing/synctest) package provides support for testing concurrent code.

- The [Test](https://go.dev/pkg/testing/synctest#Test) function runs tests in an isolated "bubble" with virtualized time.

- The [Wait](https://go.dev/pkg/testing/synctest#Wait) function waits for all goroutines in the current bubble to block.

This package was first available in Go 1.24 under `GOEXPERIMENT=synctest`. The experiment has now graduated to general availability.

### New Experimental encoding/json/v2 Package

- Go 1.25 includes a new experimental JSON implementation, enabled by setting `GOEXPERIMENT=jsonv2` at build time.

- Two new packages are available:
  - [encoding/json/v2](https://go.dev/pkg/encoding/json/v2): A major revision of the `encoding/json` package.
  - [encoding/json/jsontext](https://go.dev/pkg/encoding/json/jsontext): Lower-level JSON syntax processing.

- The new implementation performs substantially better than the existing one under many scenarios. Decoding is substantially faster.

### Other Standard Library Improvements

- **archive/tar**: `Writer.AddFS` now supports symbolic links for filesystems implementing `io/fs.ReadLinkFS`.

- **crypto**: New `MessageSigner` interface and `SignMessage` function for signers that hash messages themselves.

- **crypto/ecdsa**: New low-level encoding functions: `ParseRawPrivateKey`, `ParseUncompressedPublicKey`, `PrivateKey.Bytes`, and `PublicKey.Bytes`. FIPS 140-3 signing is now 4x faster.

- **crypto/ed25519**: FIPS 140-3 signing is now 4x faster.

- **crypto/rsa**: Key generation is now 3x faster.

- **crypto/sha1**: Hashing is now 2x faster on amd64 with SHA-NI instructions.

- **crypto/sha3**: Hashing is now 2x faster on Apple M processors. New `SHA3.Clone` method.

- **crypto/tls**: New `ConnectionState.CurveID` field and `Config.GetEncryptedClientHelloKeys` callback. SHA-1 signatures are now disallowed in TLS 1.2 (can be re-enabled with `tlssha1=1`).

- **crypto/x509**: Support for `crypto.MessageSigner` interface. `CreateCertificate` now uses truncated SHA-256 for `SubjectKeyId`.

- **go/ast**: New `PreorderStack` function for AST traversal with node stack.

- **go/token**: New `FileSet.AddExistingFiles` method.

- **go/types**: `Var` now has a `Kind` method. New `LookupSelection` function.

- **hash**: New `XOF` interface for extendable output functions. All standard library Hash implementations now implement `Cloner`.

- **io/fs**: New `ReadLinkFS` interface for reading symbolic links.

- **net**: `LookupMX` now returns DNS names that look like IP addresses. Windows `ListenMulticastUDP` now supports IPv6. Windows now implements `FileConn`, `FilePacketConn`, and `FileListener`.

- **net/http**: New `CrossOriginProtection` implements CSRF protections using Fetch metadata.

- **os**: Windows `NewFile` now supports asynchronous I/O handles. `DirFS` and `Root.FS` implement `io/fs.ReadLinkFS`. `Root` has new methods for file operations.

- **reflect**: New `TypeAssert` function for direct type assertions without allocations.

- **regexp/syntax**: `\p{name}` and `\P{name}` now accept more names and case-insensitive lookups.

- **runtime**: `AddCleanup` cleanup functions are now executed concurrently and in parallel. New `SetDefaultGOMAXPROCS` function. New `checkfinalizers=1` GODEBUG setting for diagnostics.

- **sync**: New `WaitGroup.Go` method simplifies goroutine creation and counting.

- **testing**: New `T.Attr`, `B.Attr`, and `F.Attr` methods for emitting test attributes. New `Output` method. `AllocsPerRun` now panics if parallel tests are running.

- **unique**: More eager, efficient, and parallel value reclamation.

### Platform Support

#### Darwin (macOS)

- Go 1.25 requires macOS 12 Monterey or later. Support for previous versions is discontinued.

#### Windows

- Go 1.25 is the last release containing the broken 32-bit windows/arm port. It will be removed in Go 1.26.

#### AMD64

- In `GOAMD64=v3` mode or higher, the compiler now uses fused multiply-add instructions for faster and more accurate floating-point arithmetic.

#### Loong64

- The linux/loong64 port now supports the race detector, cgo traceback, and internal linking mode.

#### RISC-V

- The linux/riscv64 port now supports the `plugin` build mode.
- The `GORISCV64` environment variable accepts a new value `rva23u64` for the RVA23U64 user-mode profile.

## References

For more details, see the official release notes: [Go 1.25 Release Notes](https://go.dev/doc/go1.25)
