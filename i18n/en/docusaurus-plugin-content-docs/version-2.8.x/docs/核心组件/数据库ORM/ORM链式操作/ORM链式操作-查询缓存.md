---
slug: '/docs/core/gdb-chaining-query-cache'
title: 'ORM Model - Query Cache'
sidebar_position: 10
hide_title: true
keywords: [GoFrame, ORM, query cache, chained operations, cache management, Redis, database, cache clearing, cache adaptation, table structure]
description: "Performing query cache operations using the ORM in the GoFrame framework. It supports caching to optimize query results, suitable for scenarios with more reads and fewer writes. The article provides a detailed introduction to cache management and adaptation, especially how to implement distributed caching using Redis. It also provides sample code showing table structures and their caching effects, demonstrating query cache implementation and cache clearing functions."
---

## Query Cache

`gdb` supports caching query results, which is commonly used in scenarios involving more reads and fewer writes. It also allows for manual cache clearing. Note that query caching only supports chained operations and is not available within a transaction.

Related methods:

```go
type CacheOption struct {
    // Duration is the TTL for the cache.
    // If the parameter `Duration` < 0, which means it clears the cache with given `Name`.
    // If the parameter `Duration` = 0, which means it never expires.
    // If the parameter `Duration` > 0, which means it expires after `Duration`.
    Duration time.Duration

    // Name is an optional unique name for the cache.
    // The Name is used to bind a name to the cache, which means you can later control the cache
    // like changing the `duration` or clearing the cache with specified Name.
    Name string

    // Force caches the query result whatever the result is nil or not.
    // It is used to avoid Cache Penetration.
    Force bool
}

// Cache sets the cache feature for the model. It caches the result of the sql, which means
// if there's another same sql request, it just reads and returns the result from cache, it
// but not committed and executed into the database.
//
// Note that, the cache feature is disabled if the model is performing select statement
// on a transaction.
func (m *Model) Cache(option CacheOption) *Model
```

## Cache Management

### Cache Object

By default, the `ORM` object provides a cache management object, and this cache object type is `*gcache.Cache`. This means it also supports all the features of `*gcache.Cache`. You can obtain the cache object through the `GetCache() *gcache.Cache` method and use the returned object to perform various custom cache operations, such as `g.DB().GetCache().Keys()`.

### Cache Adaptation (Redis Caching)

By default, the `*gcache.Cache` cache object of `ORM` provides single-process memory caching, which is highly efficient but can only be used in a single process. If the service is deployed on multiple nodes, caches between nodes may be inconsistent, so in most scenarios, we implement database query caching through a Redis server. The `*gcache.Cache` object adopts an adapter design pattern, allowing easy switching from single-process memory caching to distributed Redis caching. Example use:

```go
redisCache := gcache.NewAdapterRedis(g.Redis())
g.DB().GetCache().SetAdapter(redisCache)
```

For more information, refer to: [Caching - Redis](../../缓存管理/缓存管理-Redis缓存.md)

### Management Methods

To simplify database query cache management, starting from version `v2.2.0`, two cache management methods are provided:

```go
// ClearCache removes cached sql result of certain table.
func (c *Core) ClearCache(ctx context.Context, table string) (err error)

// ClearCacheAll removes all cached sql result from cache
func (c *Core) ClearCacheAll(ctx context.Context) (err error)
```

The methods are explained in the comments. These methods are mounted on the `Core` object, and the underlying `Core` object is already exposed through the `DB` interface, allowing us to obtain the `Core` object like this:

```go
g.DB().GetCore()
```

## Usage Example

### Table Structure

```sql
CREATE TABLE `user` (
  `uid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL DEFAULT '' COMMENT 'Nickname',
  `site` varchar(255) NOT NULL DEFAULT '' COMMENT 'Homepage',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```

### Sample Code

```go
package main

import (
    "time"

    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        db  = g.DB()
        ctx = gctx.New()
    )

    // Enable debug mode to record all executed SQL
    db.SetDebug(true)

    // Insert test data
    _, err := g.Model("user").Ctx(ctx).Data(g.Map{
        "name": "john",
        "site": "https://goframe.org",
    }).Insert()

    // Perform the query twice and cache the result for 1 hour with an optional cache name
    for i := 0; i < 2; i++ {
        r, _ := g.Model("user").Ctx(ctx).Cache(gdb.CacheOption{
            Duration: time.Hour,
            Name:     "vip-user",
            Force:    false,
        }).Where("uid", 1).One()
        g.Log().Debug(ctx, r.Map())
    }

    // Perform an update operation and clear the query cache with a specified name
    _, err = g.Model("user").Ctx(ctx).Cache(gdb.CacheOption{
        Duration: -1,
        Name:     "vip-user",
        Force:    false,
    }).Data(gdb.Map{"name": "smith"}).Where("uid", 1).Update()
    if err != nil {
        g.Log().Fatal(ctx, err)
    }

    // Execute the query again enabling the query cache feature
    r, _ := g.Model("user").Ctx(ctx).Cache(gdb.CacheOption{
        Duration: time.Hour,
        Name:     "vip-user",
        Force:    false,
    }).Where("uid", 1).One()
    g.Log().Debug(ctx, r.Map())
}
```

The output after execution is (the test table data structure is for reference only):

```html
2022-02-08 17:36:19.817 [DEBU] {c0424c75f1c5d116d0df0f7197379412} {"name":"john","site":"https://goframe.org","uid":1}
2022-02-08 17:36:19.817 [DEBU] {c0424c75f1c5d116d0df0f7197379412} {"name":"john","site":"https://goframe.org","uid":1}
2022-02-08 17:36:19.817 [DEBU] {c0424c75f1c5d116d0df0f7197379412} [  0 ms] [default] [rows:1  ] UPDATE `user` SET `name`='smith' WHERE `uid`=1
2022-02-08 17:36:19.818 [DEBU] {c0424c75f1c5d116d0df0f7197379412} [  1 ms] [default] [rows:1  ] SELECT * FROM `user` WHERE `uid`=1 LIMIT 1
2022-02-08 17:36:19.818 [DEBU] {c0424c75f1c5d116d0df0f7197379412} {"name":"smith","site":"https://goframe.org","uid":1}
```

It can be observed that:

1. To demonstrate cache effects conveniently, data `debug` feature is enabled, so any SQL operation will be output to the terminal.
2. The `One` method is executed twice for data querying. The first time an SQL query is executed, the second time it directly uses the cache without submitting the SQL to the database, hence only one query SQL is printed, and the results of both queries are consistent.
3. Note that a custom name `vip-user` is set for caching the query, facilitating subsequent cache clearing upon update. If cache clearing is not needed, a cache name does not need to be set.
4. The cache with a specified name is cleared when the `Update` operation is executed.
5. The query is executed again to re-cache the new data.