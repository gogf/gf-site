---
slug: '/docs/components/container-gpool'
title: '对象复用-gpool'
sidebar_position: 8
hide_title: true
keywords: [对象复用,GoFrame框架,gpool,过期时间,创建方法,销毁方法,并发安全,sync.Pool,GC压力,缓存复用]
description: '本文档介绍了GoFrame框架中的对象复用池gpool的基本功能和使用场景，包括提供对象缓存复用、过期时间、创建和销毁方法的定义。gpool设计与sync.Pool的区别在于对过期时间的支持和GC压力缓解功能的不同，是并发安全的。'
---

## 基本介绍

对象复用池（并发安全）。将对象进行缓存复用，支持 `过期时间`、 `创建方法` 及 `销毁方法` 定义。

**使用场景**：

任何需要支持定时过期的对象复用场景。

**使用方式**：

```go
import "github.com/gogf/gf/v2/container/gpool"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/container/gpool](https://pkg.go.dev/github.com/gogf/gf/v2/container/gpool)

需要注意两点：

1. `New` 方法的过期时间类型为 `time.Duration`。
2. 对象 `创建方法`( `newFunc NewFunc`)返回值包含一个 `error` 返回，当对象创建失败时可由该返回值反馈原因。
3. 对象 `销毁方法`( `expireFunc...ExpireFunc`)为可选参数，用以当对象超时/池关闭时，自动调用自定义的方法销毁对象。

## `gpool` 与 `sync.Pool`

`gpool` 与 `sync.Pool` 都可以达到对象复用的作用，但是两者的设计初衷和使用场景不太一样。

`sync.Pool` 的对象生命周期不支持自定义过期时间，究其原因， `sync.Pool` 并不是一个 `Cache`； `sync.Pool` 设计初衷是为了缓解GC `压力`， `sync.Pool` 中的对象会在 `GC` 开始前全部清除；并且 `sync.Pool` 不支持对象创建方法及销毁方法。

## 相关文档
import DocCardList from '@theme/DocCardList';

<DocCardList />