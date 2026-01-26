---
slug: '/docs/core/gdb-chaining'
title: 'ORM - Model 🔥'
sidebar_position: 1
hide_title: true
keywords: [GoFrame Framework, ORM Chaining Operation, gdb, Database Operation, Model Method, Transaction Processing, API Documentation, Database Object, GoFrame, Chaining Invocation]
description: "The chaining operation of gdb in the GoFrame framework, a flexible and officially recommended way to operate the database. Through the db.Model or tx.Model methods, a chained operation object *Model can be returned based on the data table, supporting various database operations such as Replace, Save, InsertGetId, etc., with a detailed explanation of the support status for each database."
---

## Introduction

`gdb` chaining operation is simple and flexible, and is the officially recommended database operation method by the `GoFrame` framework. Chaining operation can be done by using the `db.Model` method of the database object or the `tx.Model` method of the transaction object, which returns a chaining operation object `*Model` based on the specified data table. This object can perform the following methods. The current method list may lag behind the source code; for a detailed method list, please refer to the API documentation: [https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#Model](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#Model)

## Partially Unsupported Operations

Below is the support status of the latest version

| Type | Replace | Save | InsertIgnore | InsertGetId | LastInsertId | Transaction | RowsAffected |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `mysql` | Supported | Supported | Supported | Supported | Supported | Supported | Supported |
| `mariadb` | Supported | Supported | Supported | Supported | Supported | Supported | Supported |
| `tidb` | Supported | Supported | Supported | Supported | Supported | Supported | Supported |
| `pgsql` | Unsupported | Supported | Unsupported | Supported | Supported | Supported | Supported |
| `mssql` | Unsupported | Supported | Supported | Supported | Unsupported | Supported | Supported |
| `sqlite` | Unsupported | Supported | Supported | Supported | Supported | Supported | Supported |
| `oracle` | Unsupported | Supported | Supported | Supported | Unsupported | Supported | Supported |
| `dm` | Unsupported | Supported | Supported | Supported | Supported | Supported | Supported |
| `clickhouse` | Unsupported | Unsupported | Unsupported | Unsupported | Supported | Unsupported | Unsupported |

## Documentation
import DocCardList from '@theme/DocCardList';

<DocCardList />