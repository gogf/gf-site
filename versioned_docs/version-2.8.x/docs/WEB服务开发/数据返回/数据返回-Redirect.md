---
slug: '/docs/web/response-redirect'
title: '数据返回-Redirect'
sidebar_position: 2
hide_title: true
keywords: [GoFrame,GoFrame框架,数据返回,页面跳转,RedirectTo,RedirectBack,Location Header,网页重定向,HTTP地址,Referer Header]
description: '在GoFrame框架中使用RedirectTo和RedirectBack方法实现页面跳转功能。通过Location Header实现页面之间的跳转，包括跳转到指定地址和返回到上一页面。本示例演示了如何在本地服务中设置页面重定向，帮助开发者理解HTTP地址处理及Referer Header的应用。'
---

我们可以通过 `RedirectTo/RedirectBack` 来实现页面之间的跳转，该功能通过 `Location Header` 实现。相关方法：

```go
func (r *Response) RedirectBack(code ...int)
func (r *Response) RedirectTo(location string, code ...int)
```

## `RedirectTo`

`ReditectTo` 用以引导客户端跳转到指定的地址，地址可以是一个本地服务的相对路径，也可以是一个完整的 `HTTP` 地址。使用示例：

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.RedirectTo("/login")
    })
    s.BindHandler("/login", func(r *ghttp.Request) {
        r.Response.Writeln("Login First")
    })
    s.SetPort(8199)
    s.Run()
}
```

运行后，我们通过浏览器访问 [http://127.0.0.1:8199/](http://127.0.0.1:8199/) 随后可以 发现浏览器立即跳转到了 [http://127.0.0.1:8199/login](http://127.0.0.1:8199/login) 页面。

## `RedirectBack`

`RedirectBack` 用以引导客户端跳转到上一页面地址，上一页面地址是通过 `Referer Header` 获取的，一般来说浏览器客户端都会传递这一Header。使用示例：

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/page", func(r *ghttp.Request) {
        r.Response.Writeln(`<a href="/back">back</a>`)
    })
    s.BindHandler("/back", func(r *ghttp.Request) {
        r.Response.RedirectBack()
    })
    s.SetPort(8199)
    s.Run()
}
```

运行后，我们通过浏览器访问 [http://127.0.0.1:8199/page](http://127.0.0.1:8199/page) 点击页面的 `back` 连接 ，可以发现点击后页面随后又跳转了回来。