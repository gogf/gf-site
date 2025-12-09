---
title: Go 1.13 (2019-09-03)
sidebar_position: 187
---

Go 1.13 was released in September 2019, improving number literals and error handling, and refining the Modules mechanism.

## Major Changes

### Language

- **Error Wrapping**: Go 1.13 introduces a standard error wrapping mechanism, making error handling more flexible and powerful.
  - **`fmt.Errorf`**: Supports the `%w` verb for wrapping errors.
  - **New functions in `errors` package**:
    - `errors.Is(err, target)`: Determines if an error chain contains a specific error.
    - `errors.As(err, target)`: Converts an error in the chain to a specific type.
    - `errors.Unwrap(err)`: Unwraps an error, returning the wrapped error.

  ```go
  if errors.Is(err, os.ErrNotExist) {
      // Handle file not found error
  }
  ```

- **Number Literal Improvements**:
  - **Binary Literals**: Use `0b` or `0B` prefix (e.g., `0b1011`).
  - **Octal Literals**: Added `0o` or `0O` prefix (e.g., `0o660`); the old `0` prefix is still valid.
  - **Hexadecimal Floating-point**: Use `0x` prefix and `p` exponent (e.g., `0x1.0p-1021`).
  - **Digit Separators**: Allows using underscores `_` in number literals to improve readability (e.g., `1_000_000`, `3.1415_9265`).
- **Signed Shift Counts**: The right operand of shift operators `<<` and `>>` can now be any signed integer type, no longer limited to unsigned integers.

### Toolchain

- **GOPROXY Default**: The `GOPROXY` environment variable defaults to `https://proxy.golang.org,direct`. This means Go uses the Google-maintained module mirror by default.
- **GOSUMDB**: The `sum.golang.org` checksum database is enabled by default to verify the integrity of module content.
- **GOPRIVATE**: Added the `GOPRIVATE` environment variable to specify private module paths that should not be accessed via the proxy or checksum database.
- **go env -w**: The `go env` command now supports the `-w` flag to set and persist environment variables (e.g., `go env -w GOPROXY=direct`).

### Runtime

- **Panic Messages**: Runtime panic messages now include the index value and slice length/capacity that caused the out-of-bounds error, facilitating debugging.
- **Defer Performance**: The performance of `defer` statements has improved by about 30%.
- **sync.Pool**: `sync.Pool` no longer clears all objects during every garbage collection (GC), but retains some objects, thereby reducing allocation peaks after GC.

### Standard Library

- **TLS 1.3**: TLS 1.3 is enabled by default.
- **`crypto/ed25519`**: Added `crypto/ed25519` package, implementing the Ed25519 signature algorithm.
- **`time`**: `Duration` added `Microseconds` and `Milliseconds` methods.
- **`os`**: Added `UserConfigDir` function.

## References

For more details, please refer to the official release notes: [Go 1.13 Release Notes](https://go.dev/doc/go1.13)
