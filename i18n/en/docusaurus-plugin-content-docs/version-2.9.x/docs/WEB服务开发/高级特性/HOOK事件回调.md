---
slug: '/docs/web/senior-hook'
title: 'HOOK Callbacks'
sidebar_position: 6
hide_title: true
keywords: [GoFrame, GoFrame Framework, HOOK Event, Event Callback, ghttp.Server, Middleware, Routing Priority, Permission Control, Cross-Origin Requests, API Authentication]
description: "The HOOK event callback function provided by the ghttp.Server in the GoFrame framework, similar to middleware, allows custom event listening and handling. Event callbacks can be registered in a specific order to determine the callback invocation priority. This document provides a detailed explanation of the usage, application in API authentication control, cross-origin request handling, and showcases with example code the execution method and priority mechanism of event callbacks."
---

![](/markdown/25a101c86afb67b0c4f69162657c7853.png)

`ghttp.Server` provides an event callback registration function, similar to the `middleware` function in other frameworks, but event callbacks are simpler.

`ghttp.Server` supports custom event listening and handling, binding and registering based on the `pattern` method (the `pattern` format is consistent with route registration). **It supports multiple methods to listen to the same event**, and `ghttp.Server` will call the callback methods according to the `routing priority` and `callback registration order`. The earlier the HOOK callback function is registered for the same event, the higher its priority. The related methods are as follows:

```go
func (s *Server) BindHookHandler(pattern string, hook string, handler HandlerFunc) error
func (s *Server) BindHookHandlerByMap(pattern string, hookmap map[string]HandlerFunc) error
```

Of course, domain objects also support event callback registration:

```go
func (d *Domain) BindHookHandler(pattern string, hook string, handler HandlerFunc) error
func (d *Domain) BindHookHandlerByMap(pattern string, hookmap map[string]HandlerFunc) error
```

Supported `Hook` event list:

1. `ghttp.HookBeforeServe`

This event occurs before entering/initializing the service object and is most commonly used, especially for handling permission control and cross-origin requests.

2. `ghttp.HookAfterServe`

After completing the service execution process.

3. `ghttp.HookBeforeOutput`

Before outputting content to the client.

4. `ghttp.HookAfterOutput`

After outputting content to the client.

Please refer to the example for specific invocation timing.

## Callback Priority

Since event binding is also based on routing rules, its priority is the same as described in the [Router - Route Patterns](../路由管理/路由管理-路由规则.md) chapter.

However, the mechanism for event invocation differs from that of route registration invocation. **It allows multiple event callback methods under the same routing rule**, and events under this route will be `invoked in order of priority`. If the routing rules have the same priority, they will be invoked in the order of event registration.

### About Global Callback

We often use a binding like `/*` for `HOOK` routes to achieve global callback handling, which is feasible. However, `HOOK` executions have the lowest priority; the more specific the route registration, the higher the priority, and the more vague the route, the lower the priority. `/*` belongs to the most vague route.

To reduce coupling between different modules, routes are often not registered in the same place. For instance, a `HOOK` registered for a user module (`/user/*`) will be invoked first before the global `HOOK`. Relying solely on registration order to control priority becomes difficult to manage when there are many modules and routes.

### Business Function Invocation Order

It is recommended that multiple processing functions (such as: A, B, C) for the same business (same business module) be placed in the same `HOOK` callback function for handling. Manage the invocation order of business processing functions (function invocation order: A-B-C) within the registered callback function.

Although registering multiple identical `HOOK` callback functions can also fulfill the requirement without any functional issues, from a design perspective, cohesion is reduced, making it inconvenient to manage business functions.

## `ExitHook` Method

When the route matches multiple `HOOK` methods, by default, `HOOK` methods are executed according to the priority of route matching. When calling the `Request.ExitHook` method within a `HOOK` method, subsequent `HOOK` methods will not be executed, which acts similar to `HOOK` function overriding.

## API Authentication Control

A common application of event callback registration is to control authentication/permissions for the called API. This requires binding the `ghttp.HookBeforeServe` event, where all matched API requests are processed before service execution (e.g., binding `/*` event callback route). If authentication fails, call `r.ExitAll()` to exit subsequent service execution (including subsequent event callback execution).

Furthermore, executing `r.Redirect*` in the event callback function for permission verification without calling `r.ExitAll()` to exit the business execution often results in `http multiple response writeheader calls` error messages. This is because the `r.Redirect*` method writes the `Location` header in the header, and subsequent business service APIs often write the `Content-Type`/`Content-Length` headers, causing a conflict.

## Middleware vs. Event Callback

Middleware (`Middleware`) and Event Callback (`HOOK`) are two major process control features in the `GoFrame` framework. Both can be used to control request processes and support binding specific routing rules. However, they are quite different.

