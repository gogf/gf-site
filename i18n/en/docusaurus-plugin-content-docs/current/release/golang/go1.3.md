---
title: Go 1.3 (2014-06-18)
sidebar_position: 197
---

Go 1.3 was released in June 2014, mainly improving stack management, garbage collector, and toolchain performance, and adding support for several new operating systems.

## Major Changes

### Toolchain

- **Godoc**: The `godoc` tool added static analysis capabilities (via the `-analysis` flag), which can display call graphs, type relationships, etc.
- **Linker**: The linker was refactored, moving some instruction selection work to the compiler stage, significantly speeding up compilation for large projects.
- **New Platform Support**: Added support for DragonFly BSD, Plan 9, Solaris, and NaCl (Native Client).

### Runtime

- **Contiguous Stacks**: Go 1.3 changed the goroutine stack implementation from a segmented model to a contiguous model. When stack space is insufficient, the runtime allocates a larger contiguous memory block and copies the old stack over. This eliminates the "hot split" performance issue caused by repeated expansion and contraction at segment boundaries in segmented stacks.
- **Precise GC**: The garbage collector can now precisely identify pointers on the stack. This means non-pointer data (like integers) will not be mistaken for pointers, avoiding memory leaks.
- **Map Iteration**: Restored random iteration order for small Maps (`<= 8` elements) to prevent programs from relying on specific iteration orders (the Go language specification explicitly states that Map iteration order is undefined).
- **Defer Performance**: Reduced the overhead of `defer`, reducing memory allocation by about 2KB per defer call.

### Standard Library

- **`sync.Pool`**: This is an important new type used to store and reuse temporary objects. It can reduce pressure on the garbage collector, especially in high-concurrency scenarios.

  ```go
  var bufPool = sync.Pool{
      New: func() interface{} {
          return new(bytes.Buffer)
      },
  }
  ```

- **TCP Keep-Alive**: HTTP clients (`DefaultTransport`) and servers now enable TCP Keep-Alive by default.

## References

For more details, please refer to the official release notes: [Go 1.3 Release Notes](https://go.dev/doc/go1.3)
