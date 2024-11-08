---
slug: '/docs/web/cookie'
title: 'Cookie'
sidebar_position: 6
hide_title: true
keywords: [Cookie,GoFrame,GoFrame框架,ghttp,SessionId,接口文档,SetCookie,HTTP Server,Session,web开发]
description: '本文档详细介绍了如何在GoFrame框架中使用Cookie进行会话管理。通过ghttp.Request对象，开发者可以轻松获取、设置和删除Cookie。还讨论了SessionId的获取和设置，Cookie的过期时间处理，以及在控制器中继承和使用会话对象的简易方法。这些功能为Web开发者提供了强大的工具来管理用户会话，确保Web应用的灵活性和应变能力。'
---

## 基本介绍

接口文档： [https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#Cookie](https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#Cookie)

常用方法：

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

任何时候都可以通过 `*ghttp.Request` 对象获取到当前请求对应的 `Cookie` 对象，因为 `Cookie` 和 `Session` 都是和请求会话相关，因此都属于 `ghttp.Request` 的成员对象，并对外公开。 `Cookie` 对象不需要手动 `Close`，请求流程结束后， `HTTP Server` 会自动关闭掉。

此外， `Cookie` 中封装了两个 `SessionId` 相关的方法：

1. `Cookie.GetSessionId()` 用于获取当前请求提交的 `SessionId`，每个请求的 `SessionId` 都是唯一的，并且伴随整个请求流程，该值可能为空。
2. `Cookie.SetSessionId(id string)` 用于自定义设置 `SessionId` 到 `Cookie` 中，返回给客户端（往往是浏览器）存储，随后客户端每一次请求在 `Cookie` 中可带上该 `SessionId`。

在设置 `Cookie` 变量的时候可以给定过期时间，该时间为可选参数，默认的 `Cookie` 过期时间为一年。
:::tip
默认的 `SessionId` 在 `Cookie` 中的存储名称为 `gfsession`。
:::
## 使用示例

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

执行外层的 `main.go`，可以尝试刷新页面 [http://127.0.0.1:8199/cookie](http://127.0.0.1:8199/cookie) ，显示的时间在一直变化。

对于控制器对象而言，从基类控制器中继承了很多会话相关的对象指针，可以看做alias，可以直接使用，他们都是指向的同一个对象：

```go
type Controller struct {
    Request  *ghttp.Request  // 请求数据对象
    Response *ghttp.Response // 返回数据对象(r.Response)
    Server   *ghttp.Server   // WebServer对象(r.Server)
    Cookie   *ghttp.Cookie   // COOKIE操作对象(r.Cookie)
    Session  *ghttp.Session  // SESSION操作对象
    View     *View           // 视图对象
}
```

由于对于Web开发者来讲， `Cookie` 都已经是非常熟悉的组件了，相关 `API` 也非常简单，这里便不再赘述。

## `Cookie` 会话过期

`Cookie` 的有效期默认是1年，如果我们期望Cookie随着用户的浏览会话过期，像这样：

![](/markdown/6aca8ffefa9db267e2a4ecf1423ba6be.png)

那么我们仅需要通过 `SetCookie` 来设置 `Cookie` 键值对并将 `maxAge` 参数设置为 `0` 即可。像这样：

```
r.Cookie.SetCookie("MyCookieKey", "MyCookieValue", "", "/", 0)
```