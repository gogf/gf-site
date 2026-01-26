---
slug: '/docs/components/contrib-nosql-redis-conn'
title: 'Redis - Conn'
sidebar_position: 3
hide_title: true
keywords: [GoFrame, GoFrame Framework, Redis, Conn Object, Publish/Subscribe, Connection Pool, Long Connection, Connection Timeout, Subscription Mode, Publish Mode]
description: "Use the Conn object of Redis in the GoFrame framework for long connection operations, such as publish/subscribe functions. Obtain the connection object through a connection pool for operations, while paying attention to connection object timeout issues and closure operations after use. The example code demonstrates implementing the publish/subscribe pattern through Conn, with the program printing data obtained from the Redis Server on the terminal."
---

## `Conn` Object

If you need to implement long connection operations with `Redis` (such as publish/subscribe), you can use the `Conn` method to obtain a connection object from the connection pool, and then use that connection object for operations. It's important to note that when the connection object is no longer in use, it should be explicitly closed by calling the `Close` method (returned to the connection pool).
:::warning
Since the `Conn` is a connection object, be aware that it is subject to connection timeout limits, which relate to server configuration.
:::
## Publish/Subscribe

You can implement the publish/subscribe pattern through `Redis`'s `Conn`.

```go
package main

import (
    "fmt"

    _ "github.com/gogf/gf/contrib/nosql/redis/v2"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx     = gctx.New()
        channel = "channel"
    )
    conn, _ := g.Redis().Conn(ctx)
    defer conn.Close(ctx)
    _, err := conn.Subscribe(ctx, channel)
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    for {
        msg, err := conn.ReceiveMessage(ctx)
        if err != nil {
            g.Log().Fatal(ctx, err)
        }
        fmt.Println(msg.Payload)
    }
}
```

After execution, the program will block and wait to receive data.

Open another terminal and use the `redis-cli` command to enter the `Redis Server` to publish a message:

```bash
$ redis-cli
127.0.0.1:6379> publish channel test
(integer) 1
127.0.0.1:6379>
```

The program terminal will then immediately print the data obtained from the `Redis Server`:

```test
```