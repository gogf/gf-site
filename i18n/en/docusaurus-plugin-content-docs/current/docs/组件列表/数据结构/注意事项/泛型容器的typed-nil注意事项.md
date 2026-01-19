---
slug: '/docs/components/container-nilchecker'
title: 'NilChecker and Typed Nil'
sidebar_position: 1
hide_title: true
keywords: [GoFrame,GoFrame Framework,NilChecker,typed nil,container,generics,gmap,gset,gtree]
description: 'Explains how to use NilChecker in GoFrame data structure containers to solve typed nil determination issues, with usage examples and best practices for gmap/gset/gtree.'
---

## Scenario Example: Lazy Loading Cache Encounters Typed Nil

The following example uses `gmap.ListKVMap` to demonstrate the behavioral differences between not using `NilChecker` and using `NilChecker`.

**Problem Code: Without NilChecker**

```go
type Student struct {
    Name string
}

// ListKVMap without NilChecker
m := gmap.NewListKVMap[int, *Student](true)

callCount := 0
v1 := m.GetOrSetFuncLock(1, func() *Student {
    callCount++
    // Returns typed nil: (*Student)(nil)
    return nil
})

fmt.Println(v1 == nil)       // true, but key=1 has been written
fmt.Println(m.Contains(1))   // true
fmt.Println(m.Size())        // 1

// On second call, callback won't execute again since key exists
v2 := m.GetOrSetFuncLock(1, func() *Student {
    callCount++
    return &Student{Name: "Jack"}
})

fmt.Println(callCount)       // 1 (second call doesn't execute)
fmt.Println(v2 == nil)       // true
```

> Reason: In Go, when `(*Student)(nil)` is converted to `interface{}`, `any(v) == nil` returns `false`.
> The container treats it as "non-nil" and writes it, causing the lazy loading logic to "fail".

**Improved Code: Using NilChecker to Solve Typed Nil**

```go
// ListKVMap with NilChecker
m := gmap.NewListKVMapWithChecker[int, *Student](func(s *Student) bool {
    // Explicitly treat *Student(nil) as "no value"
    return s == nil
}, true)

callCount := 0
v1 := m.GetOrSetFuncLock(1, func() *Student {
    callCount++
    return nil
})

fmt.Println(v1 == nil)       // true
fmt.Println(m.Contains(1))   // false, key is not written
fmt.Println(m.Size())        // 0

// On second call, callback executes again since key doesn't exist
v2 := m.GetOrSetFuncLock(1, func() *Student {
    callCount++
    return &Student{Name: "Jack"}
})

fmt.Println(callCount)       // 2
fmt.Println(v2.Name)         // Jack
fmt.Println(m.Contains(1))   // true
fmt.Println(m.Size())        // 1
```

## What is Typed Nil and Why Does it Cause Problems?

- **Typed nil definition**: Values like `(*T)(nil)` or `(error)(nil)` are "nil with a specific type". When assigned to `interface{}`, they are not equal to interface-level `nil`, i.e., `any(v) == nil` returns `false`.
- **Container internal determination**: Many containers (including earlier versions) use `any(v) == nil` to determine "whether nil", which decides whether to write or filter. This creates ambiguity when the value is a pointer/interface type.
- **Impact on lazy loading/cache mode**:
  - When callback returns typed nil, the intention is "don't cache, just return nil";
  - But the container treats this value as "has value" and writes it, so the callback never executes again, as if "a nil was incorrectly cached".

The purpose of `NilChecker` is to give users control over "nil determination" to avoid semantic ambiguity of typed nil.

## NilChecker Common Model

Inside containers, `NilChecker` is defined as:

```go
type NilChecker[T any] func(T) bool
```

**Unified behavior convention**:

- When a container has configured `NilChecker`:
  - Use `NilChecker(value)` to determine "whether this value should be considered nil";
- When `NilChecker` is not configured:
  - Fall back to default behavior: `any(value) == nil` determination.

**Containers currently supporting NilChecker include**:

- **Map type gmap**:
  - Generic `KVMap[K, V]`, `ListKVMap[K, V]`.
- **Set type gset**:
  - Generic `TSet[T]`.
- **Tree type gtree**:
  - Generic `AVLKVTree[K, V]`, `BKVTree[K, V]`, `RedBlackKVTree[K, V]`.

These containers all follow the same pattern:

- Specify `NilChecker` during construction via **`NewXXXWithChecker` / `NewXXXWithCheckerFrom`**;
- Or dynamically register/replace determination logic at runtime via **`RegisterNilChecker`**;
- Then use this logic in **lazy loading/conditional write methods** (such as `GetOrSet*`, `AddIfNotExist*`, `SetIfNotExist*` series) to decide whether to write.

## NilChecker in gmap

In the `gmap` module, the main types and methods supporting NilChecker include:

- **Types**:
  - `KVMap[K comparable, V any]`
  - `ListKVMap[K comparable, V any]`
