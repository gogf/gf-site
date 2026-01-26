---
slug: '/docs/core/gdb-transaction-basic'
title: 'ORM Transaction - Methods'
sidebar_position: 0
hide_title: true
keywords: [transaction operations, Begin, Commit, Rollback, GoFrame, database operations, Transaction, closure method, gdb.Tx, chain operations]
description: "Basic operations for ORM transaction handling in the GoFrame framework, including how to use the Begin, Commit, and Rollback methods to start, commit, and rollback transactions. It is particularly important to close transactions promptly after use to avoid resource leaks, and it is recommended to use the Transaction closure method for safe transaction operations."
---

The usual transaction operation methods are `Begin/Commit/Rollback`, with each method specifying a specific transaction operation. A transaction operation can be initiated by executing the `db.Begin` method, which returns an interface for transaction operations, with the type `gdb.Tx`. You can perform subsequent database operations through this object, and you can submit changes with `tx.Commit` or rollback changes with `tx.Rollback`.
:::warning
Common Issues to Note: After initiating a transaction operation, be sure to close the transaction when no longer needed using `Commit`/`Rollback` operations. It is advisable to make good use of the `defer` method. If the transaction is not closed after use, it can lead to uncontrolled growth in goroutines on the application side and saturation of transaction threads on the database side, causing subsequent transaction requests to timeout. Furthermore, it is recommended to use the `Transaction` closure method introduced later for safely implementing transaction operations: [ORM Transaction - Closure](ORM事务处理-闭包操作.md)
:::
## 1. Initiating a Transaction

```go
db := g.DB()

if tx, err := db.Begin(ctx); err == nil {
    fmt.Println("Initiating a transaction")
}
```

The transaction operation object can perform all methods of the `db` object. For more details, please refer to the [API documentation](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb).

## 2. Transaction Rollback Operation

```go
if tx, err := db.Begin(ctx); err == nil {
    r, err := tx.Save("user", g.Map{
        "id"   :  1,
        "name" : "john",
    })
    if err != nil {
        tx.Rollback()
    }
    fmt.Println(r)
}
```

## 3. Transaction Commit Operation

```go
if tx, err := db.Begin(ctx); err == nil {
    r, err := tx.Save("user", g.Map{
        "id"   :  1,
        "name" : "john",
    })
    if err == nil {
       tx.Commit()
    }
    fmt.Println(r)
}
```

## 4. Transaction Chain Operations

The transaction operation object can still return a chain operation object via the `tx.Model` method. This object is the same as the one returned by the `db.Model` method, except that database operations are performed on the transaction and can be committed or rolled back.

```go
if tx, err := db.Begin(); err == nil {
    r, err := tx.Model("user").Data(g.Map{"id":1, "name": "john_1"}).Save()
    if err == nil {
       tx.Commit()
    }
    fmt.Println(r)
}
```

For other chain operations, please refer to the [ORM - Model 🔥](../ORM链式操作/ORM链式操作.md) section.