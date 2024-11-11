---
slug: '/docs/components/contrib-nosql-redis-interface'
title: 'Redis-接口化设计'
sidebar_position: 4
hide_title: true
keywords: [Redis,接口化设计,GoFrame,GoFrame框架,gredis,自定义Redis Adapter,扩展Redis方法,Redis社区组件,SetAdapter方法,GetAdapter方法]
description: '如何使用GoFrame框架中的gredis实现一个接口化设计的Redis组件，具备强大灵活性和扩展性。通过实现自定义Redis Adapter，可以轻松覆盖默认实现的方法。文中提供了详细示例，展示了如何在自定义Do方法中实现日志打印，并在业务中使用。'
---

`gredis` 采用接口化设计，具有强大的灵活性和扩展性。

## 接口定义

[https://pkg.go.dev/github.com/gogf/gf/v2/database/gredis#Adapter](https://pkg.go.dev/github.com/gogf/gf/v2/database/gredis#Adapter)

## 相关方法

```go
// SetAdapter sets custom adapter for current redis client.
func (r *Redis) SetAdapter(adapter Adapter)

// GetAdapter returns the adapter that is set in current redis client.
func (r *Redis) GetAdapter() Adapter
```

## 自实现Redis Adapter

框架社区组件提供了 `Redis Adapter` 的默认实现，如果开发者需要自实现 `Redis Adapter` 或者想要覆盖其中的某一些方法，可以基于该实现来扩展。

我们来看一个例子，在该例子中，我们实现一个自定义的 `Redis Adapter`，并且覆盖它的 `Do` 底层方法。为简化示例，我们这里在自实现的 `Do` 方法中打印一条日志即可，后续逻辑仍然走社区 `Redis Adapter` 的实现。

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

执行后，终端输出：

```
MyRedis Do: Set [key value]
MyRedis Do: Get [key]
value
```