---
slug: '/docs/components/contrib-nosql-redis-do-and-serialization'
title: 'Redis - Do'
sidebar_position: 2
hide_title: true
keywords: [Redis Command Interaction, Do Method, Automatic Serialization and Deserialization, GoFrame Framework, Struct Access, Map Access, gredis Library, JSON Serialization, Redis API, Go Language]
description: "In applications built with the GoFrame framework, interact with Redis commands and automatically serialize and deserialize data. First, we explain the powerful extensibility of the Do method, which allows the execution of any Redis command. Then we show how to use map and struct to access and store data and simplify programming with JSON serialization. By combining the GoFrame framework and Redis, developers can manage data more efficiently."
---

## `Do` Method

`Do` is a universal command interaction method that executes synchronous instructions by sending corresponding `Redis API` commands to the `Redis Server` to utilize the `Redis Server` services. The biggest feature of the `Do` method is its strong extensibility by interacting with the server using `Redis` commands, which can implement other commands not provided by the `Redis` operation methods. Usage example:

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

## Automatic Serialization/Deserialization

When the given parameters are `map`, `slice`, or `struct`, `gredis` internally supports automatic `json` serialization and can use the conversion functions of `gvar.Var` for deserialization when reading data.

### `map` Access

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

### `struct` Access

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