---
slug: '/docs/web/http-client-header'
title: 'HTTPClient - Header'
sidebar_position: 3
hide_title: true
keywords: [HTTPClient, Custom Header, GoFrame, GoFrame Framework, SetHeader, Header Method, Span-Id, Trace-Id, HTTP Request, Client]
description: "With the HTTPClient feature of the GoFrame framework, users can customize the Header information of HTTP requests. This article introduces how to set and send Headers using methods like SetHeader, SetHeaderMap, and SetHeaderRaw, thus implementing custom tracing information such as Span-Id and Trace-Id. Simple code examples demonstrate how the client interacts with the server and returns results."
---

When the HTTP client sends a request, it can customize the `Header` content sent to the server, a feature implemented using the `SetHeader*` related methods.

Method List:

```go
func (c *Client) SetHeader(key, value string) *Client
func (c *Client) SetHeaderMap(m map[string]string) *Client
func (c *Client) SetHeaderRaw(headers string) *Client
```

Let's take a look at an example where the client customizes the sending of custom tracing information `Span-Id` and `Trace-Id` message headers using `Header`.

### Server

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

Since this is an example, the server logic is straightforward, directly returning the received `Span-Id` and `Trace-Id` parameters to the client.

### Client

1. Using the `SetHeader` Method

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

Create a custom HTTP request client object using `g.Client()` and set custom `Header` information using `c.SetHeader`.

2. Using the `SetHeaderRaw` Method

This method is simpler and allows setting the client request Header via a raw Header string.

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

3. Execution Result

After executing the client code, the terminal will print the result returned by the server, as follows:

```
Span-Id:0.0.1,Trace-Id:NBC56410N97LJ016FQA
```