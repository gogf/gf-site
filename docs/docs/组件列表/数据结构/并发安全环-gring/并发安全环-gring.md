---
slug: '/docs/components/container-gring'
title: '并发安全环-gring'
sidebar_position: 9
hide_title: true
keywords: [GoFrame,GoFrame框架,并发安全,环结构,ring,循环双向链表,缓冲区控制,并发锁,gring,链式操作]
description: 'GoFrame框架中并发安全环结构gring的使用方法。该数据结构适用于需要固定大小的场景，如并发锁控制和缓冲区控制。文章提供了Gring的基本介绍，使用场景和方式，并给出了相关接口文档和链接。'
---

## 基本介绍

支持并发安全开关的环结构，循环双向链表。

**使用场景**：

`ring` 这种数据结构在底层开发中用得比较多一些，如：并发锁控制、缓冲区控制。 `ring` 的特点在于，其必须有固定的大小，当不停地往 `ring` 中追加写数据时，如果数据大小超过容量大小，新值将会将旧值覆盖。

**使用方式**：

```go
import "github.com/gogf/gf/v2/container/gring"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/container/gring](https://pkg.go.dev/github.com/gogf/gf/v2/container/gring)

> `gring` 支持链式操作。

## 相关文档

import DocCardList from '@theme/DocCardList';

<DocCardList />