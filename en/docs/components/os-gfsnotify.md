# File Watching

## Introduction

`gfsnotify` can watch changes in specified files/directories, such as additions, deletions, modifications, and renaming of files.

**Usage:**

```go
import "github.com/gogf/gf/v2/os/gfsnotify"
```

**API Documentation:**

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gfsnotify](https://pkg.go.dev/github.com/gogf/gf/v2/os/gfsnotify)

It is recommended to use the `Add` and `Remove` module methods provided by the `gfsnotify` module for adding and canceling watching. The reasons for this recommendation are explained in the following sections.

Additionally, you can also create a watching management object using the `New` method and then perform watching management. When adding watching, you need to provide a callback function that triggers during watching, with the parameter type being a `*gfsnotify.Event` object pointer.

## Documentation

Child pages:

- [File Watching - Add](https://goframe.org/en/docs/components/os-gfsnotify-add.md)
- [File Watching - Remove](https://goframe.org/en/docs/components/os-gfsnotify-remove.md)
- [File Watching - System Vars](https://goframe.org/en/docs/components/os-gfsnotify-system-variables.md)

> Page: https://goframe.org/en/docs/components/os-gfsnotify
