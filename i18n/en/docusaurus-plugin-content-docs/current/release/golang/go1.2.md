---
title: Go 1.2 (2013-12-01)
sidebar_position: 198
---

## Major Changes

### Language

- **Three-Index Slices**: Supports `s[i:j:k]` syntax to specify the capacity of the new slice, preventing the new slice from accessing parts of the original array beyond the specified capacity.

  ```go
  // slice length is 2 (4-2), capacity is 5 (7-2)
  slice = array[2:4:7]
  ```

- **Nil Pointer Safety**: The language specification explicitly guarantees that dereferencing a nil pointer (accessing fields, array indices, etc.) will trigger a panic.

### Toolchain

- **Scheduler Preemption**: The scheduler can now preempt goroutines during function calls, preventing infinite loops from blocking the entire program, implementing cooperative preemption.
- **Test Coverage**: `go test` added the `-cover` flag to calculate code coverage, which can generate detailed HTML reports when used with `go tool cover`.
- **Thread Limit**: The runtime now limits the maximum number of operating system threads to 10,000 by default, which can be modified via `debug.SetMaxThreads`.
- **Stack Size Adjustment**: The initial stack size of a goroutine increased from 4KB to 8KB, reducing the performance overhead of stack splitting.

### Standard Library

- **`encoding`**: Added the `encoding` package, defining common interfaces like `BinaryMarshaler` and `TextMarshaler`.
- **`fmt`**: `Printf` family functions now support referencing arguments by index.

  ```go
  fmt.Printf("%[2]d %[1]d\n", 11, 22) // Output "22 11"
  ```

- **`text/template`**: Added comparison functions like `eq`, `ne`, `lt`, `le`, `gt`, `ge`.

## References

For more details, please refer to the official release notes: [Go 1.2 Release Notes](https://go.dev/doc/go1.2)
