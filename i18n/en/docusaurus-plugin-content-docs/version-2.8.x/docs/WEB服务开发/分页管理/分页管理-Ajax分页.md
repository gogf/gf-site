---
slug: '/docs/web/paging-ajax'
title: 'Pagination - Ajax Paging'
sidebar_position: 2
hide_title: true
keywords: [Ajax Pagination, Pagination Management, Javascript Pagination, GoFrame, GoFrame Framework, Golang, Page Rendering, Front-end Development, Dynamic Pagination, Web Development]
description: "Technical details on implementing pagination management using the Ajax method. Unlike traditional pagination, Ajax pagination dynamically retrieves and renders pagination content using Javascript methods for a smoother user experience. The sample code demonstrates how to integrate Ajax pagination functionality in the GoFrame framework, providing a practical backend pagination solution."
---

The difference between `Ajax` pagination and other pagination methods is that the pagination links are implemented using `Javascript` methods. This `Javascript` method is the pagination method, with fixed parameters for the pagination `URL` address corresponding to the pagination. This `Javascript` method retrieves the pagination content corresponding to the `URL` link via `Ajax` and renders it onto the page.

A complete example is as follows:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gview"
)

func main() {
    s := g.Server()
    s.BindHandler("/page/ajax", func(r *ghttp.Request) {
        page := r.GetPage(100, 10)
        page.AjaxActionName = "DoAjax"
        buffer, _ := gview.ParseContent(`
        <html>
            <head>
                <style>
                    a,span {padding:8px; font-size:16px;}
                    div{margin:5px 5px 20px 5px}
                </style>
                <script src="https://cdn.bootcss.com/jquery/2.0.3/jquery.min.js"></script>
                <script>
                function DoAjax(url) {
                     $.get(url, function(data,status) {
                         $("body").html(data);
                     });
                }
                </script>
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

In this example, we define a `DoAjax(url)` method to perform pagination operations. For demonstration purposes, its logic is quite simple, loading the content of the specified pagination page and replacing the current page's pagination content.

```
function DoAjax(url) {
     $.get(url, function(data,status) {
         $("body").html(data);
     });
}
```