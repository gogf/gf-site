---
slug: '/docs/core/gdb-funcs'
title: 'ORM - Method Ops (Native)'
sidebar_position: 2
hide_title: true
keywords: [GoFrame, GoFrame Framework, ORM, SQL Operations, Database Query, Data Insertion, Data Update, Data Deletion, Batch Operations, Chain Operations]
description: "Using the GoFrame framework for native SQL ORM method operations. This guide explains how to execute complex SQL operations through method manipulation, including database queries, data insertion, updating, deletion, and batch operations, providing detailed code examples."
---

## Method Operations

Method operations are used for native `SQL` execution, which are more foundational compared to chain operations. When `ORM` chain operations are unable to handle overly complex `SQL` operations, method operations can be used instead.

**API Documentation:** 

[https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#DB](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#DB)

**Common Methods:**

The list of methods in this document may lag behind the code. For a detailed list of methods, please refer to the API documentation. The following methods are for reference only.

```go
// SQL operation methods, returning native standard library sql objects
Query(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error)
Exec(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
Prepare(ctx context.Context, query string) (*sql.Stmt, error)

// Database record queries:
// Query single record, query multiple records, get record object, query single field value (similar to chain operations)
GetAll(ctx context.Context, sql string, args ...interface{}) (Result, error)
GetOne(ctx context.Context, sql string, args ...interface{}) (Record, error)
GetValue(ctx context.Context, sql string, args ...interface{}) (Value, error)
GetArray(ctx context.Context, sql string, args ...interface{}) ([]Value, error)
GetCount(ctx context.Context, sql string, args ...interface{}) (int, error)
GetScan(ctx context.Context, objPointer interface{}, sql string, args ...interface{}) error

// Single data operation
Insert(ctx context.Context, table string, data interface{}, batch...int) (sql.Result, error)
Replace(ctx context.Context, table string, data interface{}, batch...int) (sql.Result, error)
Save(ctx context.Context, table string, data interface{}, batch...int) (sql.Result, error)

// Data update/delete
Update(ctx context.Context, table string, data interface{}, condition interface{}, args ...interface{}) (sql.Result, error)
Delete(ctx context.Context, table string, condition interface{}, args ...interface{}) (sql.Result, error)
```

**Brief Description:**

1. `Query` is the original data query method that returns the native standard library's result set object, requiring manual parsing. It is recommended to use the `Get*` methods, which automatically parse the results.
2. `Exec` is used for `SQL` operations related to writing/updating.
3. It is recommended to use the `Get*` series of query methods for data queries.
4. The `data` parameter in the `Insert`/`Replace`/`Save` methods supports data types: `string/map/slice/struct/*struct`. When passed as a `slice` type, it is automatically recognized as a batch operation, and the `batch` parameter is effective.

## Operation Examples

### 1. `ORM` Object

```go
// Get the database object with default configuration (configuration name is "default")
db := g.DB()

// Get the database object with the configuration group name "user-center"
db := g.DB("user-center")

// Use the native singleton management method to get the database object singleton
db, err := gdb.Instance()
db, err := gdb.Instance("user-center")

// Note that there is no need to use the Close method to close the database connection when not in use (and gdb does not provide a Close method).
// The underlying design of the database engine uses connection pooling, and the connection will automatically close when it is no longer in use.
```

### 2. Data Insertion

```go
r, err := db.Insert(ctx, "user", gdb.Map {
    "name": "john",
})
```

### 3. Data Query (List)

```go
list, err := db.GetAll(ctx, "select * from user limit 2")
list, err := db.GetAll(ctx, "select * from user where age > ? and name like ?", g.Slice{18, "%john%"})
list, err := db.GetAll(ctx, "select * from user where status=?", g.Slice{1})
```

### 4. Data Query (Single Record)

```go
one, err := db.GetOne(ctx, "select * from user limit 2")
one, err := db.GetOne(ctx, "select * from user where uid=1000")
one, err := db.GetOne(ctx, "select * from user where uid=?", 1000)
one, err := db.GetOne(ctx, "select * from user where uid=?", g.Slice{1000})
```

### 5. Data Save

```go
r, err := db.Save(ctx, "user", gdb.Map {
    "uid"  :  1,
    "name" : "john",
})
```

### 6. Batch Operations

The `batch` parameter is used to specify the number of records to be written in batches during batch operations (default is `10`).

```go
_, err := db.Insert(ctx, "user", gdb.List {
    {"name": "john_1"},
    {"name": "john_2"},
    {"name": "john_3"},
    {"name": "john_4"},
}, 10)
```

### 7. Data Update/Delete

```go
// db.Update/db.Delete likewise
// UPDATE `user` SET `name`='john' WHERE `uid`=10000
r, err := db.Update(ctx, "user", gdb.Map {"name": "john"}, "uid=?", 10000)
// UPDATE `user` SET `name`='john' WHERE `uid`=10000
r, err := db.Update(ctx, "user", "name='john'", "uid=10000")
// UPDATE `user` SET `name`='john' WHERE `uid`=10000
r, err := db.Update(ctx, "user", "name=?", "uid=?", "john", 10000)
```

Note that it is supported and recommended to use prepared statement mode (using `?` placeholders) for input to avoid `SQL` injection risks.