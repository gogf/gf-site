---
slug: '/docs/core/gdb-transaction-nested'
title: 'ORM Transaction - Nested'
sidebar_position: 2
hide_title: true
keywords: [GoFrame, GoFrame Framework, ORM, Nested Transactions, Transaction Handling, Database, SQL, Transaction Save Point, Rollback, Closure]
description: "Using the ORM functionality in the GoFrame framework to handle nested transactions. The article explains in detail the basic principles, methods, and log information of nested transactions, provides examples of regular operations and closure operations, and points out potential issues. Finally, a reference example of nested transactions in a project is provided to help developers understand how to apply this in real-world projects."
---

The `GoFrame ORM` supports database nested transactions, which are commonly used in business projects, especially in mutual calls between business modules, to ensure that the database operations of each business module are within a transaction. This is achieved by implicitly passing and associating the same transaction object through the `context`. It should be noted that database services often do not support nested transactions but rely on the `ORM` component layer to implement this using the `Transaction Save Point` feature. Similarly, we recommend using the `Transaction` closure method to implement nested transactions. For completeness, we will still introduce nested transaction operations starting from the most basic transaction operation methods here.

## 1. Example SQL

A simple example `SQL`, containing two fields `id` and `name`:

```sql
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL COMMENT 'User ID',
  `name` varchar(45) NOT NULL COMMENT 'User Name',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 2. Regular Operations (Not Recommended)

```go
db := g.DB()

