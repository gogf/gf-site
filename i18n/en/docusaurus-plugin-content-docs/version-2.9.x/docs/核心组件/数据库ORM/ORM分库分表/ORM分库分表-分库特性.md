---
slug: '/docs/core/gdb-sharding-schema'
title: 'ORM Sharding - Database Sharding'
sidebar_position: 2000
hide_title: true
keywords: ['Database Sharding', 'Horizontal Sharding', 'Schema Sharding', 'sharding', 'database sharding']
description: 'GoFrame ORM Database Sharding provides flexible and efficient database partitioning functionality, supporting custom sharding rules to easily implement horizontal database scaling.'
---

## Basic Introduction

`ORM` Database Sharding (`Schema Sharding`) is a data partitioning solution provided by `GoFrame ORM` that allows developers to distribute data from a logical table across multiple physical databases. Database sharding is an important approach for implementing horizontal database scaling. By distributing data across different database nodes, system processing capacity and scalability can be significantly improved.

## Advantages of Database Sharding

1. **Overcomes Single Machine Performance Bottlenecks**: By distributing data across multiple database nodes, overcomes the performance limitations of a single database server
2. **Improves Concurrent Processing Capacity**: Distributes read and write pressure across multiple database nodes, improving overall concurrent processing capacity
3. **Enhances System Availability**: Failure of a single database node does not affect the entire system, improving system availability
4. **Geographic Distribution Advantages**: Can distribute data based on geographic location, reducing access latency and improving user experience
5. **Flexible Data Management**: Can distribute different types of data to different database nodes based on business requirements

## Application Scenarios

1. **Large-Scale User Systems**: Sharding by user ID or geographic location to handle global user distribution
2. **E-commerce Platforms**: Sharding by merchant or product category to process large-scale product data
3. **Financial Systems**: Sharding by account type or business line to achieve business isolation and high availability
4. **Multi-tenant SaaS Platforms**: Sharding by tenant to ensure data isolation and security
5. **Big Data Analysis Systems**: Sharding by time or data type to optimize large-scale data processing

## Basic Usage

`GoFrame ORM` provides simple and easy-to-use database sharding APIs through the `Sharding` and `ShardingValue` methods.

### Database Sharding Configuration

```go
// Create database sharding configuration
shardingConfig := gdb.ShardingConfig{
    Schema: gdb.ShardingSchemaConfig{
        Enable: true,     // Enable database sharding
        Prefix: "db_",    // Database prefix
        Rule: &gdb.DefaultShardingRule{
            SchemaCount: 2, // Number of database shards
        },
    },
}

// Use sharding configuration and sharding value
model := db.Model("user").
    Sharding(shardingConfig).
    ShardingValue(10001) // Sharding value, used to calculate which database the data routes to
```

### Default Database Sharding Rule

`GoFrame ORM` includes a built-in default database sharding rule `DefaultShardingRule`, which determines the database name based on the hash modulo of the sharding value:

```go
// Default database sharding rule implementation
func (r *DefaultShardingRule) SchemaName(ctx context.Context, config ShardingSchemaConfig, value any) (string, error) {
    if r.SchemaCount == 0 {
        return "", gerror.NewCode(
            gcode.CodeInvalidParameter, "schema count should not be 0 using DefaultShardingRule when schema sharding enabled",
        )
    }
    hashValue, err := getHashValue(value)
    if err != nil {
        return "", err
    }
    nodeIndex := hashValue % uint64(r.SchemaCount)
    return fmt.Sprintf("%s%d", config.Prefix, nodeIndex), nil
}
```

## Complete Example

First, using `MySQL` database as an example, we need to create multiple databases and corresponding table structures. For database sharding examples, we need to create multiple databases with the same table structure:

```sql
-- Create databases needed for sharding
CREATE DATABASE IF NOT EXISTS `db_0`;
CREATE DATABASE IF NOT EXISTS `db_1`;

-- Create tables with identical structure in each database
-- Create table in db_0
USE `db_0`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create table in db_1
USE `db_1`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Basic CRUD Operations

The following example demonstrates how to perform basic `CRUD` operations in a database sharding environment:

```go
package main

import (
    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"

    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/frame/g"
)

// User structure
type User struct {
    Id   int    `json:"id"`
    Name string `json:"name"`
}

func main() {
    // Create database sharding configuration
    shardingConfig := gdb.ShardingConfig{
        Schema: gdb.ShardingSchemaConfig{
            Enable: true,  // Enable database sharding
            Prefix: "db_", // Database prefix
            Rule: &gdb.DefaultShardingRule{
                SchemaCount: 2, // Number of database shards
            },
        },
    }

    // Prepare test data
    user := User{
        Id:   1,
        Name: "John",
    }

    // Create sharded model
    db := g.DB()
    db.SetDebug(true)
    model := db.Model("user").
        Sharding(shardingConfig).
        ShardingValue(user.Id) // Use user ID as sharding value

    // Insert data
    _, err := model.Data(user).Insert()
    if err != nil {
        panic(err)
    }
    // INSERT INTO `user`(`id`,`name`) VALUES(1,'John')
    // Note: The operation is actually performed on the user table in the db_1 database

    // Query data
    var result User
    err = model.Where("id", user.Id).Scan(&result)
    if err != nil {
        panic(err)
    }
    // SELECT * FROM `user` WHERE `id`=1 LIMIT 1
    // Note: The query is actually performed on the user table in the db_1 database
    g.DumpJson(result)

    // Update data
    _, err = model.Data(g.Map{"name": "John Doe"}).
        Where("id", user.Id).
        Update()
    if err != nil {
        panic(err)
    }
    // UPDATE `user` SET `name`='John Doe' WHERE `id`=1
    // Note: The update is actually performed on the user table in the db_1 database

    // Delete data
    _, err = model.Where("id", user.Id).Delete()
    if err != nil {
        panic(err)
    }
    // DELETE FROM `user` WHERE `id`=1
    // Note: The deletion is actually performed on the user table in the db_1 database
}
```

### Custom Database Sharding Rules

You can create custom database sharding rules by implementing the `ShardingRule` interface:

```go
package main

