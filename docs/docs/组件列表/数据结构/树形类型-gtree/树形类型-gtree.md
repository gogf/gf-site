---
slug: '/docs/components/container-gtree'
title: '树形类型-gtree'
sidebar_position: 7
hide_title: true
keywords: [GoFrame,树形容器,gtree,并发安全,红黑树,AVL树,BTree,排序,大数据处理,数据结构]
description: '该文档介绍了GoFrame框架提供的树形容器组件，包括RedBlackTree、AVLTree和BTree等数据结构。树形容器支持并发安全和有序遍历，适合处理大数据量的存储需求。通过GoFrame框架，开发者可以高效地实现关联数组、排序键值对和大数据量内存CRUD等场景。'
---

## 基本介绍

支持并发安全开关特性的树形容器，树形数据结构的特点是支持有序遍历、内存占用低、复杂度稳定、适合大数据量存储。该模块包含多个数据结构的树形容器： `RedBlackTree`、 `AVLTree` 和 `BTree`。

| 类型 | 数据结构 | 平均复杂度 | 支持排序 | 有序遍历 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `RedBlackTree` | 红黑树 | `O(log N)` | 是 | 是 | 写入性能比较好 |
| `AVLTree` | 高度平衡树 | `O(log N)` | 是 | 是 | 查找性能比较好 |
| `BTree` | B树/B-树 | `O(log N)` | 是 | 是 | 常用于外部存储 |

> 参考连接： [https://en.wikipedia.org/wiki/Binary\_tree](https://en.wikipedia.org/wiki/Binary_tree)

**使用场景**：

关联数组场景、排序键值对场景、大数据量内存CRUD场景等等。

**使用方式**：

```go
import "github.com/gogf/gf/v2/container/gtree"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/container/gtree](https://pkg.go.dev/github.com/gogf/gf/v2/container/gtree)

几种容器的API方法都非常类似，特点是需要在初始化时提供用于排序的方法。

在 `gutil` 模块中提供了常用的一些基本类型比较方法，可以直接在程序中直接使用，后续也有示例。

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

## NilChecker 与 typed nil 支持

- **功能简介**：在泛型版本中，`gtree` 为多种泛型树形容器（如 `AVLKVTree[K, V]`、`BKVTree[K, V]`、`RedBlackKVTree[K, V]`）提供了 `NilChecker` 函数，用于自定义“哪些值应当被视为 nil”，从而在包含指针、接口等类型时更好地控制 typed nil 的写入语义。
- **使用方式**：可以通过 `NewXXXWithChecker`、`NewXXXWithCheckerFrom` 等构造函数，或在运行时调用 `RegisterNilChecker` 注册一个 `func(V) bool` 判定函数，懒加载/条件写入方法（如 `GetOrSet*`、`SetIfNotExist*` 系列）在真正写入前会先调用该函数，当判定为 nil 时通常不会写入该键值对。
- **兼容性**：如果未设置 `NilChecker`，则保持与历史版本一致，默认使用 `any(v) == nil` 进行判定，typed nil 的行为不会发生变化。

**示例**：

```go
type Student struct {
    Name string
}

// 将 *Student(nil) 视为“无值”，不会写入树
// 这里以 RedBlackKVTree 为例
tr := gtree.NewRedBlackKVTreeWithChecker[int, *Student](gutil.ComparatorInt, func(s *Student) bool {
    return s == nil
}, true)

v := tr.GetOrSetFunc(1, func() *Student {
    return nil
})
fmt.Println(v == nil)       // true
fmt.Println(tr.Contains(1)) // false，key 未写入
```

## 相关文档
import DocCardList from '@theme/DocCardList';

<DocCardList />