---
slug: '/docs/components/container-glist'
title: '链表类型-glist'
sidebar_position: 3
hide_title: true
keywords: [GoFrame,GoFrame框架,链表,双向链表,并发安全,glist,组件,Go语言,编程,数据结构,泛型链表,TList]
description: 'GoFrame框架中的glist组件，支持并发安全的双向链表。glist提供了链表的数据结构和并发控制，v2.10版本新增泛型链表TList，提供类型安全的链表操作，适用于需要使用双向链表的场景，从而提高Go语言程序的开发效率和运行性能。'
---

## 基本介绍

带并发安全开关的双向列表。

**使用场景**：

双向链表。

**使用方式：**

```go
import "github.com/gogf/gf/v2/container/glist"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/container/glist](https://pkg.go.dev/github.com/gogf/gf/v2/container/glist)

**泛型支持**：

从 `v2.10` 版本开始，`glist` 提供了泛型链表类型：
- `TList[T]`：泛型双向链表，提供类型安全的链表操作
- 支持高效的首尾插入、删除操作
- 推荐在新项目中使用泛型链表，享受编译时类型检查带来的安全性

## 相关文档
import DocCardList from '@theme/DocCardList';

<DocCardList />