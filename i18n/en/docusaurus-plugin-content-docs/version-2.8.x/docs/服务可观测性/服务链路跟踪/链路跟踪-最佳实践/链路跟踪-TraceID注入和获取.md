---
slug: '/docs/obs/tracing-practice-inject-traceid'
title: 'TraceID Injection and Retrieval'
sidebar_position: 0
hide_title: true
keywords: [Tracing, TraceID, GoFrame, OpenTelemetry, Context, Client, Server, Log, Request, Response Header]
description: "How to inject and retrieve TraceID using the GoFrame framework in tracing. TraceID is an important identifier for associating requests between services, passed through the Context parameter, and can be automatically generated, inherited, or customized on both the client and server sides. The glog logging component automatically records TraceID, and GoFrame's Client and Server offer convenient TraceID management methods. Practice examples, including custom TraceID and integration methods for handling third-party RequestID, are provided."
---

## 1. Introduction

In tracing, `TraceID` serves as a unique identifier passed between various services, used to associate requests between services, making it a crucial piece of data. `TraceID` is passed through the `Context` parameter, and if you use the framework's `glog` logging component, the `TraceID` will automatically be read and recorded in the log content. Therefore, it is recommended to use the framework's `glog` logging component for logging to perfectly support the tracing feature.

## 2. Injection of TraceID

### 1. Client

If using the `GoFrame` framework's `Client`, all requests will inherently include `TraceID` injection. `GoFrame` utilizes the `OpenTelemetry` standard for its `TraceID`, which is a `32` hexadecimal character string.
:::tip
It is strongly recommended to use the `gclient` component, which is both feature-rich and equipped with tracing capabilities.
:::
### 2. Server

If using the `GoFrame` framework's `Server`, if the request includes a `TraceID`, it will be automatically inherited into the `Context`; otherwise, a standard `TraceID` will be automatically injected and passed to subsequent logic.

## 3. Retrieval of TraceID

### 1. Client

If using the `GoFrame` framework's `Client`, there are three methods available here.

#### 1) Automatically Generate TraceID (Recommended)

Create a `Context` with a `TraceID` using the `gctx.New/WithCtx` method, and pass this `Context` parameter when making requests. You can subsequently retrieve the `TraceID` for the entire trace using the `gctx.CtxId` method. Relevant methods:

```go
// New creates and returns a context which contains context id.
func New() context.Context

// WithCtx creates and returns a context containing context id upon given parent context `ctx`.
func WithCtx(ctx context.Context) context.Context
```

When using the `WithCtx` method, if the given `ctx` parameter already contains a `TraceID`, it will be used directly without creating a new one.

#### 2) Client Custom TraceID

An advanced usage is that the client can customize the `TraceID` using the `gtrace.WithTraceID` method. The method is defined as follows:

```go
// WithTraceID injects custom trace id into context to propagate.
func WithTraceID(ctx context.Context, traceID string) (context.Context, error)
```

#### 3) Read Response Header

If it is a request to a `GoFrame` framework `Server`, the `Trace-Id` field will be added to the returned request's `Header` for the client to read.

### 2. Server

If using the `GoFrame` framework's `Server`, you can directly obtain the `TraceID` using the `gctx.CtxId` method. Relevant methods:

```go
// CtxId retrieves and returns the context id from context.
func CtxId(ctx context.Context) string
```

## 4. Examples of Use

### 1. HTTP Response Header TraceID

```go
package main

import (
    "context"
    "time"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        traceID := gctx.CtxId(r.Context())
        g.Log().Info(r.Context(), "handler")
        r.Response.Write(traceID)
    })
    s.SetPort(8199)
    go s.Start()

    time.Sleep(time.Second)

    req, err := g.Client().Get(context.Background(), "http://127.0.0.1:8199/")
    if err != nil {
        panic(err)
    }
    defer req.Close()
    req.RawDump()
}
```

After execution, the terminal output:

