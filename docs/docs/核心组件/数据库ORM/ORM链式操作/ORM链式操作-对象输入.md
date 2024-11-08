---
slug: '/docs/core/gdb-chaining-object-parameter'
title: 'ORM链式操作-对象输入'
sidebar_position: 5
hide_title: true
keywords: [GoFrame,GoFrame框架,ORM链式操作,对象输入,gdb,struct映射,数据库ORM,映射关系,Go语言,类型转换]
description: '该文档介绍了如何在GoFrame框架中使用链式操作的对象输入功能，支持不同类型的数据参数，使得gdb具有极高的灵活性。详细说明了使用struct对象进行参数输入时的映射关系以及标签的优先级，以实现数据库ORM的有效转换。'
---

`Data/Where/WherePri/And/Or` 方法支持任意的 `string/map/slice/struct/*struct` 数据类型参数，该特性为 `gdb` 提供了很高的灵活性。当使用 `struct`/ `*struct` 对象作为输入参数时，将会被自动解析为 `map` 类型，只有 `struct` 的 **公开属性** 能够被转换，并且支持 `orm`/ `gconv`/ `json` 标签，用于定义转换后的键名，即与表字段的映射关系。

例如:

```go
type User struct {
    Uid      int    `orm:"user_id"`
    Name     string `orm:"user_name"`
    NickName string `orm:"nick_name"`
}
// 或者
type User struct {
    Uid      int    `gconv:"user_id"`
    Name     string `gconv:"user_name"`
    NickName string `gconv:"nick_name"`
}
// 或者
type User struct {
    Uid      int    `json:"user_id"`
    Name     string `json:"user_name"`
    NickName string `json:"nick_name"`
}
```

其中， `struct` 的属性应该是公开属性（首字母大写）， `orm` 标签对应的是数据表的字段名称。表字段的对应关系标签既可以使用 `orm`，也可以用 `gconv`，还可以使用传统的 `json` 标签，但是当三种标签都存在时， `orm` 标签的优先级更高。为避免将 `struct` 对象转换为 `JSON` 数据格式返回时与 `JSON` 编码标签冲突，推荐使用 `orm` 标签来实现数据库 `ORM` 的映射关系。更详细的转换规则请查看 [类型转换-Map转换](../../类型转换/类型转换-Map转换.md) 章节。