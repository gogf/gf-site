# Pagination - Custom Paging

As the predefined styles of the paging object are relatively limited, sometimes we want to customize the style or tags of the paging. Since all properties and methods of the paging object are public, this provides developers with a high degree of flexibility in customizing paging styles. Developers can customize paging content in the following ways:

1. Use regex matching to replace the output content for customization.
2. Organize paging content based on the properties and methods exposed by the paging object for customization.

## Custom Tag Replacement

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gview"
    "github.com/gogf/gf/v2/text/gstr"
    "github.com/gogf/gf/v2/util/gpage"
)

// wrapContent wraps each of the page tag with html li and ul.
func wrapContent(page *gpage.Page) string {
    content := page.GetContent(4)
    content = gstr.ReplaceByMap(content, map[string]string{
        "<span":  "<li><span",
        "/span>": "/span></li>",
        "<a":     "<li><a",
        "/a>":    "/a></li>",
    })
    return "<ul>" + content + "</ul>"
}

func main() {
    s := g.Server()
    s.BindHandler("/page/custom1/*page", func(r *ghttp.Request) {
        page := r.GetPage(100, 10)
        content := wrapContent(page)
        buffer, _ := gview.ParseContent(`
        <html>
            <head>
                <style>
                    a,span {padding:8px; font-size:16px;}
                    div{margin:5px 5px 20px 5px}
                </style>
            </head>
            <body>
                <div>{{.page}}</div>
            </body>
        </html>
        `, g.Map{
            "page": content,
        })
        r.Response.Write(buffer)
    })
    s.SetPort(10000)
    s.Run()
}
```

After execution, the page output is:

## Define Paging Tag Names

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gview"
    "github.com/gogf/gf/v2/util/gpage"
)

// pageContent customizes the page tag name.
func pageContent(page *gpage.Page) string {
    page.NextPageTag = "NextPage"
    page.PrevPageTag = "PrevPage"
    page.FirstPageTag = "HomePage"
    page.LastPageTag = "LastPage"
    pageStr := page.FirstPage()
    pageStr += page.PrevPage()
    pageStr += page.PageBar()
    pageStr += page.NextPage()
    pageStr += page.LastPage()
    return pageStr
}

func main() {
    s := g.Server()
    s.BindHandler("/page/custom2/*page", func(r *ghttp.Request) {
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
                <div>{{.page}}</div>
            </body>
        </html>
        `, g.Map{
            "page": pageContent(page),
        })
        r.Response.Write(buffer)
    })
    s.SetPort(10000)
    s.Run()
}
```

After execution, the page output is:

> Page: https://goframe.org/en/docs/web/paging-customization