```
  ADDRESS | METHOD | ROUTE |                             HANDLER                             |    MIDDLEWARE
----------|--------|-------|-----------------------------------------------------------------|--------------------
  :8199   | ALL    | /     | main.main.func1                                                 |
----------|--------|-------|-----------------------------------------------------------------|--------------------
  :8199   | ALL    | /*    | github.com/gogf/gf/v2/net/ghttp.internalMiddlewareServerTracing | GLOBAL MIDDLEWARE
----------|--------|-------|-----------------------------------------------------------------|--------------------

2022-06-06 21:14:37.245 [INFO] pid[55899]: http server started listening on [:8199]
2022-06-06 21:14:38.247 [INFO] {908d2027560af616e218e912d2ac3972} handler
+---------------------------------------------+
|                   REQUEST                   |
+---------------------------------------------+
GET / HTTP/1.1
Host: 127.0.0.1:8199
User-Agent: GClient v2.1.0-rc4 at TXQIANGGUO-MB0
Traceparent: 00-908d2027560af616e218e912d2ac3972-1e291041b9afa718-01
Accept-Encoding: gzip

+---------------------------------------------+
|                   RESPONSE                  |
+---------------------------------------------+
HTTP/1.1 200 OK
Connection: close
Content-Length: 32
Content-Type: text/plain; charset=utf-8
Date: Mon, 06 Jun 2022 13:14:38 GMT
Server: GoFrame HTTP Server
Trace-Id: 908d2027560af616e218e912d2ac3972

908d2027560af616e218e912d2ac3972
```

### 2. Injecting `TraceID` in Client

```go
package main

import (
    "time"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        traceID := gctx.CtxId(r.Context())
        g.Log().Info(r.Context(), "handler")
        r.Response.Write(traceID)
    })
    s.SetPort(8199)
    go s.Start()

    time.Sleep(time.Second)

    ctx := gctx.New()
    g.Log().Info(ctx, "request starts")
    content := g.Client().GetContent(ctx, "http://127.0.0.1:8199/")
    g.Log().Infof(ctx, "response: %s", content)
}
```

After execution, the terminal output:

```html
2022-06-06 21:17:17.447 [INFO] pid[56070]: http server started listening on [:8199]

  ADDRESS | METHOD | ROUTE |                             HANDLER                             |    MIDDLEWARE
----------|--------|-------|-----------------------------------------------------------------|--------------------
  :8199   | ALL    | /     | main.main.func1                                                 |
----------|--------|-------|-----------------------------------------------------------------|--------------------
  :8199   | ALL    | /*    | github.com/gogf/gf/v2/net/ghttp.internalMiddlewareServerTracing | GLOBAL MIDDLEWARE
----------|--------|-------|-----------------------------------------------------------------|--------------------

2022-06-06 21:17:18.450 [INFO] {e843f0737b0af616d8ed185d46ba65c5} request starts
2022-06-06 21:17:18.451 [INFO] {e843f0737b0af616d8ed185d46ba65c5} handler
2022-06-06 21:17:18.451 [INFO] {e843f0737b0af616d8ed185d46ba65c5} response: e843f0737b0af616d8ed185d46ba65c5
```

### 3. Custom `TraceID` in Client

```go
package main

import (
    "context"
    "time"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/net/gtrace"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/text/gstr"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        traceID := gctx.CtxId(r.Context())
        g.Log().Info(r.Context(), "handler")
        r.Response.Write(traceID)
    })
    s.SetPort(8199)
    go s.Start()

    time.Sleep(time.Second)

    ctx, _ := gtrace.WithTraceID(context.Background(), gstr.Repeat("a", 32))
    g.Log().Info(ctx, "request starts")
    content := g.Client().GetContent(ctx, "http://127.0.0.1:8199/")
    g.Log().Infof(ctx, "response: %s", content)
}
```

After execution, the terminal output:

