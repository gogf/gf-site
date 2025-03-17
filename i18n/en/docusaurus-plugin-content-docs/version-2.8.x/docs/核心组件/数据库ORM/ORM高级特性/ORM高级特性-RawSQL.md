---
slug: '/docs/core/gdb-senior-raw-sql'
title: 'ORM Senior - RawSQL'
sidebar_position: 0
hide_title: true
keywords: [GoFrame, ORM, RawSQL, SQL injection, gdb.Raw, data insertion, data updating, data querying, prepared mode, SQL statement]
description: "Using the RawSQL feature of ORM in the GoFrame framework, by employing the gdb.Raw type, you can embed custom SQL fragments in generated SQL statements for more flexible database operations. This document provides a detailed explanation of using RawSQL in Insert, Update, and Select operations, along with examples to ensure the security and flexibility of SQL statements."
---

Due to the security assurance of `ORM`, all input parameters are executed in a prepared mode at the underlying level to prevent common `SQL` injection risks. In certain scenarios, we expect to embed custom SQL statements in the generated execution SQL statements, then we can use the `RawSQL` feature of `ORM` through the `gdb.Raw` type. Let's look at a few examples.

## Using `RawSQL` in `Insert`

`gdb.Raw` is a string type, and the parameter of this type will be directly embedded as an `SQL` fragment into the SQL statement submitted to the underlying level. It will not be automatically converted into a string parameter type, nor will it be treated as a prepared parameter. For example:

```go
// INSERT INTO `user`(`id`,`passport`,`password`,`nickname`,`create_time`) VALUES('id+2','john','123456','now()')
g.Model("user").Data(g.Map{
    "id":          "id+2",
    "passport":    "john",
    "password":    "123456",
    "nickname":    "JohnGuo",
    "create_time": "now()",
}).Insert()
// Execution error: Error Code: 1136. Column count doesn't match value count at row 1
```

After refactoring with `gdb.Raw`:

```go
// INSERT INTO `user`(`id`,`passport`,`password`,`nickname`,`create_time`) VALUES(id+2,'john','123456',now())
g.Model("user").Data(g.Map{
    "id":          gdb.Raw("id+2"),
    "passport":    "john",
    "password":    "123456",
    "nickname":    "JohnGuo",
    "create_time": gdb.Raw("now()"),
}).Insert()
```

## Using `RawSQL` in `Update`

```go
// UPDATE `user` SET login_count='login_count+1',update_time='now()' WHERE id=1
g.Model("user").Data(g.Map{
    "login_count": "login_count+1",
    "update_time": "now()",
}).Where("id", 1).Update()
// Execution error: Error Code: 1136. Column count doesn't match value count at row 1
```

After refactoring with `gdb.Raw`:

```go
// UPDATE `user` SET login_count=login_count+1,update_time=now() WHERE id=1
g.Model("user").Data(g.Map{
    "login_count": gdb.Raw("login_count+1"),
    "update_time": gdb.Raw("now()"),
}).Where("id", 1).Update()
```

## Using `RawSQL` in `Select`

The time function `now()` will be converted into a string to be executed as an `SQL` parameter:

```go
// SELECT * FROM `user` WHERE `created_at`<'now()'
g.Model("user").WhereLT("created_at", "now()").All()
```

After refactoring with `gdb.Raw`:

```go
// SELECT * FROM `user` WHERE `created_at`<now()
g.Model("user").WhereLT("created_at", gdb.Raw("now()")).All()
```