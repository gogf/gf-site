---
slug: '/docs/components/container-gset'
title: '集合类型-gset'
sidebar_position: 2
hide_title: true
keywords: [GoFrame,GoFrame框架,gset,集合类型,并发安全,元素集合,Go语言,集合操作,GoFrame框架,集合接口]
description: 'GoFrame框架中的集合类型gset，其特点是不重复元素集合，支持任意类型的元素。gset提供了并发安全的选项，是一种高效的集合操作工具，适合在Go语言中应用。提供了详细的使用方式及接口文档链接，便于开发者查阅。'
---

## 基本介绍

集合，即不可重复的一组元素，元素项可以为任意类型。

同时， `gset` 支持可选的并发安全参数选项，支持并发安全的场景。

**使用场景**：

集合操作。

**使用方式**：

```go
import "github.com/gogf/gf/v2/container/gset"
```

**接口文档**： [https://pkg.go.dev/github.com/gogf/gf/v2/container/gset](https://pkg.go.dev/github.com/gogf/gf/v2/container/gset)

## NilChecker 与 typed nil 支持

- **功能简介**：在泛型版本中，`gset` 为泛型集合类型 `TSet[T]` 提供了 `NilChecker` 函数，用于自定义“哪些元素应当被视为 nil”，以便在包含指针、接口等类型时更精确地处理 typed nil 场景。
- **使用方式**：可以通过 `NewTSetWithChecker`、`NewTSetWithCheckerFrom` 创建集合，或在运行时调用 `RegisterNilChecker` 注册一个 `func(T) bool` 判定函数，懒加载/条件写入方法（如 `AddIfNotExist*` 系列）在真正写入前会先调用该函数，当判定为 nil 时通常不会将该元素加入集合。
- **兼容性**：如果未设置 `NilChecker`，则保持与历史版本一致，默认使用 `any(v) == nil` 进行判定，typed nil 的行为不会发生变化。

**示例**：

```go
type Student struct {
    Name string
}

// 将 *Student(nil) 视为“无效元素”，不会加入集合
set := gset.NewTSetWithChecker[*Student](func(s *Student) bool {
    return s == nil
}, true)

ok := set.AddIfNotExist(nil)
fmt.Println(ok)      // false
fmt.Println(set.Size()) // 0
```

## 相关文档
import DocCardList from '@theme/DocCardList';

<DocCardList />