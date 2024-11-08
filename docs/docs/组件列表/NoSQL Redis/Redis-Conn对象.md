---
slug: '/docs/components/contrib-nosql-redis-conn'
title: 'Redis-Conn对象'
sidebar_position: 3
hide_title: true
keywords: [GoFrame,GoFrame框架,Redis,Conn对象,订阅发布,连接池,长链接,连接超时,订阅模式,发布模式]
description: '本文档介绍了如何在GoFrame框架中使用Redis的Conn对象进行长链接操作，如订阅发布等功能。通过使用连接池获取连接对象进行操作，同时注意连接对象超时问题以及使用后的关闭操作。示例代码展示了通过Conn实现订阅发布模式，程序将在终端打印从Redis Server获取的数据。'
---

## `Conn` 对象

如果需要实现长链接性的 `Redis` 操作（例如订阅发布），那么我们可以使用 `Conn` 方法从连接池中获取一个连接对象，随后使用该连接对象进行操作。但需要注意的是，该连接对象不再使用时，应当显式调用 `Close` 方法进行关闭（丢回连接池）。
:::warning
由于该 `Conn` 是个连接对象，注意该对象存在连接超时的限制，超时和服务端配置有关。
:::
## 订阅/发布

我们可以通过 `Redis` 的 `Conn` 实现订阅/发布模式。

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

执行后，程序将阻塞等待获取数据。

另外打开一个终端通过 `redis-cli` 命令进入 `Redis Server`，发布一条消息：

```bash
$ redis-cli
127.0.0.1:6379> publish channel test
(integer) 1
127.0.0.1:6379>
```

随后程序终端立即打印出从 `Redis Server` 获取的数据：

```test
```