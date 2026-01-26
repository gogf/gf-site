---
slug: '/docs/components/contrib-nosql-redis'
title: 'NoSQL Redis'
sidebar_position: 11
hide_title: true
keywords: [GoFrame framework, gredis component, Redis client, connection pool design, command channel, Redis operations, GoFrame documentation, interface design, NoSQL Redis, community component]
description: "Implementation of NoSQL Redis client in the GoFrame framework, mainly through the gredis component for Redis operations, using connection pool design and command channel method, ensuring the component's universality and scalability. This article provides installation and reference guidelines, emphasizing gredis's notable features and linking to the relevant interface documentation. Developers can implement over 100 common methods through community components and support various advanced features, including cluster operations."
---

## Introduction

The `Redis` client is implemented by the `gredis` component, which adopts a connection pool design at the bottom layer. 
:::tip
To ensure universality and scalability, the `gredis` component uses the **command channel** method to execute `Redis` operations. When you are unsure how to pass parameters for the command channel, you can refer to the parameter passing of the terminal command line. In other words, all operations remain consistent with the parameter passing of command lines.
:::
**Usage:**

Installation:

```bash
go get -u github.com/gogf/gf/contrib/nosql/redis/v2
```

Reference:

```go
import (
    _ "github.com/gogf/gf/contrib/nosql/redis/v2"

    // other imported packages.
)
```

**Interface Documentation:**

- [https://pkg.go.dev/github.com/gogf/gf/v2/database/gredis](https://pkg.go.dev/github.com/gogf/gf/v2/database/gredis)
- [https://github.com/gogf/gf/tree/master/contrib/nosql/redis](https://github.com/gogf/gf/tree/master/contrib/nosql/redis)

**Brief Introduction:**

`gredis` uses a connection pool to manage `Redis` connections. You can manage the connection pool properties through the `Config` configuration object or the `Set*` methods, and obtain pool statistics through the `Stats` method. `gredis` uses an interface-based design to decouple the underlying dependency on `redis`. It implements over `100+` common methods using a community component approach and provides a grouping method for managing interfaces.
:::warning
The `gredis.Redis` client object provides a `Close` method, which is used to close the `Redis` client (and also the client's connection pool), not the connection object. Developers generally will not use it; non-advanced users should not use it.
:::

## Features

`gredis` has the following notable features:

- Easy to use, powerful features
- Unified configuration for components
- Provides community component implementation of `100+` common methods
- Supports both single instance and cluster operations
- Supports all features of `Redis` services
- Supports `OpenTelemetry` observability
- Supports singleton objects and dynamic object creation
- Interface design with high flexibility and extensibility

## Documentation
import DocCardList from '@theme/DocCardList';

<DocCardList />