import (
    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"

    "context"
    "fmt"

    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/frame/g"
)

// RegionShardingRule implements region-based database sharding
type RegionShardingRule struct {
    // Mapping from region to database
    RegionMapping map[string]string
}

// SchemaName implements region-based database sharding rule
func (r *RegionShardingRule) SchemaName(ctx context.Context, config gdb.ShardingSchemaConfig, value any) (string, error) {
    // Convert sharding value to region information
    region, ok := value.(string)
    if !ok {
        return "", fmt.Errorf("sharding value must be string for RegionShardingRule")
    }

    // Get the database name corresponding to the region
    if dbName, exists := r.RegionMapping[region]; exists {
        return dbName, nil
    }

    // If no corresponding region is found, use the default database
    return config.Prefix + "default", nil
}

// TableName implements table sharding interface
func (r *RegionShardingRule) TableName(ctx context.Context, config gdb.ShardingTableConfig, value any) (string, error) {
    // Not implementing table sharding, return empty string
    return "", nil
}

func main() {
    // Create mapping from region to database
    regionMapping := map[string]string{
        "east":  "db_east",
        "west":  "db_west",
        "north": "db_north",
        "south": "db_south",
    }

    // Create region-based database sharding configuration
    shardingConfig := gdb.ShardingConfig{
        Schema: gdb.ShardingSchemaConfig{
            Enable: true,                                              // Enable database sharding
            Prefix: "db_",                                             // Database prefix
            Rule:   &RegionShardingRule{RegionMapping: regionMapping}, // Custom database sharding rule
        },
    }

    // Sharding value is the user's region
    region := "east"

    // Create sharded model
    db := g.DB()
    db.SetDebug(true)
    model := g.DB().Model("user").
        Sharding(shardingConfig).
        ShardingValue(region) // Use region as sharding value

    // Insert user data
    _, err := model.Data(g.Map{
        "id":     1001,
        "name":   "John",
        "region": region,
    }).Insert()
    if err != nil {
        panic(err)
    }
    // INSERT INTO `user`(`id`,`name`,`region`) VALUES(1001,'John','east')
    // Note: The operation is actually performed on the user table in the db_east database
}
```

### Combining Database and Table Sharding

`GoFrame ORM` supports configuring both database and table sharding simultaneously for more granular data partitioning:

```go
// Configure both database and table sharding
shardingConfig := gdb.ShardingConfig{
    Schema: gdb.ShardingSchemaConfig{
        Enable: true,     // Enable database sharding
        Prefix: "db_",    // Database prefix
        Rule: &gdb.DefaultShardingRule{
            SchemaCount: 2, // Number of database shards
        },
    },
    Table: gdb.ShardingTableConfig{
        Enable: true,     // Enable table sharding
        Prefix: "user_",  // Table prefix
        Rule: &gdb.DefaultShardingRule{
            TableCount: 4, // Number of table shards
        },
    },
}

// Use database and table sharding configuration
model := g.DB().Model("user").
    Sharding(shardingConfig).
    ShardingValue(10001)  // The same sharding value is used to calculate both database and table
```

## Using `Hook` for Dynamic Database Sharding

`GoFrame ORM` provides a powerful `Hook` mechanism that can be used to implement more flexible database sharding strategies:

```go
// Using Hook for dynamic database sharding
model := db.Model("user").Hook(gdb.HookHandler{
    Select: func(ctx context.Context, in *gdb.HookSelectInput) (result gdb.Result, err error) {
        // Dynamically determine database based on query conditions
        in.Schema = determineSchema(in.Model.GetWhere())
        return in.Next(ctx)
    },
    Insert: func(ctx context.Context, in *gdb.HookInsertInput) (result sql.Result, err error) {
        // Dynamically determine database based on insert data
        in.Schema = determineSchemaFromData(in.Data)
        return in.Next(ctx)
    },
    // Other Hook methods...
})
```

For more information about the `Hook` feature, please refer to the chapter: [ORM Chain Operations-Hook Feature](../ORM链式操作/ORM链式操作-Hook特性.md)

## Important Considerations

1. **Sharding Value Must Be Provided**: When database sharding is enabled, a sharding value must be provided via the `ShardingValue` method, otherwise an error will be returned
2. **Sharding Rule Must Be Set**: When database sharding is enabled, a sharding rule must be set, otherwise an error will be returned
3. **Cross-Database Transaction Limitations**: By default, transactions cannot span multiple databases; distributed transactions must be used to solve this
4. **Database Configuration Requirements**: All database shard nodes need to be correctly configured in the configuration file to ensure connectivity
5. **Cross-Database Query Limitations**: By default, queries are only routed to a single database shard; for cross-database queries, custom implementation is required

## Conclusion

The database sharding feature of `GoFrame ORM` provides a flexible and powerful horizontal database partitioning solution suitable for scenarios requiring large-scale data processing capabilities. By properly configuring database sharding strategies, you can significantly improve system performance and scalability. Whether using the built-in default database sharding rules or implementing custom sharding logic, `GoFrame` provides flexible API support.

In practical applications, it is recommended to choose appropriate database sharding strategies based on business characteristics and data distribution, and pay attention to handling cross-database queries and transaction issues.
