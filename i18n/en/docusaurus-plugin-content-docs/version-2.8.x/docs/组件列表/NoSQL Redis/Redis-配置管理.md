---
slug: '/docs/components/contrib-nosql-redis-config'
title: 'Redis - Configuration'
sidebar_position: 0
hide_title: true
keywords: [GoFrame, GoFrame framework, gredis, Redis configuration, configuration management, configuration file, singleton object, cluster configuration, modularization, configuration method]
description: "Use the gredis component in the GoFrame framework for Redis configuration management. We recommend managing Redis configurations through configuration files, supporting both single instance and cluster configurations. Additionally, detailed instructions on various configuration items are provided, along with related code examples for reference."
---

The `gredis` component supports two methods for managing `redis` configurations and obtaining `redis` objects: one is through the **configuration component + singleton object** approach; the other is modularized using **configuration management methods** and object creation methods.

## Configuration File (Recommended)

In most cases, it is recommended to use the `g.Redis` singleton approach to operate `redis`. Therefore, using configuration files to manage `Redis` configurations is also recommended. An example configuration in `config.yaml` is as follows:

### Single Instance Configuration

```
# Redis Configuration Example
redis:
  # Single Instance Example 1
  default:
    address: 127.0.0.1:6379
    db:      1

  # Single Instance Example 2
  cache:
    address:     127.0.0.1:6379
    db:          1
    pass:        123456
    idleTimeout: 600
```

Here, `default` and `cache` represent configuration group names. In the program, you can obtain the corresponding `redis` singleton object using this name. If no group name is passed, the `redis.default` configuration group is used by default to obtain the corresponding `redis` client singleton object.

### Cluster Configuration

```
# Redis Configuration Example
redis:
   # Cluster Mode Configuration Method
  default:
    address: 127.0.0.1:6379,127.0.0.1:6370
    db:      1
```

### Configuration Item Description

| Configuration Item | Required | Default | Description |
| --- | --- | --- | --- |
| `address` | Yes | - | Format: `Address:Port`<br />Supports `Redis` single instance mode and cluster mode configuration, using `,` to separate multiple addresses. For example:<br />`192.168.1.1:6379, 192.168.1.2:6379` |
| `db` | No | `0` | Database index |
| `user` | No | `-` | Authorized user for access |
| `pass` | No | `-` | Authorized password for access |
| `minIdle` | No | `0` | Minimum number of idle connections allowed |
| `maxIdle` | No | `10` | Maximum number of idle connections allowed (`0` means no limit) |
| `maxActive` | No | `100` | Maximum connection limit (`0` means no limit) |
| `idleTimeout` | No | `10` | Maximum idle time for connections, using a time string such as `30s/1m/1d` |
| `maxConnLifetime` | No | `30` | Maximum lifetime for connections, using a time string such as `30s/1m/1d` |
| `waitTimeout` | No | `0` | Timeout for waiting on a connection pool, using a time string such as `30s/1m/1d` |
| `dialTimeout` | No | `0` | Timeout for `TCP` connection, using a time string such as `30s/1m/1d` |
| `readTimeout` | No | `0` | Timeout for `TCP` `Read` operation, using a time string such as `30s/1m/1d` |
| `writeTimeout` | No | `0` | Timeout for `TCP` `Write` operation, using a time string such as `30s/1m/1d` |
| `masterName` | No | `-` | Used in Sentinel mode, set `MasterName` |
| `tls` | No | `false` | Whether to use `TLS` authentication |
| `tlsSkipVerify` | No | `false` | Whether to disable server name verification when connecting via `TLS` |
| `cluster` | No | `false` | Whether to force setting as cluster working mode. When `address` is a single endpoint cluster, the system will automatically determine it as single instance mode, in which case this should be set to `true`. |
| `protocol` | No | `3` | Set the `RESP` protocol version for communication with `Redis Server`. |
| `sentinelUsername` | No |  | Account for `Sentinel` mode |
| `sentinelPassword` | No |  | Password for `Sentinel` mode |

Usage Example:

`config.yaml`

```
# Redis Configuration Example
redis:
  # Single Instance Example 1
  default:
    address: 127.0.0.1:6379
    db:      1
    pass:    "password" # Set password here, remove if not needed
```

```go
package main

import (
    "fmt"

    _ "github.com/gogf/gf/contrib/nosql/redis/v2"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var ctx = gctx.New()
    _, err := g.Redis().Set(ctx, "key", "value")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    value, err := g.Redis().Get(ctx, "key")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    fmt.Println(value.String())
}
```

After execution, the output is:

```value
```

## Configuration Method (Advanced)

Since `GoFrame` is a modular framework, apart from using the coupled and convenient `g` module to automatically parse configuration files and obtain singleton objects, it also supports modular use of the `gredis` package by capable developers.

`gredis` provides global group configuration capabilities, with related configuration management methods as follows:

```go
func SetConfig(config Config, name ...string)
func SetConfigByMap(m map[string]interface{}, name ...string) error
func GetConfig(name ...string) (config Config, ok bool)
func RemoveConfig(name ...string)
func ClearConfig()
```

Usage Example:

```go
package main

import (
    "fmt"

    _ "github.com/gogf/gf/contrib/nosql/redis/v2"

    "github.com/gogf/gf/v2/database/gredis"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

var (
    config = gredis.Config{
        Address: "127.0.0.1:6379",
        Db:      1,
        Pass:    "password",
    }
    group = "cache"
    ctx   = gctx.New()
)

func main() {
    gredis.SetConfig(&config, group)

    _, err := g.Redis(group).Set(ctx, "key", "value")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    value, err := g.Redis(group).Get(ctx, "key")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    fmt.Println(value.String())
}
```