```
  ADDRESS | METHOD | ROUTE |                             HANDLER                             |    MIDDLEWARE
----------|--------|-------|-----------------------------------------------------------------|--------------------
  :8199   | ALL    | /     | main.main.func1                                                 |
----------|--------|-------|-----------------------------------------------------------------|--------------------
  :8199   | ALL    | /*    | github.com/gogf/gf/v2/net/ghttp.internalMiddlewareServerTracing | GLOBAL MIDDLEWARE
----------|--------|-------|-----------------------------------------------------------------|--------------------

2022-06-06 21:40:03.897 [INFO] pid[58435]: http server started listening on [:8199]
2022-06-06 21:40:04.900 [INFO] {aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa} request starts
2022-06-06 21:40:04.901 [INFO] {aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa} handler
2022-06-06 21:40:04.901 [INFO] {aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa} response: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

## 5. Common Questions

### 1. If not using `GoFrame` framework's `Client/Server`, how to obtain the trace's `TraceID`?

Refer to the implementation of trace in `GoFrame` framework's `Client/Server` and implement it manually. This may involve certain costs.

If using a third-party `Client/Server` component, refer to the relevant documentation of the third-party component.

### 2. Internal services do not use the standard `OpenTelemetry` protocol, but each request carries a `RequestID` parameter in the form of `33612a70-990a-11ea-87fe-fd68517e7a2d`. How to integrate with `TraceID`?

Based on my analysis, your `RequestID` format closely aligns with the `TraceID` standard, utilizing a `UUID` string, which can be directly converted to a `TraceID`. It is suggested to convert `RequestID` to `TraceID` in the first middleware layer within your `Server` internally and inject it into the `Context` using the custom `TraceID` method, passing the `Context` to subsequent business logic.

Here's an example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/net/gtrace"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    // Internal service
    internalServer := g.Server("internalServer")
    internalServer.BindHandler("/", func(r *ghttp.Request) {
        traceID := gctx.CtxId(r.Context())
        g.Log().Info(r.Context(), "internalServer handler")
        r.Response.Write(traceID)
    })
    internalServer.SetPort(8199)
    go internalServer.Start()

    // External service, accessed for testing
    // http://127.0.0.1:8299/?RequestID=33612a70-990a-11ea-87fe-fd68517e7a2d
    userSideServer := g.Server("userSideServer")
    userSideServer.Use(func(r *ghttp.Request) {
        requestID := r.Get("RequestID").String()
        if requestID != "" {
            newCtx, err := gtrace.WithUUID(r.Context(), requestID)
            if err != nil {
                panic(err)
            }
            r.SetCtx(newCtx)
        }
        r.Middleware.Next()
    })
    userSideServer.BindHandler("/", func(r *ghttp.Request) {
        ctx := r.Context()
        g.Log().Info(ctx, "request internalServer starts")
        content := g.Client().GetContent(ctx, "http://127.0.0.1:8199/")
        g.Log().Infof(ctx, "internalServer response: %s", content)
        r.Response.Write(content)
    })
    userSideServer.SetPort(8299)
    userSideServer.Run()
}
```

This example code runs two HTTP services to demonstrate inter-service tracing capabilities. One is an internal service that provides functionality; the other is an external service for testing, which achieves its functionality by calling the internal service. After execution, access: [http://127.0.0.1:8299/?RequestID=33612a70-990a-11ea-87fe-fd68517e7a2d](http://127.0.0.1:8299/?RequestID=33612a70-990a-11ea-87fe-fd68517e7a2d)

Then check the terminal output:

```html
2022-06-07 14:51:21.957 [INFO] openapi specification is disabled
2022-06-07 14:51:21.958 [INTE] ghttp_server.go:78 78198: graceful reload feature is disabled

      SERVER     | DOMAIN  | ADDRESS | METHOD | ROUTE |                             HANDLER                             |    MIDDLEWARE
-----------------|---------|---------|--------|-------|-----------------------------------------------------------------|--------------------
  internalServer | default | :8199   | ALL    | /     | main.main.func1                                                 |
-----------------|---------|---------|--------|-------|-----------------------------------------------------------------|--------------------
  internalServer | default | :8199   | ALL    | /*    | github.com/gogf/gf/v2/net/ghttp.internalMiddlewareServerTracing | GLOBAL MIDDLEWARE
-----------------|---------|---------|--------|-------|-----------------------------------------------------------------|--------------------

2022-06-07 14:51:21.959 [INFO] pid[78198]: http server started listening on [:8199]
2022-06-07 14:51:21.965 [INFO] openapi specification is disabled

      SERVER     | DOMAIN  | ADDRESS | METHOD | ROUTE |                             HANDLER                             |    MIDDLEWARE
-----------------|---------|---------|--------|-------|-----------------------------------------------------------------|--------------------
  userSideServer | default | :8299   | ALL    | /     | main.main.func3                                                 |
-----------------|---------|---------|--------|-------|-----------------------------------------------------------------|--------------------
  userSideServer | default | :8299   | ALL    | /*    | github.com/gogf/gf/v2/net/ghttp.internalMiddlewareServerTracing | GLOBAL MIDDLEWARE
-----------------|---------|---------|--------|-------|-----------------------------------------------------------------|--------------------
  userSideServer | default | :8299   | ALL    | /*    | main.main.func2                                                 | GLOBAL MIDDLEWARE
-----------------|---------|---------|--------|-------|-----------------------------------------------------------------|--------------------

2022-06-07 14:51:21.965 [INFO] pid[78198]: http server started listening on [:8299]
2022-06-07 14:53:05.322 [INFO] {33612a70990a11ea87fefd68517e7a2d} request internalServer starts
2022-06-07 14:53:05.323 [INFO] {33612a70990a11ea87fefd68517e7a2d} internalServer handler
2022-06-07 14:53:05.323 [INFO] {33612a70990a11ea87fefd68517e7a2d} internalServer response: 33612a70990a11ea87fefd68517e7a2d
```

We can see that the `RequestID` has been successfully circulated as the `TraceID` through the service chain!