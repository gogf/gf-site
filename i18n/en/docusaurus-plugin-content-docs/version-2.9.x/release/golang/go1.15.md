---
title: Go 1.15 (2020-08-11)
sidebar_position: 185
---

Go 1.15 was released in August 2020, mainly improving the linker and runtime performance, and optimizing the toolchain.

## Major Changes

### Toolchain

- **Linker Improvements**: Go 1.15 includes major improvements to the linker, significantly reducing resource usage and improving code robustness.
  - **Performance**: Link speed improved by 20% and memory usage reduced by 30% for large Go programs.
  - **Binary Size**: Generated binary size reduced by an average of 5% by eliminating unused type metadata.
- **GOPROXY Enhancements**: The `GOPROXY` environment variable now supports skipping proxies that return errors.
  - Separated by pipes `|` (e.g., `https://proxy1|https://proxy2`): If the first proxy returns any error, try the next one.
  - Separated by commas `,`: Only try the next one if a 404/410 is returned.
- **GOMODCACHE**: Added `GOMODCACHE` environment variable, allowing users to customize the location of the module cache (default is `$GOPATH/pkg/mod`).
- **Vet Checks**:
  - **string(int)**: `vet` now warns about conversions of the form `string(x)` where `x` is an integer type (not `rune`/`byte`). It is recommended to use `string(rune(x))` or `strconv.Itoa(x)`.
  - **Interface Conversions**: Checks for interface type assertions that can never succeed.

### Runtime

- **Small Object Allocation**: Improved performance of small object allocation on high core counts, reducing worst-case latency.
- **Panic Output**: `panic` can now print values of more types (such as booleans, complex numbers, integers, strings), not just addresses.
- **Signal Handling**: On Unix systems, if a program receives `SIGSEGV`, `SIGBUS`, or `SIGFPE` and does not handle it, it will now reliably crash and print a stack trace.

### Standard Library

- **Embedded Time Zone Data (time/tzdata)**: Added `time/tzdata` package, allowing the time zone database to be embedded in the program.
  - **Usage**: Import `import _ "time/tzdata"` or build with `-tags timetzdata`.
  - **Effect**: Allows the program to correctly handle time zone information in environments without a system time zone database (such as some container images). However, this increases the binary size by about 800 KB.
- **X.509 CommonName Deprecation**: The `crypto/x509` package now treats the `CommonName` field as deprecated by default.
  - **Behavior Change**: If a certificate does not have Subject Alternative Names (SANs), Go will no longer verify `CommonName` as a hostname.
  - **Temporary Reversion**: The old behavior can be temporarily restored by setting the environment variable `GODEBUG=x509ignoreCN=0`.
- **`testing`**:
  - `t.TempDir()`: Automatically creates and cleans up a temporary directory.
  - `t.Deadline()`: Gets the deadline for the test timeout.
- **`sync`**:
  - `Map.LoadAndDelete`: Atomically loads and deletes a key value.
- **`net/url`**:
  - `URL.Redacted()`: Returns a URL string with the password hidden.
- **`time`**:
  - `Ticker.Reset()`: Allows resetting the Ticker interval.
- **`database/sql`**:
  - `DB.SetConnMaxIdleTime`: Sets the maximum idle time for connections in the connection pool.

## References

For more details, please refer to the official release notes: [Go 1.15 Release Notes](https://go.dev/doc/go1.15)
