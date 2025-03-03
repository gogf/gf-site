---
slug: '/docs/web/request-json-xml-parameter'
title: 'Request - JSON/XML'
sidebar_position: 3
hide_title: true
keywords: [GoFrame,GoFrame framework,request input,JSON,XML,data format,GoFrame documentation,data validation,API development,web framework]
description: "GoFrame framework's native support for JSON and XML data formats, detailing how to handle client-submitted data formats through the Request object of the GoFrame framework to improve development efficiency. The documentation includes sample code demonstrating how to parse and validate submitted data, as well as how to perform data format conversion, providing developers with convenient data acquisition and processing capabilities."
---

Starting from version `GoFrame v1.11`, the `Request` object provides native support for client-submitted `JSON/XML` data formats, offering developers more convenient data acquisition features to further improve development efficiency.

## Example 1, Simple Example

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Writef("name: %v, pass: %v", r.Get("name"), r.Get("pass"))
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, we use the `curl` tool to submit data for testing:

1. `Query` Data Format

```bash
$ curl "http://127.0.0.1:8199/?name=john&pass=123"
name: john, pass: 123
```

2. `Form` Submit Form

```bash
$ curl -d "name=john&pass=123" "http://127.0.0.1:8199/"
name: john, pass: 123
```

3. `JSON` Data Format

```bash
$ curl -d '{"name":"john","pass":"123"}' "http://127.0.0.1:8199/"
name: john, pass: 123
```

4. `XML` Data Format

```bash
$ curl -d '<?xml version="1.0" encoding="UTF-8"?><doc><name>john</name><pass>123</pass></doc>' "http://127.0.0.1:8199/"
name: john, pass: 123


$ curl -d '<doc><name>john</name><pass>123</pass></doc>' "http://127.0.0.1:8199/"
name: john, pass: 123
```

## Example 2, Object Conversion and Validation

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/util/gvalid"
)

type RegisterReq struct {
    Name  string `p:"username"  v:"required|length:6,30#Please enter account|Account length should be between:{min} to:{max}"`
    Pass  string `p:"password1" v:"required|length:6,30#Please enter password|Password is too short"`
    Pass2 string `p:"password2" v:"required|length:6,30|same:password1#Please confirm password|Password is too short|Passwords do not match"`
}

type RegisterRes struct {
    Code  int         `json:"code"`
    Error string      `json:"error"`
    Data  interface{} `json:"data"`
}

func main() {
    s := g.Server()
    s.BindHandler("/register", func(r *ghttp.Request) {
        var req *RegisterReq
        if err := r.Parse(&req); err != nil {
            // Validation error.
            if v, ok := err.(gvalid.Error); ok {
                r.Response.WriteJsonExit(RegisterRes{
                    Code:  1,
                    Error: v.FirstString(),
                })
            }
            // Other error.
            r.Response.WriteJsonExit(RegisterRes{
                Code:  1,
                Error: err.Error(),
            })
        }
        // ...
        r.Response.WriteJsonExit(RegisterRes{
            Data: req,
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, we use the `curl` tool to submit data for testing:

1. `JSON` Data Format

```bash
$ curl -d '{"username":"johngcn","password1":"123456","password2":"123456"}' "http://127.0.0.1:8199/register"
{"code":0,"error":"","data":{"Name":"johngcn","Pass":"123456","Pass2":"123456"}}


$ curl -d '{"username":"johngcn","password1":"123456","password2":"1234567"}' "http://127.0.0.1:8199/register"
{"code":1,"error":"Passwords do not match","data":null}
```

As you can see, the `JSON` content we submitted is intelligently converted into a structure object by the `Parse` method.

2. `XML` Data Format

```bash
$ curl -d '<?xml version="1.0" encoding="UTF-8"?><doc><username>johngcn</username><password1>123456</password1><password2>123456</password2></doc>' "http://127.0.0.1:8199/register"
{"code":0,"error":"","data":{"Name":"johngcn","Pass":"123456","Pass2":"123456"}}


$ curl -d '<?xml version="1.0" encoding="UTF-8"?><doc><username>johngcn</username><password1>123456</password1><password2>1234567</password2></doc>' "http://127.0.0.1:8199/register"
{"code":1,"error":"Passwords do not match","data":null}
```

As you can see, the `XML` content we submitted is also intelligently converted into a structure object by the `Parse` method.