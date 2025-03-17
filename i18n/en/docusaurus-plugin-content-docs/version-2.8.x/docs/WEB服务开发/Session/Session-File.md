---
slug: '/docs/web/session-file'
title: 'Session - File'
sidebar_position: 0
hide_title: true
keywords: [GoFrame,GoFrame Framework,Session,File Storage,ghttp.Server,StorageFile,gcache,Serialization,Deserialization,Session Management]
description: "Using the ghttp.Server of the GoFrame framework to implement file storage for sessions. By default, session storage uses a combination of memory and files through StorageFile for persistent management. Thanks to the gcache module, session data operations are efficient, especially suitable for scenarios with more reads and fewer writes. Meanwhile, the demonstration example shows how to set and get sessions in a GoFrame project."
---

## File Storage

By default, the session storage of `ghttp.Server` uses a combination of `memory + file`, implemented through the `StorageFile` object. The specific principles are:

1. Session data operations are entirely memory-based;
2. The `gcache` process caching module controls data expiration;
3. File storage is used for persistent management of session data;
4. Session serialization and file persistence storage are executed only when a session is marked as `dirty` (data has been updated);
5. Deserialization from file storage to restore session data to memory only occurs when the session does not exist in memory, reducing IO calls;
6. Serialization/deserialization uses the `json.Marshal/UnMarshal` methods from the standard library.

As can be seen from the principles, session data operations are very efficient in scenarios with more reads and fewer writes.
:::tip
A detail to note is that because file storage involves file operations, to reduce IO overhead and improve session operation performance, the TTL of the corresponding session is not immediately refreshed after each session request ends. It is only immediately refreshed when it involves update operations (marked as `dirty`). For read requests, the TTL of the session files corresponding to read operations in the previous minute is updated every `one minute`, allowing the session to automatically persist.
:::

## Usage Example

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gtime"
    "time"
)

func main() {
    s := g.Server()
    s.SetSessionMaxAge(time.Minute)
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

In this instance, to easily observe expiration and invalidation, we set the session expiration time to `1 minute`. After execution:

1. First, visit [http://127.0.0.1:8199/set](http://127.0.0.1:8199/set) to set a session variable;
2. Then, visit [http://127.0.0.1:8199/get](http://127.0.0.1:8199/get) to see that the session variable is set and successfully retrieved;
3. Next, stop the program, restart it, and visit [http://127.0.0.1:8199/get](http://127.0.0.1:8199/get) again to see that the session variable has been restored from file storage;
4. After waiting for 1 minute, visit [http://127.0.0.1:8199/get](http://127.0.0.1:8199/get) again to see that the session can no longer be retrieved because it has expired.