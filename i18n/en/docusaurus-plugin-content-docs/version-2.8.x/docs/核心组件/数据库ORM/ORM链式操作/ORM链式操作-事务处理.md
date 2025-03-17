---
slug: '/docs/core/gdb-chaining-transaction'
title: 'ORM Model - Transaction'
sidebar_position: 8
hide_title: true
keywords: [GoFrame, Transaction Handling, ORM Chaining, GoFrame Framework, Transaction, TX Interface, Database Object, Transaction Object, Chaining Operations, Commit/Rollback]
description: "Using transaction handling in the GoFrame framework for ORM chaining methods. Through the Transaction and TX interfaces, transactional operations on the database can be achieved to ensure data consistency and reliability. Provides a detailed explanation of using the TX interface to create Model objects and the commit and rollback mechanisms in transaction handling."
---

`Model` objects can also be created through the `TX` transaction interface. The functionality of a `Model` object created through a transaction object is the same as that of one created through a `DB` database object, except that the former's operations are based on transactions. Once the transaction is committed or rolled back, the corresponding `Model` object cannot be used further; otherwise, an error will be returned. Because the `TX` interface cannot be reused, a transaction object corresponds to a single transaction process and ends after `Commit`/`Rollback`.

This chapter provides a simple introduction to transaction handling methods involved in chaining operations. For more detailed information, please refer to the [ORM - Transaction](../ORM事务处理/ORM事务处理.md) chapter.

## Example 1: Using `Transaction`

To facilitate transaction operations, `gdb` provides a closure operation for transactions, implemented through the `Transaction` method, which is defined as follows:

```go
func (db DB) Transaction(ctx context.Context, f func(ctx context.Context, tx TX) error) (err error)
```

If the `error` returned by the given closure method is `nil`, the `Commit` operation is automatically executed after the closure finishes execution; otherwise, it automatically performs a `Rollback`.
:::tip
If a `panic` occurs within the closure operation, the transaction will also be rolled back.
:::
```go
func Register() error {
    return g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
        var (
            result sql.Result
            err    error
        )
        // Insert basic user data
        result, err = tx.Table("user").Insert(g.Map{
            "name":  "john",
            "score": 100,
            //...
        })
        if err != nil {
            return err
        }
        // Insert user detail data, utilizing the user uid from the previous insertion
        result, err = tx.Table("user_detail").Insert(g.Map{
            "uid":   result.LastInsertId(),
            "phone": "18010576258",
            //...
        })
        return err
    })
}
```

## Example 2: Using `TX` Chaining Operations

We can also switch the bound transaction object within chaining operations using the `TX` method. Multiple chaining operations can bind to the same transaction object, executing the corresponding chaining operations within that transaction object.

```go
func Register() error {
    var (
        uid int64
        err error
    )
    tx, err := g.DB().Begin()
    if err != nil {
        return err
    }
    // Validate the return value upon method exit,
    // If successful, execute tx.Commit() to commit,
    // Otherwise, execute tx.Rollback() to roll back.
    defer func() {
        if err != nil {
            tx.Rollback()
        } else {
            tx.Commit()
        }
    }()
    // Insert basic user data
    uid, err = AddUserInfo(tx, g.Map{
        "name":  "john",
        "score": 100,
        //...
    })
    if err != nil {
        return err
    }
    // Insert user detail data, using the user uid from the previous insertion
    err = AddUserDetail(tx, g.Map{
        "uid":   uid,
        "phone": "18010576259",
        //...
    })
    return err
}

func AddUserInfo(tx gdb.TX, data g.Map) (int64, error) {
    result, err := g.Model("user").TX(tx).Data(data).Insert()
    if err != nil {
        return 0, err
    }
    uid, err := result.LastInsertId()
    if err != nil {
        return 0, err
    }
    return uid, nil
}

func AddUserDetail(tx gdb.TX, data g.Map) error {
    _, err := g.Model("user_detail").TX(tx).Data(data).Insert()
    return err
}
```