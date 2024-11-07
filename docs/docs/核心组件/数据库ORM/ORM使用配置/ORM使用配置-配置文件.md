---
slug: '/docs/core/gdb-config-file'
title: 'ORM使用配置-配置文件'
sidebar_position: 0
hide_title: true
---

我们推荐使用配置组件来管理数据库配置，并使用 `g` 对象管理模块中的 `g.DB("数据库分组名称")` 方法获取数据库操作对象，数据库对象将会自动读取配置组件中的相应配置项，并自动初始化该数据库操作的单例对象。数据库配置管理功能使用的是配置管理组件实现（配置组件采用接口化设计默认使用文件系统实现），同样支持多种数据格式如： `toml/yaml/json/xml/ini/properties`。默认并且推荐的配置文件数据格式为 `yaml`。

## 简单配置
:::tip
从 `v2.2.0` 版本开始，使用 `link` 进行数据库配置时，数据库组件统一了不同数据库类型的配置格式，以简化配置管理。
:::
简化配置通过配置项 `link` 指定，格式如下：

```html
type:username:password@protocol(address)[/dbname][?param1=value1&...&paramN=valueN]
```

即：

```html
类型:账号:密码@协议(地址)/数据库名称?特性配置
```

其中：

- **数据库名称** 及 **特性配置** 为非必须参数，其他参数为必须参数。
- **协议** 可选配置为： `tcp/udp/file`，常见配置为 `tcp`
- **特性配置** 根据不同的数据库类型，由其底层实现的第三方驱动定义，具体需要参考第三方驱动官网。例如，针对 `mysql` 驱动而言，使用的第三方驱动为： [https://github.com/go-sql-driver/mysql](https://github.com/go-sql-driver/mysql) 支持的特性配置如 `multiStatements` 和 `loc` 等。

示例：

```yaml
database:
  default:
    link:  "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
  user:
    link:  "sqlite::@file(/var/data/db.sqlite3)"
```

不同数据类型对应的 `link` 示例如下：

| 类型 | link示例 | extra参数 |
| --- | --- | --- |
| `mysql` | ```mysql:root:12345678@tcp(127.0.0.1:3306)/test?loc=Local&parseTime=true``` | [mysql](https://github.com/go-sql-driver/mysql) |
| `mariadb` | ```mariadb:root:12345678@tcp(127.0.0.1:3306)/test?loc=Local&parseTime=true``` | [mysql](https://github.com/go-sql-driver/mysql) |
| `tidb` | ```tidb:root:12345678@tcp(127.0.0.1:3306)/test?loc=Local&parseTime=true``` | [mysql](https://github.com/go-sql-driver/mysql) |
| `pgsql` | ```pgsql:root:12345678@tcp(127.0.0.1:5432)/test``` | [pq](https://github.com/lib/pq) |
| `mssql` | ```mssql:root:12345678@tcp(127.0.0.1:1433)/test?encrypt=disable``` | [go-mssqldb](https://github.com/microsoft/go-mssqldb) |
| `sqlite` | ```sqlite::@file(/var/data/db.sqlite3)``` | pure go:[go-sqlite](https://github.com/glebarez/go-sqlite)32bit-cgo:[go-sqlite3](https://github.com/mattn/go-sqlite3) |
| `oracle` | ```oracle:root:12345678@tcp(127.0.0.1:5432)/test``` | [go-ora](https://github.com/sijms/go-ora) |
| `clickhouse` | ```clickhouse:root:12345678@tcp(127.0.0.1:9000)/test``` | [clickhouse-go](https://github.com/ClickHouse/clickhouse-go) |
| `dm` | ```dm:root:12345678@tcp(127.0.0.1:5236)/test``` | [dm](https://gitee.com/chunanyong/dm) |
:::tip
更多框架支持的数据库类型请参考： [https://github.com/gogf/gf/tree/master/contrib/drivers](https://github.com/gogf/gf/tree/master/contrib/drivers)
:::
## 完整配置

完整的 `config.yaml` 数据库配置项的数据格式形如下：

```yaml
database:
  分组名称:
    host:                  "地址"
    port:                  "端口"
    user:                  "账号"
    pass:                  "密码"
    name:                  "数据库名称"
    type:                  "数据库类型(如：mariadb/tidb/mysql/pgsql/mssql/sqlite/oracle/clickhouse/dm)"
    link:                  "(可选)自定义数据库链接信息，当该字段被设置值时，以上链接字段(Host,Port,User,Pass,Name)将失效，但是type必须有值"
    extra:                 "(可选)不同数据库的额外特性配置，由底层数据库driver定义"
    role:                  "(可选)数据库主从角色(master/slave)，不使用应用层的主从机制请均设置为master"
    debug:                 "(可选)开启调试模式"
    prefix:                "(可选)表名前缀"
    dryRun:                "(可选)ORM空跑(只读不写)"
    charset:               "(可选)数据库编码(如: utf8/gbk/gb2312)，一般设置为utf8"
	protocol:              "(可选)数据库连接协议，默认为TCP"
    weight:                "(可选)负载均衡权重，用于负载均衡控制，不使用应用层的负载均衡机制请置空"
    timezone:              "(可选)时区配置，例如:Local"
    namespace:             "(可选)用以支持个别数据库服务Catalog&Schema区分的问题，原有的Schema代表数据库名称，而NameSpace代表个别数据库服务的Schema"
    maxIdle:               "(可选)连接池最大闲置的连接数(默认10)"
    maxOpen:               "(可选)连接池最大打开的连接数(默认无限制)"
    maxLifetime:           "(可选)连接对象可重复使用的时间长度(默认30秒)"
	queryTimeout:          "(可选)查询语句超时时长(默认无限制，注意ctx的超时时间设置)"
	execTimeout:           "(可选)写入语句超时时长(默认无限制，注意ctx的超时时间设置)"
	tranTimeout:           "(可选)事务处理超时时长(默认无限制，注意ctx的超时时间设置)"
	prepareTimeout:        "(可选)预准备SQL语句执行超时时长(默认无限制，注意ctx的超时时间设置)"
    createdAt:             "(可选)自动创建时间字段名称"
    updatedAt:             "(可选)自动更新时间字段名称"
    deletedAt:             "(可选)软删除时间字段名称"
    timeMaintainDisabled:  "(可选)是否完全关闭时间更新特性，true时CreatedAt/UpdatedAt/DeletedAt都将失效"
```

完整的数据库配置项示例( `YAML`)：

```yaml
database:
  default:
    host:          "127.0.0.1"
    port:          "3306"
    user:          "root"
    pass:          "12345678"
    name:          "test"
    type:          "mysql"
    extra:         "parseTime=true"
    role:          "master"
    debug:         "true"
    dryrun:        0
    weight:        "100"
    prefix:        "gf_"
    charset:       "utf8"
    timezone:      "Local"
    maxIdle:       "10"
    maxOpen:       "100"
    maxLifetime:   "30s"
 	protocol
```
:::note
使用该配置方式时， **为保证数据库安全，默认底层不支持多行 `SQL` 语句执行**。为了得到更多配置项控制，请参考推荐的简化配置，同时建议您务必了解清楚简化配置项中每个连接参数的功能作用。
:::
## 集群模式

`gdb` 的配置支持集群模式，数据库配置中每一项分组配置均可以是多个节点，支持负载均衡权重策略，例如：

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

以上数据库配置示例中包含两个数据库分组 `default` 和 `user`，其中 `default` 分组包含一主一从， `user` 分组包含一主两从。在代码中可以通过 `g.DB()` 和 `g.DB("user")` 获取对应的数据库连接对象。

## 日志配置

`gdb` 支持日志输出，内部使用的是 `glog.Logger` 对象实现日志管理，并且可以通过配置文件对日志对象进行配置。默认情况下 `gdb` 关闭了 `DEBUG` 日志输出，如果需要打开 `DEBUG` 信息需要将数据库的 `debug` 参数设置为 `true`。以下是为一个配置文件示例：

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

其中 `database.logger` 即为 `gdb` 的日志配置，当该配置不存在时，将会使用日志组件的默认配置，
具体请参考 [日志组件-配置管理](../../../../docs/核心组件/日志组件/日志组件-配置管理.md) 章节。
:::warning
需要注意哦：由于 `ORM` 底层都是采用安全的预处理执行方式，提交到底层的 `SQL` 与参数其实是分开的，因此日志中记录的完整 `SQL` 仅作参考方便人工阅读，并不是真正提交到底层的 `SQL` 语句。
:::
