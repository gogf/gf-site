# Pagination - Static Paging

Static paging refers to the use of route parameters for page pagination, where the paging object is highly coupled with the route definition of the `Server`. The route definition requires a route parameter with the name `page`, which can use fuzzy matching route `*page`, named matching route `:page`, or field matching route `{page}`.

### Example 1, Using Fuzzy Matching Route

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gview"
)

func main() {
    s := g.Server()
    s.BindHandler("/page/static/*page", func(r *ghttp.Request) {
        page := r.GetPage(100, 10)
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

After execution, we manually visit the page [http://127.0.0.1:8199/page/static/6](http://127.0.0.1:8199/page/static/6), and the result is as follows:

### Example 2, Using Field Matching Route

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gview"
)

func main() {
    s := g.Server()
    s.BindHandler("/:obj/*action/{page}.html", func(r *ghttp.Request) {
        page := r.GetPage(100, 10)
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

The routing rule in this example is more flexible, using the `{page}` field matching rule to obtain current page number information. After execution, we visit any URL according to the routing rule, such as: [http://127.0.0.1:8199/order/list/6.html](http://127.0.0.1:8199/order/list/6.html), and the result is as shown below:

> Page: https://goframe.org/en/docs/web/paging-static