1. Firstly, Middleware focuses on application-level process control, while Event Callback focuses on service-level process control; Middleware's scope is limited to applications, while Event Callback is more powerful, at the `Server` level, and can handle static file request callbacks.
2. Secondly, middleware design adopts an “onion” design model; Event Callback adopts a hook trigger design for specific events.
3. Lastly, middleware is relatively more flexible and is often recommended for process control; Event Callback is simpler but less flexible.

### `Request.URL` vs. `Request.Router`

`Request.Router` is the matched route object containing route registration information, which is typically not used by developers. `Request.URL` is the underlying URL object from the standard library `http.Request`, containing the request URL address information, especially `Request.URL.Path` representing the requested URI address.

Therefore, if used in a service callback function, `Request.Router` has a value because it will call the service callback method only when the route is matched. However, in an event callback function, this object may be `nil` (indicating no matched service callback function route). Especially when using event callback for request API authentication, use the `Request.URL` object to obtain the request URL information instead of `Request.Router`.

## Static File Events
:::tip
If you are only providing API API services (including front static file service proxies like `nginx`), which do not involve static file services, you can ignore this section.
:::
Note that event callbacks can also match static file accesses that meet routing rules ([Static File Service](静态文件服务.md) feature is disabled by default in the `gf` framework, and we can manually enable it using `WebServer` related configuration. See [Configuration](../服务配置/服务配置.md) for details).

For example, if we register a `/*` global match event callback route, static file accesses like `/static/js/index.js` or `/upload/images/thumb.jpg` will also be matched and processed in the registered event callback function.

We can use `Request.IsFileRequest()` in the event callback function to determine whether the request is a static file request. If the business logic does not require static file event callbacks, ignore it in the event callback function to selectively process it.

## Event Callback Examples

### Example 1: Basic Usage

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    // Basic event callback usage
    p := "/:name/info/{uid}"
    s := g.Server()
    s.BindHookHandlerByMap(p, map[string]ghttp.HandlerFunc{
        ghttp.HookBeforeServe:  func(r *ghttp.Request) { glog.Println(ghttp.HookBeforeServe) },
        ghttp.HookAfterServe:   func(r *ghttp.Request) { glog.Println(ghttp.HookAfterServe) },
        ghttp.HookBeforeOutput: func(r *ghttp.Request) { glog.Println(ghttp.HookBeforeOutput) },
        ghttp.HookAfterOutput:  func(r *ghttp.Request) { glog.Println(ghttp.HookAfterOutput) },
    })
    s.BindHandler(p, func(r *ghttp.Request) {
        r.Response.Write("User:", r.Get("name"), ", uid:", r.Get("uid"))
    })
    s.SetPort(8199)
    s.Run()
}
```

When accessing [http://127.0.0.1:8199/john/info/10000](http://127.0.0.1:8199/john/info/10000), the terminal running the WebServer process will print out the corresponding event names according to the execution sequence of the events.

### Example 2: Registering the Same Event

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

// Priority HOOK
func beforeServeHook1(r *ghttp.Request) {
    r.SetParam("name", "GoFrame")
    r.Response.Writeln("set name")
}

// Subsequent HOOK
func beforeServeHook2(r *ghttp.Request) {
    r.SetParam("site", "https://goframe.org")
    r.Response.Writeln("set site")
}

// Allow registering multiple callback functions for the same route and event, invoked in the order of registration priority.
// To easily compare priority in the route table, here the HOOK callback functions are separately defined as two functions.
func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Writeln(r.Get("name"))
        r.Response.Writeln(r.Get("site"))
    })
    s.BindHookHandler("/", ghttp.HookBeforeServe, beforeServeHook1)
    s.BindHookHandler("/", ghttp.HookBeforeServe, beforeServeHook2)
    s.SetPort(8199)
    s.Run()
}
```

After execution, the terminal outputs routing table information as follows:

```text
SERVER | ADDRESS | DOMAIN  | METHOD | P | ROUTE |        HANDLER        |    MIDDLEWARE
|---------|---------|---------|--------|---|-------|-----------------------|-------------------|
  default |  :8199  | default | ALL    | 1 | /     | main.main.func1       |
|---------|---------|---------|--------|---|-------|-----------------------|-------------------|
  default |  :8199  | default | ALL    | 2 | /     | main.beforeServeHook1 | HOOK_BEFORE_SERVE
|---------|---------|---------|--------|---|-------|-----------------------|-------------------|
  default |  :8199  | default | ALL    | 1 | /     | main.beforeServeHook2 | HOOK_BEFORE_SERVE
|---------|---------|---------|--------|---|-------|-----------------------|-------------------|
```

