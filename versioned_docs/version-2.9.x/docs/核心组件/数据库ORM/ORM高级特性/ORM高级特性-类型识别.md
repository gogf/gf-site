---
slug: '/docs/core/gdb-senior-type-recognization'
title: 'ORM高级特性-类型识别'
sidebar_position: 6
hide_title: true
keywords: [GoFrame,GoFrame框架,ORM,类型识别,Go语言,数据库映射,自动识别,MySQL,数据类型,查询]
description: '在使用GoFrame框架进行ORM查询时的高级特性——类型识别。通过GoFrame框架，查询结果中的字段值会自动识别并映射为对应的Go语言变量类型，例如int类型或string类型。这一功能对于将查询结果编码并通过JSON等方式直接返回给客户端非常实用，并有助于提升开发效率。'
---

使用 `GoFrame ORM` 查询数据时，由于字段值是一个泛型对象，返回的数据类型将会被自动识别映射到 `Go` 变量类型，作为泛型的具体值。

例如：

- 当字段类型为 `int(xx)` 时，查询到的字段值类型将会被识别会 `int` 类型
- 当字段类型为 `varchar(xxx)`/ `char(xxx)`/ `text` 等类型时将会被自动识别为 `string` 类型
- ……

以下以 `mysql` 类型为例，介绍数据库类型与 `Go` 变量类型的自动识别映射关系:
:::tip
版本可能随时迭代更新，具体可查看源码 [https://github.com/gogf/gf/blob/master/database/gdb/gdb\_core\_structure.go](https://github.com/gogf/gf/blob/master/database/gdb/gdb_core_structure.go)
:::
| 数据库类型 | Go变量类型 |
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
| `其他` | `string` |

这一特性对于需要将查询结果进行编码，并通过例如 `JSON` 方式直接返回给客户端来说将会非常友好。