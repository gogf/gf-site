---
slug: '/docs/web/http-client-middleware'
title: 'HTTPClient - Middleware'
sidebar_position: 8
hide_title: true
keywords: [GoFrame, GoFrame Framework, HTTPClient, Interceptor, Middleware, Client Request, Parameter Validation, Signature Generation, API Security, Request Interception]
description: "The HTTPClient interceptor/middleware feature in the GoFrame framework can be used for global request interception and parameter validation. Through middleware, developers can insert custom logic in the pre and post phases of requests, modify submitted parameters or returned parameters, implement signature parameter injection, and more, ensuring the security of API parameters."
---

## Introduction

`HTTPClient` supports a powerful interceptor/middleware feature, which makes global request interception and injection for the client possible, such as modifying/injecting submitted parameters, modifying/injecting returned parameters, client-based parameter validation, etc. Middleware injection is implemented through the following method:

```go
func (c *Client) Use(handlers ...HandlerFunc) *Client
```

In middleware, execute the next step of the process through the `Next` method, which is defined as follows:

```go
func (c *Client) Next(req *http.Request) (*Response, error)
```

## Types of Middleware

The middleware feature in `HTTPClient` is similar to the middleware feature in `HTTPServer`, and is also divided into pre-middleware and post-middleware.

### Pre-middleware

Processing logic is before the `Next` method, formatted as follows:

```go
c := g.Client()
c.Use(func(c *gclient.Client, r *http.Request) (resp *gclient.Response, err error) {
    // Custom processing logic
    resp, err = c.Next(r)
    return resp, err
})
```

### Post-middleware

Processing logic is after the `Next` method, formatted as follows:

```go
c := g.Client()
c.Use(func(c *gclient.Client, r *http.Request) (resp *gclient.Response, err error) {
    resp, err = c.Next(r)
    // Custom processing logic
    return resp, err
})
```

## Usage Example

Let's use a code example to better illustrate usage. This example adds an interceptor to the client, injecting custom additional parameters into the submitted JSON data. These additional parameters implement signature generation for the submitted parameters, essentially achieving a simple API parameter security validation.

### Server

The server logic is straightforward, it parses the client's submitted `JSON` parameters as a `map` and then constructs a `JSON` string to return to the client.
:::note
Often, the server also needs to perform signature validation through middleware, but here I've taken a shortcut and directly returned the data submitted by the client. Please understand the documentation maintainer😸.
:::
```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.ALL("/", func(r *ghttp.Request) {
            r.Response.Write(r.GetMap())
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

### Client

The client logic implements basic client parameter submission, interceptor injection, signature-related parameter injection, and signature parameter generation.

```go
package main

import (
    "bytes"
    "fmt"
    "io/ioutil"
    "net/http"

    "github.com/gogf/gf/v2/container/garray"
    "github.com/gogf/gf/v2/crypto/gmd5"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/internal/json"
    "github.com/gogf/gf/v2/net/gclient"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gtime"
    "github.com/gogf/gf/v2/util/gconv"
    "github.com/gogf/gf/v2/util/guid"
    "github.com/gogf/gf/v2/util/gutil"
)

const (
    appId     = "123"
    appSecret = "456"
)

// Inject unified API signature parameters
func injectSignature(jsonContent []byte) []byte {
    var m map[string]interface{}
    _ = json.Unmarshal(jsonContent, &m)
    if len(m) > 0 {
        m["appid"] = appId
        m["nonce"] = guid.S()
        m["timestamp"] = gtime.Timestamp()
        var (
            keyArray   = garray.NewSortedStrArrayFrom(gutil.Keys(m))
            sigContent string
        )
        keyArray.Iterator(func(k int, v string) bool {
            sigContent += v
            sigContent += gconv.String(m[v])
            return true
        })
        m["signature"] = gmd5.MustEncryptString(gmd5.MustEncryptString(sigContent) + appSecret)
        jsonContent, _ = json.Marshal(m)
    }
    return jsonContent
}

func main() {
    c := g.Client()
    c.Use(func(c *gclient.Client, r *http.Request) (resp *gclient.Response, err error) {
        bodyBytes, _ := ioutil.ReadAll(r.Body)
        if len(bodyBytes) > 0 {
            // Inject signature-related parameters, modify the original submission parameters of the Request
            bodyBytes = injectSignature(bodyBytes)
            r.Body = ioutil.NopCloser(bytes.NewBuffer(bodyBytes))
            r.ContentLength = int64(len(bodyBytes))
        }
        return c.Next(r)
    })
    content := c.ContentJson().PostContent(gctx.New(), "http://127.0.0.1:8199/", g.Map{
        "name": "goframe",
        "site": "https://goframe.org",
    })
    fmt.Println(content)
}
```

### Run Test

First, run the server:

```bash
$ go run server.go

  SERVER  | DOMAIN  | ADDRESS | METHOD | ROUTE |      HANDLER      | MIDDLEWARE
----------|---------|---------|--------|-------|-------------------|-------------
  default | default | :8199   | ALL    | /     | main.main.func1.1 |
----------|---------|---------|--------|-------|-------------------|-------------

2021-05-18 09:23:41.865 97906: http server started listening on [:8199]
```

Then, run the client:

```bash
$ go run client.go
{"appid":"123","name":"goframe","nonce":"12vd8tx23l6cbfz9k59xehk1002pixfo","signature":"578a90b67bdc63d551d6a18635307ba2","site":"https://goframe.org","timestamp":1621301076}
$
```

You can see that the server received parameters with several additional items, including `appid/nonce/timestamp/signature`, which are often parameters required by the signature verification algorithm.