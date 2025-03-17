---
slug: '/docs/core/gcache-redis'
title: '缓存管理-Redis缓存'
sidebar_position: 2
hide_title: true
keywords: [GoFrame,GoFrame框架,缓存管理,Redis缓存,gcache,redis适配,Session共享,数据库查询缓存,redis db,缓存对象]
description: 'GoFrame框架中的缓存管理模块，重点讲解Redis缓存的适配实现及其使用方法，通过示例展示如何在多节点环境下确保数据一致性。文中提供了设置Redis客户端和使用Redis缓存适配器的详细步骤，同时探讨了Clear和Size方法在多对象连接情况下的操作注意事项，并建议针对不同业务配置独立的Redis db。'
---

## 基本介绍

缓存组件同时提供了 `gcache` 的 `Redis` 缓存适配实现。 `Redis` 缓存在多节点保证缓存的数据一致性时非常有用，特别是 `Session` 共享、数据库查询缓存等场景中。

## 使用示例

```go
func ExampleCache_SetAdapter() {
    var (
        err         error
        ctx         = gctx.New()
        cache       = gcache.New()
        redisConfig = &gredis.Config{
            Address: "127.0.0.1:6379",
            Db:      9,
        }
        cacheKey   = `key`
        cacheValue = `value`
    )
    // Create redis client object.
    redis, err := gredis.New(redisConfig)
    if err != nil {
        panic(err)
    }
    // Create redis cache adapter and set it to cache object.
    cache.SetAdapter(gcache.NewAdapterRedis(redis))

    // Set and Get using cache object.
    err = cache.Set(ctx, cacheKey, cacheValue, time.Second)
    if err != nil {
        panic(err)
    }
    fmt.Println(cache.MustGet(ctx, cacheKey).String())

    // Get using redis client.
    fmt.Println(redis.MustDo(ctx, "GET", cacheKey).String())

    // Output:
    // value
    // value
}
```

## 注意事项

### 关于 `Clear/Size` 等方法

首先，相同的 `gredis.Config` 总是会连接到相同的 `redis db` 中，而由于 `Redis` 本身没有数据分组功能，所以当多个 `gcache.Cache` 对象连接到同个 `redis db` 时，将会共享整个 `redis db`，而不会单独开辟一个分组用来存储当前 `gcache.Cache` 对象中的内容。因此当使用 `Clear`、 `Size` 这类操作时，将会对整个 `redis db` 进行操作，而不是与内存缓存一样的仅操作当前 `gcache.Cache` 对象中的内容，存在一定的反直觉，请务必谨慎使用。

### 建议使用不同的 `redis db` 区分业务缓存类型

另外，建议大家在使用 `Redis` 缓存时，单独配置不同的 `db` 来使用，而不是和其他的业务数据共用一个 `db`。