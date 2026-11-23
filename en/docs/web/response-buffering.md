# Response - Buffering

## Introduction

The `Response` output employs buffer control, where the output content is pre-written to a buffer and only truly outputted to the client after the service method execution is completed. This feature not only improves execution efficiency but also provides greater flexibility in controlling output content.

Relevant methods:

```go
func (r *Response) Buffer() []byte
func (r *Response) BufferLength() int
func (r *Response) BufferString() string
func (r *Response) Flush()
func (r *Response) SetBuffer(data []byte)
```

## Usage Example

We handle the returned data uniformly through a post middleware. If a service method generates an exception, sensitive error information should not be pushed to the client; instead, a standard error message should be set.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "net/http"
)

func MiddlewareErrorHandler(r *ghttp.Request) {
    r.Middleware.Next()
    if r.Response.Status >= http.StatusInternalServerError {
        r.Response.ClearBuffer()
        r.Response.Writeln("The server is currently experiencing issues, please try again later!")
    }
}

func main() {
    s := g.Server()
    s.Group("/api.v2", func(group *ghttp.RouterGroup) {
        group.Middleware(MiddlewareErrorHandler)
        group.ALL("/user/list", func(r *ghttp.Request) {
            panic("db error: sql is xxxxxxx")
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

Visiting [http://127.0.0.1:8199/api.v2/user/list](http://127.0.0.1:8199/api.v2/user/list), you will see the page outputs:

```text
The server is currently experiencing issues, please try again later!
```

> Page: https://goframe.org/en/docs/web/response-buffering
