---
slug: '/docs/core/gdb-chaining-object-parameter'
title: 'ORM Model - Object Input'
sidebar_position: 5
hide_title: true
keywords: [GoFrame, GoFrame Framework, ORM Chaining Operations, Object Input, gdb, Struct Mapping, Database ORM, Mapping Relationships, Go Language, Type Conversion]
description: "This document introduces how to use the object input feature of chaining operations in the GoFrame framework, supporting various types of data parameters, providing gdb with high flexibility. It explains in detail the mapping relationships and tag priorities when using struct objects for parameter input to achieve effective database ORM conversion."
---

The `Data/Where/WherePri/And/Or` methods support any `string/map/slice/struct/*struct` data type parameters, which provides `gdb` with great flexibility. When using `struct`/ `*struct` objects as input parameters, they will be automatically parsed as `map` types. Only the **public attributes** of the `struct` can be converted, and the `orm`/ `gconv`/ `json` tags are supported to define the key names after conversion, that is, the mapping relationship with the table fields.

For example:

```go
type User struct {
    Uid      int    `orm:"user_id"`
    Name     string `orm:"user_name"`
    NickName string `orm:"nick_name"`
}
// Or
type User struct {
    Uid      int    `gconv:"user_id"`
    Name     string `gconv:"user_name"`
    NickName string `gconv:"nick_name"`
}
// Or
type User struct {
    Uid      int    `json:"user_id"`
    Name     string `json:"user_name"`
    NickName string `json:"nick_name"`
}
```

In this, the attributes of `struct` should be public (first letter capitalized), and the `orm` tag corresponds to the field name of the data table. The tags for table field mapping relationships can use `orm`, `gconv`, or the traditional `json` tag. However, when all three tags are present, the `orm` tag takes precedence. To avoid conflicts with `JSON` encoding tags when converting `struct` objects to `JSON` data format, it is recommended to use the `orm` tag to achieve the database `ORM` mapping relationship. For more detailed conversion rules, please refer to the [Type Conversion - Map](../../类型转换/类型转换-Map转换.md) section.