tx, err := db.Begin()
if err != nil {
    panic(err)
}
if err = tx.Begin(); err != nil {
    panic(err)
}
_, err = tx.Model(table).Data(g.Map{"id": 1, "name": "john"}).Insert()
if err = tx.Rollback(); err != nil {
    panic(err)
}
_, err = tx.Model(table).Data(g.Map{"id": 2, "name": "smith"}).Insert()
if err = tx.Commit(); err != nil {
    panic(err)
}
```

### 1. `db.Begin` and `tx.Begin`

In our nested transaction example, we see `db.Begin` and `tx.Begin` as two ways to start transactions. What is the difference between them? `db.Begin` actually starts a transaction operation on the database service and returns a transaction operation object `tx`. All subsequent transaction operations are managed through this `tx` transaction object. `tx.Begin` starts a nested transaction in the current transaction operation, and by default uses automatic naming for the nested transaction `SavePoint`. The naming format is `transactionN`, where `N` represents the nesting level. If you see the log showing ``SAVEPOINT `transaction1` ``, it indicates the current nesting level is `2` (starting from `0`).

### 2. More Detailed Logs

`goframe`'s `ORM` has a very comprehensive logging mechanism. If you enable `SQL` logging, you will see the following log information displaying the detailed execution process of the entire database request:

```html
2021-05-22 21:12:10.776 [DEBU] [  4 ms] [default] [txid:1] BEGIN
2021-05-22 21:12:10.776 [DEBU] [  0 ms] [default] [txid:1] SAVEPOINT `transaction0`
2021-05-22 21:12:10.789 [DEBU] [ 13 ms] [default] [txid:1] SHOW FULL COLUMNS FROM `user`
2021-05-22 21:12:10.790 [DEBU] [  1 ms] [default] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(1,'john')
2021-05-22 21:12:10.791 [DEBU] [  1 ms] [default] [txid:1] ROLLBACK TO SAVEPOINT `transaction0`
2021-05-22 21:12:10.791 [DEBU] [  0 ms] [default] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(2,'smith')
2021-05-22 21:12:10.792 [DEBU] [  1 ms] [default] [txid:1] COMMIT
```

Here, `[txid:1]` indicates the transaction ID recorded by the `ORM` component, and each real transaction operation will have a different ID, while nested transactions within the same real transaction share the same transaction ID.

After execution, query the database result:

```
mysql> select * from `user`;
+----+-------+
| id | name  |
+----+-------+
|  2 | smith |
+----+-------+
1 row in set (0.00 sec)
```

You can see that the first operation was successfully rolled back, and only the second operation was successfully executed and committed.

## 3. Closure Operations (Recommended)

We can also implement nested transactions through closure operations using the `Transaction` method.

```go
db.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) error {
    // Nested transaction 1.
    if err := tx.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) error {
        _, err := tx.Model(table).Ctx(ctx).Data(g.Map{"id": 1, "name": "john"}).Insert()
        return err
    }); err != nil {
        return err
    }
    // Nested transaction 2, panic.
    if err := tx.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) error {
        _, err := tx.Model(table).Ctx(ctx).Data(g.Map{"id": 2, "name": "smith"}).Insert()
        // Create a panic that can make this transaction rollback automatically.
        panic("error")
        return err
    }); err != nil {
        return err
    }
    return nil
})
```

In the nested transaction closure, you do not necessarily have to use the `tx` object and can instead directly use the `db` object or `dao` package. This approach is more common, especially in method-level calls, as it means developers do not have to worry about passing the `tx` object or determine whether the current transaction should be nested; everything is automatically managed by the component, greatly reducing the mental workload for developers. However, be sure to pass the `ctx` context variable through every level. For example:

```go
db.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) error {
    // Nested transaction 1.
    if err := db.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) error {
        _, err := db.Model(table).Ctx(ctx).Data(g.Map{"id": 1, "name": "john"}).Insert()
        return err
    }); err != nil {
        return err
    }
    // Nested transaction 2, panic.
    if err := db.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) error {
        _, err := db.Model(table).Ctx(ctx).Data(g.Map{"id": 2, "name": "smith"}).Insert()
        // Create a panic that can make this transaction rollback automatically.
        panic("error")
        return err
    }); err != nil {
        return err
    }
    return nil
})
```

If you have enabled `SQL` logging, you will see the following log information displaying the detailed execution process of the entire database request:

```html
2021-05-22 21:18:46.672 [DEBU] [  2 ms] [default] [txid:1] BEGIN
2021-05-22 21:18:46.672 [DEBU] [  0 ms] [default] [txid:1] SAVEPOINT `transaction0`
2021-05-22 21:18:46.673 [DEBU] [  0 ms] [default] [txid:1] SHOW FULL COLUMNS FROM `user`
2021-05-22 21:18:46.674 [DEBU] [  0 ms] [default] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(1,'john')
2021-05-22 21:18:46.674 [DEBU] [  0 ms] [default] [txid:1] RELEASE SAVEPOINT `transaction0`
2021-05-22 21:18:46.675 [DEBU] [  1 ms] [default] [txid:1] SAVEPOINT `transaction0`
2021-05-22 21:18:46.675 [DEBU] [  0 ms] [default] [txid:1] INSERT INTO `user`(`name`,`id`) VALUES('smith',2)
2021-05-22 21:18:46.675 [DEBU] [  0 ms] [default] [txid:1] ROLLBACK TO SAVEPOINT `transaction0`
2021-05-22 21:18:46.676 [DEBU] [  1 ms] [default] [txid:1] ROLLBACK
```

:::warning
If the `ctx` context variable is not passed through each layer, the nested transaction will fail. Let's look at an erroneous example:

```go
db.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) error {
    // Nested transaction 1.
    if err := db.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) error {
        _, err := db.Model(table).Ctx(ctx).Data(g.Map{"id": 1, "name": "john"}).Insert()
        return err
    }); err != nil {
        return err
    }
    // Nested transaction 2, panic.
    if err := db.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) error {
        _, err := db.Model(table).Data(g.Map{"id": 2, "name": "smith"}).Insert()
        // Create a panic that can make this transaction rollback automatically.
        panic("error")
        return err
    }); err != nil {
        return err
    }
    return nil
})
```

Open the `SQL` execution log, and after execution, you will see the following log content:

```html
2021-05-22 21:29:38.841 [DEBU] [  3 ms] [default] [txid:1] BEGIN
2021-05-22 21:29:38.842 [DEBU] [  1 ms] [default] [txid:1] SAVEPOINT `transaction0`
2021-05-22 21:29:38.843 [DEBU] [  1 ms] [default] [txid:1] SHOW FULL COLUMNS FROM `user`
2021-05-22 21:29:38.845 [DEBU] [  2 ms] [default] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(1,'john')
2021-05-22 21:29:38.845 [DEBU] [  0 ms] [default] [txid:1] RELEASE SAVEPOINT `transaction0`
2021-05-22 21:29:38.846 [DEBU] [  1 ms] [default] [txid:1] SAVEPOINT `transaction0`
2021-05-22 21:29:38.847 [DEBU] [  1 ms] [default] INSERT INTO `user`(`id`,`name`) VALUES(2,'smith')
2021-05-22 21:29:38.848 [DEBU] [  0 ms] [default] [txid:1] ROLLBACK TO SAVEPOINT `transaction0`
2021-05-22 21:29:38.848 [DEBU] [  0 ms] [default] [txid:1] ROLLBACK
```

You can see that the second `INSERT` operation ``INSERT INTO `user`(`id`,`name`) VALUES(2,'smith') `` has no transaction ID printed, indicating it was not used within a transaction and hence will be truly committed to the database execution and cannot be rolled back.
:::
## 4. `SavePoint/RollbackTo`

Developers can also flexibly use the `Transaction Save Point` feature and implement custom `SavePoint` naming and designated `Point` rollback operations.

```go
tx, err := db.Begin()
if err != nil {
    panic(err)
}
defer func() {
    if err := recover(); err != nil {
        _ = tx.Rollback()
    }
}()
if _, err = tx.Model(table).Data(g.Map{"id": 1, "name": "john"}).Insert(); err != nil {
    panic(err)
}
if err = tx.SavePoint("MyPoint"); err != nil {
    panic(err)
}
if _, err = tx.Model(table).Data(g.Map{"id": 2, "name": "smith"}).Insert(); err != nil {
    panic(err)
}
if _, err = tx.Model(table).Data(g.Map{"id": 3, "name": "green"}).Insert(); err != nil {
    panic(err)
}
if err = tx.RollbackTo("MyPoint"); err != nil {
    panic(err)
}
if err = tx.Commit(); err != nil {
    panic(err)
}
```

If you open the `SQL` log, you will see the following log information displaying the detailed execution process of the entire database request:

```html
2021-05-22 21:38:51.992 [DEBU] [  3 ms] [default] [txid:1] BEGIN
2021-05-22 21:38:52.002 [DEBU] [  9 ms] [default] [txid:1] SHOW FULL COLUMNS FROM `user`
2021-05-22 21:38:52.002 [DEBU] [  0 ms] [default] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(1,'john')
2021-05-22 21:38:52.003 [DEBU] [  1 ms] [default] [txid:1] SAVEPOINT `MyPoint`
2021-05-22 21:38:52.004 [DEBU] [  1 ms] [default] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(2,'smith')
2021-05-22 21:38:52.005 [DEBU] [  1 ms] [default] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(3,'green')
2021-05-22 21:38:52.006 [DEBU] [  0 ms] [default] [txid:1] ROLLBACK TO SAVEPOINT `MyPoint`
2021-05-22 21:38:52.006 [DEBU] [  0 ms] [default] [txid:1] COMMIT
```

After execution, query the database result:

```
mysql> select * from `user`;
+----+------+
| id | name |
+----+------+
|  1 | john |
+----+------+
1 row in set (0.00 sec)
```

You can see that by saving a `SavePoint` named `MyPoint` after the first `Insert` operation, the subsequent operations were all rolled back using the `RollbackTo` method, so only the first `Insert` operation was successfully committed and executed.

## 5. Reference Example of Nested Transactions in a Project

To simplify the example, let's use a user module-related example, such as user registration, saving user's basic information (`user`) and detailed information (`user_detail`) to two tables through transaction operations. If any table operation fails, the entire registration operation will fail. To demonstrate the nested transaction effect, we separate the basic information and detailed information management into two `dao` objects.

Assume our project follows the `goframe` standard project structuring divided into three layers: `api-service-dao`; our nested transaction operation might look like this.

### `controller`

```go
// User registration HTTP interface
func (*cUser) Signup(r *ghttp.Request) {
    // ....
    service.User().Signup(r.Context(), userServiceSignupReq)
    // ...
}
```

Indicates the handling of the HTTP request and passes the `Context` context variable to subsequent processes.

### `service`

```go
// User registration business logic handling
func (*userService) Signup(ctx context.Context, r *model.UserServiceSignupReq) {
    // ....
    dao.User.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) error {
        err := dao.User.Ctx(ctx).Save(r.UserInfo)
        if err != nil {
            return err
        }
        err := dao.UserDetail.Ctx(ctx).Save(r.UserDetail)
        if err != nil {
            return err
        }
        return nil
    })
    // ...
}
```

As you can see, the `user` table and `user_detail` table internally use nested transactions to perform unified transaction operations. Note that within the closure, use the `Ctx` method to pass the context variable to the next level. If there are calls to other `service` objects within the closure, you also need to pass the `ctx` variable, for example:

```go
func (*userService) Signup(ctx context.Context, r *model.UserServiceSignupReq) {
    // ....
    dao.User.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) (err error) {
        if err = dao.User.Ctx(ctx).Save(r.UserInfo); err != nil {
            return err
        }
        if err = dao.UserDetail.Ctx(ctx).Save(r.UserDetail); err != nil {
            return err
        }
        if err = service.XXXA().Call(ctx, ...); err != nil {
            return err
        }
        if err = service.XXXB().Call(ctx, ...); err != nil {
            return err
        }
        if err = service.XXXC().Call(ctx, ...); err != nil {
            return err
        }
        // ...
        return nil
    })
    // ...
}
```

### `dao`

The code for the `dao` layer can be fully automated and maintained by `goframe cli` tools.