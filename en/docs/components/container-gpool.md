# Pool

## Introduction

Object reuse pool (concurrency safe). Provides cached reuse of objects with support for defining `expiration time`, `creation method`, and `destruction method`.

**Use Cases**:

Any object reuse scenario that needs to support timed expiration.

**Usage**:

```go
import "github.com/gogf/gf/v2/container/gpool"
```

**API Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/container/gpool](https://pkg.go.dev/github.com/gogf/gf/v2/container/gpool)

Two points to note:

1. The expiration time type of the `New` method is `time.Duration`.
2. The object `creation method` (`newFunc NewFunc`) return value includes an `error` return, which can provide feedback on the reason for failure when object creation fails.
3. The object `destruction method` (`expireFunc...ExpireFunc`) is an optional parameter for automatically invoking custom methods to destroy objects when they timeout/pool closure.

## `gpool` vs `sync.Pool`

`gpool` and `sync.Pool` both achieve object reuse, but their design intentions and use cases are quite different.

The object lifecycle in `sync.Pool` does not support customizable expiration time because `sync.Pool` is not a `Cache`; the original intention of `sync.Pool` is to alleviate GC `pressure`, and the objects in `sync.Pool` are all cleared before `GC` starts; furthermore, `sync.Pool` does not support object creation and destruction methods.

## Documentation

Child pages:

- [Pool - Usage](https://goframe.org/en/docs/components/container-gpool-example.md)

> Page: https://goframe.org/en/docs/components/container-gpool
