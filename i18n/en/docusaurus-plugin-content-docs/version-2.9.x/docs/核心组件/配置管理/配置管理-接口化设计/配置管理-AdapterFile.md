---
slug: '/docs/core/gcfg-interface-adapter-file'
title: 'Configuration - AdapterFile'
sidebar_position: 0
hide_title: true
keywords: [GoFrame, GoFrame framework, configuration management, AdapterFile, g.Cfg object, file-based configuration, gcfg.NewWithAdapter, configuration component, configuration loading, Golang]
description: "In the GoFrame framework, configuration management is implemented primarily through AdapterFile for file-based configuration loading and reading. Users can conveniently use configuration management through the g.Cfg singleton object or create configuration management objects via the gcfg.NewWithAdapter method. Example code demonstrates how to implement and execute these configuration operations in Golang."
---

## `AdapterFile`

`AdapterFile` is the default configuration management implementation in the framework, based on file loading and reading.

## Use through `g.Cfg` Singleton Object

In most scenarios, we can conveniently use the file-based configuration management implementation through the g.Cfg singleton object already encapsulated by the framework. For example:

`config.yaml`

```yaml
server:
  address:     ":8888"
  openapiPath: "/api.json"
  swaggerPath: "/swagger"
  dumpRouterMap: false

database:
  default:
    link:  "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
    debug:  true
```

`main.go`

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var ctx = gctx.New()
    fmt.Println(g.Cfg().MustGet(ctx, "server.address").String())
    fmt.Println(g.Cfg().MustGet(ctx, "database.default").Map())
}
```

After running, the terminal output:

```html
:8888
map[debug:true link:mysql:root:12345678@tcp(127.0.0.1:3306)/test]
```

## Use via `gcfg.NewWithAdapter`

We can also create a configuration management object based on a given `Adapter` via the configuration component's `NewWithAdapter` method. Here, we provide an `AdapterFile` interface object.

`config.yaml`

```yaml
server:
  address:     ":8888"
  openapiPath: "/api.json"
  swaggerPath: "/swagger"
  dumpRouterMap: false

database:
  default:
    link:  "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
    debug:  true
```

`main.go`

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/os/gcfg"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var ctx = gctx.New()
    adapter, err := gcfg.NewAdapterFile("config")
    if err != nil {
        panic(err)
    }
    config := gcfg.NewWithAdapter(adapter)
    fmt.Println(config.MustGet(ctx, "server.address").String())
    fmt.Println(config.MustGet(ctx, "database.default").Map())
}
```

After running, the terminal output:

```html
:8888
map[debug:true link:mysql:root:12345678@tcp(127.0.0.1:3306)/test]
```