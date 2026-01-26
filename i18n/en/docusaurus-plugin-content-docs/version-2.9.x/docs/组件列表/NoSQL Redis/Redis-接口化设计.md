---
slug: '/docs/components/contrib-nosql-redis-interface'
title: 'Redis - Interface'
sidebar_position: 4
hide_title: true
keywords: [Redis, Interface Design, GoFrame, GoFrame Framework, gredis, Custom Redis Adapter, Extend Redis Methods, Redis Community Component, SetAdapter Method, GetAdapter Method]
description: "Implement an interface-designed Redis component using gredis in the GoFrame framework, which has strong flexibility and extensibility. By implementing a custom Redis Adapter, you can easily override the default implementation methods. The text provides detailed examples showing how to achieve log printing in the custom Do method and use it in business operations."
---

`gredis` adopts an interface-based design, offering strong flexibility and extensibility.

## Interface Definition

[https://pkg.go.dev/github.com/gogf/gf/v2/database/gredis#Adapter](https://pkg.go.dev/github.com/gogf/gf/v2/database/gredis#Adapter)

## Related Methods

```go
// SetAdapter sets custom adapter for current redis client.
func (r *Redis) SetAdapter(adapter Adapter)

// GetAdapter returns the adapter that is set in current redis client.
func (r *Redis) GetAdapter() Adapter
```

## Custom Redis Adapter

The framework community component provides a default implementation of the `Redis Adapter`. If developers need to implement a custom `Redis Adapter` or want to override certain methods, they can extend based on this implementation.

Let's look at an example where we implement a custom `Redis Adapter` and override its underlying `Do` method. To simplify the example, we print a log in the custom `Do` method, and subsequent logic follows the community `Redis Adapter` implementation.

```go
package main

import (
    "context"
    "fmt"

    "github.com/gogf/gf/contrib/nosql/redis/v2"

    "github.com/gogf/gf/v2/container/gvar"
    "github.com/gogf/gf/v2/database/gredis"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

var (
    ctx    = gctx.New()
    group  = "cache"
    config = gredis.Config{
        Address: "127.0.0.1:6379",
        Db:      1,
    }
)

// MyRedis description
type MyRedis struct {
    *redis.Redis
}

// Do implements and overwrites the underlying function Do from Adapter.
func (r *MyRedis) Do(ctx context.Context, command string, args ...interface{}) (*gvar.Var, error) {
    fmt.Println("MyRedis Do:", command, args)
    return r.Redis.Do(ctx, command, args...)
}

func main() {
    gredis.RegisterAdapterFunc(func(config *gredis.Config) gredis.Adapter {
        r := &MyRedis{redis.New(config)}
        r.AdapterOperation = r // This is necessary.
        return r
    })
    gredis.SetConfig(&config, group)

    _, err := g.Redis(group).Set(ctx, "key", "value")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    value, err := g.Redis(group).Get(ctx, "key")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    fmt.Println(value.String())
}
```

After execution, the terminal outputs:

```
MyRedis Do: Set [key value]
MyRedis Do: Get [key]
value
```