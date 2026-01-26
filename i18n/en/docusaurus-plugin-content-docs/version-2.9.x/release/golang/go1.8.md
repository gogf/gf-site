---
title: Go 1.8 (2017-02-16)
sidebar_position: 192
---

Go 1.8 was released on February 16, 2017. This release maintains the Go 1 compatibility promise while bringing significant performance improvements (especially GC and defer), as well as important features like HTTP/2 Server Push, HTTP Server graceful shutdown, and a plugin system.

## Major Changes

### Language

- **Struct Conversion Ignoring Tags**: When explicitly converting one struct type to another, if they differ only in field tags, the conversion is now allowed directly without requiring field tags to match exactly.

  ```go
  type T1 struct {
      X int `json:"foo"`
  }
  type T2 struct {
      X int `json:"bar"`
  }
  var v1 T1
  var v2 T2
  v1 = T1(v2) // Illegal before Go 1.8, now legal
  ```

### Toolchain

- **Plugin System**: Go 1.8 introduced preliminary support for dynamically loading shared libraries (currently Linux only). The `plugin` package allows Go programs to load Go packages compiled as plugins (`.so` files) at runtime and look up exported symbols (variables or functions).

  ```go
  p, err := plugin.Open("myplugin.so")
  f, err := p.Lookup("MyFunction")
  ```

- **Default GOPATH**: If the `GOPATH` environment variable is not set, Go now uses a default value:
  - Unix: `$HOME/go`
  - Windows: `%USERPROFILE%\go`

### Runtime

- **Garbage Collection (GC)**: GC pause times are further reduced, typically under **100 microseconds**, and even as low as 10 microseconds. This is due to the elimination of "stop-the-world" stack rescanning.
- **Defer Overhead**: The overhead of `defer` function calls is reduced by about half.
- **Cgo Overhead**: The overhead of calling C code from Go is also reduced by about half.
- **`mutex` Profiling**: Support for profiling mutex contention (`go test -mutexprofile`).

### Standard Library

- **HTTP/2 Server Push**: The `net/http` package added support for HTTP/2 Server Push. This allows the server to push resources before the client requests them. `http.ResponseWriter` now implements the `Pusher` interface.

  ```go
  if pusher, ok := w.(http.Pusher); ok {
      // Push is supported.
      if err := pusher.Push("/style.css", nil); err != nil {
          log.Printf("Failed to push: %v", err)
      }
  }
  ```

- **HTTP Server Graceful Shutdown**: `http.Server` added the `Shutdown` method, supporting graceful server shutdown. `Shutdown` stops listening for new requests but allows currently processing requests to complete before closing the server.

  ```go
  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()
  if err := srv.Shutdown(ctx); err != nil {
      log.Fatal("Server Shutdown:", err)
  }
  ```

- **`sort.Slice`**: The `sort` package added the `Slice` function, making it much simpler to sort slices without defining a new type to implement `sort.Interface`.

  ```go
  sort.Slice(people, func(i, j int) bool {
      return people[i].Name < people[j].Name
  })
  ```

- **Context Support Extension**: Support for `context.Context` has been extended to more standard libraries:
  - **`database/sql`**: Added `QueryContext`, `ExecContext`, `PrepareContext`, etc., allowing database operations to be cancelled via Context.
  - **`net.Resolver`**: DNS query methods now accept Context.
- **`encoding/base64`**: Added `Strict` mode to strictly check padding bits.
- **`encoding/json`**: `Marshal` now supports floating-point number formatting consistent with ES6.

## References

For more details, please refer to the official release notes: [Go 1.8 Release Notes](https://go.dev/doc/go1.8)
