---
slug: '/docs/web/response-json-xml'
title: 'Response - JSON/XML'
sidebar_position: 1
hide_title: true
keywords: [GoFrame, GoFrame Framework, JSON, XML, Data Return, JSONP, Response, WriteJson, WriteXml, HTTP Server]
description: "Using the Response object of the GoFrame framework to implement data return functions, supporting JSON and XML format output. Through methods such as WriteJson and WriteXml, content output can be easily achieved. Sample code demonstrates how to use GoFrame to build an HTTP server and provide implementation with support for the JSONP protocol."
---

Related methods:

```go
func (r *Response) WriteJson(content interface{}) error
func (r *Response) WriteJsonExit(content interface{}) error
func (r *Response) WriteJsonP(content interface{}) error
func (r *Response) WriteJsonPExit(content interface{}) error
func (r *Response) WriteXml(content interface{}, rootTag ...string) error
func (r *Response) WriteXmlExit(content interface{}, rootTag ...string) error
```

`Response` provides native support for `JSON/XML` data format output, implemented through the following methods:

1. `WriteJson*` methods are used to return `JSON` data format, with parameters of any type, such as `string`, `map`, `struct`, etc. The returned `Content-Type` is `application/json`.
2. `WriteXml*` methods are used to return `XML` data format, with parameters of any type, such as `string`, `map`, `struct`, etc. The returned `Content-Type` is `application/xml`.

:::tip
While supporting the `JSON` data format, it also supports the `JSONP` protocol.
:::

## `JSON`

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.ALL("/json", func(r *ghttp.Request) {
            r.Response.WriteJson(g.Map{
                "id":   1,
                "name": "john",
            })
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, we test it using the `curl` tool:

```bash
$ curl -i http://127.0.0.1:8199/json
HTTP/1.1 200 OK
Content-Type: application/json
Server: GoFrame HTTP Server
Date: Sun, 05 Jan 2020 02:49:31 GMT
Content-Length: 22

{"id":1,"name":"john"}
```

## `JSONP`

Note that when using the `JSONP` protocol, you must provide the `callback` parameter via `Query`.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.ALL("/jsonp", func(r *ghttp.Request) {
            r.Response.WriteJsonP(g.Map{
                "id":   1,
                "name": "john",
            })
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, we test it using the `curl` tool:

```bash
$ curl -i "http://127.0.0.1:8199/jsonp?callback=MyCallback"
HTTP/1.1 200 OK
Server: GoFrame HTTP Server
Date: Sun, 05 Jan 2020 02:50:42 GMT
Content-Length: 34
Content-Type: text/plain; charset=utf-8

MyCallback({"id":1,"name":"john"})
```

## `XML`

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.ALL("/xml", func(r *ghttp.Request) {
            r.Response.Write(`<?xml version="1.0" encoding="UTF-8"?>`)
            r.Response.WriteXml(g.Map{
                "id":   1,
                "name": "john",
            })
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, we test it using the `curl` tool:

```bash
$ curl -i http://127.0.0.1:8199/xml
HTTP/1.1 200 OK
Content-Type: application/xml
Server: GoFrame HTTP Server
Date: Sun, 05 Jan 2020 03:00:55 GMT
Content-Length: 76

<?xml version="1.0" encoding="UTF-8"?><doc><id>1</id><name>john</name></doc>
```