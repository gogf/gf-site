---
slug: '/docs/core/gdb-chaining'
title: 'ORM链式操作(🔥重点🔥)'
sidebar_position: 1
hide_title: true
keywords: [GoFrame框架,ORM链式操作,gdb,数据库操作,Model方法,事务处理,接口文档,数据库对象,GoFrame,链式调用]
description: '本文介绍了GoFrame框架中gdb的链式操作方式，这是一种灵活且官方推荐的数据库操作方式。通过db.Model或tx.Model方法，可以基于数据表返回链式操作对象*Model，支持多种数据库操作，如Replace、Save、InsertGetId等，并详细说明了每种数据库的支持情况。'
---

## 基本介绍

`gdb` 链式操作使用方式简单灵活，是 `GoFrame` 框架官方推荐的数据库操作方式。链式操作可以通过数据库对象的 `db.Model` 方法或者事务对象的 `tx.Model` 方法，基于指定的数据表返回一个链式操作对象 `*Model`，该对象可以执行以下方法。当前方法列表可能滞后于源代码，详细的方法列表请参考接口文档： [https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#Model](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#Model)

## 部分不支持的操作

以下是最新版本的支持情况

| 类型 | Replace | Save | InsertIgnore | InsertGetId | LastInsertId | Transaction | RowsAffected |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `mysql` | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 |
| `mariadb` | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 |
| `tidb` | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 |
| `pgsql` | 不支持 | 支持 | 不支持 | 支持 | 支持 | 支持 | 支持 |
| `mssql` | 不支持 | 支持 | 支持 | 支持 | 不支持 | 支持 | 支持 |
| `sqlite` | 不支持 | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 |
| `oracle` | 不支持 | 支持 | 支持 | 支持 | 不支持 | 支持 | 支持 |
| `dm` | 不支持 | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 |
| `clickhouse` | 不支持 | 不支持 | 不支持 | 不支持 | 支持 | 不支持 | 不支持 |

## 相关文档
import DocCardList from '@theme/DocCardList';

<DocCardList />