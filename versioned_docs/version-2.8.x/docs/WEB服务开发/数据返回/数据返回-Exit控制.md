---
slug: '/docs/web/response-exit-exitall-exithook'
title: '数据返回-Exit控制'
sidebar_position: 3
hide_title: true
keywords: [GoFrame,GoFrame框架,Exit,ExitAll,ExitHook,服务函数,HOOK事件,流程控制,数据返回,权限控制]
description: 'GoFrame框架中的数据返回控制方法，包括Exit、ExitAll和ExitHook。Exit用于退出当前执行的逻辑方法，而ExitAll会强行中断当前执行流程，非常适用于权限控制。ExitHook用于当路由匹配到多个HOOK方法时，控制其执行顺序。这些方法在服务函数和HOOK事件回调函数中有效，并通过极少的运行时开销来提高易用性。'
---

## `Exit`, `ExitAll` 与 `ExitHook`

1. `Exit`: 仅退出当前执行的逻辑方法，不退出后续的请求流程，可用于替代 `return`。
2. `ExitAll`: 强行中断当前执行流程，当前执行方法的后续逻辑以及后续所有的逻辑方法将不再执行，常用于权限控制。
3. `ExitHook`: 当路由匹配到多个 `HOOK` 方法时，默认是按照路由匹配优先级顺序执行 `HOOK` 方法。当在 `HOOK` 方法中调用 `ExitHook` 方法后，后续的 `HOOK` 方法将不会被继续执行，作用类似 `HOOK` 方法覆盖。
4. 这三个退出函数仅在服务函数和 `HOOK` 事件回调函数中有效，无法控制中间件的执行流程。

由于 `ExitAll` 和 `ExitHook` 方法在应用层比较少用，因此这里仅介绍 `Exit` 方法的使用。
:::tip
`Exit*` 流程退出特性底层采用的是 `panic...recover...` 机制来实现的，CPU执行损耗大约几十纳秒（ `ns`），通过极少的运行时开销来提高易用性。
:::
## `Exit` 返回方法

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

执行后，我们访问 [http://127.0.0.1:8199/?type=1](http://127.0.0.1:8199/?type=1) ，可以看到页面输出了：

```text
john
smith
```

我们将以上代码稍微调整一下：

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

执行后，我们再次访问 [http://127.0.0.1:8199/?type=1](http://127.0.0.1:8199/?type=1) ，可以看到页面输出了：

```text
john
```

此外， `Response` 对象中提供了很多 `Write*Exit` 的方法，表示输出内容后立即调用 `Exit` 方法退出当前服务方法。