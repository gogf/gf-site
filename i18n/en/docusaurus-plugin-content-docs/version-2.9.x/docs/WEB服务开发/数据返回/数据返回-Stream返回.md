---
slug: '/docs/web/response-stream'
title: 'Response - Streaming'
sidebar_position: 6
hide_title: true
keywords: [GoFrame, GoFrame Framework, HTTP Streaming Data Return, Streaming Data, v2.4, SSE, Data Return, Stream Processing, Event Stream, Go Language]
description: "Implement HTTP streaming data returns using the GoFrame framework, suitable for framework versions less than v2.4 and above. Achieve efficient streaming data transmission with simplified code, applicable for scenarios requiring long connections and continuous data updates, and provides notices and references."
---

We can easily implement HTTP streaming data return.

## Framework version < `v2.4`

If the current framework version is less than `v2.4` final version (not `beta` version), use the following method to return (native standard library writing).

```go
package main

import (
    "fmt"
    "net/http"
    "time"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        rw := r.Response.RawWriter()
        flusher, ok := rw.(http.Flusher)
        if !ok {
            http.Error(rw, "Streaming unsupported!", http.StatusInternalServerError)
            return
        }
        r.Response.Header().Set("Content-Type", "text/event-stream")
        r.Response.Header().Set("Cache-Control", "no-cache")
        r.Response.Header().Set("Connection", "keep-alive")

        for i := 0; i < 100; i++ {
            _, err := fmt.Fprintf(rw, "data: %d\n", i)
            if err != nil {
                panic(err)
            }
            flusher.Flush()
            time.Sleep(time.Millisecond * 200)
        }
    })
    s.SetPort(8999)
    s.Run()
}
```

## Framework version >= `v2.4`

Because the above operation is somewhat cumbersome, operational improvements were made in this version and above. If the current framework version is `v2.4` final version (not `beta` version) or later, you can quickly implement streaming data return using the following method.

```go
package main

import (
    "time"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Header().Set("Content-Type", "text/event-stream")
        r.Response.Header().Set("Cache-Control", "no-cache")
        r.Response.Header().Set("Connection", "keep-alive")

        for i := 0; i < 100; i++ {
            r.Response.Writefln("data: %d", i)
            r.Response.Flush()
            time.Sleep(time.Millisecond * 200)
        }
    })
    s.SetPort(8999)
    s.Run()
}
```

## Example Result

After execution, visiting [http://127.0.0.1:8999/](http://127.0.0.1:8999/) shows data continuously returned to the caller in a streaming manner.

![](/markdown/1a8b7fecfb331ebe454633ac06b27592.png)

## Precautions

- If used in a controller, the `Request` object can be acquired through the `g.RequestFromCtx(ctx)` method.
- If there is a middleware for pre-unified input and output processing, please place this method outside the middleware scope or use the `r.ExitAll()` method to exit middleware control.

## References

[Server-Sent Events (SSE)](https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html)