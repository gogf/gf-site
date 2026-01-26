---
slug: '/docs/core/gdb-sharding-table'
title: 'ORM Sharding - Table Sharding'
sidebar_position: 1000
hide_title: true
keywords: ['Table Sharding', 'Horizontal Sharding', 'Table Partitioning', 'sharding', 'table sharding']
description: 'GoFrame ORM Table Sharding provides a simple and efficient table partitioning feature, supporting custom sharding rules to easily handle large data volume scenarios.'
---

## Basic Introduction

`ORM` Table Sharding is a data partitioning solution provided by `GoFrame ORM` that allows developers to distribute data from a logical table across multiple physical tables. Table sharding is an effective approach to address issues with large table data volumes. By distributing data across different tables, query performance and system scalability can be significantly improved.

## Advantages of Table Sharding

1. **Improved Query Performance**: Reduces single table data volume, decreases index depth, and improves query efficiency
2. **Optimized Write Performance**: Distributes write pressure, reduces lock contention, and increases concurrent write capacity
3. **Simplified Maintenance**: Facilitates data backup, recovery, and archiving by shard
4. **Overcomes Single Table Data Limitations**: Avoids database single table data volume limits
5. **Increased Availability**: Failure of a single shard does not affect the entire system

## Application Scenarios

1. **Large-Scale User Systems**: Sharding by user ID to handle massive user data
2. **Order Systems**: Sharding by order ID or time to process high-concurrency order writes and queries
3. **Logging Systems**: Sharding by time for easier log storage and cleanup
4. **IoT Data**: Sharding by device ID or time to handle massive sensor data
5. **Social Media**: Sharding by user ID to handle large volumes of user-generated social data

## Basic Usage

`GoFrame ORM` provides simple and easy-to-use table sharding APIs through the `Sharding` and `ShardingValue` methods.

### Sharding Configuration

```go
// Create sharding configuration
shardingConfig := gdb.ShardingConfig{
    Table: gdb.ShardingTableConfig{
        Enable: true,      // Enable table sharding
        Prefix: "user_",   // Table prefix
        Rule: &gdb.DefaultShardingRule{
            TableCount: 4, // Number of sharded tables
        },
    },
}

// Use sharding configuration and sharding value
model := db.Model("user").
    Sharding(shardingConfig).
    ShardingValue(10001) // Sharding value, used to calculate which table the data routes to, typically the primary key ID value
```

### Default Sharding Rule

`GoFrame ORM` includes a built-in default sharding rule `DefaultShardingRule`, which determines the table name based on the hash modulo of the sharding value:

```go
// Default sharding rule implementation
func (r *DefaultShardingRule) TableName(ctx context.Context, config ShardingTableConfig, value any) (string, error) {
    if r.TableCount == 0 {
        return "", gerror.NewCode(
            gcode.CodeInvalidParameter, "table count should not be 0 using DefaultShardingRule when table sharding enabled",
        )
    }
    hashValue, err := getHashValue(value)
    if err != nil {
        return "", err
    }
    tableIndex := hashValue % uint64(r.TableCount)
    return fmt.Sprintf("%s%d", config.Prefix, tableIndex), nil
}
```

## Complete Example

First, using `MySQL` database as an example, we need to create the corresponding database table structure. For table sharding examples, we need to create multiple physical tables with the same structure:

```sql
CREATE TABLE `user_0` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user_1` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user_2` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user_3` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Basic CRUD Operations

