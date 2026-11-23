# Map

## Introduction

A `map` container with a concurrent safety switch option, the most commonly used data structure. This module includes `map` containers with multiple data structures: `HashMap`, `TreeMap`, and `ListMap`.

| Type | Data Structure | Average Complexity | Supports Sorting | Ordered Traversal | Description |
| --- | --- | --- | --- | --- | --- |
| `HashMap` | Hash Table | `O(1)` | No | No | High performance read/write operation, high memory usage, random traversal |
| `ListMap` | Hash Table + Doubly Linked List | `O(2)` | No | Yes | Supports traversal in the order of insertion, high memory usage |
| `TreeMap` | Red Black Tree | `O(log N)` | Yes | Yes | Compact memory usage, supports key name sorting and ordered traversal |

**Tip**

Additionally, the `gmap` module supports defining common types of `map` with hash table as the underlying data structure: `IntIntMap`, `IntStrMap`, `IntAnyMap`, `StrIntMap`, `StrStrMap`, `StrAnyMap`.

**Usage Scenarios**:

Any `map`/hash table/associative array usage scenario, particularly in concurrent safety scenarios.

**Usage Method**:

```go
import "github.com/gogf/gf/v2/container/gmap"
```

**Interface Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/container/gmap](https://pkg.go.dev/github.com/gogf/gf/v2/container/gmap)

## Documentation

Child pages:

- [Map - Usage](https://goframe.org/en/docs/components/container-gmap-example.md)
- [Map - Performance](https://goframe.org/en/docs/components/container-gmap-benchmark.md)
- [Map - Methods](https://goframe.org/en/docs/components/container-gmap-funcs.md)

> Page: https://goframe.org/en/docs/components/container-gmap
