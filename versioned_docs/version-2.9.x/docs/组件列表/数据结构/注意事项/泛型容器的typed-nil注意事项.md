---
slug: '/docs/components/container-nilchecker'
title: 'NilChecker 与 typed nil'
sidebar_position: 1
hide_title: true
keywords: [GoFrame,GoFrame框架,NilChecker,typed nil,容器,泛型,gmap,gset,gtree]
description: '说明在 GoFrame 数据结构容器中，如何使用 NilChecker 解决 typed nil 带来的判定问题，并给出 gmap/gset/gtree 中的使用示例和最佳实践。'
---

## 场景示例：懒加载缓存遇到 typed nil

下面以 `gmap.ListKVMap` 为例，展示在没有 `NilChecker` 和使用 `NilChecker` 时的行为差异。

**问题代码：未使用 NilChecker**

```go
type Student struct {
    Name string
}

// 不带 NilChecker 的 ListKVMap
m := gmap.NewListKVMap[int, *Student](true)

callCount := 0
v1 := m.GetOrSetFuncLock(1, func() *Student {
    callCount++
    // 返回 typed nil：(*Student)(nil)
    return nil
})

fmt.Println(v1 == nil)       // true，但 key=1 已经写入
fmt.Println(m.Contains(1))   // true
fmt.Println(m.Size())        // 1

// 再次调用时，由于 key 已存在，回调不会再执行
v2 := m.GetOrSetFuncLock(1, func() *Student {
    callCount++
    return &Student{Name: "Jack"}
})

fmt.Println(callCount)       // 1（第二次不会再调用）
fmt.Println(v2 == nil)       // true
```

> 原因：在 Go 中，`(*Student)(nil)` 转成 `interface{}` 后，`any(v) == nil` 为 `false`，
> 容器内部按“非 nil”处理并写入，从而导致懒加载逻辑“失效”。

**改进代码：使用 NilChecker 解决 typed nil**

```go
// 带 NilChecker 的 ListKVMap
m := gmap.NewListKVMapWithChecker[int, *Student](func(s *Student) bool {
    // 显式把 *Student(nil) 视为“无值”
    return s == nil
}, true)

callCount := 0
v1 := m.GetOrSetFuncLock(1, func() *Student {
    callCount++
    return nil
})

fmt.Println(v1 == nil)       // true
fmt.Println(m.Contains(1))   // false，key 不会被写入
fmt.Println(m.Size())        // 0

// 再次调用时，由于 key 不存在，回调会再次执行
v2 := m.GetOrSetFuncLock(1, func() *Student {
    callCount++
    return &Student{Name: "Jack"}
})

fmt.Println(callCount)       // 2
fmt.Println(v2.Name)         // Jack
fmt.Println(m.Contains(1))   // true
fmt.Println(m.Size())        // 1
```

## 什么是 typed nil，为什么会出问题？

- **typed nil 定义**：像 `(*T)(nil)`、`(error)(nil)` 这样的“带具体类型的 nil”，在赋值给 `interface{}` 时并不等于接口层面的 `nil`，即 `any(v) == nil` 结果为 `false`。
- **容器内部判定方式**：许多容器（包括早期版本）使用 `any(v) == nil` 判定“是否为 nil”，用于决定是否写入、是否过滤；这在值为指针/接口类型时会产生歧义。
- **在懒加载/缓存模式中的影响**：
  - 回调返回 typed nil 时，本意是“不缓存，只返回 nil”；
  - 但容器会把这个值当作“有值”写入，之后再也不会执行回调，业务上就像“错误缓存了一个 nil”。

`NilChecker` 的设计目的，就是把“nil 的判定权”交还给使用者，避免 typed nil 的语义歧义。

## NilChecker 通用模型

在容器内部，`NilChecker` 的定义形式大致为：

```go
type NilChecker[T any] func(T) bool
```

**统一行为约定**：

- 当容器配置了 `NilChecker` 时：
  - 使用 `NilChecker(value)` 判断“该值是否应被视为 nil”；
- 当未配置 `NilChecker` 时：
  - 退回到默认行为：`any(value) == nil` 判定。

**当前支持 NilChecker 的容器包括**：

- **字典类型 gmap**：
  - 泛型 `KVMap[K, V]`、`ListKVMap[K, V]`。
- **集合类型 gset**：
  - 泛型 `TSet[T]`。
- **树形类型 gtree**：
  - 泛型 `AVLKVTree[K, V]`、`BKVTree[K, V]`、`RedBlackKVTree[K, V]`。

这些容器都遵循相同的模式：

- 通过 **`NewXXXWithChecker` / `NewXXXWithCheckerFrom`** 在构造阶段指定 `NilChecker`；
- 或通过 **`RegisterNilChecker`** 在运行时动态注册/替换判定逻辑；
- 然后在 **懒加载/条件写入方法** 中（如 `GetOrSet*`、`AddIfNotExist*`、`SetIfNotExist*` 系列）使用该逻辑决定是否写入。

## gmap 中的 NilChecker

在 `gmap` 模块中，支持 NilChecker 的主要类型和方法包括：

- **类型**：
  - `KVMap[K comparable, V any]`
  - `ListKVMap[K comparable, V any]`
