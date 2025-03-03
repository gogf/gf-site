---
slug: '/docs/web/senior-cors'
title: 'CORS'
sidebar_position: 4
hide_title: true
keywords: [CORS, Cross-Domain Requests, GoFrame, Middleware, AJAX, Origin, CORSOptions, Cross-Domain Access, GoFrame Framework, WebSocket]
description: "Handling CORS cross-domain requests using the GoFrame framework, setting cross-domain rules with routing management and middleware, allowing WebSocket cross-domain access. Provides CORS object and its configuration parameters, including default and restricted Origin settings. Additionally, it demonstrates basic usage methods, authorizing cross-domain Origin, and custom detection methods to achieve more flexible cross-domain request management."
---

Allowing cross-domain access to APIs often requires using it in conjunction with [Middleware - Intro](../路由管理/路由管理-中间件拦截器/中间件拦截器-基本介绍.md) to uniformly set which API under certain routing rules can be accessed cross-domain. This method is also used to allow cross-domain access for `WebSocket` requests.

Related methods: [https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#Response](https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#Response)

```go
func (r *Response) CORS(options CORSOptions)
func (r *Response) CORSAllowedOrigin(options CORSOptions) bool
func (r *Response) CORSDefault()
func (r *Response) DefaultCORSOptions() CORSOptions
```

### `CORS` Object

`CORS` is the standard for HTTP cross-domain requests by the `W3` internet standard organization. In the `ghttp` module, we can manage the corresponding cross-domain request options through the `CORSOptions` object. Defined as follows:

```go
// See https://www.w3.org/TR/cors/ .
// Server allows cross-domain request options
type CORSOptions struct {
    AllowDomain      []string // Used for allowing requests from custom domains
    AllowOrigin      string   // Access-Control-Allow-Origin
    AllowCredentials string   // Access-Control-Allow-Credentials
    ExposeHeaders    string   // Access-Control-Expose-Headers
    MaxAge           int      // Access-Control-Max-Age
    AllowMethods     string   // Access-Control-Allow-Methods
    AllowHeaders     string   // Access-Control-Allow-Headers
}
```

For specific parameter introductions, please refer to the W3 organization [official manual](https://www.w3.org/TR/cors/).

### `CORS` Configuration

#### Default `CORSOptions`

For ease of cross-domain settings, the `ghttp` module also provides default cross-domain request options, available through the `DefaultCORSOptions` method. In most cases, we can directly use `CORSDefault()` to allow cross-domain access for APIs that need to allow cross-domain requests (generally using middleware).

#### Restricting `Origin` Sources

Most of the time, we need to limit the request source to our trusted domain list. We can use the `AllowDomain` configuration, as follows:

```go
// Allow cross-domain request middleware
func Middleware(r *ghttp.Request) {
    corsOptions := r.Response.DefaultCORSOptions()
    corsOptions.AllowDomain = []string{"goframe.org", "johng.cn"}
    r.Response.CORS(corsOptions)
    r.Middleware.Next()
}
```

### `OPTIONS` Request

Some clients and certain browsers will send an `OPTIONS` preflight request before sending an `AJAX` request to check whether subsequent requests are allowed. The `GoFrame` framework's `Server` fully complies with the `W3C` specifications for the `OPTIONS` request method. Therefore, as long as the server is set up with `CORS` middleware, `OPTIONS` requests will also be automatically supported.

### Example 1, Basic Usage

Let's look at a simple API example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func Order(r *ghttp.Request) {
    r.Response.Write("GET")
}

func main() {
    s := g.Server()
    s.Group("/api.v1", func(group *ghttp.RouterGroup) {
        group.GET("/order", Order)
    })
    s.SetPort(8199)
    s.Run()
}
```

The API address is [http://localhost/api.v1/order](http://localhost/api.v1/order), and of course, this API does not allow cross-domain access. We open a different domain, for example, the Baidu homepage (which uses `jQuery`, convenient for debugging), then press `F12` to open the developer panel and execute the following `AJAX` request under `console`:

```
$.get("http://localhost:8199/api.v1/order", function(result){
    console.log(result)
});
```

The result is as follows:

![](/markdown/06b316cb2a487071cf4be67a3481dac3.png)

It returned an error indicating that cross-domain requests are not allowed. Next, we modify the server-side API test code as follows:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func MiddlewareCORS(r *ghttp.Request) {
    r.Response.CORSDefault()
    r.Middleware.Next()
}

func Order(r *ghttp.Request) {
    r.Response.Write("GET")
}

func main() {
    s := g.Server()
    s.Group("/api.v1", func(group *ghttp.RouterGroup) {
        group.Middleware(MiddlewareCORS)
        group.GET("/order", Order)
    })
    s.SetPort(8199)
    s.Run()
}
```

We added the pre-middleware `MiddlewareCORS` for the route `/api.v1`, which will be called before all services are executed. By calling the `CORSDefault` method, we use the default cross-domain settings to allow cross-domain requests. The bound event routing rule uses a fuzzy matching rule, indicating that all API addresses starting with `/api.v1` allow cross-domain requests.

Returning to the Baidu homepage, executing the `AJAX` request again, this time it succeeds:

![](/markdown/46045bd28217115525ef3db08eec309b.png)

Of course, we can also set more cross-domain request settings using the `CORSOptions` object and `CORS` method.

### Example 2, Authorizing Cross-Domain `Origin`

In most scenarios, we need to customize and authorize cross-domain `Origin`. We can improve the example above as follows. In this example, we only allow cross-domain requests from `goframe.org` and `baidu.com`.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func MiddlewareCORS(r *ghttp.Request) {
    corsOptions := r.Response.DefaultCORSOptions()
    corsOptions.AllowDomain = []string{"goframe.org", "baidu.com"}
    r.Response.CORS(corsOptions)
    r.Middleware.Next()
}

func Order(r *ghttp.Request) {
    r.Response.Write("GET")
}

func main() {
    s := g.Server()
    s.Group("/api.v1", func(group *ghttp.RouterGroup) {
        group.Middleware(MiddlewareCORS)
        group.GET("/order", Order)
    })
    s.SetPort(8199)
    s.Run()
}
```

### Example 3, Custom Detection and Authorization

I wonder if you noticed a detail in the above examples: even if the current API does not allow cross-domain access, once the API is called, the complete logic of the API will still be executed, and a full request process will have occurred on the server. To address this issue, we can customize the authorization `Origin` and use the `CORSAllowedOrigin` method in middleware to determine whether the current request `Origin` is allowed by the server to execute. Only then will the subsequent process be executed; otherwise, execution will be terminated.

In the following example, only cross-domain requests from the `goframe.org` domain are allowed, while requests from other domains will fail and return `403`:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func MiddlewareCORS(r *ghttp.Request) {
    corsOptions := r.Response.DefaultCORSOptions()
    corsOptions.AllowDomain = []string{"goframe.org"}
    if !r.Response.CORSAllowedOrigin(corsOptions) {
        r.Response.WriteStatus(http.StatusForbidden)
        return
    }
    r.Response.CORS(corsOptions)
    r.Middleware.Next()
}

func Order(r *ghttp.Request) {
    r.Response.Write("GET")
}

func main() {
    s := g.Server()
    s.Group("/api.v1", func(group *ghttp.RouterGroup) {
        group.Middleware(MiddlewareCORS)
        group.GET("/order", Order)
    })
    s.SetPort(8199)
    s.Run()
}
```