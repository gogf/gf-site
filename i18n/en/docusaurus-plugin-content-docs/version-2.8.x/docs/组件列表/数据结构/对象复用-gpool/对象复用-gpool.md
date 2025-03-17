---
slug: '/docs/components/container-gpool'
title: 'Pool'
sidebar_position: 8
hide_title: true
keywords: [object reuse, GoFrame framework, gpool, expiration time, creation method, destruction method, concurrency safety, sync.Pool, GC pressure, cache reuse]
description: "The basic functions and use cases of the object reuse pool gpool in the GoFrame framework, including providing object cache reuse, expiration time, and the definition of creation and destruction methods. The difference between gpool design and sync.Pool lies in the support of expiration time and the different functions of alleviating GC pressure, it is concurrency safe."
---

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
import DocCardList from '@theme/DocCardList';

<DocCardList />