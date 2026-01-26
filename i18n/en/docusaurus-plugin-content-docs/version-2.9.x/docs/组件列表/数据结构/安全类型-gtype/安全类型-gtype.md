---
slug: '/docs/components/container-gtype'
title: 'Safe Type'
sidebar_position: 5
hide_title: true
keywords: [GoFrame, safe type, concurrent programming, concurrency safety, gtype, basic type, atomic operations, performance optimization, data type, lock mechanism]
description: "The safe type gtype in the GoFrame framework is suitable for any scenario requiring concurrency safety. By providing concurrency safety support for the most commonly used basic data types, gtype has higher performance than mutex locks, simplifies concurrency control using atomic operations, and facilitates developers in efficient concurrent programming in complex scenarios."
---

## Introduction

Concurrency-safe basic types.

**Use Scenarios**:

`gtype` is used very frequently and is applicable in any scenario requiring concurrency safety.

In common concurrency-safe scenarios, a variable of a basic type, especially a `struct` containing several attributes, often uses mutex (read/write) locks or multiple (read/write) locks for safe management. However, in such usage, the operation performance of `variables/struct/attributes` is **very low**, and the presence of the mutex lock mechanism often makes the operation quite complex, requiring careful maintenance of `variable/attribute` concurrency safety control (especially `(RW)Mutex`).

`gtype` provides corresponding concurrency-safe data types for the most commonly used basic data types, making it easier to maintain variables/attributes in concurrency-safe scenarios. Developers no longer need to create and maintain cumbersome `(RW)Mutex` in `struct`. Since `gtype` maintains concurrency safety for basic types, it mostly uses `atomic` operations internally to maintain concurrency safety, often resulting in efficiency that is tens of times higher than `(RW)Mutex` mutex locks.

**Usage**:

```go
import "github.com/gogf/gf/v2/container/gtype"
```

**Interface Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/container/gtype](https://pkg.go.dev/github.com/gogf/gf/v2/container/gtype)

## Documentation

import DocCardList from '@theme/DocCardList';

<DocCardList />