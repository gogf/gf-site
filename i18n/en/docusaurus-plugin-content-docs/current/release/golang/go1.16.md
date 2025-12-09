---
title: Go 1.16 (2021-02-16)
sidebar_position: 184
---

Go 1.16 was released in February 2021, introducing file embedding (`embed`) support and enabling Go Modules by default.

## Major Changes

### Toolchain

- **Go Modules Enabled by Default**: The default value of the `GO111MODULE` environment variable is now `on`. The Go command now runs in Module mode by default, regardless of whether the current directory contains a `go.mod` file.
  - The `go install` command now supports the `pkg@version` syntax for installing executables of a specific version without affecting the dependencies of the current project. For example: `go install golang.org/x/tools/gopls@latest`.
  - `go build` and `go test` no longer automatically modify `go.mod` and `go.sum`. If dependencies need to be updated, `go mod tidy` or `go get` must be run explicitly.
- **Embedding Static Files (Embed)**: Introduced the `//go:embed` directive, allowing static files (such as HTML, CSS, images, etc.) to be directly embedded into the compiled Go binary.

  ```go
  package main

  import (
      "embed"
      "fmt"
  )

  //go:embed hello.txt
  var f embed.FS

  func main() {
      data, _ := f.ReadFile("hello.txt")
      fmt.Print(string(data))
  }
  ```

- **Linker Optimization**: Linker speed improved by 20-25%, and memory usage reduced by 5-15%.
- **`go build -overlay`**: Supports the `-overlay` flag, mainly for editor tools (such as gopls).
- **`go vet`**: Added checks for incorrect use of `testing.T` in `goroutines`.

### Runtime

- **Apple Silicon (M1) Support**: Added `darwin/arm64` port, officially supporting running Go programs natively on Macs with Apple Silicon (M1) chips.
- **`runtime/metrics`**: Added a new package providing a more stable and general interface for reading runtime metrics.
- **`GODEBUG=inittrace=1`**: Setting this environment variable traces the execution time and memory allocation of `init` functions, helping to analyze startup performance.
- **Linux Memory Release**: On Linux, the runtime now defaults to using `MADV_DONTNEED` to quickly release memory to the operating system, instead of `MADV_FREE`.

### Standard Library

- **`io/fs`**: Introduced the `fs.FS` interface, defining an abstraction for read-only file systems. Many packages in the standard library (such as `net/http`, `html/template`) have been adapted to this interface.
- **`embed`**: Added the `embed` standard library package, providing methods to access embedded files.
- **`io/ioutil` Deprecation**: The `io/ioutil` package is marked as deprecated (although still usable, migration is recommended). Its functionality has been moved to the `io` and `os` packages:
  - `ioutil.Discard` -> `io.Discard`
  - `ioutil.NopCloser` -> `io.NopCloser`
  - `ioutil.ReadAll` -> `io.ReadAll`
  - `ioutil.ReadDir` -> `os.ReadDir` (returns `os.DirEntry` slice)
  - `ioutil.ReadFile` -> `os.ReadFile`
  - `ioutil.WriteFile` -> `os.WriteFile`
  - `ioutil.TempDir` -> `os.MkdirTemp`
  - `ioutil.TempFile` -> `os.CreateTemp`
- **`os/signal`**: Added `NotifyContext` function, creating a Context that is canceled when a signal is received.
- **`path/filepath`**: Added `WalkDir` function, which is more efficient than `Walk` (avoids calling `os.Lstat` for every file).
- **`net/http`**: Adjusted default behavior for `SameSite` cookie attribute.
- **`strconv`**: `ParseFloat` uses the faster Eisel-Lemire algorithm.

## References

For more details, please refer to the official release notes: [Go 1.16 Release Notes](https://go.dev/doc/go1.16)
