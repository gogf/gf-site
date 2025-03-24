---
slug: '/docs/web/http-client-header'
title: 'HTTPClient-自定义Header'
sidebar_position: 3
hide_title: true
keywords: [HTTPClient,自定义Header,GoFrame,GoFrame框架,SetHeader,Header方法,Span-Id,Trace-Id,HTTP请求,客户端]
description: '通过GoFrame框架的HTTPClient功能，用户可以自定义HTTP请求的Header信息。本文介绍了如何利用SetHeader、SetHeaderMap和SetHeaderRaw等方法设置和发送Header，从而实现自定义链路跟踪信息，如Span-Id和Trace-Id。通过简单的代码示例，展示了客户端如何与服务端交互并返回结果。'
---

HTTP客户端发起请求时可以自定义发送给服务端的 `Header` 内容，该特性使用 `SetHeader*` 相关方法实现。

方法列表：

```go
func (c *Client) SetHeader(key, value string) *Client
func (c *Client) SetHeaderMap(m map[string]string) *Client
func (c *Client) SetHeaderRaw(headers string) *Client
```

我们来看一个客户端通过 `Header` 来自定义发送自定义链路跟踪信息 `Span-Id` 及 `Trace-Id` 消息头的示例。

### 服务端

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Writef(
            "Span-Id:%s,Trace-Id:%s",
            r.Header.Get("Span-Id"),
            r.Header.Get("Trace-Id"),
        )
    })
    s.SetPort(8199)
    s.Run()
}
```

由于是作为示例，服务端的逻辑很简单，直接将接收到的 `Span-Id` 及 `Trace-Id` 参数返回给客户端。

### 客户端

1. 使用 `SetHeader` 方法

```go
package main

import (
       "fmt"

       "github.com/gogf/gf/v2/frame/g"
       "github.com/gogf/gf/v2/os/gctx"
)

func main() {
       c := g.Client()
       c.SetHeader("Span-Id", "0.0.1")
       c.SetHeader("Trace-Id", "NBC56410N97LJ016FQA")
       if r, e := c.Get(gctx.New(), "http://127.0.0.1:8199/"); e != nil {
           panic(e)
       } else {
           fmt.Println(r.ReadAllString())
       }
}
```

通过 `g.Client()` 创建一个自定义的HTTP请求客户端对象，并通过 `c.SetHeader` 设置自定义的 `Header` 信息。

2. 使用 `SetHeaderRaw` 方法

这个方法更加简单，可以通过原始的Header字符串来设置客户端请求Header。

```go
package main

import (
       "fmt"

       "github.com/gogf/gf/v2/frame/g"
       "github.com/gogf/gf/v2/os/gctx"
)

func main() {
       c := g.Client()
       c.SetHeaderRaw(`
           Referer: https://localhost
           Span-Id: 0.0.1
           Trace-Id: NBC56410N97LJ016FQA
           User-Agent: MyTestClient
       `)
       if r, e := c.Get(gctx.New(), "http://127.0.0.1:8199/"); e != nil {
           panic(e)
       } else {
           fmt.Println(r.ReadAllString())
       }
}
```

3. 执行结果

客户端代码执行后，终端将会打印出服务端的返回结果，如下：

```
Span-Id:0.0.1,Trace-Id:NBC56410N97LJ016FQA
```