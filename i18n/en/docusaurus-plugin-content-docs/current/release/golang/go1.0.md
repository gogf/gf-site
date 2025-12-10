---
title: Go 1 (2012-03-28)
sidebar_position: 200
---

Go 1 is the first formal stable release of the Go language, released on March 28, 2012. It marks the maturity of the Go language and brings an extremely important **compatibility promise** as well as a unified toolchain experience.

## Major Changes

### Language

- **`rune` Type**: Introduced `rune` as an alias for `int32`, used to represent Unicode code points.
- **`error` Interface**: Introduced the built-in `error` interface type, replacing the previous `os.Error`, forming a unified error handling contract.
- **`append` Supports Strings**: `append` can now directly append strings to `[]byte` slices, simplifying byte sequence operations.
- **`delete` Built-in Function**: Provided `delete(m, k)` for deleting elements from a map.
- **Structs and Arrays Comparable**: They now support `==`/`!=` and can be used as map keys, improving data structure composition capabilities.
- **Composite Literal Simplification**: Pointer type elements in composite literals can omit type declarations.
- **Map Iteration Order**: Explicitly defined as random order, encouraging robust traversal logic.
- **`close` Check**: Prohibited closing receive-only channels to avoid runtime panics.

### Toolchain

- **`go` Command**: A unified command-line tool integrating functions like `get/build/install/test/doc`, automatically handling dependencies based on source code imports, relying on the `GOPATH` structure (`src`/`pkg`/`bin`).
- **`cgo`**: Strengthened C language interoperability support, improving system call usability.
- **`go fix`**: Includes a migration tool to automatically convert old version code to the Go 1 specification.
- **`gofmt`**: Further standardized code style, becoming an indispensable formatting solution in the Go ecosystem.

### Runtime

- **Compatibility Promise**: Besides introducing language and tool changes, the core of Go 1 is the compatibility guarantee for the Go 1.x lifecycle: as long as the code complies with the Go 1 specification, it will continue to compile and run, with very few exceptions not affecting mainstream application stability.

### Standard Library

- **Package Path Reorganization**: Multiple packages migrated to form a more reasonable hierarchy: `http`→`net/http`, `template`→`text/template`, `exec`→`os/exec`, `utf8`→`unicode/utf8`.
- **`os.Error` Removal**: Replaced by the `error` interface and the `errors` package.
- **`syscall` Errors**: Unified to return the `error` interface.
- **`time` Package Rewrite**: Introduced `time.Time` and `time.Duration`, providing nanosecond precision.
- **`os.FileInfo` Becomes Interface**: Abstracted file information access methods, increasing extensibility.
- **`regexp` Package Rewrite**: Adopted RE2 syntax, ensuring linear time execution.

## References

For more details, please refer to the official release notes: [Go 1 Release Notes](https://go.dev/doc/go1)
