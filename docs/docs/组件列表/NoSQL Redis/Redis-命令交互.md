---
slug: '/docs/components/contrib-nosql-redis-do-and-serialization'
title: 'Redis-命令交互'
sidebar_position: 2
hide_title: true
keywords: [Redis命令交互,Do方法,自动序列化与反序列化,GoFrame框架,结构体存取,map存取,gredis库,json序列化,Redis API,Go语言]
description: '本文档介绍了如何在使用GoFrame框架构建的应用中，通过Redis命令交互以及自动化的方式来序列化和反序列化数据。首先，我们讲解了Do方法的强大扩展性，它允许任何Redis命令的执行。随后我们展示了如何使用map和struct来存取数据，并利用json序列化简化编程。通过GoFrame框架与Redis的结合，开发者可以更加高效地进行数据管理。'
---

## `Do` 方法

`Do` 是通用的命令交互方法，执行同步指令，通过向 `Redis Server` 发送对应的 `Redis API` 命令，来使用 `Redis Server` 的服务。 `Do` 方法最大的特点是使用 `Redis` 命令与服务端交互，因此扩展很强，没有提供 `Redis` 操作方法的其他命令都可以通过 `Do` 方法来实现。使用示例：

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx = gctx.New()
    )
    v, _ := g.Redis().Do(ctx, "SET", "k", "v")
    fmt.Println(v.String())
}
```

## 自动序列化/反序列化

当给定的参数为 `map`, `slice`, `struct` 时， `gredis` 内部支持自动对其使用 `json` 序列化，并且读取数据时可使用 `gvar.Var` 的转换功能实现反序列化。

### `map` 存取

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gvar"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx = gctx.New()
        err    error
        result *gvar.Var
        key    = "user"
        data   = g.Map{
            "id":   10000,
            "name": "john",
        }
    )
    _, err = g.Redis().Do(ctx, "SET", key, data)
    if err != nil {
        panic(err)
    }
    result, err = g.Redis().Do(ctx,"GET", key)
    if err != nil {
        panic(err)
    }
    fmt.Println(result.Map())
}
```

### `struct` 存取

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gvar"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    type User struct {
        Id   int
        Name string
    }

    var (
        ctx = gctx.New()
        err    error
        result *gvar.Var
        key    = "user"
        user   = g.Map{
            "id":   10000,
            "name": "john",
        }
    )

    _, err = g.Redis().Do(ctx, "SET", key, user)
    if err != nil {
        panic(err)
    }
    result, err = g.Redis().Do(ctx, "GET", key)
    if err != nil {
        panic(err)
    }

    var user2 *User
    if err = result.Struct(&user2); err != nil {
        panic(err)
    }
    fmt.Println(user2.Id, user2.Name)
}
```