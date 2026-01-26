---
slug: '/docs/web/request-context'
title: 'Request - Context'
sidebar_position: 6
hide_title: true
keywords: [GoFrame, GoFrame framework, request context, Context object, context variable, middleware, routing service, module method, context.Context API, Golang]
description: "Using the Context object in the GoFrame framework to handle context variable sharing in the request process. By providing necessary methods, developers can set custom variables at the beginning of a request and access them during subsequent processing. Additionally, this article includes example code and detailed steps on integrating third-party components to enhance functionality."
---

## Introduction

In request processes, some custom set variables are often shared in the context, such as setting some variables through middleware before the request starts, which can then be accessed in the routing service method for corresponding processing. This requirement is very common. In the `GoFrame` framework, we recommend using the `Context` context object to handle context variables shared in the process, even passing this object further into various dependent module methods. The `Context` object type implements the standard library's `context.Context` API, which is often used as the first parameter of module inter-call methods, and this API parameter is also the recommended way by `Golang` official to pass context variables between modules.

**Method List:**

```go
func (r *Request) GetCtx() context.Context
func (r *Request) SetCtx(ctx context.Context)
func (r *Request) GetCtxVar(key interface{}, def ...interface{}) *gvar.Var
func (r *Request) SetCtxVar(key interface{}, value interface{})
```

**Brief Explanation:**

1. The `GetCtx` method is used to get the current `context.Context` object, serving the same purpose as the `Context` method.
2. The `SetCtx` method is used to set a custom `context.Context` context object.
3. The `GetCtxVar` method is used to get the context variable and can provide a default value if the variable does not exist.
4. The `SetCtxVar` method is used to set the context variable.

## Usage Example

### Example 1, `SetCtxVar/GetCtxVar`

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

const (
    TraceIdName = "trace-id"
)

func main() {
    s := g.Server()
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.Middleware(func(r *ghttp.Request) {
            r.SetCtxVar(TraceIdName, "HBm876TFCde435Tgf")
            r.Middleware.Next()
        })
        group.ALL("/", func(r *ghttp.Request) {
            r.Response.Write(r.GetCtxVar(TraceIdName))
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

As you can see, we can use `SetCtxVar` and `GetCtxVar` to set and get custom variables, and the lifecycle of these variables is limited to the current request process.

After execution, access [http://127.0.0.1:8199/](http://127.0.0.1:8199/), and the page output is:

```text
HBm876TFCde435Tgf
```

### Example 2, `SetCtx`

The `SetCtx` method is often used in middleware to integrate some third-party components, such as third-party tracing components.

To simplify the example, let's modify the above example using the `SetCtx` method for demonstration.

```go
package main

import (
    "context"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

const (
    TraceIdName = "trace-id"
)

func main() {
    s := g.Server()
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.Middleware(func(r *ghttp.Request) {
            ctx := context.WithValue(r.Context(), TraceIdName, "HBm876TFCde435Tgf")
            r.SetCtx(ctx)
            r.Middleware.Next()
        })
        group.ALL("/", func(r *ghttp.Request) {
            r.Response.Write(r.Context().Value(TraceIdName))
            // Alternatively, you can use
            // r.Response.Write(r.GetCtxVar(TraceIdName))
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, access [http://127.0.0.1:8199/](http://127.0.0.1:8199/), and the page output is:

```text
HBm876TFCde435Tgf
```