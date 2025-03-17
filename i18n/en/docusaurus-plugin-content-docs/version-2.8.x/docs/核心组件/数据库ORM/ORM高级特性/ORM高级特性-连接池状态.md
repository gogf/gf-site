---
slug: '/docs/core/gdb-senior-connection-pool'
title: 'ORM Senior - Connection Pool'
sidebar_position: 8
hide_title: true
keywords: [GoFrame, GoFrame Framework, ORM, Connection Pool, DB Stats, Database Connection, gdb, mysql, GoFrame database, GoFrame gdb]
description: "Use GoFrame framework's `DB.Stats` method to obtain the connection pool status of ORM objects. Through example code, developers can understand how to configure database connections and obtain detailed connection pool status information via GoFrame. Additionally, the specific fields of the connection pool status output and their meanings are introduced."
---

We can obtain the connection pool status of an `orm` object using the `DB.Stats` method. Let's look at an example:

```go
package main

import (
    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"

    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var ctx = gctx.New()
    db, err := gdb.New(gdb.ConfigNode{
        Link: "mysql:root:12345678@tcp(127.0.0.1:3306)/test",
    })
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    err = db.PingMaster()
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    stats := db.Stats(ctx)
    g.Dump(stats)
}
```

After execution, the terminal output is as follows, showing each database node and its corresponding connection pool status information.

```html
[
    {
        node:  {
            Host:                 "127.0.0.1",
            Port:                 "3306",
            User:                 "root",
            Pass:                 "12345678",
            Name:                 "test",
            Type:                 "mysql",
            Link:                 "",
            Extra:                "",
            Role:                 "",
            Debug:                false,
            Prefix:               "",
            DryRun:               false,
            Weight:               0,
            Charset:              "utf8",
            Protocol:             "tcp",
            Timezone:             "",
            Namespace:            "",
            MaxIdleConnCount:     0,
            MaxOpenConnCount:     0,
            MaxConnLifeTime:      0,
            QueryTimeout:         0,
            ExecTimeout:          0,
            TranTimeout:          0,
            PrepareTimeout:       0,
            CreatedAt:            "",
            UpdatedAt:            "",
            DeletedAt:            "",
            TimeMaintainDisabled: false,
        },
        stats: {
            MaxOpenConnections: 0,
            OpenConnections:    1,
            InUse:              0,
            Idle:               1,
            WaitCount:          0,
            WaitDuration:       0,
            MaxIdleClosed:      0,
            MaxIdleTimeClosed:  0,
            MaxLifetimeClosed:  0,
        },
    },
]
```