---
slug: '/docs/core/gcache-redis'
title: 'Caching - Redis'
sidebar_position: 2
hide_title: true
keywords: [GoFrame, GoFrame Framework, Cache Management, Redis Cache, gcache, Redis Adapter, Session Sharing, Database Query Cache, Redis DB, Cache Object]
description: "The cache management module in the GoFrame framework focuses on the implementation and usage of the Redis cache adapter. It provides examples on ensuring data consistency in multi-node environments. Detailed steps on setting up Redis clients and using Redis cache adapters are given, and the operation notes for Clear and Size methods in multi-object connections are discussed. It is also recommended to configure independent Redis DBs for different business scenarios."
---

## Introduction

The cache component provides a `Redis` cache adapter implementation for `gcache`. `Redis` cache is very useful in ensuring data consistency in multi-node environments, especially in scenarios such as `Session` sharing and database query caching.

## Usage Example

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

## Notes

### On `Clear/Size` Methods

First, the same `gredis.Config` will always connect to the same `redis db`, and since `Redis` itself doesn't have data grouping features, when multiple `gcache.Cache` objects connect to the same `redis db`, they will share the entire `redis db` rather than having a separate group to store the current `gcache.Cache` object's content. Therefore, operations like `Clear` and `Size` will act on the entire `redis db` instead of just the content in the current `gcache.Cache` object as with in-memory caches, which can be counterintuitive, so please use with caution.

### It is recommended to use different `redis db` to differentiate business cache types

Additionally, it is recommended to configure different `db` for usage when using `Redis` cache, rather than sharing a `db` with other business data.