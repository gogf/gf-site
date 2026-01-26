---
slug: '/docs/core/gdb-transaction-closure'
title: 'ORM Transaction - Closure'
sidebar_position: 1
hide_title: true
keywords: [GoFrame, GoFrame framework, ORM transaction handling, closure operation, transaction management, code simplification, nested transactions, automatic commit, automatic rollback, context parameters]
description: "The advantages of using closure operations for ORM transaction handling in the GoFrame framework, including reducing redundant code, lowering operational risks, and simplifying nested transactions, achieving automatic commit and rollback functions, and introducing the role of context parameters in nested transaction management to ensure transaction processing safety and simplicity."
---

## 1. Pain Points

It can be seen that there are some issues with managing transactions using conventional transaction methods:

- **Redundant code**. There are many repetitive `tx.Commit/Rollback` operations in the code.
- **High operational risk**. It is very easy to forget to execute `tx.Commit/Rollback` operations, or due to code logic bugs, causing the transaction operation not to close properly. In cases of self-managing transaction operations, most programmers encounter this pitfall. The author updates this description (2023-08-09) because a friend encountered a production incident due to improper handling of `tx.Commit/Rollback` in their transaction management.
- **Complex nested transaction implementation**. If there are multiple levels of transaction processing (nested transactions) in the business logic, it requires considering how to pass the `tx` object down, making it more cumbersome.

## 2. Closure Operation

Therefore, to facilitate safe transaction operations, the `ORM` component also provides a closure operation for transactions, implemented via the `Transaction` method, which is defined as follows:

```go
func (db DB) Transaction(ctx context.Context, f func(ctx context.Context, tx TX) error) (err error)
```

When the `error` returned by the given closure method is `nil`, the current transaction automatically executes the `Commit` operation once the closure completes; otherwise, it automatically executes the `Rollback` operation. The `context.Context` parameter in the closure is a context variable introduced in `goframe v1.16`, mainly for link tracing transmission and nested transaction management. As the context variable is an important parameter for nested transaction management, it is defined for explicit parameter passing.
:::tip
If a `panic` interruption occurs within the closure operation, the transaction will also automatically rollback to ensure operation safety.
:::
Usage example:

```go
g.DB().Transaction(context.TODO(), func(ctx context.Context, tx gdb.TX) error {
    // user
    result, err := tx.Ctx(ctx).Insert("user", g.Map{
        "passport": "john",
        "password": "12345678",
        "nickname": "JohnGuo",
    })
    if err != nil {
        return err
    }
    // user_detail
    id, err := result.LastInsertId()
    if err != nil {
        return err
    }
    _, err = tx.Ctx(ctx).Insert("user_detail", g.Map{
        "uid":       id,
        "site":      "https://johng.cn",
        "true_name": "GuoQiang",
    })
    if err != nil {
        return err
    }
    return nil
})
```

The closure operation method allows for easy implementation of nested transactions, and it is essentially transparent to upper-level business developers. For more details, you can continue reading the chapter: [ORM Transaction - Nested](ORM事务处理-嵌套事务.md)