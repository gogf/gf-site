---
slug: '/docs/components/container-gvar'
title: '泛型类型-gvar'
sidebar_position: 4
hide_title: true
keywords: [GoFrame,GoFrame框架,gvar,泛型类型,运行时泛型,并发安全,数据类型转换,g.Var,开发效率]
description: 'GoFrame框架中的gvar类型，它是一种运行时泛型实现，旨在提高开发便捷性和效率。gvar支持内置数据类型转换，并可作为interface{}的替代类型，其与并发安全特性使其在需要频繁数据转换的场景下表现出色。此外，还介绍了gvar类型的使用方式和相关接口文档。'
---

![](/markdown/cd9ed75865d6b5efe704f58156a42fa4.png)

## 基本介绍

`gvar` 是一种 **运行时泛型** 实现，以较小的运行时开销提高开发便捷性以及研发效率，支持各种内置的数据类型转换，可以作为 `interface{}` 类型的替代数据类型，并且该类型支持并发安全开关。
:::tip
框架同时提供了 `g.Var` 的数据类型，其实也是 `gvar.Var` 数据类型的别名。
:::
**使用场景**：

使用 `interface{}` 的场景，各种不固定数据类型格式，或者需要对变量进行频繁的数据类型转换的场景。

**使用方式**：

```go
import "github.com/gogf/gf/v2/container/gvar"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/container/gvar](https://pkg.go.dev/github.com/gogf/gf/v2/container/gvar)

## 相关文档

import DocCardList from '@theme/DocCardList';

<DocCardList />