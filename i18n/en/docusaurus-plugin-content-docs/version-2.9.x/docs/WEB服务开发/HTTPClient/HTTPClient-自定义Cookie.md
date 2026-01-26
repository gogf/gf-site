---
slug: '/docs/web/http-client-cookie'
title: 'HTTPClient - Cookie'
sidebar_position: 2
hide_title: true
keywords: [HTTPClient, Custom Cookie, GoFrame, GoFrame Framework, SetCookie, SetCookieMap, HTTP Client, ghttp, Cookie, Server]
description: "Customize the Cookie content sent to the server using the HTTP client in the GoFrame framework, mainly implemented through the SetCookie and SetCookieMap methods. Demonstrated with simple server and client examples on how to set and receive custom Cookie parameters, achieving personalized HTTP client requests."
---

When an HTTP client initiates a request, it can customize the `Cookie` content sent to the server. This feature is implemented using the `SetCookie*` related methods.

Method list:

```go
func (c *Client) SetCookie(key, value string) *Client
func (c *Client) SetCookieMap(m map[string]string) *Client
```

Let's look at an example of a client customizing `Cookie`.

### Server

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request){
        r.Response.Write(r.Cookie.Map())
    })
    s.SetPort(8199)
    s.Run()
}
```

As this is an example, the server logic is straightforward, directly returning all received `Cookie` parameters to the client.

### Client

1. Using the `SetCookie` method

```go
package main

import (
       "fmt"

       "github.com/gogf/gf/v2/frame/g"
       "github.com/gogf/gf/v2/os/gctx"
)

func main() {
       c := g.Client()
       c.SetCookie("name", "john")
       c.SetCookie("score", "100")
       if r, e := c.Get(gctx.New(), "http://127.0.0.1:8199/"); e != nil {
           panic(e)
       } else {
           fmt.Println(r.ReadAllString())
       }
}
```

Create a custom HTTP request client object using `g.Client()` and set custom `Cookie` using the `c.SetCookie` method. Here, we set two example `Cookie` parameters, one `name`, and one `score`.

2. Using the `SetCookieMap` method

This method is simpler and allows setting `Cookie` key-value pairs in bulk.

```go
package main

import (
       "fmt"

       "github.com/gogf/gf/v2/frame/g"
       "github.com/gogf/gf/v2/os/gctx"
)

func main() {
       c := g.Client()
       c.SetCookieMap(g.MapStrStr{
           "name":  "john",
           "score": "100",
       })
       if r, e := c.Get(gctx.New(), "http://127.0.0.1:8199/"); e != nil {
           panic(e)
       } else {
           fmt.Println(r.ReadAllString())
       }
}
```

3. Execution Result

After executing the client code, the terminal will print the server's response as follows:

```
map[name:john score:100]
```

As you can see, the server has received the custom `Cookie` parameters from the client.