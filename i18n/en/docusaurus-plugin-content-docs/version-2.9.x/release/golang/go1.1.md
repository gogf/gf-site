---
title: Go 1.1 (2013-05-13)
sidebar_position: 199
---

## Major Changes

### Language

- **Method Values**: Support for assigning a method with a specific receiver to a variable as a function value.

  ```go
  w := os.Stdout
  f := w.Write // f is a function bound to w
  f([]byte("hello"))
  ```

- **Integer Division by Zero**: Integer division by constant 0 is now a compile-time error (previously a runtime panic).
- **Return Statement**: Relaxed the requirement that a function must end with a `return` statement, as long as all execution paths have a terminating statement.

### Toolchain

- **Race Detector**: Introduced a data race detection tool, `go test -race`, to detect concurrent read/write issues at runtime.
- **int Type**: On 64-bit platforms, `int` and `uint` changed from 32-bit to 64-bit, supporting slices with over 2 billion elements.
- **Heap Size**: The maximum heap size on 64-bit platforms significantly increased, supporting tens of GBs of memory usage.

### Performance

Go 1.1 includes significant optimizations in the compiler, garbage collector, map implementation, and network library, with performance generally improved by 30%-40%.

### Standard Library

- **`bufio.Scanner`**: Provides a simple interface to read data streams.

  ```go
  scanner := bufio.NewScanner(os.Stdin)
  for scanner.Scan() {
      fmt.Println(scanner.Text()) // Read line by line
  }
  ```

- **`reflect`**: Functionality significantly enhanced, supporting `MakeFunc`, `Select`, `ChanOf`, `MapOf`, and `SliceOf`, etc.
- **`time`**: On Linux, FreeBSD, OS X, etc., time precision improved from microseconds to nanoseconds.

## References

For more details, please refer to the official release notes: [Go 1.1 Release Notes](https://go.dev/doc/go1.1)
