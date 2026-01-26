---
slug: '/docs/components/container-gmap'
title: 'Map'
sidebar_position: 0
hide_title: true
keywords: [GoFrame,GoFrame Framework,gmap,map container,HashMap,TreeMap,ListMap,concurrent safety,data structure,associative array]
description: "Basic methods and considerations for using the gmap dictionary type in the GoFrame framework. The gmap module provides various concurrent-safe map data structure options, including HashMap, TreeMap, and ListMap. Suitable for any scenario involving concurrent access and hash table operations in Go applications, and details the performance and characteristics of each type."
---

## Introduction

A `map` container with a concurrent safety switch option, the most commonly used data structure. This module includes `map` containers with multiple data structures: `HashMap`, `TreeMap`, and `ListMap`.

| Type | Data Structure | Average Complexity | Supports Sorting | Ordered Traversal | Description |
| --- | --- | --- | --- | --- | --- |
| `HashMap` | Hash Table | `O(1)` | No | No | High performance read/write operation, high memory usage, random traversal |
| `ListMap` | Hash Table + Doubly Linked List | `O(2)` | No | Yes | Supports traversal in the order of insertion, high memory usage |
| `TreeMap` | Red Black Tree | `O(log N)` | Yes | Yes | Compact memory usage, supports key name sorting and ordered traversal |
:::tip
Additionally, the `gmap` module supports defining common types of `map` with hash table as the underlying data structure: `IntIntMap`, `IntStrMap`, `IntAnyMap`, `StrIntMap`, `StrStrMap`, `StrAnyMap`.
:::
**Usage Scenarios**:

Any `map`/hash table/associative array usage scenario, particularly in concurrent safety scenarios.

**Usage Method**:

```go
import "github.com/gogf/gf/v2/container/gmap"
```

**Interface Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/container/gmap](https://pkg.go.dev/github.com/gogf/gf/v2/container/gmap)

## NilChecker and Typed Nil Support

- **Feature Overview**: Starting from the generic version, `gmap` provides `NilChecker` functions for generic map types (such as `KVMap[K, V]`, `ListKVMap[K, V]`) to customize "which values should be considered nil", primarily used to solve typed nil determination issues when containing pointers, interfaces, and other types.
- **Usage**: You can specify via constructors like `NewKVMapWithChecker`, `NewListKVMapWithChecker`, or register at runtime by calling `RegisterNilChecker` with a `func(V) bool` determination function. Lazy loading/conditional write methods (such as `GetOrSet*` series) will call this function before actually writing, and usually won't write the key-value pair when it returns `true`.
- **Compatibility**: If `NilChecker` is not set, it maintains consistency with historical versions, defaulting to `any(v) == nil` for determination, and typed nil behavior won't change.

**Example**:

```go
type Student struct {
    Name string
}

// Treat *Student(nil) as "no value", won't write to map
m := gmap.NewListKVMapWithChecker[int, *Student](func(s *Student) bool {
    return s == nil
}, true)

v := m.GetOrSetFuncLock(1, func() *Student {
    return nil
})
fmt.Println(v == nil)       // true
fmt.Println(m.Contains(1)) // false, key not written
```

## Documentation

import DocCardList from '@theme/DocCardList';

<DocCardList />