# Resource

## Introduction

`Resource Management` refers to the ability to package any file/directory into a `Golang` source file and compile it into an executable file, which is then released with the executable file.

When the program starts, resource files will be decompressed and released into memory for read-only access by the program. You can consider it as a memory-based file manager. Additionally, the `GoFrame` resource management feature supports packaging files/directories for use as standalone binary resource files. Since resource file operations are memory-based during program execution, there is no disk `IO` overhead, resulting in very high file operation efficiency.

**Usage:**

```go
import "github.com/gogf/gf/v2/os/gres"
```

**API Documentation:**

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gres](https://pkg.go.dev/github.com/gogf/gf/v2/os/gres)

## Features

The `gres` resource management component has the following notable features:

1. It can package any file/directory as a `Go` file, supporting custom encryption and decryption.
2. The packaged `Go` file/resource file is automatically compressed, with common `css/js` files achieving a compression rate of `50~90%`.
3. It supports easily exporting resource content packaged in `Go` files to the local file system.
4. Resource manager content is entirely memory-based and read-only, with no dynamic modification possible.
5. The resource manager is integrated by default with the `WebServer`, configuration management, and template engine modules.
6. Any file, such as website static files or configuration files, can be compiled into a binary file and also into the released executable file.
7. Developers can publish just one executable file, making software distribution easier and protecting software intellectual property possible.

## Comparison with `embed.FS`

Starting from `Golang v1.16`, the official release provides a static file embedding feature `embed.FS`. The overall underlying design is similar to the `gres` component, with comparable compression rates and execution efficiency, although there are significant differences in usage design and engineering management. The `GoFrame` resource management component is more feature-rich, and the core components of the framework have been fully integrated with the `gres` resource management component. Under GoFrame's standard engineering management, developers can seamlessly use the resource management features without being aware of them. For details, see the chapter [Resource - Best Practices](https://goframe.org/en/docs/core/gres-practice.md).

In the future, the GoFrame base framework will not consider built-in support for the `embed.FS` component. `embed.FS` and the `gres` component can be independently used without affecting each other.

## Documentation

Child pages:

- [Resource - Packing With Tool](https://goframe.org/en/docs/core/gres-pack-using-cli.md)
- [Resource - Packing With Method](https://goframe.org/en/docs/core/gres-pack-using-funcs.md)
- [Resource - Methods](https://goframe.org/en/docs/core/gres-funcs.md)
- [Resource - Examples](https://goframe.org/en/docs/core/gres-example.md)
- [Resource - Best Practices](https://goframe.org/en/docs/core/gres-practice.md)

> Page: https://goframe.org/en/docs/core/gres
