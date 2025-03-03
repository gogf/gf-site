---
slug: '/docs/core/gdb-config-funcs'
title: 'ORM Configuration - Methods'
sidebar_position: 1
hide_title: true
keywords: [GoFrame, ORM Usage Configuration, Database Node Management, Connection Property Configuration, Database Cluster, Relational Database, Read-Write Separation, Load Balancing, Configuration Management Features, GoFrame Framework]
description: "Configure the gdb database module in the GoFrame framework. It mainly covers data structure design, features, and specific configuration methods. By configuring ConfigNode and ConfigGroup, developers can flexibly manage multi-node database clusters to achieve efficient load balancing and read-write separation. Additionally, examples of default group and custom global configuration are provided."
---
:::tip
Below is an introduction to the configuration of database underlying management. If you are interested in the underlying configuration management of databases, you can continue reading the following sections.
:::
## Data Structure

The internal configuration management data structure of the `gdb` database management module is as follows:

`ConfigNode` is used to store database node information; `ConfigGroup` manages configuration groups consisting of multiple database nodes (typically, a group corresponds to a business database cluster); `Config` manages multiple `ConfigGroup` configuration groups.

**Configuration Management Features:**

1. Supports management of multi-node database clusters;
2. Each node can individually configure connection properties;
3. Uses a singleton pattern to manage database instance objects;
4. Supports database cluster group management and access to instantiated database operation objects according to group names;
5. Supports management of various relational databases, configurable through the `ConfigNode.Type` attribute;
6. Supports `Master-Slave` read-write separation, configurable through the `ConfigNode.Role` attribute;
7. Supports client load balancing management, configurable through the `ConfigNode.Weight` attribute, where a higher value indicates a higher priority;

```go
type Config      map[string]ConfigGroup // Database configuration object
type ConfigGroup []ConfigNode           // Database group configuration
// Database configuration item (one configuration item corresponds to multiple configuration items)
type ConfigNode  struct {
    Host             string        // Address
    Port             string        // Port
    User             string        // User
    Pass             string        // Password
    Name             string        // Database name
    Type             string        // Database type: mysql, sqlite, mssql, pgsql, oracle
    Link             string        // (Optional) Custom link information. When set, the above link fields (Host,Port,User,Pass,Name) will be invalid (this field is an extension feature)
    Extra            string        // (Optional) Additional feature configuration for different databases, defined by the underlying database driver
    Role             string        // (Optional, default is master) Database role, used for master-slave operation separation, at least one master is required, parameter value: master, slave
    Debug            bool          // (Optional) Enable debug mode
    Charset          string        // (Optional, default is utf8) Encoding, default is utf8
    Prefix           string        // (Optional) Table name prefix
    Weight           int           // (Optional) Weight for load balancing calculation. When there is only one node in the cluster, the weight is meaningless
    MaxIdleConnCount int           // (Optional) Maximum number of idle connections in the connection pool
    MaxOpenConnCount int           // (Optional) Maximum number of open connections in the connection pool
    MaxConnLifetime  time.Duration // (Optional, in seconds) Time duration for which a connection object can be reused
}
```

It is worth mentioning that the greatest **feature** of `gdb` configuration management is that (within the same process), all database cluster information is uniformly maintained by the same configuration management module, and **different businesses use different group names** for database cluster configuration and retrieval.

## Configuration Method

This is a native call to the `gdb` module to configure database management. Developers who want to control their database configuration management independently can refer to the following methods. If not needed, this section can be ignored.

API Documentation: [https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb)

```go
// Add a database node to a specified group
func AddConfigNode(group string, node ConfigNode)
// Add a configuration group to database configuration management (overwrites if the same name exists)
func AddConfigGroup(group string, nodes ConfigGroup)

// Add a database node to the default group (default is 'default', can be changed)
func AddDefaultConfigNode(node ConfigNode)
// Add a configuration group to the database configuration management (default group is 'default', can be changed)
func AddDefaultConfigGroup(nodes ConfigGroup)

// Set the default group name, which will be automatically read when obtaining the default database object
func SetDefaultGroup(groupName string)

// Set the database configuration to defined configuration information, overriding the original configuration
func SetConfig(c Config)
```

The default group means that if you do not specify a configuration group name when obtaining a database object, the `gdb` will default to reading the configuration group. For example, `gdb.NewByGroup()` can be used to obtain a database object of the default group. As a simple approach, we can use the `SetConfig` configuration management method of the `gdb` package to perform custom global database configuration, for example:

```go
gdb.SetConfig(gdb.Config {
    "default" : gdb.ConfigGroup {
        gdb.ConfigNode {
            Host     : "192.168.1.100",
            Port     : "3306",
            User     : "root",
            Pass     : "123456",
            Name     : "test",
            Type     : "mysql",
            Role     : "master",
            Weight   : 100,
        },
        gdb.ConfigNode {
            Host     : "192.168.1.101",
            Port     : "3306",
            User     : "root",
            Pass     : "123456",
            Name     : "test",
            Type     : "mysql",
            Role     : "slave",
            Weight   : 100,
        },
    },
    "user-center" : gdb.ConfigGroup {
        gdb.ConfigNode {
            Host     : "192.168.1.110",
            Port     : "3306",
            User     : "root",
            Pass     : "123456",
            Name     : "test",
            Type     : "mysql",
            Role     : "master",
            Weight   : 100,
        },
    },
})
```

Subsequently, we can use `gdb.NewByGroup("database group name")` to obtain a database operation object. This object is used for a series of subsequent database methods/chain operations.