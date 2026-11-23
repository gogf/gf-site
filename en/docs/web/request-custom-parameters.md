# Request - Custom Parameters

Developers can customize some variables in the request, with custom variables having the highest priority, able to override the originally submitted client parameters.

**Tip**

Custom variables can often be used for variable sharing throughout the request process, but it is important to note that these variables become part of the request parameters and are publicly exposed to the execution flow of the business.

Method list:

```go
func (r *Request) SetParam(key string, value interface{})
func (r *Request) GetParam(key string, def ...interface{}) interface{}
func (r *Request) GetParamVar(key string, def ...interface{}) *gvar.Var
```

Custom variables can be set using the `SetParam` method. Retrieving custom variables can be done through request parameter retrieval methods, such as `Get/GetVar/GetMap`, etc., or through specific custom variable methods `GetParam/GetParamVar`.

Usage example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

// Pre-middleware 1
func MiddlewareBefore1(r *ghttp.Request) {
    r.SetParam("name", "GoFrame")
    r.Response.Writeln("set name")
    r.Middleware.Next()
}

// Pre-middleware 2
func MiddlewareBefore2(r *ghttp.Request) {
    r.SetParam("site", "https://goframe.org")
    r.Response.Writeln("set site")
    r.Middleware.Next()
}

func main() {
    s := g.Server()
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.Middleware(MiddlewareBefore1, MiddlewareBefore2)
        group.ALL("/", func(r *ghttp.Request) {
            r.Response.Writefln(
                "%s: %s",
                r.GetParam("name").String(),
                r.GetParam("site").String(),
            )
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

As you can see, we can use `SetParam` and `GetParam` to set and retrieve custom variables, with the variable's lifecycle being limited to the current request process.

After execution, visit [http://127.0.0.1:8199/](http://127.0.0.1:8199/), and the page output content is:

```
set name
set site
GoFrame: https://goframe.org
```

> Page: https://goframe.org/en/docs/web/request-custom-parameters
