---
slug: '/docs/web/senior-csrf'
title: 'CSRF'
sidebar_position: 5
hide_title: true
keywords: [CSRF Defense, GoFrame Framework, Cross-Site Request Forgery, CSRF Attack, XSRF, Token Verification, Middleware, Plugin Batch Processing, Network Security, Web Application Security]
description: "Explains how to protect web application security through CSRF defense settings in the GoFrame framework. We will introduce the use of token verification mechanisms and implement plugin-based protection through middleware. Includes installation and configuration of plugins, as well as key steps and code examples for front-end integration to help developers effectively resist CSRF attacks."
---

**Cross-Site Request Forgery** (abbreviated as **CSRF** or **XSRF**), also known as **one-click attack** or **session riding**, is an attack method that coerces a user to perform unintended actions on a currently authenticated web application. Compared to Cross-Site Scripting (`XSS`), **XSS** exploits the trust a user has in a particular site, while `CSRF` exploits the trust that a site has in a user's web browser.

## How to Defend

Here, we choose to validate requests using `token` through middleware, with the `CSRF` cross-site defense plugin provided by the community package.

Developers can add middleware to the API to include `token` verification functionality.

Interested parties can read the plugin source code at [https://github.com/gogf/csrf](https://github.com/gogf/csrf).

## Usage

### Import Plugin Package

```go
import "github.com/gogf/csrf"
```

### Configure API Middleware

The `csrf` plugin supports custom `csrf.Config` configuration. In `Config`, `Cookie.Name` is the name of the `token` set by the middleware in the returned `Cookie`, `ExpireTime` is the timeout for the `token`, `TokenLength` is the `token` length, and `TokenRequestKey` is the name of the parameter required to be included in subsequent requests.

```go
s := g.Server()
s.Group("/api.v2", func(group *ghttp.RouterGroup) {
    group.Middleware(csrf.NewWithCfg(csrf.Config{
        Cookie: &http.Cookie{
            Name: "_csrf", // token name in cookie
        },
        ExpireTime:      time.Hour * 24,
        TokenLength:     32,
        TokenRequestKey: "X-Token", // use this key to read token in request param
    }))
    group.ALL("/csrf", func(r *ghttp.Request) {
        r.Response.Writeln(r.Method + ": " + r.RequestURI)
    })
})
```

### Front-end Integration

After configuration, the front-end reads the value of `_csrf` (i.e., `token`) from the `Cookie` before making a POST request, and includes the `token` in the request as the `X-Token` (set by `TokenRequestKey`) parameter name (either in `Header` or `Form`) to pass the `token` verification.

## Code Example

### Using Default Configuration

```go
package main

import (
    "net/http"
    "time"

    "github.com/gogf/csrf"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

// default cfg
func main() {
    s := g.Server()
    s.Group("/api.v2", func(group *ghttp.RouterGroup) {
        group.Middleware(csrf.New())
        group.ALL("/csrf", func(r *ghttp.Request) {
            r.Response.Writeln(r.Method + ": " + r.RequestURI)
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

### Using Custom Configuration

```go
package main

import (
    "net/http"
    "time"

    "github.com/gogf/csrf"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

// set cfg
func main() {
    s := g.Server()
    s.Group("/api.v2", func(group *ghttp.RouterGroup) {
        group.Middleware(csrf.NewWithCfg(csrf.Config{
            Cookie: &http.Cookie{
                Name: "_csrf", // token name in cookie
                Secure:   true,
                SameSite: http.SameSiteNoneMode, // custom samesite
            },
            ExpireTime:      time.Hour * 24,
            TokenLength:     32,
            TokenRequestKey: "X-Token", // use this key to read token in request param
        }))
        group.ALL("/csrf", func(r *ghttp.Request) {
            r.Response.Writeln(r.Method + ": " + r.RequestURI)
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

## Experience the Effect Through Request

[http://localhost:8199/api.v2/csrf](http://localhost:8199/api.v2/csrf)