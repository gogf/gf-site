---
slug: '/docs/web/paging-template'
title: 'Pagination - URL Template'
sidebar_position: 3
hide_title: true
keywords: [GoFrame, GoFrame framework, gpage, pagination management, URL template, custom URL, built-in variables, page rendering, code examples, template replacement]
description: "Use the gpage of the GoFrame framework for pagination management and realize dynamic page rendering by replacing page number content with built-in variables through the custom URL template function. The article provides detailed code examples demonstrating how to achieve personalized pagination URL configuration by setting the UrlTemplate property, offering developers a flexible and efficient solution."
---

`gpage` supports custom `URL` templates, where the `{.page}` built-in variable can be used to replace the content of the page number. Let's look at a simple example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gview"
)

func main() {
    s := g.Server()
    s.BindHandler("/page/template/{page}.html", func(r *ghttp.Request) {
        page := r.GetPage(100, 10)
        page.UrlTemplate = "/order/list/{.page}.html"
        buffer, _ := gview.ParseContent(`
        <html>
            <head>
                <style>
                    a,span {padding:8px; font-size:16px;}
                    div{margin:5px 5px 20px 5px}
                </style>
            </head>
            <body>
                <div>{{.page1}}</div>
                <div>{{.page2}}</div>
                <div>{{.page3}}</div>
                <div>{{.page4}}</div>
            </body>
        </html>
        `, g.Map{
            "page1": page.GetContent(1),
            "page2": page.GetContent(2),
            "page3": page.GetContent(3),
            "page4": page.GetContent(4),
        })
        r.Response.Write(buffer)
    })
    s.SetPort(8199)
    s.Run()
}
```

In the code, we can set the `URL` template using the `UrlTemplate` property. After executing, the result is as follows:

![](/markdown/a67f2f6285ed959812f70fd066e7453a.png)