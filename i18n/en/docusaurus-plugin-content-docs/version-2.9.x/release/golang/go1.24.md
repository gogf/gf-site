---
title: Go 1.24 (2025-02-11)
sidebar_position: 176
---

Go 1.24 was released in February 2025, six months after [Go 1.23](https://go.dev/doc/go1.23). Most changes are in the implementation of the toolchain, runtime, and libraries. Go 1.24 continues to uphold the [Go 1 compatibility promise](https://go.dev/doc/go1compat). Almost all Go programs are expected to continue to compile and run as before.

## Language Changes

Go 1.24 now fully supports [generic type aliases](https://go.dev/issue/46477). Type aliases can be parameterized just like defined types. See the [language specification](https://go.dev/ref/spec#Alias_declarations) for details. This feature can currently be disabled by setting `GOEXPERIMENT=noaliastypeparams`, but this setting will be removed in Go 1.25.

## Toolchain

### Go Command

- **Tool Dependency Management**: Go modules can now track executable dependencies using the `tool` directive in `go.mod` and run those tools using the `go tool` command. This eliminates the previous workaround of using "tools.go" files. See the [documentation](https://go.dev/doc/modules/managing-dependencies#tools) for more information.
  - Added the `-tool` flag to `go get` to add tool directives to the current module.
  - Added the `tool` meta-pattern to refer to all tools in the current module. You can use `go get tool` to upgrade all tools or `go install tool` to install them to the GOBIN directory.

- **Cache Improvements**: Executables created by `go run` and the new `go tool` behavior are now cached in the Go build cache, making repeated executions faster. See [#69290](https://go.dev/issue/69290).

- **JSON Output**: 
  - The `go build` and `go install` commands now accept the `-json` flag to report build output and failures in structured JSON format. See `go help buildjson` for details.
  - `go test -json` now reports build output and failures in JSON format interleaved with test results. These are distinguished by a new `Action` type. To restore text build output, set the [GODEBUG](https://go.dev/doc/godebug) `gotestjsonbuildtext=1`.

- **Private Module Authentication**: Added the `GOAUTH` environment variable to provide a flexible way to authenticate private module fetches. See `go help goauth` for more information.

- **Version Information**: The `go build` command now sets the main module's version in the compiled binary based on version control system tags and/or commits. If there are uncommitted changes, a `+dirty` suffix is appended. Use the `-buildvcs=false` flag to omit version control information.

- **Toolchain Tracing**: Added the [GODEBUG](https://go.dev/doc/godebug) setting [toolchaintrace=1](https://go.dev/doc/toolchain#select) to trace the `go` command's toolchain selection process.

### Cgo

Cgo supports new annotations to improve runtime performance:

- `#cgo noescape cFunctionName`: Tells the compiler that memory passed to the C function does not escape.
- `#cgo nocallback cFunctionName`: Tells the compiler that the C function does not call any Go functions.

See the [cgo documentation](https://go.dev/pkg/cmd/cgo#hdr-Optimizing_calls_of_C_code) for more information.

Cgo now better detects multiple incompatible declarations of C functions across files. For example, if `f` is declared as both `void f(int)` and `void f(double)`, cgo reports an error instead of potentially generating incorrect call sequences for `f(0)`. See [#67699](https://go.dev/issue/67699).

### Objdump

The [objdump](https://go.dev/cmd/objdump) tool now supports disassembly for the 64-bit LoongArch (`GOARCH=loong64`), RISC-V (`GOARCH=riscv64`), and S390X (`GOARCH=s390x`) architectures.

### Vet

- **New `tests` Analyzer**: Reports common mistakes in tests, fuzz tests, benchmarks, and examples, such as misformatted names, incorrect signatures, or examples documenting non-existent identifiers. Some of these mistakes can cause tests not to run. This analyzer is part of the analyzers run by `go test`.

- **`printf` Analyzer Improvements**: Now reports calls like `fmt.Printf(s)` where `s` is a non-constant format string with no other arguments. Such calls are often mistakes because `s` may contain `%` symbols; `fmt.Print` should be used instead. See [#60529](https://go.dev/issue/60529). This check is only applied when the language version (as specified by the `go` directive in go.mod or `//go:build` comments) is at least Go 1.24 to avoid breaking CI when upgrading to the 1.24 toolchain.

- **`buildtag` Analyzer Improvements**: Reports diagnostics when invalid Go [major version build constraints](https://go.dev/pkg/cmd/go#hdr-Build_constraints) are present in `//go:build` directives. For example, `//go:build go1.23.1` refers to a point release; `//go:build go1.23` should be used instead. See [#64127](https://go.dev/issue/64127).

- **`copylock` Analyzer Improvements**: Reports diagnostics when variables declared in the three-clause "for" loop (e.g., `for i := iter(); done(i); i = next(i) { ... }`) contain `sync.Locker` (e.g., `sync.Mutex`). Go 1.22 changed the behavior of such loops to create a new variable for each iteration, copying the value from the previous iteration; this copying is unsafe for locks. See [#66387](https://go.dev/issue/66387).

### GOCACHEPROG

The `cmd/go` internal binary and test caching mechanism can now be implemented by a subprocess named by the `GOCACHEPROG` environment variable, which implements a JSON protocol between the `cmd/go` tool and the subprocess. This previously required GOEXPERIMENT. See the [documentation](https://go.dev/cmd/go/internal/cacheprog) for protocol details.

## Runtime

The runtime includes several performance improvements, reducing average CPU overhead by 2–3%, depending on the application. These improvements include:

- **New Map Implementation**: A new built-in `map` implementation based on [Swiss Tables](https://abseil.io/about/design/swisstables).
- **Efficient Memory Allocation**: More efficient memory allocation for small objects.
- **New Mutex Implementation**: A new runtime internal mutex implementation.

The new map implementation and new mutex implementation can be disabled by setting `GOEXPERIMENT=noswissmap` and `GOEXPERIMENT=nospinbitmutex` at build time, respectively.

## References

For more details, please refer to the official release notes: [Go 1.24 Release Notes](https://go.dev/doc/go1.24)