- **Constructor and registration methods (illustrative)**:
  - `NewKVMapWithChecker(checker NilChecker[V], safe ...bool) *KVMap[K, V]`
  - `NewKVMapWithCheckerFrom(data map[K]V, checker NilChecker[V], safe ...bool) *KVMap[K, V]`
  - `NewListKVMapWithChecker(checker NilChecker[V], safe ...bool) *ListKVMap[K, V]`
  - `NewListKVMapWithCheckerFrom(data map[K]V, checker NilChecker[V], safe ...bool) *ListKVMap[K, V]`
  - `func (m *KVMap[K, V]) RegisterNilChecker(checker NilChecker[V])`
  - `func (m *ListKVMap[K, V]) RegisterNilChecker(checker NilChecker[V])`

**Typically affected methods**:

- `GetOrSet` / `GetOrSetFunc` / `GetOrSetFuncLock`
- Lazy loading logic relying on internal `doSetWithLockCheck`

If `NilChecker(value)` returns `true`, these methods usually **only return the value without writing the key-value pair**.

## NilChecker in gset

In the `gset` module, the generic set `TSet[T]` supports NilChecker:

- **Constructor and registration methods (illustrative)**:
  - `NewTSetWithChecker(checker NilChecker[T], safe ...bool) *TSet[T]`
  - `NewTSetWithCheckerFrom(items []T, checker NilChecker[T], safe ...bool) *TSet[T]`
  - `func (set *TSet[T]) RegisterNilChecker(checker NilChecker[T])`

**Typically affected methods**:

- `AddIfNotExist`
- `AddIfNotExistFunc`
- `AddIfNotExistFuncLock`

When `NilChecker(item)` returns `true`, these methods consider it an "invalid element", **do not add the element to the set, and return `false`**.

**Example: Filter out typed nil elements**

```go
type Student struct {
    Name string
}

// Treat *Student(nil) as "invalid element", won't add to set
set := gset.NewTSetWithChecker[*Student](func(s *Student) bool {
    return s == nil
}, true)

ok := set.AddIfNotExist(nil)
fmt.Println(ok)        // false
fmt.Println(set.Size()) // 0
```

## NilChecker in gtree

In the `gtree` module, the following generic tree containers support NilChecker:

- `AVLKVTree[K, V]`
- `BKVTree[K, V]`
- `RedBlackKVTree[K, V]`

**Constructor and registration methods (illustrative)**:

- `NewAVLKVTreeWithChecker(comparator func(v1, v2 K) int, checker NilChecker[V], safe ...bool) *AVLKVTree[K, V]`
- `NewAVLKVTreeWithCheckerFrom(comparator func(v1, v2 K) int, data map[K]V, checker NilChecker[V], safe ...bool) *AVLKVTree[K, V]`
- `NewBKVTreeWithChecker(m int, comparator func(v1, v2 K) int, checker NilChecker[V], safe ...bool) *BKVTree[K, V]`
- `NewBKVTreeWithCheckerFrom(m int, comparator func(v1, v2 K) int, data map[K]V, checker NilChecker[V], safe ...bool) *BKVTree[K, V]`
- `NewRedBlackKVTreeWithChecker(comparator func(v1, v2 K) int, checker NilChecker[V], safe ...bool) *RedBlackKVTree[K, V]`
- `NewRedBlackKVTreeWithCheckerFrom(comparator func(v1, v2 K) int, data map[K]V, checker NilChecker[V], safe ...bool) *RedBlackKVTree[K, V]`
- Corresponding `RegisterNilChecker` methods:
  - `func (tree *AVLKVTree[K, V]) RegisterNilChecker(checker NilChecker[V])`
  - `func (tree *BKVTree[K, V]) RegisterNilChecker(checker NilChecker[V])`
  - `func (tree *RedBlackKVTree[K, V]) RegisterNilChecker(checker NilChecker[V])`

**Typically affected methods**:

- `GetOrSet` / `GetOrSetFunc` / `GetOrSetFuncLock`
- `SetIfNotExist` / `SetIfNotExistFunc` / `SetIfNotExistFuncLock`

Using `RedBlackKVTree` as an example:

```go
type Student struct {
    Name string
}

// Use NilChecker to treat *Student(nil) as "no value", won't write to tree
tr := gtree.NewRedBlackKVTreeWithChecker[int, *Student](gutil.ComparatorInt, func(s *Student) bool {
    return s == nil
}, true)

v := tr.GetOrSetFunc(1, func() *Student {
    return nil
})

fmt.Println(v == nil)       // true
fmt.Println(tr.Contains(1)) // false, key not written
```

## Usage Recommendations and Considerations

- **Enable NilChecker only when needed**:
  - When the value type itself won't have typed nil (like pure value types `int`, `struct`), you generally don't need to configure NilChecker;
  - When the value type is a pointer/interface and you rely on "nil means no value" semantics, it's recommended to explicitly configure.
- **NilChecker should be kept simple**:
  - Recommend only lightweight checks, like `return v == nil` or for a few special cases;
  - Avoid complex logic in NilChecker (like IO, lock waiting) to prevent affecting container performance or introducing deadlock risks.
- **Understand default behavior to ensure compatibility**:
  - If NilChecker is not set, behavior remains consistent with historical versions (based on `any(v) == nil`);
  - Only after explicitly configuring NilChecker will the write semantics of typed nil change.
- **Unify NilChecker strategy within your project**:
  - For the same business type (e.g., cached `*User` or `*Student`), recommend unifying NilChecker strategy within the project to avoid inconsistent understanding of "nil" across different modules.
