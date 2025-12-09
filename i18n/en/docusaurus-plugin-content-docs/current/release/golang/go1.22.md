---
title: Go 1.22 (2024-02-06)
sidebar_position: 178
---

Go 1.22 was released in February 2024, primarily addressing the long-standing loop variable issue and enhancing HTTP routing capabilities.

## Major Changes

### Language

- **Loop Variable Scope**: Variables declared in a `for` loop are now created as new instances for each iteration. This solves the common issue of closures capturing loop variables.
- **Range over integers**: `for range` now supports integers, e.g., `for i := range 10` will iterate from 0 to 9.
- **Range-over-function (Preview)**: Introduced preview support for `range-over-function` iterators (enabled via `GOEXPERIMENT=rangefunc`).

### Toolchain

- **Go Command**:
  - Workspaces now support `vendor` directories.
  - `go get` is no longer supported in non-module legacy `GOPATH` mode.
  - `go test -cover` can now report coverage for packages without test files (as 0%).
- **Trace**: The `trace` tool's Web UI has been updated, improving readability and thread-oriented views.
- **Vet**:
  - Adapted to the new loop variable semantics, no longer reporting loop variable references that are no longer issues.
  - Added checks: missing values after `append`, direct calls to `time.Since` in `defer`, mismatched key-value pairs in `log/slog`.

### Runtime

- **Performance Optimization**: The runtime now keeps type-based GC metadata near heap objects, improving CPU performance (1-3%) and reducing memory overhead.
- **PGO Enhancements**: PGO builds can now devirtualize more calls, with performance improvements typically between 2-14%.
- **Inlining Enhancements (Preview)**: Introduced a preview of an enhanced inlining phase (enabled via `GOEXPERIMENT=newinliner`).

### Standard Library

- **`math/rand/v2`**: Introduced the `math/rand/v2` package, providing faster and more standard random number generators (such as ChaCha8, PCG) and cleaning up old APIs.
- **`net/http` Routing Enhancements**: `http.ServeMux` now supports method matching (e.g., `GET /items`) and wildcards (e.g., `/items/{id}`, `/files/{path...}`).
- **`go/version`**: Added `go/version` package for parsing and comparing Go version strings.
- **`slices`**: Added `Concat` function for concatenating slices; functions that shrink slices like `Delete` now zero out the deleted elements.
- **`cmp`**: Added `Or` function, returning the first non-zero value in a sequence.
- **`database/sql`**: Added `Null[T]` type for scanning nullable columns of any column type.

## References

For more details, please refer to the official release notes: [Go 1.22 Release Notes](https://go.dev/doc/go1.22)
