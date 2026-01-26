---
slug: '/docs/web/paging-template'
title: '分页管理-URL模板'
sidebar_position: 3
hide_title: true
keywords: [GoFrame,GoFrame框架,gpage,分页管理,URL模板,自定义URL,内置变量,页面渲染,代码示例,模板替换]
description: '使用GoFrame框架的gpage进行分页管理，并通过自定义URL模板功能，使用内置变量替换页码内容来实现页面的动态渲染。文章提供了详细的代码示例，展示了通过设置UrlTemplate属性实现分页URL的个性化配置，为开发者提供了灵活高效的解决方案。'
---

`gpage` 支持自定义 `URL` 模板，在模板中可以使用 `{.page}` 内置变量替换页码的内容，我们来看一个简单的示例：

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

在代码中，我们可以使用 `UrlTemplate` 属性设置 `URL` 模板，执行后，结果如下：

![](/markdown/a67f2f6285ed959812f70fd066e7453a.png)