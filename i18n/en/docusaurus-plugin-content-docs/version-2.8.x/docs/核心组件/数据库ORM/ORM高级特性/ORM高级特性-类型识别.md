---
slug: '/docs/core/gdb-senior-type-recognization'
title: 'ORM Senior - Type Recognition'
sidebar_position: 6
hide_title: true
keywords: [GoFrame, GoFrame Framework, ORM, Type Recognition, Go Language, Database Mapping, Automatic Recognition, MySQL, Data Types, Query]
description: "In advanced features of GoFrame framework ORM queries, - Type Recognition. Through the GoFrame framework, field values in the query results will be automatically recognized and mapped to the corresponding Go language variable types, such as int type or string type. This functionality is very useful for encoding query results and directly returning them to the client via JSON and helps to improve development efficiency."
---

When using `GoFrame ORM` to query data, since the field value is a generic object, the returned data type will be automatically recognized and mapped to the `Go` variable type as the concrete value of the generic.

For example:

- When the field type is `int(xx)`, the queried field value type will be recognized as `int` type
- When the field type is `varchar(xxx)`/ `char(xxx)`/ `text`, etc., it will be automatically recognized as `string` type
- ……

Taking `mysql` types as an example, the following introduces the automatic recognition and mapping relationship between database types and `Go` variable types:
:::tip
The version may be updated iteratively, please check the source code for details [https://github.com/gogf/gf/blob/master/database/gdb/gdb_core_structure.go](https://github.com/gogf/gf/blob/master/database/gdb/gdb_core_structure.go)
:::
| Database Type | Go Variable Type |
| --- | --- |
| `*char` | `string` |
| `*text` | `string` |
| `*binary` | `bytes` |
| `*blob` | `bytes` |
| `*int` | `int` |
| `*money` | `float64` |
| `bit` | `int` |
| `big_int` | `int64` |
| `float` | `float64` |
| `double` | `float64` |
| `decimal` | `float64` |
| `bool` | `bool` |
| `year` | `time.Time` |
| `date` | `time.Time` |
| `datetime` | `time.Time` |
| `time` | `time.Time` |
| `timestamp` | `time.Time` |
| `others` | `string` |

This feature is especially friendly for encoding query results and directly returning them to the client via methods like `JSON`.