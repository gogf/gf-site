---
slug: '/docs/web/cookie'
title: 'Cookie'
sidebar_position: 6
hide_title: true
keywords: [Cookie,GoFrame,GoFrame Framework,ghttp,SessionId,API Documentation,SetCookie,HTTP Server,Session,Web Development]
description: 'This document provides a detailed guide on using cookies for session management in the GoFrame framework. The ghttp.Request object makes it easy for developers to get, set, and delete cookies. It also covers obtaining and setting SessionIds, handling cookie expiration times, and the simple methods for inheriting and using session objects in controllers. These features offer powerful tools for web developers to manage user sessions, ensuring flexibility and responsiveness in web applications.'
---

## Basic Introduction

API Documentation: [https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#Cookie](https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#Cookie)

Common methods:

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

At any time, you can obtain the `Cookie` object for the current request through the `*ghttp.Request` object. Since `Cookie` and `Session` are related to the request session, they are both member objects of `ghttp.Request` and are publicly accessible. The `Cookie` object does not need to be manually closed; the `HTTP Server` will automatically close it after the request process ends.

Additionally, the `Cookie` class encapsulates two methods related to `SessionId`:

1. `Cookie.GetSessionId()` is used to obtain the `SessionId` submitted with the current request. Each request's `SessionId` is unique and persists throughout the request process; this value might be empty.
2. `Cookie.SetSessionId(id string)` allows you to set a custom `SessionId` in the `Cookie`, which is returned to the client (usually a browser) for storage. The client can then send this `SessionId` with every request in the `Cookie`.

When setting cookie variables, you can specify an expiration time, which is an optional parameter, with the default expiration time being one year for the cookie.
:::tip
The default storage name for `SessionId` in the `Cookie` is `gfsession`.
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

By running the outer `main.go`, you can try refreshing the page [http://127.0.0.1:8199/cookie](http://127.0.0.1:8199/cookie), and you will see the displayed time constantly changing.

For the controller object, many session-related object pointers are inherited from the base controller and can be used directly as aliases; they all point to the same object:

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

Since cookies are already a very familiar component for web developers, and the related APIs are very simple, they will not be further elaborated here.

## `Cookie` Session Expiry

By default, the cookie's validity is for one year. If we want the cookie to expire with the user's browsing session, like this:

![](/markdown/6aca8ffefa9db267e2a4ecf1423ba6be.png)

We only need to set the `Cookie` key-value pair using `SetCookie` and set the `maxAge` parameter to `0`, like this:

```
r.Cookie.SetCookie("MyCookieKey", "MyCookieValue", "", "/", 0)
```