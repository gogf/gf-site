---
slug: '/docs/core/gdb-config-file'
title: 'ORM Configuration - File'
sidebar_position: 0
hide_title: true
keywords: [GoFrame, GoFrame Framework, Database Configuration, Configuration File, ORM, Database Management, yaml Configuration, Data Format, Cluster Mode, Log Configuration]
description: "Manage database configurations using GoFrame framework's configuration component, including the recommended yaml format configuration file. Easily obtain singleton objects for database operations through the g object. Supports configurations in multiple data formats and simplified connection methods, enabling cluster mode and log output functionality."
---

We recommend using the configuration component to manage database configurations and the `g.DB("database group name")` method in the g object management module to obtain database operation objects. The database object will automatically read the corresponding configuration items from the configuration component and automatically initialize the singleton object for that database operation. The database configuration management functionality is implemented using a configuration management component (the configuration component adopts an interface design and uses a file system implementation by default), and also supports various data formats like `toml/yaml/json/xml/ini/properties`. The default and recommended configuration file data format is `yaml`.

## Simple Configuration
:::tip
From version `v2.2.0`, when using `link` for database configuration, the database component unifies the configuration formats for different database types to simplify configuration management.
:::
The simplified configuration is specified through the `link` configuration item, with the format as follows:

```text
type:username:password@protocol(address)[/dbname][?param1=value1&...&paramN=valueN]
```

That is:

```text
Type:Account:Password@Protocol(Address)/DatabaseName?FeatureConfiguration
```

Where:

- **DatabaseName** and **FeatureConfiguration** are optional parameters; other parameters are required.
- **Protocol** optional configurations are: `tcp/udp/unix/file`, commonly `tcp`.
- **FeatureConfiguration** is defined by the third-party driver implemented by the database type, check the third-party driver's official website for specifics. For example, for the `mysql` driver, the third-party driver used is: [https://github.com/go-sql-driver/mysql](https://github.com/go-sql-driver/mysql) supporting features like `multiStatements` and `loc`.

Example:

```yaml
database:
  default:
    link:  "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
  user:
    link:  "sqlite::@file(/var/data/db.sqlite3)"
  local:
    link:  "mysql:username:password@unix(/tmp/mysql.sock)/dbname"
```

`link` examples for different data types are as follows:

