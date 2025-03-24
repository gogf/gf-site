---
slug: '/docs/web/session-redis-key-value'
title: 'Session - Redis-KeyValue'
sidebar_position: 2
hide_title: true
keywords: [GoFrame, GoFrame framework, Redis, Session, KeyValue, multi-node deployment, StorageRedis, memory + Redis, JSON serialization, HashTable Storage]
description: "Using Redis in the GoFrame framework for Session KeyValue storage to solve the issue of Session sharing across multiple nodes. By using the StorageRedis object to implement Redis storage, it improves execution efficiency, suitable for scenarios with small amounts of user Session data, and provides specific examples and explanations. In the example, the Session expiration time is set to 1 minute, demonstrating methods of setting, getting, deleting Sessions, and the recovery function of Session data in Redis."
---

## Redis KeyValue Storage

The file storage method works well in single-node scenarios, but when it comes to deploying an application across multiple nodes, the `Session` cannot be shared between nodes, making it necessary to separate `Session` storage for independent management. The `Redis` server is a common choice.

The `gsession` Redis storage uses the `StorageRedis` object, similar to file storage. To improve execution efficiency, it adopts a `memory + Redis` approach. The only difference from file storage is that if `Session` operations are needed during each request, the latest `Session` data will be pulled from `Redis` (file storage only reads a file once when the `Session` does not exist). At the end of each request, the entire `Session` data is serialized using `JSON` and updated to the `Redis` service using the `KeyValue` method.
:::tip
For business scenarios where the `Session` data of each user is not large (taking the user dimension as an example), this storage method is recommended. If the `Session` data for a single user is large (e.g., `>10MB`), you can refer to the `HashTable` storage method: [Session - Redis-HashTable](Session-Redis-HashTable.md)
:::
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
    s.SetSessionStorage(gsession.NewStorageRedis(g.Redis()))
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

In this instance, to facilitate observing expiration, we set the `Session` expiration time to `1 minute`. After execution,

1. First, visit [http://127.0.0.1:8199/set](http://127.0.0.1:8199/set) to set a `Session` variable;
2. Then, visit [http://127.0.0.1:8199/get](http://127.0.0.1:8199/get) to see that the `Session` variable has been set and successfully retrieved;
3. Next, stop the program, restart it, and visit [http://127.0.0.1:8199/get](http://127.0.0.1:8199/get) again, you will see the `Session` variable has been restored from `Redis` storage; if we manually modify the corresponding key-value data in `Redis`, the latest value will be read when the page is refreshed;
4. After waiting 1 minute, visiting [http://127.0.0.1:8199/get](http://127.0.0.1:8199/get) again shows that the `Session` cannot be retrieved since it has expired;