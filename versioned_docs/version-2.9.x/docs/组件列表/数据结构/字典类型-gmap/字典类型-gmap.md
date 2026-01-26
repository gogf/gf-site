---
slug: '/docs/components/container-gmap'
title: '字典类型-gmap'
sidebar_position: 0
hide_title: true
keywords: [GoFrame,GoFrame框架,gmap,map容器,HashMap,TreeMap,ListMap,并发安全,数据结构,关联数组]
description: '在GoFrame框架中使用gmap字典类型的基本方法和注意事项。gmap模块提供了多种并发安全的map数据结构选项，包括HashMap、TreeMap和ListMap。适用于在Go应用程序中任何涉及并发访问和哈希表操作的场景，并详细描述了每种类型的性能和特性。'
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

## NilChecker 与 typed nil 支持

- **功能简介**：从泛型版本开始，`gmap` 为泛型字典类型（如 `KVMap[K, V]`、`ListKVMap[K, V]`）提供了 `NilChecker` 函数，用于自定义“哪些值应当被视为 nil”，主要用于解决包含指针、接口等类型时的 typed nil 判定问题。
- **使用方式**：可以通过 `NewKVMapWithChecker`、`NewListKVMapWithChecker` 等构造函数，或在运行时调用 `RegisterNilChecker` 注册一个 `func(V) bool` 判定函数，懒加载/条件写入方法（如 `GetOrSet*` 系列）在真正写入前会先调用该函数，当返回 `true` 时通常不会写入该键值对。
- **兼容性**：如果未设置 `NilChecker`，则保持与历史版本一致，默认使用 `any(v) == nil` 进行判定，typed nil 的行为不会发生变化。

**示例**：

```go
type Student struct {
    Name string
}

// 将 *Student(nil) 视为“无值”，不会写入 map
m := gmap.NewListKVMapWithChecker[int, *Student](func(s *Student) bool {
    return s == nil
}, true)

v := m.GetOrSetFuncLock(1, func() *Student {
    return nil
})
fmt.Println(v == nil)       // true
fmt.Println(m.Contains(1)) // false，key 未写入
```

## 相关文档

import DocCardList from '@theme/DocCardList';

<DocCardList />