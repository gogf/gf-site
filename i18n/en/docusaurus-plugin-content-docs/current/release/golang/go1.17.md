---
title: Go 1.17 (2021-08-16)
sidebar_position: 183
---

Go 1.17 was released in August 2021, bringing compiler performance improvements, pruned module graphs, and new build tag syntax.

## Major Changes

### Language

- **Slice Conversion**: Support for converting slices to array pointers. If the slice length is less than the array length, the conversion panics at runtime.

  ```go
  s := []int{1, 2, 3}
  p := (*[3]int)(s)
  ```

- **`unsafe` Package**: Added `unsafe.Add` and `unsafe.Slice` functions, simplifying pointer arithmetic and slice creation, making code more compliant with `unsafe.Pointer` safety rules.

### Toolchain

- **Pruned Module Graphs**: If a module specifies `go 1.17` or higher, the module graph includes only the direct dependencies of other `go 1.17` modules, no longer loading the full transitive dependency graph. This significantly improves module loading speed for large projects.
- **`//go:build` Syntax**: Introduced the new build tag syntax `//go:build`, replacing the old `// +build`, supporting boolean expressions and being more readable.

  ```go
  //go:build linux || darwin
  ```

- **`go get` Deprecation**: The feature of `go get` to install executables is deprecated (and will be removed in a future version); use `go install cmd@version` instead.

### Performance

- **Register-based Calling Convention**: On x86-64 (amd64) architecture, Go function calls now use registers to pass arguments and results instead of the stack. This brings about a 5% performance improvement and a 2% reduction in binary size.
- **Bounds Check Elimination**: Improved bounds check elimination logic, further enhancing performance.

### Standard Library

- **`time`**: Added `Time.UnixMilli` and `Time.UnixMicro` methods; added `Time.IsDST` method to check if it is currently Daylight Saving Time.
- **`testing`**: Added `-shuffle` flag to randomly shuffle test execution order; added `T.Setenv` and `B.Setenv` methods to set environment variables during tests.
- **`sync/atomic`**: `atomic.Value` added `Swap` and `CompareAndSwap` methods.
- **`net/http`**: Semicolons `;` are no longer allowed as separators in URL query parameters.
- **`runtime/cgo`**: Added `Handle` mechanism for safely passing Go values between C and Go.

## References

For more details, please refer to the official release notes: [Go 1.17 Release Notes](https://go.dev/doc/go1.17)
