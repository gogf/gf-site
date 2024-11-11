---
slug: '/docs/core/gdb-chaining-fields-retrieving'
title: 'ORM链式操作-字段获取'
sidebar_position: 7
hide_title: true
keywords: [ORM,链式操作,字段获取,FieldsStr,FieldsExStr,GoFrame,GoFrame框架,数据库字段,字段前缀,字段排除]
description: '使用GoFrame框架中的ORM链式操作来获取数据库表字段的技巧，包括使用FieldsStr和FieldsExStr方法获取指定表的字段及排除字段的用法，支持字段前缀自定义，提升开发效率和代码可读性。'
---

## `FieldsStr/FieldsExStr` 字段获取

1. `FieldsStr` 用于获取指定表的字段，并可给定字段前缀，字段之间使用" `,`"符号连接成字符串返回；
2. `FieldsExStr` 用于获取指定表中例外的字段，并可给定字段前缀，字段之间使用" `,`"符号连接成字符串返回；

### `FieldsStr` 示例

1. 假如 `user` 表有4个字段 `uid`, `nickname`, `passport`, `password`。
2. 查询字段

```go
// uid,nickname,passport,password
g.Model("user").FieldsStr()
```

3. 查询字段给指定前缀

```go
// gf_uid,gf_nickname,gf_passport,gf_password
g.Model("user").FieldsStr("gf_")
```


### `FieldsExStr` 示例

1. 假如 `user` 表有4个字段 `uid`, `nickname`, `passport`, `password`。
2. 查询字段排除

```go
// uid,nickname
g.Model("user").FieldsExStr("passport, password")
```

3. 查询字段排除并给定前缀

```go
// gf_uid,gf_nickname
g.Model("user").FieldsExStr("passport, password", "gf_")
```