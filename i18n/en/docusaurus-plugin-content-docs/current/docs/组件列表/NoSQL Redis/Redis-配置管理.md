---
slug: '/docs/components/contrib-nosql-redis-config'
title: 'Redis-配置管理'
sidebar_position: 0
hide_title: true
---

`gredis` 组件支持两种方式来管理 `redis` 配置和获取 `redis` 对象，一种是通过 **配置组件+单例对象** 的方式；一种是模块化通过 **配置管理方法** 及对象创建方法。

## 配置文件（推荐）

绝大部分情况下推荐使用 `g.Redis` 单例方式来操作 `redis`。因此同样推荐使用配置文件来管理 `Redis` 配置，在 `config.yaml` 中的配置示例如下：

### 单实例配置

```
# Redis 配置示例
redis:
  # 单实例配置示例1
  default:
    address: 127.0.0.1:6379
    db:      1

  # 单实例配置示例2
  cache:
    address:     127.0.0.1:6379
    db:          1
    pass:        123456
    idleTimeout: 600
```

其中的 `default` 和 `cache` 分别表示配置分组名称，我们在程序中可以通过该名称获取对应配置的 `redis` 单例对象。不传递分组名称时，默认使用 `redis.default` 配置分组项)来获取对应配置的 `redis` 客户端单例对象。

### 集群化配置

```
# Redis 配置示例
redis:
   # 集群模式配置方法
  default:
    address: 127.0.0.1:6379,127.0.0.1:6370
    db:      1
```

### 配置项说明

| 配置项名称 | 是否必须 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `address` | 是 | - | 格式： `地址:端口`<br />支持 `Redis` 单实例模式和集群模式配置，使用 `,` 分割多个地址。例如：<br />`192.168.1.1:6379, 192.168.1.2:6379` |
| `db` | 否 | `0` | 数据库索引 |
| `user` | 否 | `-` | 访问授权用户 |
| `pass` | 否 | `-` | 访问授权密码 |
| `minIdle` | 否 | `0` | 允许闲置的最小连接数 |
| `maxIdle` | 否 | `10` | 允许闲置的最大连接数( `0` 表示不限制) |
| `maxActive` | 否 | `100` | 最大连接数量限制( `0` 表示不限制) |
| `idleTimeout` | 否 | `10` | 连接最大空闲时间，使用时间字符串例如 `30s/1m/1d` |
| `maxConnLifetime` | 否 | `30` | 连接最长存活时间，使用时间字符串例如 `30s/1m/1d` |
| `waitTimeout` | 否 | `0` | 等待连接池连接的超时时间，使用时间字符串例如 `30s/1m/1d` |
| `dialTimeout` | 否 | `0` | `TCP` 连接的超时时间，使用时间字符串例如 `30s/1m/1d` |
| `readTimeout` | 否 | `0` | `TCP` 的 `Read` 操作超时时间，使用时间字符串例如 `30s/1m/1d` |
| `writeTimeout` | 否 | `0` | `TCP` 的 `Write` 操作超时时间，使用时间字符串例如 `30s/1m/1d` |
| `masterName` | 否 | `-` | 哨兵模式下使用, 设置 `MasterName` |
| `tls` | 否 | `false` | 是否使用 `TLS` 认证 |
| `tlsSkipVerify` | 否 | `false` | 通过 `TLS` 连接时，是否禁用服务器名称验证 |
| `cluster` | 否 | `false` | 是否强制设置为集群工作模式。当 `address` 是单个endpoint的集群时，系统会自动判定为单实例模式，这时需要设置此项为 `true`。 |
| `protocol` | 否 | `3` | 设置与 `Redis Server` 通信的 `RESP` 协议版本。 |
| `sentinelUsername` | 否 |  | `Sentinel` 模式下的账号 |
| `sentinelPassword` | 否 |  | `Sentinel` 模式下的密码 |

使用示例：

`config.yaml`

```
# Redis 配置示例
redis:
  # 单实例配置示例1
  default:
    address: 127.0.0.1:6379
    db:      1
    pass:    "password" # 在此配置密码, 没有可去掉
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

执行后，输出结果为：

```value
```

## 配置方法（高级）

由于 `GoFrame` 是模块化的框架，除了可以通过耦合且便捷的 `g` 模块来自动解析配置文件并获得单例对象之外，也支持有能力的开发者模块化使用 `gredis` 包。

`gredis` 提供了全局的分组配置功能，相关配置管理方法如下：

```go
func SetConfig(config Config, name ...string)
func SetConfigByMap(m map[string]interface{}, name ...string) error
func GetConfig(name ...string) (config Config, ok bool)
func RemoveConfig(name ...string)
func ClearConfig()
```

使用示例：

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