---
slug: '/docs/components/contrib-nosql-redis-conn'
title: 'Redis-高级特性'
sidebar_position: 3
hide_title: true
keywords: [GoFrame,GoFrame框架,Redis,Conn对象,订阅发布,连接池,长链接,连接超时,订阅模式,发布模式]
description: '在GoFrame框架中使用Redis的Conn对象进行长链接操作，如订阅发布等功能。通过使用连接池获取连接对象进行操作，同时注意连接对象超时问题以及使用后的关闭操作。示例代码展示了通过Conn实现订阅发布模式，程序将在终端打印从Redis Server获取的数据。'
---

## `Conn` 对象

如果需要实现长链接性的 `Redis` 操作（例如订阅发布），那么我们可以使用 `Conn` 方法从连接池中获取一个连接对象，随后使用该连接对象进行操作。但需要注意的是，该连接对象不再使用时，应当显式调用 `Close` 方法进行关闭（丢回连接池）。
:::warning
由于该 `Conn` 是个连接对象，注意该对象存在连接超时的限制，超时和服务端配置有关。
:::

### 订阅/发布

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

```bash
test
```

## 原始客户端

`Client` 方法返回底层的 `Redis` 客户端实例，提供对原始 `Redis` 客户端的访问，用于执行标准 `Redis` 接口未覆盖的高级操作。

### 方法说明

```go
func (r *Redis) Client() gredis.RedisRawClient
```

该方法返回原始的 `Redis` 客户端，通过类型断言可以将其转换为 `goredis.UniversalClient`，从而访问更多高级功能，如管道（Pipeline）操作、事务等。

### 使用示例

以下示例展示如何使用原始客户端进行管道操作：

```go
import (
    "context"
    "errors"
    goredis "github.com/redis/go-redis/v9"
)

func ExampleUsage(ctx context.Context, redis *gredis.Redis) error {
    // 获取原始客户端
    client := redis.Client()
    
    // 类型断言为 UniversalClient
    universalClient, ok := client.(goredis.UniversalClient)
    if !ok {
        return errors.New("failed to assert to UniversalClient")
    }

    // 使用管道进行批量操作
    pipe := universalClient.Pipeline()
    pipe.Set(ctx, "key1", "value1", 0)
    pipe.Set(ctx, "key2", "value2", 0)
    pipe.Get(ctx, "key1")
    
    // 执行管道中的所有命令
    results, err := pipe.Exec(ctx)
    if err != nil {
        return err
    }
    
    // 处理结果
    for _, result := range results {
        fmt.Println(result.Val())
    }
    
    return nil
}
```

### 适用场景

- **批量操作**：使用管道（Pipeline）提高批量操作的性能
- **事务操作**：执行需要原子性保证的多个命令
- **Lua脚本**：执行自定义的 Lua 脚本
- **高级特性**：访问 go-redis 库的其他高级功能

:::tip
原始客户端的使用需要了解 `github.com/redis/go-redis/v9` 库的相关 API，建议在需要进行高级操作时才使用此方法。
:::
