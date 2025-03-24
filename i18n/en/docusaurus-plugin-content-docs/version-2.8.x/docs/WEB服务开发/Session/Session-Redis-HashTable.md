---
slug: '/docs/web/session-redis-hash-table'
title: 'Session - Redis-HashTable'
sidebar_position: 3
hide_title: true
keywords: [GoFrame,GoFrame Framework,RedisHashTableStorage,Session,Redis Storage,Session Management,Go Development,Web Development,Session Expiration,Session Example]
description: "In the GoFrame framework, use RedisHashTableStorage for session management. Unlike RedisKeyValueStorage, this method operates directly through the Redis service without needing a full data fetch. The example code illustrates basic session setting, retrieval, and deletion operations, and how to integrate this feature in GoFrame."
---

## RedisHashTableStorage

Unlike `RedisKeyValueStorage`, `RedisHashTableStorage` uses a `HashTable` to store `Session` data at its core. Each addition, deletion, or query operation on `Session` is directly implemented by accessing the `Redis` service (single data item operation). There is no full data fetch as in `RedisKeyValueStorage`, which fetches all data once during initialization and updates all data to the `Redis` service after modifications when the request ends.

## Usage Example

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gsession"
    "github.com/gogf/gf/v2/os/gtime"
    "time"
)

func main() {
    s := g.Server()
    s.SetSessionMaxAge(time.Minute)
    s.SetSessionStorage(gsession.NewStorageRedisHashTable(g.Redis()))
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.ALL("/set", func(r *ghttp.Request) {
            r.Session.Set("time", gtime.Timestamp())
            r.Response.Write("ok")
        })
        group.ALL("/get", func(r *ghttp.Request) {
            r.Response.Write(r.Session.Data())
        })
        group.ALL("/del", func(r *ghttp.Request) {
            _ = r.Session.RemoveAll()
            r.Response.Write("ok")
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

In this example, to conveniently observe expiration, the session expiration time is set to `1 minute`. After running:

1. First, visit [http://127.0.0.1:8199/set](http://127.0.0.1:8199/set) to set a session variable;
2. Then, visit [http://127.0.0.1:8199/get](http://127.0.0.1:8199/get) to see the session variable has been set and successfully retrieved;
3. Next, stop the program, restart it, and visit [http://127.0.0.1:8199/get](http://127.0.0.1:8199/get) again. You can see that the session variable has been restored from the Redis storage. If we manually modify the corresponding key-value data in Redis, the page refresh will read the latest value;
4. After waiting for 1 minute, visit [http://127.0.0.1:8199/get](http://127.0.0.1:8199/get) again and see that the session cannot be retrieved because it has expired.