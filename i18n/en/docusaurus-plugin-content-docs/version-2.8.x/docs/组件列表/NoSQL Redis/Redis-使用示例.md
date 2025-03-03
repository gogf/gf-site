---
slug: '/docs/components/contrib-nosql-redis-example'
title: 'Redis - Examples'
sidebar_position: 1
hide_title: true
keywords: [Redis example, GoFrame framework, NoSQL database, Set operation, Get operation, SetEx operation, HSet operation, HMSet operation, HGetAll operation, HMGet operation]
description: "Examples of performing basic operations in Redis using the GoFrame framework, including Set/Get, SetEx, HSet/HGetAll, and HMSet/HMGet operations. These code examples demonstrate how to store and retrieve data through the Redis module of the GoFrame framework, suitable for beginners to learn how to implement Redis functions in the GoFrame framework environment. This example also reminds users that HMSET has been deprecated in Redis version 4.0.0 and above; HSET should be used."
---

## `Set/Get` Operation

```go
package main

import (
    "fmt"

    _ "github.com/gogf/gf/contrib/nosql/redis/v2"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var ctx = gctx.New()
    _, err := g.Redis().Set(ctx, "key", "value")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    value, err := g.Redis().Get(ctx, "key")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    fmt.Println(value.String())
}
```

After execution, terminal output:

```value
```

## `SetEx` Operation

```go
package main

import (
    "fmt"
    "time"

    _ "github.com/gogf/gf/contrib/nosql/redis/v2"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var ctx = gctx.New()
    err := g.Redis().SetEX(ctx, "key", "value", 1)
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    value, err := g.Redis().Get(ctx, "key")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    fmt.Println(value.IsNil())
    fmt.Println(value.String())

    time.Sleep(time.Second)

    value, err = g.Redis().Get(ctx, "key")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    fmt.Println(value.IsNil())
    fmt.Println(value.Val())
}
```

After execution, terminal output:

```false
value
true
<nil>
```

## `HSet/HGetAll` Operation

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
        ctx = gctx.New()
        key = "key"
    )
    _, err := g.Redis().HSet(ctx, key, g.Map{
        "id":    1,
        "name":  "john",
        "score": 100,
    })
    if err != nil {
        g.Log().Fatal(ctx, err)
    }

    // retrieve hash map
    value, err := g.Redis().HGetAll(ctx, key)
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    fmt.Println(value.Map())

    // scan to struct
    type User struct {
        Id    uint64
        Name  string
        Score float64
    }
    var user *User
    if err = value.Scan(&user); err != nil {
        g.Log().Fatal(ctx, err)
    }
    g.Dump(user)
}
```

After execution, terminal output:

```
map[id:1 name:john score:100]
{
    Id:    1,
    Name:  "john",
    Score: 100,
}
```

## `HMSet/HMGet` Operation

```go
package main

import (
    _ "github.com/gogf/gf/contrib/nosql/redis/v2"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx = gctx.New()
        key = "key"
    )
    err := g.Redis().HMSet(ctx, key, g.Map{
        "id":    1,
        "name":  "john",
        "score": 100,
    })
    if err != nil {
        g.Log().Fatal(ctx, err)
    }

    // retrieve hash map
    values, err := g.Redis().HMGet(ctx, key, "id", "name")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    g.Dump(values.Strings())
}
```

After execution, terminal output:

```
[
    "1",
    "john",
]
```

As per Redis 4.0.0, HMSET is considered deprecated. Please use HSET in new code.