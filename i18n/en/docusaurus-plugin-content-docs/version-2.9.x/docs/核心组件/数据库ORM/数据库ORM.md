---
slug: '/docs/core/gdb'
title: 'Database ORM🔥'
sidebar_position: 8
hide_title: true
keywords: [GoFrame, GoFrame Framework, Database ORM, gdb Module, Database Driver, Connection Pool, Preprocessing, Automation, Observability, DAO Design]
description: "In the GoFrame framework, the gdb module is used to implement ORM functionality for databases, emphasizing the design of connection pools, preprocessing SQL parameters, and automatic recognition of Map/Struct. The GoFrame ORM component supports nested transactions, interface-based design, is compatible with mainstream database drivers, and has strong configuration management and debugging features."
---

## Driver Introduction🔥

To decouple the database drivers from the main framework library, starting from version `v2.1`, all database drivers need to be introduced manually through community packages.

For database driver installation and introduction, please refer to: [https://github.com/gogf/gf/tree/master/contrib/drivers](https://github.com/gogf/gf/tree/master/contrib/drivers)

## Introduction

The `ORM` functionality of the `GoFrame` framework is implemented by the `gdb` module, used for `ORM` operations of common relational databases.
:::tip
The `gdb` database engine uses a **connection pool design** at the bottom layer, and connections will automatically close when not in use, so there is no need to explicitly use the `Close` method to close the database connection when the connection object is no longer needed.
:::
:::note
Note: To improve the security of database operations, it is not recommended to directly concatenate parameters into an `SQL` string for execution in `ORM` operations. It is recommended to use preprocessing (utilizing `?` placeholders extensively) to pass `SQL` parameters. The bottom layer of `gdb` is implemented using preprocessing to handle the parameters passed by developers, ensuring the safety of database operations.
:::
**Interface Documentation:**

[https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb)

## Features

The `GoFrame ORM` component has the following notable features:

1. Fully automated support for nested transactions.
2. Interface-oriented design, easy to use and extend.
3. Built-in support for mainstream database types and drivers, and easy to extend.
4. Powerful configuration management using the framework's unified configuration component.
5. Supports singleton mode to obtain database objects of the same configuration group.
6. Supports two operation methods: native SQL method operations and ORM chain operations.
7. Supports `OpenTelemetry` observability: trace tracing, logging, and metric reporting.
8. Automatically recognizes `Map/Struct` to receive query results through the `Scan` method, automating query result initialization and struct type conversion.
9. Recognizes empty results by returning `nil`, without the need for `sql.ErrNoRows` to identify empty query results.
10. Fully automated struct property-field mapping, without needing to explicitly define struct tags to maintain property-field mapping relationships.
11. Automates field recognition and filtering of given `Map/Struct/Slice` parameter types, greatly enhancing query condition input and result reception.
12. Perfectly supports `DAO` design at the `GoFrame` framework layer, fully automated `Model/DAO` code generation, significantly improving development efficiency.
13. Supports debugging modes, log output, `DryRun`, custom `Handler`, automatic type conversion, custom interface conversion, and other advanced features.
14. Supports query caching, soft delete, automatic time updates, model associations, database cluster configurations (software master-slave mode), and other practical features.

## `g.DB` vs `gdb.New` & `gdb.Instance`

There are three ways to obtain database operation objects: using the `g.DB` method (recommended), using the native `gdb.New` method, and using the package's native singleton method `gdb.Instance`, with the first being the recommended usage. The differences between these three methods are as follows:

1. The `g.DB` object management method obtains a singleton object, integrating the management features of the configuration file and supporting hot updates of configuration files.
2. `gdb.New` creates a new database object (not a singleton) based on the given database node configuration and cannot use configuration files.
3. `gdb.Instance` is the package's native singleton management method, which needs to be used together with the configuration method to obtain the database singleton object for the corresponding configuration by group name (not required).
:::tip
There are so many ways to obtain objects because `GoFrame` is a modular design framework, and each module can be used independently.
:::
### Creating a Database Object with `New`

```go
db, err := gdb.New(gdb.ConfigNode{
    Link: "mysql:root:12345678@tcp(127.0.0.1:3306)/test",
})
```

### Obtaining the Database Object Singleton

```go
// Obtain the database object with default configuration (configuration name "default")
db := g.DB()

// Obtain the database object of the configuration group named "user"
db := g.DB("user")

// Obtain the database object singleton using the native singleton management method
db, err := gdb.Instance()
db, err := gdb.Instance("user")
```

## Documentation
import DocCardList from '@theme/DocCardList';

<DocCardList />