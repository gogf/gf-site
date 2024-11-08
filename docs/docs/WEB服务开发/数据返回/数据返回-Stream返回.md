---
slug: '/docs/web/response-stream'
title: '数据返回-Stream返回'
sidebar_position: 6
hide_title: true
keywords: [GoFrame,GoFrame框架,HTTP流式数据返回,流式数据,v2.4,SSE,数据返回,流式处理,事件流,Go语言]
description: '本页介绍如何使用GoFrame框架实现HTTP流式数据返回，适用于框架版本小于v2.4及以上的版本。通过简化的代码实现高效的流式数据传输，适用于需要长连接和持续数据更新的场景，并提供注意事项和相关资料的参考。'
---

我们可以很简单实现HTTP流式数据返回。

## 框架版本 < `v2.4`

如果当前使用的框架版本小于 `v2.4` 正式版（不是 `beta` 版本），使用以下方式返回（标准库原生写法）。

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

## 框架版本 >= `v2.4`

由于以上操作有点繁琐，因此在该版本以后做了一些操作上的改进，如果当前使用的框架版本在 `v2.4` 正式版（不是 `beta` 版本）以上，那么可以使用以下方式快速实现流式数据返回。

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

## 示例结果

执行后访问 [http://127.0.0.1:8999/](http://127.0.0.1:8999/) 可以看到数据通过流式方式不断地将数据返回给调用端。

![](/markdown/1a8b7fecfb331ebe454633ac06b27592.png)

## 注意事项

- 如果是在控制器中使用， `Request` 对象的获取可以通过 `g.RequestFromCtx(ctx)` 方法。
- 如果有前置统一输入输出处理的中间件，请将该方法放置于中间件作用域之外，或者使用 `r.ExitAll()` 方法跳出中间件控制。

## 资料

[Server-Sent Events （SSE）](https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html)