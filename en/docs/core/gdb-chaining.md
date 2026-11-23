# ORM - Model

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

Child pages:

- [ORM Model - Model](https://goframe.org/en/docs/core/gdb-chaining-model.md)
- [ORM Model - Insert/Save](https://goframe.org/en/docs/core/gdb-chaining-insert-save.md)
- [ORM Model - Update/Delete](https://goframe.org/en/docs/core/gdb-chaining-update-delete.md)
- [ORM Model - Object Input](https://goframe.org/en/docs/core/gdb-chaining-object-parameter.md)
- [ORM Model - Fields Filtering](https://goframe.org/en/docs/core/gdb-chaining-fields-filtering.md)
- [ORM Model - Fields Retrieval](https://goframe.org/en/docs/core/gdb-chaining-fields-retrieving.md)
- [ORM Model - Transaction](https://goframe.org/en/docs/core/gdb-chaining-transaction.md)
- [ORM Model - Master/Slave](https://goframe.org/en/docs/core/gdb-chaining-master-slave.md)
- [ORM Model - Query Cache](https://goframe.org/en/docs/core/gdb-chaining-query-cache.md)
- [ORM Model - Schema](https://goframe.org/en/docs/core/gdb-chaining-schema.md)
- [ORM Model - Hook](https://goframe.org/en/docs/core/gdb-chaining-hook.md)
- [ORM Model - Handler](https://goframe.org/en/docs/core/gdb-chaining-handler.md)
- [ORM Model - Lock](https://goframe.org/en/docs/core/gdb-chaining-locks.md)
- [ORM Model - Query](https://goframe.org/en/docs/core/gdb-chaining-query.md)
- [ORM Model - Association](https://goframe.org/en/docs/core/gdb-chaining-relation.md)
- [ORM Model - Time Fields](https://goframe.org/en/docs/core/gdb-chaining-soft-time.md)

> Page: https://goframe.org/en/docs/core/gdb-chaining
