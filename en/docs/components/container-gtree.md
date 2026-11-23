# Tree

## Introduction

Concurrent-safe feature support for tree containers, with the characteristics of tree data structures supporting ordered traversal, low memory consumption, stable complexity, and suitability for large data storage. This module includes tree containers for multiple data structures: `RedBlackTree`, `AVLTree`, and `BTree`.

| Type | Data Structure | Average Complexity | Supports Sorting | Ordered Traversal | Description |
| --- | --- | --- | --- | --- | --- |
| `RedBlackTree` | Red-black tree | `O(log N)` | Yes | Yes | Good write performance |
| `AVLTree` | Height-balanced tree | `O(log N)` | Yes | Yes | Good search performance |
| `BTree` | B-tree/B-tree | `O(log N)` | Yes | Yes | Commonly used for external storage |

> Reference link: [https://en.wikipedia.org/wiki/Binary\_tree](https://en.wikipedia.org/wiki/Binary_tree)

**Usage Scenarios**:

Associative array scenarios, sorted key-value pair scenarios, large data volume memory CRUD scenarios, etc.

**Usage Method**:

```go
import "github.com/gogf/gf/v2/container/gtree"
```

**API Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/container/gtree](https://pkg.go.dev/github.com/gogf/gf/v2/container/gtree)

The API methods for several containers are very similar, characterized by needing to provide methods for sorting during initialization.

The `gutil` module provides some common basic type comparison methods that can be directly used in the program, and examples are also available later.

```go
func ComparatorByte(a, b interface{}) int
func ComparatorFloat32(a, b interface{}) int
func ComparatorFloat64(a, b interface{}) int
func ComparatorInt(a, b interface{}) int
func ComparatorInt16(a, b interface{}) int
func ComparatorInt32(a, b interface{}) int
func ComparatorInt64(a, b interface{}) int
func ComparatorInt8(a, b interface{}) int
func ComparatorRune(a, b interface{}) int
func ComparatorString(a, b interface{}) int
func ComparatorTime(a, b interface{}) int
func ComparatorUint(a, b interface{}) int
func ComparatorUint16(a, b interface{}) int
func ComparatorUint32(a, b interface{}) int
func ComparatorUint64(a, b interface{}) int
func ComparatorUint8(a, b interface{}) int
```

## Documentation

Child pages:

- [Tree - Usage](https://goframe.org/en/docs/components/container-gtree-example.md)
- [Tree - Methods](https://goframe.org/en/docs/components/container-gtree-funcs.md)

> Page: https://goframe.org/en/docs/components/container-gtree
