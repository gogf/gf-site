---
title: Go 1.6 (2016-02-17)
sidebar_position: 194
---

Go 1.6 was released in February 2016, enabling HTTP/2 support by default and enhancing template functionality and runtime detection.

## Major Changes

### Toolchain

- **Vendor**: Support for the vendor directory is now enabled by default. The `GO15VENDOREXPERIMENT` environment variable defaults to 1. Go 1.6 is the last version that allows disabling Vendor support by setting this variable to 0.
- **Cgo**: Rules for passing Go pointers to C code are now explicitly defined and enforced. As long as C code does not retain pointers to Go-allocated memory, and that memory itself does not contain pointers to other Go-allocated memory, Go code can pass pointers to Go-allocated memory to C. Violating these rules will cause a runtime crash.

### Runtime

- **Map Concurrency Detection**: The runtime added lightweight detection for concurrent misuse of Maps. If a concurrent write operation is detected, the program will crash and print an error message. This helps discover potential data race issues.

### Standard Library

- **`net/http`**:
  - **HTTP/2 Support**: The `net/http` package now supports the HTTP/2 protocol by default (over HTTPS). When using HTTPS, Go clients and servers will automatically negotiate and use HTTP/2. Existing HTTP programs can enjoy the performance benefits of HTTP/2 without code changes.
- **`text/template` and `html/template`**:
  - **Whitespace Trimming**: Supports using `{{-` and `-}}` syntax to trim whitespace around template actions.

    ```go
    {{23 -}} < {{- 45}} // Output "23<45"
    ```

  - **Block Action**: Introduced the `{{block "name" pipeline}}...{{end}}` action, allowing template blocks to be defined and subsequently overridden, which is very useful for defining base layout templates.
- **`sort`**:
  - **Performance Improvement**: The implementation of the `sort` package was rewritten, reducing `Less` and `Swap` method calls by about 10%, improving sorting speed. Note that the sort order for equal elements may change (unstable sort).

## References

For more details, please refer to the official release notes: [Go 1.6 Release Notes](https://go.dev/doc/go1.6)
