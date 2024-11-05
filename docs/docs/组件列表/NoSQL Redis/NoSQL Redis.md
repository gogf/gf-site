---
slug: '/docs/components/contrib-nosql-redis'
title: 'NoSQL Redis'
sidebar_position: 11
hide_title: true
---

## 基本介绍

`Redis` 客户端由 `gredis` 组件实现，底层采用了链接池设计。
:::tip
为了保证通用性和扩展性， `gredis` 组件采用了 **命令通道** 的方式执行 `Redis` 操作。当您不知道命令通道的参数如何传递时，可以参考终端命令行的参数传递。也就是说，所有的操作都和命令行的参数传递保持一致。
:::
**使用方式**：

安装：

```bash
go get -u github.com/gogf/gf/contrib/nosql/redis/v2
```

引用：

```go
import (
    _ "github.com/gogf/gf/contrib/nosql/redis/v2"

    // other imported packages.
)
```

**接口文档**：

- [https://pkg.go.dev/github.com/gogf/gf/v2/database/gredis](https://pkg.go.dev/github.com/gogf/gf/v2/database/gredis)
- [https://github.com/gogf/gf/tree/master/contrib/nosql/redis](https://github.com/gogf/gf/tree/master/contrib/nosql/redis)

**简要介绍：**

`gredis` 使用了连接池来进行 `Redis` 连接管理，通过 `Config` 配置对象或者 `Set*` 方法可以对连接池的属性进行管理，通过 `Stats` 方法可以获取连接池的统计信息。 `gredis` 使用接口化的设计来解耦对 `redis` 的底层依赖，通过社区组件的方式实现了 `100+` 项常用方法，并且提供了分组的方式来管理接口。
:::warning
`gredis.Redis` 客户端对象提供了一个 `Close` 方法，该方法用于关闭 `Redis` 客户端（同时关闭客户端的连接池），而不是连接对象，开发者基本不会用到，非高级玩家请不要使用。
:::

## 组件特性

`gredis` 具有以下显著特性：

- 使用简便，功能强大
- 统一配置组件进行配置
- 提供 `100+` 项常用方法社区组件实现
- 支持单实例及集群化操作
- 支持 `Redis` 服务所有特性
- 支持 `OpenTelemetry` 可观测性
- 支持单例对象、也支持动态创建对象
- 接口化设计，很高的灵活性和扩展性

## 相关文档
import DocCardList from '@theme/DocCardList';

<DocCardList />