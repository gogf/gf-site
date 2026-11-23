# Session - Memory

## Memory Storage

Memory storage is relatively simple and efficient, but it does not persistently store `Session` data, so the `Session` data will be lost after the application restarts. It can be used in specific business scenarios. The `memory` storage of `gsession` is implemented using the `StorageMemory` object.

## Example Usage

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
    s.SetSessionStorage(gsession.NewStorageMemory())
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.ALL("/set", func(r *ghttp.Request) {
            r.Session.MustSet("time", gtime.Timestamp())
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

In this example, to conveniently observe expiration, we set the `Session` expiration time to `1 minute`. After executing,

1. First, visit [http://127.0.0.1:8199/set](http://127.0.0.1:8199/set) to set a `Session` variable;
2. Then, visit [http://127.0.0.1:8199/get](http://127.0.0.1:8199/get) to see that the `Session` variable has been set and successfully retrieved;
3. Next, we stop the program and restart it. Visit [http://127.0.0.1:8199/get](http://127.0.0.1:8199/get) again to see that the `Session` variable is gone;

> Page: https://goframe.org/en/docs/web/session-memory
