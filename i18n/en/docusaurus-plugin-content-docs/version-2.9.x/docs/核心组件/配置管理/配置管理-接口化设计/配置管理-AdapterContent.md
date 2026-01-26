---
slug: '/docs/core/gcfg-interface-adapter-content'
title: 'Configuration - AdapterContent'
sidebar_position: 1
hide_title: true
keywords: [GoFrame, GoFrame Framework, Configuration Management, AdapterContent, Configuration Content, Configuration Format, g.Cfg Singleton, gcfg, Configuration Example, Golang Framework]
description: "Use the AdapterContent interface in the GoFrame framework to manage configurations. Users can generate the corresponding Adapter interface object by providing specific configuration content, supporting multiple formats. Example code demonstrates how to use the g.Cfg singleton for file-based configuration management."
---

## `AdapterContent`

`AdapterContent` is an implementation based on configuration content, allowing users to generate an `Adapter` interface object by providing specific configuration content. The configuration content supports multiple formats, which are consistent with the configuration management component.

## Usage Example

In most scenarios, we can conveniently use file-based configuration management through the g.Cfg singleton object already encapsulated by the framework. For example:

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/os/gcfg"
    "github.com/gogf/gf/v2/os/gctx"
)

const content = `
server:
  address:     ":8888"
  openapiPath: "/api.json"
  swaggerPath: "/swagger"
  dumpRouterMap: false

database:
  default:
    link:  "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
    debug:  true
`

func main() {
    var ctx = gctx.New()
    adapter, err := gcfg.NewAdapterContent(content)
    if err != nil {
        panic(err)
    }
    config := gcfg.NewWithAdapter(adapter)
    fmt.Println(config.MustGet(ctx, "server.address").String())
    fmt.Println(config.MustGet(ctx, "database.default").Map())
}
```

After running, the terminal outputs:

```html
:8888
map[debug:true link:mysql:root:12345678@tcp(127.0.0.1:3306)/test]
```