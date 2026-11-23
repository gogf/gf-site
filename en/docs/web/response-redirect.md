# Response - Redirect

We can achieve page-to-page redirection through `RedirectTo/RedirectBack`, which is implemented via `Location Header`. Relevant methods:

```go
func (r *Response) RedirectBack(code ...int)
func (r *Response) RedirectTo(location string, code ...int)
```

## `RedirectTo`

`RedirectTo` is used to guide the client to a specified address, which can be a relative path of a local service or a complete `HTTP` address. Usage example:

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

After running, we access [http://127.0.0.1:8199/](http://127.0.0.1:8199/) through the browser and you will find that the browser immediately redirects to the page [http://127.0.0.1:8199/login](http://127.0.0.1:8199/login).

## `RedirectBack`

`RedirectBack` is used to guide the client back to the previous page address, which is obtained through the `Referer Header`. Usually, browser clients will pass this Header. Usage example:

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

After running, we access [http://127.0.0.1:8199/page](http://127.0.0.1:8199/page) through the browser and click the `back` link on the page. You can observe that after clicking, the page redirects back.

> Page: https://goframe.org/en/docs/web/response-redirect
