---
slug: '/docs/core/gdb-interface-callback'
title: 'ORM Interface - Callback'
sidebar_position: 0
hide_title: true
keywords: [GoFrame,ORM Interface,SQL Statements,Custom Callback,Logging,Authentication Operations,Database Driver,MySQL Driver,gdb Interface,Framework Override]
description: "When developing ORM interfaces using the GoFrame framework, custom callback handling is used to log or authenticate SQL statements. By implementing and overriding interface methods like DoQuery, DoExec, etc., developers can inject custom logic into the default implementation. The example demonstrates how to customize a MySQL driver to log executed SQL statements and configure gdb to use that driver."
---

## Introduction

Custom callback handling is the most common implementation in interface development, where it involves **replacing and modifying** some methods in the interface to inject custom logic into the default implementation of the driver. By referring to the interface relationship diagram ([ORM - Interface](ORM接口开发.md)), we understand that all `SQL` statement executions will pass through the `DoQuery`, `DoExec`, or `DoFilter` interfaces. Depending on the requirements, you can **implement and override** the relevant interface methods in the custom driver to achieve the desired functionality.

A common use case is to perform **log recording or unified security checks** on `SQL` at the `ORM` lower layer.

## Example Usage

Let's look at an example of custom callback handling. Suppose we need to log all executed `SQL` statements into a `monitor` table for `SQL` auditing purposes. The easiest way to achieve this is by creating a custom `Driver` and then overriding the underlying interface methods of `ORM`. To simplify the example, the following code demonstrates a custom `MySQL` driver, which inherits from the `mysql` module's `Driver` under `drivers`.

```go
package driver

import (
    "context"

    "github.com/gogf/gf/contrib/drivers/mysql/v2"
    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/os/gtime"
)

// MyDriver is a custom database driver, which is used for testing only.
// For simplifying the unit testing case purpose, MyDriver struct inherits the mysql driver
// gdb.Driver and overwrites its functions DoQuery and DoExec.
// So if there's any sql execution, it goes through MyDriver.DoQuery/MyDriver.DoExec firstly
// and then gdb.Driver.DoQuery/gdb.Driver.DoExec.
// You can call it sql "HOOK" or "HiJack" as your will.
type MyDriver struct {
    *mysql.Driver
}

var (
    // customDriverName is my driver name, which is used for registering.
    customDriverName = "MyDriver"
)

func init() {
    // It here registers my custom driver in package initialization function "init".
    // You can later use this type in the database configuration.
    if err := gdb.Register(customDriverName, &MyDriver{}); err != nil {
        panic(err)
    }
}

// New creates and returns a database object for mysql.
// It implements the interface of gdb.Driver for extra database driver installation.
func (d *MyDriver) New(core *gdb.Core, node *gdb.ConfigNode) (gdb.DB, error) {
    return &MyDriver{
        &mysql.Driver{
            Core: core,
        },
    }, nil
}

// DoCommit commits current sql and arguments to underlying sql driver.
func (d *MyDriver) DoCommit(ctx context.Context, in gdb.DoCommitInput) (out gdb.DoCommitOutput, err error) {
    tsMilliStart := gtime.TimestampMilli()
    out, err = d.Core.DoCommit(ctx, in)
    tsMilliFinished := gtime.TimestampMilli()
    _, _ = in.Link.ExecContext(ctx,
        "INSERT INTO `monitor`(`sql`,`cost`,`time`,`error`) VALUES(?,?,?,?)",
        gdb.FormatSqlWithArgs(in.Sql, in.Args),
        tsMilliFinished-tsMilliStart,
        gtime.Now(),
        err,
    )
    return
}
```

We see that a custom driver is registered with a unique name in the package initialization function `init` using `gdb.Register("MyDriver", &MyDriver{})`. We can also override the existing framework `mysql` driver with our own driver using `gdb.Register("mysql", &MyDriver{})`.
:::tip
The driver name `mysql` is the default name for the framework's `DriverMysql`.
:::
Since we are using a new driver name `MyDriver`, it is necessary to specify this driver name in the `type` field in the `gdb` configuration. Below is an example configuration:

```yaml
database:
  default:
  - link: "MyDriver:root:12345678@tcp(127.0.0.1:3306)/user"
```

## Notes

In the implementation of interface methods, use the `Link` input object parameter to operate on the database. Using the `g.DB` method to get a database object for operations may lead to deadlock issues.