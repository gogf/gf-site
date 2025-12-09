---
title: Go 1.23 (2024-08-13)
sidebar_position: 177
---

Go 1.23 was released in August 2024, introducing iterator support, telemetry, and toolchain improvements.

## Major Changes

### Language

- **Range-over-func (Iterators)**: `for-range` loops now support user-defined iterator functions. This allows developers to create standard iteration interfaces for custom containers.
- **Generic Type Aliases**: Introduced preview support for generic type aliases (enabled via `GOEXPERIMENT=aliastypeparams`).

### Toolchain

- **Go Telemetry**: Introduced an optional telemetry system to help the Go team understand toolchain usage and performance issues. Users can opt-in or opt-out at any time (`go telemetry on`).
- **Go Command**:
  - `go env -changed`: Lists only environment variables that differ from their default values.
  - `go mod tidy -diff`: Prints the necessary changes as a diff instead of modifying files.
  - `godebug` directive: Declare GODEBUG settings in `go.mod` and `go.work`.
- **Vet**: Added `stdversion` analyzer, which flags references to symbols that are too new for the current Go version.
- **Trace**: The `trace` tool is now more tolerant of partially corrupted trace data, especially when the program crashes.

### Runtime

- **PGO Improvements**: Significantly reduced build time overhead when PGO is enabled.
- **Stack Usage Optimization**: The compiler can now overlap stack frame slots for local variables in disjoint regions of a function, reducing stack usage.
- **Linker**: The linker now prohibits the use of `//go:linkname` to reference internal symbols in the standard library that are not marked for export.

### Standard Library

- **`iter`**: Added `iter` package, defining basic types and functions for iterators.
- **`slices` and `maps`**: Added support for iterators, such as `slices.All`, `slices.Collect`, `maps.Keys`, `maps.Values`, etc.
- **`unique`**: Added `unique` package for deduplicating immutable values via interning.
- **`structs`**: Added `structs` package, providing `HostLayout` type to control struct memory layout.
- **`time`**: Garbage collection for `Timer` and `Ticker` has been improved, no longer requiring explicit `Stop` calls to prevent memory leaks. Associated channels are now unbuffered.
- **`net/http`**: `Cookie` handling improvements (preserving quotes, supporting Partitioned attribute), `ServeMux` patterns support spaces.
- **`reflect`**: Added `Value.Seq` and `Value.Seq2` methods to support iteration over reflected values.

## References

For more details, please refer to the official release notes: [Go 1.23 Release Notes](https://go.dev/doc/go1.23)
