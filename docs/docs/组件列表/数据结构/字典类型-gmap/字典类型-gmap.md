---
slug: '/docs/components/container-gmap'
title: '字典类型-gmap'
sidebar_position: 0
hide_title: true
---

## 基本介绍

支持并发安全开关选项的 `map` 容器，最常用的数据结构。该模块包含多个数据结构的 `map` 容器： `HashMap`、 `TreeMap` 和 `ListMap`。

| 类型 | 数据结构 | 平均复杂度 | 支持排序 | 有序遍历 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `HashMap` | 哈希表 | `O(1)` | 否 | 否 | 高性能读写操作，内存占用较高，随机遍历 |
| `ListMap` | 哈希表+双向链表 | `O(2)` | 否 | 是 | 支持按照写入顺序遍历，内存占用较高 |
| `TreeMap` | 红黑树 | `O(log N)` | 是 | 是 | 内存占用紧凑，支持键名排序及有序遍历 |
:::tip
此外， `gmap` 模块支持多种以哈希表为基础数据结构的常见类型 `map` 定义： `IntIntMap`、 `IntStrMap`、 `IntAnyMap`、 `StrIntMap`、 `StrStrMap`、 `StrAnyMap`。
:::
**使用场景**：

任何 `map`/哈希表/关联数组使用场景，尤其是并发安全场景中。

**使用方式**：

```go
import "github.com/gogf/gf/v2/container/gmap"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/container/gmap](https://pkg.go.dev/github.com/gogf/gf/v2/container/gmap)

## 相关文档

import DocCardList from '@theme/DocCardList';

<DocCardList />