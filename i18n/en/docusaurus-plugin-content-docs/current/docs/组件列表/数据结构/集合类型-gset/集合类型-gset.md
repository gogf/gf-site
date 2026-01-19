---
slug: '/docs/components/container-gset'
title: 'Set'
sidebar_position: 2
hide_title: true
keywords: [GoFrame, GoFrame Framework, gset, Collection Type, Concurrent Safety, Element Collection, Go Language, Collection Operation, GoFrame Framework, Collection Interface]
description: "The gset collection type in the GoFrame framework is characterized by a set of non-repeating elements, supporting elements of any type. gset provides a concurrent safety option, making it an efficient tool for collection operations, suitable for application in the Go language. Detailed usage instructions and interface documentation links are provided for developers to consult."
---

## Introduction

A collection is a set of non-repeating elements, where the elements can be of any type.

At the same time, `gset` supports optional concurrent safety parameters for concurrent-safe scenarios.

**Use Cases**:

Collection operations.

**Usage**:

```go
import "github.com/gogf/gf/v2/container/gset"
```

**Interface Documentation**: [https://pkg.go.dev/github.com/gogf/gf/v2/container/gset](https://pkg.go.dev/github.com/gogf/gf/v2/container/gset)

## NilChecker and Typed Nil Support

- **Feature Overview**: In the generic version, `gset` provides `NilChecker` functions for the generic set type `TSet[T]` to customize "which elements should be considered nil", for more precise handling of typed nil scenarios when containing pointers, interfaces, and other types.
- **Usage**: You can create sets via `NewTSetWithChecker`, `NewTSetWithCheckerFrom`, or register at runtime by calling `RegisterNilChecker` with a `func(T) bool` determination function. Lazy loading/conditional write methods (such as `AddIfNotExist*` series) will call this function before actually writing, and usually won't add the element to the set when determined as nil.
- **Compatibility**: If `NilChecker` is not set, it maintains consistency with historical versions, defaulting to `any(v) == nil` for determination, and typed nil behavior won't change.

**Example**:

```go
type Student struct {
    Name string
}

// Treat *Student(nil) as "invalid element", won't add to set
set := gset.NewTSetWithChecker[*Student](func(s *Student) bool {
    return s == nil
}, true)

ok := set.AddIfNotExist(nil)
fmt.Println(ok)      // false
fmt.Println(set.Size()) // 0
```

## Documentation
import DocCardList from '@theme/DocCardList';

<DocCardList />