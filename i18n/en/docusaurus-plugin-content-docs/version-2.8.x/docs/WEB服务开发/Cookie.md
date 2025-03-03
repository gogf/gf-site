---
slug: '/docs/web/cookie'
title: 'Cookie'
sidebar_position: 6
hide_title: true
keywords: [Cookie, GoFrame, GoFrame Framework, ghttp, SessionId, API Documentation, SetCookie, HTTP Server, Session, Web Development]
description: "Use Cookie for session management in the GoFrame framework. Developers can easily get, set, and delete cookies through the ghttp.Request object. It also discusses obtaining and setting SessionId, handling cookie expiration, and simple methods to inherit and use session objects in controllers. These features provide powerful tools for web developers to manage user sessions, ensuring the flexibility and adaptability of web applications."
---

## Introduction

API Documentation: [https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#Cookie](https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#Cookie)

Common Methods:

```go
type Cookie
    func GetCookie(r *Request) *Cookie
    func (c *Cookie) Contains(key string) bool
    func (c *Cookie) Flush()
    func (c *Cookie) Get(key string, def ...string) string
    func (c *Cookie) GetSessionId() string
    func (c *Cookie) Map() map[string]string
    func (c *Cookie) Remove(key string)
    func (c *Cookie) RemoveCookie(key, domain, path string)
    func (c *Cookie) Set(key, value string)
    func (c *Cookie) SetCookie(key, value, domain, path string, maxAge time.Duration, httpOnly ...bool)
    func (c *Cookie) SetHttpCookie(httpCookie *http.Cookie)
    func (c *Cookie) SetSessionId(id string)
```

The `Cookie` object corresponding to the current request can be obtained at any time through the `*ghttp.Request` object since both `Cookie` and `Session` are related to the request session and are therefore member objects of `ghttp.Request`, accessible to the public. The `Cookie` object does not need to be manually closed; the `HTTP Server` will automatically close it after the request cycle ends.

Additionally, `Cookie` encapsulates two methods related to `SessionId`:

1. `Cookie.GetSessionId()` is used to obtain the `SessionId` submitted by the current request. Each request's `SessionId` is unique and accompanies the entire request cycle. The value may be empty.
2. `Cookie.SetSessionId(id string)` is used to custom-set the `SessionId` into the `Cookie`, which is then returned to the client (often the browser) for storage. Subsequently, the client can carry the `SessionId` in `Cookie` with each request.

When setting the `Cookie` variable, an expiration time can be given, which is an optional parameter. The default `Cookie` expiration time is one year.

:::tip
The default storage name for `SessionId` in `Cookie` is `gfsession`.
:::

## Usage Example

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gtime"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/cookie", func(r *ghttp.Request) {
        datetime := r.Cookie.Get("datetime")
        r.Cookie.Set("datetime", gtime.Datetime())
        r.Response.Write("datetime:", datetime)
    })
    s.SetPort(8199)
    s.Run()
}
```

Execute the outer `main.go`, and try refreshing the page [http://127.0.0.1:8199/cookie](http://127.0.0.1:8199/cookie), the displayed time keeps changing.

For controller objects, many session-related object pointers inherited from the base class controller can be regarded as aliases and used directly, all pointing to the same object:

```go
type Controller struct {
    Request  *ghttp.Request  // Request data object
    Response *ghttp.Response // Response data object (r.Response)
    Server   *ghttp.Server   // WebServer object (r.Server)
    Cookie   *ghttp.Cookie   // COOKIE operation object (r.Cookie)
    Session  *ghttp.Session  // SESSION operation object
    View     *View           // View object
}
```

Since `Cookie` is already a very familiar component to web developers, and the related `API` is very simple, further elaboration is not needed here.

## `Cookie` Session Expiry

The default validity period for `Cookie` is 1 year. If we want the Cookie to expire with the user's browsing session, like this:

![](/markdown/6aca8ffefa9db267e2a4ecf1423ba6be.png)

Then we only need to set the `Cookie` key-value pair via `SetCookie` and set the `maxAge` parameter to `0`. Like this:

```
r.Cookie.SetCookie("MyCookieKey", "MyCookieValue", "", "/", 0)
```