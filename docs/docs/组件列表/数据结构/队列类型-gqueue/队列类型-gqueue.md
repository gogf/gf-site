---
slug: '/docs/components/container-gqueue'
title: '队列类型-gqueue'
sidebar_position: 6
hide_title: true
keywords: [GoFrame,GoFrame框架,gqueue,队列,并发安全,动态队列,固定队列,goroutine,数据通信,Go语言]
description: 'GoFrame框架中的动态大小并发安全队列gqueue，其支持固定和动态大小队列的功能，与标准库的channel效率相当。gqueue特别适合于多goroutine之间的数据通信，并为开发者提供了简便且强大的并发处理能力。'
---

## 基本介绍

动态大小的并发安全队列。同时， `gqueue` 也支持固定队列大小，固定队列大小时队列效率和标准库的 `channel` 无异。

**使用场景**：

该队列是并发安全的，常用于多 `goroutine` 数据通信且支持动态队列大小的场景。

**使用方式**：

```go
import "github.com/gogf/gf/v2/container/gqueue"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/container/gqueue](https://pkg.go.dev/github.com/gogf/gf/v2/container/gqueue)

## 相关文档

import DocCardList from '@theme/DocCardList';

<DocCardList />