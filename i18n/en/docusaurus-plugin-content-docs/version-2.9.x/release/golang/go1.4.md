---
title: Go 1.4 (2014-12-10)
sidebar_position: 196
---

Go 1.4 was released in December 2014, focusing on implementation improvements, including garbage collector optimizations and rewriting the runtime in Go (preparing for Go 1.5 bootstrapping). Additionally, it added official support for Android.

## Major Changes

### Language

- **For-range Loop**: Previously required `for _ = range x`, now can be shortened to `for range x`.

  ```go
  // Before Go 1.4
  for _ = range ch { ... }
  // Go 1.4 and later
  for range ch { ... }
  ```

### Toolchain

- **Android Support**: Go 1.4 can build binaries running on Android ARM processors. With the `golang.org/x/mobile` library, you can write Android apps.
- **Contiguous Stacks**: The runtime now uses contiguous stacks. When stack space is insufficient, a larger new stack is allocated and data is copied, rather than linking a new stack segment as before. This eliminates the "hot stack split" performance issue and allows goroutines to start with a smaller stack (2KB).
- **Canonical Import Paths**: Package declarations can include comments to specify their canonical import path. If a user tries to import the package via another path, the `go` command will refuse to compile.

  ```go
  package pdf // import "rsc.io/pdf"
  ```

- **go generate**: Added the `go generate` subcommand, used to scan for `//go:generate` directives in source code and execute corresponding commands. This is typically used for code generation (like Stringer methods, Yacc parsers, etc.).
- **Internal Packages**: Introduced the concept of `internal` directories. Packages in a directory named `internal` can only be imported by code in the directory tree rooted at the parent of `internal`. Although mainly enforced in the main repository in Go 1.4, it laid the foundation for widespread adoption in Go 1.5.

### Standard Library

- **`testing`**: Supports `TestMain` function, allowing global setup and teardown before and after test execution.

  ```go
  func TestMain(m *testing.M) {
      setup()
      code := m.Run()
      teardown()
      os.Exit(code)
  }
  ```

- **`sync/atomic`**: Added `Value` type for atomically storing and loading values of any type (often used for configuration loading, etc.).
- **`syscall`**: The `syscall` package is frozen and no new system calls will be added. New system call development has moved to the `golang.org/x/sys` sub-repository.

## References

For more details, please refer to the official release notes: [Go 1.4 Release Notes](https://go.dev/doc/go1.4)