After manually accessing [http://127.0.0.1:8199/](http://127.0.0.1:8199/), the page output is:

```
set name
set site
GoFrame
https://goframe.org
```

### Example 3: Changing Business Logic

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    // Multi-event callback example, event 1
    pattern1 := "/:name/info"
    s.BindHookHandlerByMap(pattern1, map[string]ghttp.HandlerFunc{
        ghttp.HookBeforeServe: func(r *ghttp.Request) {
            r.SetParam("uid", 1000)
        },
    })
    s.BindHandler(pattern1, func(r *ghttp.Request) {
        r.Response.Write("User:", r.Get("name"), ", uid:", r.Get("uid"))
    })

    // Multi-event callback example, event 2
    pattern2 := "/{object}/list/{page}.java"
    s.BindHookHandlerByMap(pattern2, map[string]ghttp.HandlerFunc{
        ghttp.HookBeforeOutput: func(r *ghttp.Request) {
            r.Response.SetBuffer([]byte(
                fmt.Sprintf("Changed output content through event, object:%s, page:%s", r.Get("object"), r.GetRouterString("page"))),
            )
        },
    })
    s.BindHandler(pattern2, func(r *ghttp.Request) {
        r.Response.Write(r.Router.Uri)
    })
    s.SetPort(8199)
    s.Run()
}
```

Event 1 sets the GET parameter when accessing the route `/:\name/info`; Event 2 changes the output result when the access path matches the route `/{object}/list/{page}.java`. After execution, access the following URLs to see the effect:

- [http://127.0.0.1:8199/user/info](http://127.0.0.1:8199/user/info)
- [http://127.0.0.1:8199/user/list/1.java](http://127.0.0.1:8199/user/list/1.java)
- [http://127.0.0.1:8199/user/list/2.java](http://127.0.0.1:8199/user/list/2.java)

### Example 4: Callback Execution Priority

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/priority/show", func(r *ghttp.Request) {
        r.Response.Writeln("priority service")
    })

    s.BindHookHandlerByMap("/priority/:name", map[string]ghttp.HandlerFunc{
        ghttp.HookBeforeServe: func(r *ghttp.Request) {
            r.Response.Writeln("/priority/:name")
        },
    })
    s.BindHookHandlerByMap("/priority/*any", map[string]ghttp.HandlerFunc{
        ghttp.HookBeforeServe: func(r *ghttp.Request) {
            r.Response.Writeln("/priority/*any")
        },
    })
    s.BindHookHandlerByMap("/priority/show", map[string]ghttp.HandlerFunc{
        ghttp.HookBeforeServe: func(r *ghttp.Request) {
            r.Response.Writeln("/priority/show")
        },
    })
    s.SetPort(8199)
    s.Run()
}
```

In this example, we registered event callbacks for 3 route rules, all of which can match the route registered address `/priority/show`, allowing us to access this address to see the order of route execution.

After execution, when we access [http://127.0.0.1:8199/priority/show](http://127.0.0.1:8199/priority/show), the page outputs the following information:

```
/priority/show
/priority/:name
/priority/*any
priority service
```

### Example 5: Allowing Cross-Origin Requests

In the chapters [Middleware - Intro](../路由管理/路由管理-中间件拦截器/中间件拦截器-基本介绍.md) and [CORS](CORS跨域处理.md), examples of cross-origin handling have also been introduced. In most cases, we use middleware to achieve cross-origin request handling.

Both `HOOK` and middleware can implement cross-origin request handling. Here, we'll use HOOK to achieve simple cross-origin processing. First, let's look at a simple API example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func Order(r *ghttp.Request) {
    r.Response.Write("GET")
}

func main() {
    s := g.Server()
    s.Group("/api.v1", func(group *ghttp.RouterGroup) {
        group.GET("/order", Order)
    })
    s.SetPort(8199)
    s.Run()
}
```

The API address is [http://localhost:8199/api.v1/order](http://localhost:8199/api.v1/order), and this API is not allowed for cross-origin. Open a different domain name, such as the Baidu homepage (conveniently using `jQuery` for debugging), and press `F12` to open the developer panel, and execute the following `AJAX` request in `console`:

```
$.get("http://localhost:8199/api.v1/order", function(result){
    console.log(result)
});
```

The result is:

![](/markdown/a6db04d4319bfebb80ff75d5d0f64e6a.png)

A cross-origin error is returned. Next, let's modify the test code as follows:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func Order(r *ghttp.Request) {
    r.Response.Write("GET")
}

func main() {
    s := g.Server()
    s.Group("/api.v1", func(group *ghttp.RouterGroup) {
        group.Hook("/*any", ghttp.HookBeforeServe, func(r *ghttp.Request) {
            r.Response.CORSDefault()
        })
        group.GET("/order", Order)
    })
    s.SetPort(8199)
    s.Run()
}
```

We added a bound event `ghttp.HookBeforeServe` for the route `/api.v1/*any`. This event will be called before all service executions. In this event's callback method, we allow cross-origin requests by calling the `CORSDefault` method with default cross-origin settings. The bound event route rule uses a vague match rule, indicating that all API addresses starting with `/api.v1` allow cross-origin requests.

Return to the Baidu homepage and execute the `AJAX` request again; this time, it is successful:

![](/markdown/60e832386a9f7ae79a1022d33cb58db6.png)