The following example demonstrates how to perform basic `CRUD` operations in a sharded table environment:

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
    // Create sharding configuration
    shardingConfig := gdb.ShardingConfig{
        Table: gdb.ShardingTableConfig{
            Enable: true,    // Enable table sharding
            Prefix: "user_", // Table prefix
            Rule: &gdb.DefaultShardingRule{
                TableCount: 4, // Number of sharded tables
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
    // INSERT INTO `user_1`(`id`,`name`) VALUES(1,'John')

    // Query data
    var result User
    err = model.Where("id", user.Id).Scan(&result)
    if err != nil {
        panic(err)
    }
    // SELECT * FROM `user_1` WHERE `id`=1 LIMIT 1
    g.DumpJson(result)

    // Update data
    _, err = model.Data(g.Map{"name": "John Doe"}).
        Where("id", user.Id).
        Update()
    if err != nil {
        panic(err)
    }
    // UPDATE `user_1` SET `name`='John Doe' WHERE `id`=1

    // Delete data
    _, err = model.Where("id", user.Id).Delete()
    if err != nil {
        panic(err)
    }
    // DELETE FROM `user_1` WHERE `id`=1
}
```

### Custom Sharding Rules

You can create custom sharding rules by implementing the `ShardingRule` interface:

```go
package main

import (
    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"

    "context"
    "fmt"
    "time"

    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gtime"
)

// TimeShardingRule implements time-based table sharding
type TimeShardingRule struct{}

// TableName implements monthly table sharding rule
func (r *TimeShardingRule) TableName(ctx context.Context, config gdb.ShardingTableConfig, value any) (string, error) {
    // Convert sharding value to time
    t, ok := value.(time.Time)
    if !ok {
        return "", fmt.Errorf("sharding value must be time.Time for TimeShardingRule")
    }

    // Generate table name by year and month, e.g., log_202501
    return fmt.Sprintf("%s%04d%02d", config.Prefix, t.Year(), t.Month()), nil
}

// SchemaName implements database sharding interface
func (r *TimeShardingRule) SchemaName(ctx context.Context, config gdb.ShardingSchemaConfig, value any) (string, error) {
    // Not implementing database sharding, return empty string
    return "", nil
}

func main() {
    // Create time-based table sharding configuration
    shardingConfig := gdb.ShardingConfig{
        Table: gdb.ShardingTableConfig{
            Enable: true,                // Enable table sharding
            Prefix: "log_",              // Table prefix
            Rule:   &TimeShardingRule{}, // Custom sharding rule
        },
    }

    // Current time as sharding value
    now := gtime.Now().Time

    // Create sharded model
    db := g.DB()
    db.SetDebug(true)
    model := db.Model("log").
        Sharding(shardingConfig).
        ShardingValue(now) // Use time as sharding value

    // Insert log data
    _, err := model.Data(g.Map{
        "content": "System startup",
        "level":   "info",
        "time":    now,
    }).Insert()
    if err != nil {
        panic(err)
    }
    // INSERT INTO `log_202503`(`content`,`level`,`time`) VALUES('System startup','info','2025-03-13 12:02:54')
}
```

## Important Considerations

1. **Sharding Value Must Be Provided**: When table sharding is enabled, a sharding value must be provided via the `ShardingValue` method, otherwise an error will be returned
2. **Sharding Rule Must Be Set**: When table sharding is enabled, a sharding rule must be set, otherwise an error will be returned
3. **Cross-Shard Query Limitations**: By default, queries are only routed to a single sharded table; for cross-shard queries, custom implementation is required
4. **Transaction Limitations**: Table sharding transactions can only be performed within the same database; cross-database table sharding transactions require distributed transactions
5. **Table Structure Consistency**: All sharded tables should maintain consistent structure

## Advanced Usage

### Using `Hook` for Dynamic Table Sharding

`GoFrame ORM` provides a powerful `Hook` mechanism that can be used to implement more flexible sharding strategies:

```go
// Using Hook for dynamic table sharding
model := db.Model("log").Hook(gdb.HookHandler{
    Select: func(ctx context.Context, in *gdb.HookSelectInput) (result gdb.Result, err error) {
        // Dynamically determine table name based on query conditions
        in.Table = "log_" + determineTableSuffix(in.Model.GetWhere())
        return in.Next(ctx)
    },
    Insert: func(ctx context.Context, in *gdb.HookInsertInput) (result sql.Result, err error) {
        // Dynamically determine table name based on insert data
        in.Table = "log_" + determineTableSuffixFromData(in.Data)
        return in.Next(ctx)
    },
    // Other Hook methods...
})
```

For more information about the `Hook` feature, please refer to the chapter: [ORM Chain Operations-Hook Feature](../ORM链式操作/ORM链式操作-Hook特性.md)

## Conclusion

The table sharding feature of `GoFrame ORM` provides a simple yet powerful data partitioning solution suitable for handling large-scale data scenarios. By properly configuring sharding strategies, you can significantly improve system performance and scalability. Whether using the built-in default sharding rules or implementing custom sharding logic, `GoFrame` provides flexible API support.

In practical applications, it is recommended to choose appropriate sharding keys and strategies based on business characteristics, and pay attention to handling cross-shard queries and transaction issues.
