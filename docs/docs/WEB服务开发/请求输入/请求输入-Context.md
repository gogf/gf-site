---
slug: '/docs/web/request-context'
title: '请求输入-Context'
sidebar_position: 6
hide_title: true
keywords: [GoFrame,GoFrame框架,请求上下文,Context对象,上下文变量,中间件,路由服务,模块方法,context.Context接口,Golang]
description: '本文档介绍了如何在GoFrame框架中使用Context对象处理请求流程中的上下文变量共享。通过提供必要的方法，开发者可以在请求开始时设置自定义变量，并在后续的处理中访问它们。此外，本文包含了如何集成第三方组件以增强功能的示例代码和详细步骤。'
---

## 基本介绍

请求流程往往会在上下文中共享一些自定义设置的变量，例如在请求开始之前通过中间件设置一些变量，随后在路由服务方法中可以获取该变量并相应对一些处理。这种需求非常常见。在 `GoFrame` 框架中，我们推荐使用 `Context` 上下文对象来处理流程共享的上下文变量，甚至将该对象进一步传递到依赖的各个模块方法中。该 `Context` 对象类型实现了标准库的 `context.Context` 接口，该接口往往会作为模块间调用方法的第一个参数，该接口参数也是 `Golang` 官方推荐的在模块间传递上下文变量的推荐方式。

**方法列表：**

```go
func (r *Request) GetCtx() context.Context
func (r *Request) SetCtx(ctx context.Context)
func (r *Request) GetCtxVar(key interface{}, def ...interface{}) *gvar.Var
func (r *Request) SetCtxVar(key interface{}, value interface{})
```

**简要说明：**

1. `GetCtx` 方法用于获取当前的 `context.Context` 对象，作用同 `Context` 方法。
2. `SetCtx` 方法用于设置自定义的 `context.Context` 上下文对象。
3. `GetCtxVar` 方法用于获取上下文变量，并可给定当该变量不存在时的默认值。
4. `SetCtxVar` 方法用于设置上下文变量。

## 使用示例

### 示例1， `SetCtxVar/GetCtxVar`

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

可以看到，我们可以通过 `SetCtxVar` 和 `GetCtxVar` 来设置和获取自定义的变量，该变量生命周期仅限于当前请求流程。

执行后，访问 [http://127.0.0.1:8199/](http://127.0.0.1:8199/) ，页面输出内容为：

```HBm876TFCde435Tgf
```

### 示例2， `SetCtx`

`SetCtx` 方法常用于中间件中整合一些第三方的组件，例如第三方的链路跟踪组件等等。

为简化示例，这里我们将上面的例子通过 `SetCtx` 方法来改造一下来做演示。

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
            // 也可以使用
            // r.Response.Write(r.GetCtxVar(TraceIdName))
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

执行后，访问 [http://127.0.0.1:8199/](http://127.0.0.1:8199/) ，页面输出内容为：

```HBm876TFCde435Tgf
```