- **构造函数与注册方法（示意）**：
  - `NewKVMapWithChecker(checker NilChecker[V], safe ...bool) *KVMap[K, V]`
  - `NewKVMapWithCheckerFrom(data map[K]V, checker NilChecker[V], safe ...bool) *KVMap[K, V]`
  - `NewListKVMapWithChecker(checker NilChecker[V], safe ...bool) *ListKVMap[K, V]`
  - `NewListKVMapWithCheckerFrom(data map[K]V, checker NilChecker[V], safe ...bool) *ListKVMap[K, V]`
  - `func (m *KVMap[K, V]) RegisterNilChecker(checker NilChecker[V])`
  - `func (m *ListKVMap[K, V]) RegisterNilChecker(checker NilChecker[V])`

**典型受影响的方法**：

- `GetOrSet` / `GetOrSetFunc` / `GetOrSetFuncLock`
- 依赖内部 `doSetWithLockCheck` 的懒加载逻辑

如果 `NilChecker(value)` 返回 `true`，这些方法通常 **只返回值而不写入键值对**。

## gset 中的 NilChecker

在 `gset` 模块中，泛型集合 `TSet[T]` 支持 NilChecker：

- **构造函数与注册方法（示意）**：
  - `NewTSetWithChecker(checker NilChecker[T], safe ...bool) *TSet[T]`
  - `NewTSetWithCheckerFrom(items []T, checker NilChecker[T], safe ...bool) *TSet[T]`
  - `func (set *TSet[T]) RegisterNilChecker(checker NilChecker[T])`

**典型受影响的方法**：

- `AddIfNotExist`
- `AddIfNotExistFunc`
- `AddIfNotExistFuncLock`

当 `NilChecker(item)` 返回 `true` 时，这些方法会视为“无效元素”，**不会向集合中添加该元素，并返回 `false`**。

**示例：过滤掉 typed nil 元素**

```go
type Student struct {
    Name string
}

// 将 *Student(nil) 视为“无效元素”，不会加入集合
set := gset.NewTSetWithChecker[*Student](func(s *Student) bool {
    return s == nil
}, true)

ok := set.AddIfNotExist(nil)
fmt.Println(ok)        // false
fmt.Println(set.Size()) // 0
```

## gtree 中的 NilChecker

在 `gtree` 模块中，以下泛型树形容器支持 NilChecker：

- `AVLKVTree[K, V]`
- `BKVTree[K, V]`
- `RedBlackKVTree[K, V]`

**构造函数与注册方法（示意）**：

- `NewAVLKVTreeWithChecker(comparator func(v1, v2 K) int, checker NilChecker[V], safe ...bool) *AVLKVTree[K, V]`
- `NewAVLKVTreeWithCheckerFrom(comparator func(v1, v2 K) int, data map[K]V, checker NilChecker[V], safe ...bool) *AVLKVTree[K, V]`
- `NewBKVTreeWithChecker(m int, comparator func(v1, v2 K) int, checker NilChecker[V], safe ...bool) *BKVTree[K, V]`
- `NewBKVTreeWithCheckerFrom(m int, comparator func(v1, v2 K) int, data map[K]V, checker NilChecker[V], safe ...bool) *BKVTree[K, V]`
- `NewRedBlackKVTreeWithChecker(comparator func(v1, v2 K) int, checker NilChecker[V], safe ...bool) *RedBlackKVTree[K, V]`
- `NewRedBlackKVTreeWithCheckerFrom(comparator func(v1, v2 K) int, data map[K]V, checker NilChecker[V], safe ...bool) *RedBlackKVTree[K, V]`
- 对应的 `RegisterNilChecker` 方法：
  - `func (tree *AVLKVTree[K, V]) RegisterNilChecker(checker NilChecker[V])`
  - `func (tree *BKVTree[K, V]) RegisterNilChecker(checker NilChecker[V])`
  - `func (tree *RedBlackKVTree[K, V]) RegisterNilChecker(checker NilChecker[V])`

**典型受影响的方法**：

- `GetOrSet` / `GetOrSetFunc` / `GetOrSetFuncLock`
- `SetIfNotExist` / `SetIfNotExistFunc` / `SetIfNotExistFuncLock`

以 `RedBlackKVTree` 为例：

```go
type Student struct {
    Name string
}

// 使用 NilChecker 将 *Student(nil) 视为“无值”，不会写入树
tr := gtree.NewRedBlackKVTreeWithChecker[int, *Student](gutil.ComparatorInt, func(s *Student) bool {
    return s == nil
}, true)

v := tr.GetOrSetFunc(1, func() *Student {
    return nil
})

fmt.Println(v == nil)       // true
fmt.Println(tr.Contains(1)) // false，key 未写入
```

## 使用建议与注意事项

- **只在需要时启用 NilChecker**：
  - 当值类型本身不会出现 typed nil（如纯值类型 `int`、`struct`）时，一般不需要配置 NilChecker；
  - 当值类型为指针/接口，且你依赖“nil 表示无值”语义时，建议显式配置。
- **NilChecker 应保持简单**：
  - 建议只做轻量判定，如 `return v == nil` 或针对少数特例；
  - 避免在 NilChecker 中做复杂逻辑（如 IO、锁等待），以免影响容器性能或引入死锁风险。
- **理解默认行为以保证兼容性**：
  - 如果不设置 NilChecker，行为与历史版本保持一致（基于 `any(v) == nil`）；
  - 只有在显式配置 NilChecker 后，typed nil 的写入语义才会发生改变。
- **统一规范项目内 NilChecker 策略**：
  - 对同一业务类型（例如缓存的 `*User` 或 `*Student`），建议在项目内统一 NilChecker 策略，避免不同模块对“nil”的理解不一致。
