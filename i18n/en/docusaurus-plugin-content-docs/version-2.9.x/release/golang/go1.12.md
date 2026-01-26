---
title: Go 1.12 (2019-02-25)
sidebar_position: 188
---

Go 1.12 was released in February 2019, focusing on runtime performance improvements, module support, and preliminary support for TLS 1.3.

## Major Changes

### Toolchain

- **Go Modules Improvements**:
  - **`go` directive**: The `go.mod` file now supports the `go` directive (e.g., `go 1.12`) to specify the language version used by the module's code.
  - **Concurrent Downloads**: The `go` command can now download and extract modules concurrently.
  - **Module Awareness**: When `GO111MODULE=on`, the `go` command supports module-aware operations even outside of a module directory.
- **`go vet` Rewrite**: The `go vet` command has been rewritten based on the new `golang.org/x/tools/go/analysis` framework, making it more modular and powerful.
- **Build Cache**: The build cache is now mandatory to speed up the build process.
- **Godoc**: `godoc` no longer provides a command-line interface and runs only as a web server. For command-line help, use `go doc`.

### Runtime

- **Memory Release**: The runtime now more aggressively returns unused memory to the operating system. On Linux, it defaults to using `MADV_FREE`, which may cause RSS to appear higher, but the memory is actually reclaimable by the system. To restore the old behavior, set `GODEBUG=madvdontneed=1`.
- **GC Scanning**: Significantly improved scanning performance when most of the heap is live, reducing allocation latency after GC.
- **Timer Optimization**: Optimized performance of timers and deadlines, especially in high-concurrency scenarios.

### Standard Library

- **TLS 1.3 Support (Optional)**: Go 1.12 introduces optional support for TLS 1.3. It is disabled by default and can be enabled by setting the environment variable `GODEBUG=tls13=1`. It will be enabled by default in Go 1.13.
- **`strings` / `bytes`**: Added `ReplaceAll` function to replace all occurrences of a substring, which is more concise than `Replace(s, old, new, -1)`.
- **`os`**: Added `UserHomeDir` function to get the current user's home directory.
- **`fmt`**: Map printing order is now fixed (sorted by key) to facilitate testing.
- **`runtime/debug`**: Added `BuildInfo` type and `ReadBuildInfo` function to read build information (module version, etc.) from binaries.

### Platform Support

- **Windows/ARM**: Support for running Go on Windows 10 IoT Core (e.g., Raspberry Pi 3).
- **AIX**: Support for AIX 7.2 and later (`aix/ppc64`).
- **macOS**: Go 1.12 is the last version to support macOS 10.10 Yosemite.

## References

For more details, please refer to the official release notes: [Go 1.12 Release Notes](https://go.dev/doc/go1.12)