| Type | link Example | extra parameters |
| --- | --- | --- |
| `mysql` | ```mysql:root:12345678@tcp(127.0.0.1:3306)/test?loc=Local&parseTime=true``` | [mysql](https://github.com/go-sql-driver/mysql) |
| `mariadb` | ```mariadb:root:12345678@tcp(127.0.0.1:3306)/test?loc=Local&parseTime=true``` | [mysql](https://github.com/go-sql-driver/mysql) |
| `tidb` | ```tidb:root:12345678@tcp(127.0.0.1:3306)/test?loc=Local&parseTime=true``` | [mysql](https://github.com/go-sql-driver/mysql) |
| `pgsql` | ```pgsql:root:12345678@tcp(127.0.0.1:5432)/test``` | [pq](https://github.com/lib/pq) |
| `mssql` | ```mssql:root:12345678@tcp(127.0.0.1:1433)/test?encrypt=disable``` | [go-mssqldb](https://github.com/microsoft/go-mssqldb) |
| `sqlite` | ```sqlite::@file(/var/data/db.sqlite3)``` | pure go:[go-sqlite](https://github.com/glebarez/go-sqlite) <br /> 32bit-cgo:[go-sqlite3](https://github.com/mattn/go-sqlite3) |
| `oracle` | ```oracle:root:12345678@tcp(127.0.0.1:5432)/test``` | [go-ora](https://github.com/sijms/go-ora) |
| `clickhouse` | ```clickhouse:root:12345678@tcp(127.0.0.1:9000)/test``` | [clickhouse-go](https://github.com/ClickHouse/clickhouse-go) |
| `dm` | ```dm:root:12345678@tcp(127.0.0.1:5236)/test``` | [dm](https://gitee.com/chunanyong/dm) |

:::tip
For more database types supported by the framework, please refer to: [https://github.com/gogf/gf/tree/master/contrib/drivers](https://github.com/gogf/gf/tree/master/contrib/drivers)
:::
## Complete Configuration

The data format of the complete `config.yaml` database configuration item is as follows:

```yaml
database:
  default:                      # Group Name, customizable, default is default
    host: "127.0.0.1"           # Address
    port: "3306"                # Port
    user: "root"                # Username
    pass: "your_password"       # Password
    name: "your_database"       # Database Name
    type: "mysql"               # Database Type (e.g., mariadb/tidb/mysql/pgsql/mssql/sqlite/oracle/clickhouse/dm)
    link: ""                    # (Optional) Custom database link information, if this field is set, the above link fields (Host, Port, User, Pass, Name, Type) will be invalid
    extra: ""                   # (Optional) Additional feature configurations for different databases, defined by the underlying database driver, please see the specific database driver overview for what configurations are available
    role: "master"              # (Optional) Database master-slave role (master/slave), default is master. If not using application master-slave mechanism please do not configure or leave empty.
    debug: false                # (Optional) Enable debug mode
    prefix: "gf_"               # (Optional) Table name prefix
    dryRun: false               # (Optional) ORM Dry Run (read-only, no writing)
    charset: "utf8"             # (Optional) Database encoding (e.g., utf8mb4/utf8/gbk/gb2312), usually set to utf8mb4. Default is utf8.
    protocol: "tcp"             # (Optional) Database connection protocol, default is TCP
    weight: 100                 # (Optional) Load balancing weight, used for load balancing control, not using application layer load balancing mechanism please leave empty
    timezone: "Local"           # (Optional) Time zone configuration, e.g., Local
    namespace: ""               # (Optional) To support the catalog & schema distinction problem of some database services, the original schema represents the database name, while the NameSpace represents the schema of some database services
    maxIdle: 10                 # (Optional) Maximum number of idle connections in the connection pool (default 10)
    maxOpen: 100                # (Optional) Maximum number of open connections in the connection pool (default unlimited)
    maxLifetime: "30s"          # (Optional) Duration of reuse for connection objects (default 30 seconds)
    queryTimeout: "0"           # (Optional) Query statement timeout duration (default unlimited, also affected by ctx timeout). The value is in time.Parse supported formats, such as 30s, 1m.
    execTimeout: "0"            # (Optional) Write statement timeout duration (default unlimited, also affected by ctx timeout). The value is in time.Parse supported formats, such as 30s, 1m.
    tranTimeout: "0"            # (Optional) Transaction processing timeout duration (default unlimited, also affected by ctx timeout). The value is in time.Parse supported formats, such as 30s, 1m.
    prepareTimeout: "0"         # (Optional) Prepared SQL statement execution timeout duration (default unlimited, also affected by ctx timeout). The value is in time.Parse supported formats, such as 30s, 1m.
    createdAt: "created_at"     # (Optional) Field name for automatic creation time
    updatedAt: "updated_at"     # (Optional) Field name for automatic update time
    deletedAt: "deleted_at"     # (Optional) Field name for soft delete time
    timeMaintainDisabled: false # (Optional) Whether to completely disable the time update feature, when true CreatedAt/UpdatedAt/DeletedAt will all be invalid
```
:::note
When using this configuration method, **to ensure database security, the underlying by default does not support multi-line `SQL` statement execution**. For more configuration control, refer to the recommended simplified `link` configuration, and understand the function of each connection parameter in the simplified configuration, as well as the official additional configuration parameters for the corresponding driver.
:::
## Cluster Mode

`gdb` supports cluster mode configuration; each configuration item group in database configurations can be multiple nodes, supporting load balancing weight strategies, for example:

```yaml
database:
  default:
  - link: "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
    role: "master"
  - link: "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
    role: "slave"

  user:
  - link: "mysql:root:12345678@tcp(127.0.0.1:3306)/user"
    role: "master"
  - link: "mysql:root:12345678@tcp(127.0.0.1:3306)/user"
    role: "slave"
  - link: "mysql:root:12345678@tcp(127.0.0.1:3306)/user"
    role: "slave"
```

The database configuration example above includes two database groups `default` and `user`, where the `default` group contains one master and one slave, and the `user` group contains one master and two slaves. In the code, you can use `g.DB()` and `g.DB("user")` to get the corresponding database connection object.

## Log Configuration

`gdb` supports log output, using the `glog.Logger` object internally for log management, and it can be configured through configuration files. By default, `gdb` disables the `DEBUG` log output; to enable `DEBUG` messages, set the database's `debug` parameter to `true`. Below is a configuration file example:

```yaml
database:
  logger:
    path:    "/var/log/gf-app/sql"
    level:   "all"
    stdout:  true
  default:
    link:    "mysql:root:12345678@tcp(127.0.0.1:3306)/user_center"
    debug:   true
```

Where `database.logger` is the log configuration for `gdb`, which is a special configuration item. When this configuration does not exist, the default configuration of the logging component will be used.
For more details, refer to the [Logging - Configuration](../../../../docs/核心组件/日志组件/日志组件-配置管理.md) section.
:::warning
Please note: since the `ORM` uses a secure preprocessing execution method at the lower layer, the submitted `SQL` and parameters are actually separate. Therefore, the complete `SQL` recorded in logs is for reference and convenient manual reading only and is not the actual `SQL` submitted to the lower layer.
:::