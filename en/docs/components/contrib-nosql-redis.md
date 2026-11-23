# NoSQL Redis

## Introduction

The `Redis` client is implemented by the `gredis` component, which adopts a connection pool design at the bottom layer.

**Tip**

To ensure universality and scalability, the `gredis` component uses the **command channel** method to execute `Redis` operations. When you are unsure how to pass parameters for the command channel, you can refer to the parameter passing of the terminal command line. In other words, all operations remain consistent with the parameter passing of command lines.

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

**Warning**

The `gredis.Redis` client object provides a `Close` method, which is used to close the `Redis` client (and also the client's connection pool), not the connection object. Developers generally will not use it; non-advanced users should not use it.

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

Child pages:

- [Redis - Configuration](https://goframe.org/en/docs/components/contrib-nosql-redis-config.md)
- [Redis - Examples](https://goframe.org/en/docs/components/contrib-nosql-redis-example.md)
- [Redis - Do](https://goframe.org/en/docs/components/contrib-nosql-redis-do-and-serialization.md)
- [Redis - Conn](https://goframe.org/en/docs/components/contrib-nosql-redis-conn.md)
- [Redis - Interface](https://goframe.org/en/docs/components/contrib-nosql-redis-interface.md)

> Page: https://goframe.org/en/docs/components/contrib-nosql-redis
