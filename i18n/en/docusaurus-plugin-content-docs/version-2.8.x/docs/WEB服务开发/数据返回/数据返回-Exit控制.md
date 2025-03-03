---
slug: '/docs/web/response-exit-exitall-exithook'
title: 'Response - Exit'
sidebar_position: 3
hide_title: true
keywords: [GoFrame, GoFrame framework, Exit, ExitAll, ExitHook, service function, HOOK event, flow control, data return, permission control]
description: "Data return control methods in the GoFrame framework, including Exit, ExitAll, and ExitHook. Exit is used to exit the current executing logic method, while ExitAll forcibly interrupts the current execution flow, which is very suitable for permission control. ExitHook is used to control the execution order when multiple HOOK methods are matched to a route. These methods are effective in service functions and HOOK event callback functions and improve usability with minimal runtime overhead."
---

## `Exit`, `ExitAll`, and `ExitHook`

1. `Exit`: Only exits the current executing logic method without exiting the subsequent request flow, can be used as a substitute for `return`.
2. `ExitAll`: Forcibly interrupts the current execution flow, and neither the subsequent logic in the current executing method nor all subsequent logic methods will be executed, commonly used for permission control.
3. `ExitHook`: When multiple `HOOK` methods are matched to a route, the `HOOK` methods are executed in the order of route matching priority by default. When calling the `ExitHook` method in a `HOOK` method, subsequent `HOOK` methods will not be executed, similar to `HOOK` method overriding.
4. These three exit functions are only effective in service functions and `HOOK` event callback functions and cannot control the execution flow of middleware.

Since the `ExitAll` and `ExitHook` methods are rarely used at the application layer, only the use of the `Exit` method is introduced here.
:::tip
The `Exit*` flow exit features are implemented using the `panic...recover...` mechanism at the underlying level, with CPU execution costs of approximately tens of nanoseconds (`ns`), improving usability with minimal runtime overhead.
:::
## `Exit` Return Method

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        if r.Get("type").Int() == 1 {
            r.Response.Writeln("john")
        }
        r.Response.Writeln("smith")
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, we visit [http://127.0.0.1:8199/?type=1](http://127.0.0.1:8199/?type=1), and see the page output:

```john
smith
```

Let's slightly adjust the above code:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        if r.Get("type").Int() == 1 {
            r.Response.Writeln("john")
            r.Exit()
        }
        r.Response.Writeln("smith")
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, we visit [http://127.0.0.1:8199/?type=1](http://127.0.0.1:8199/?type=1) again, and see the page output:

```john
```

In addition, the `Response` object provides many `Write*Exit` methods, which indicate that the content is output and the `Exit` method is immediately called to exit the current service method.