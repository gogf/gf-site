---
title: 'gen model'
sidebar_position: 1
hide_title: true
---

`gen model` 命令生成的 `model` 采用包管理方式维护数据表操作及数据结构定义，一张数据表一个包。

未来不再推荐这种方式，而是推荐使用 `dao` 的使用方式，具体请参考 [gen dao(重点)](gen%20dao-重点.md) 命令及 DAO-基本痛点及改进。

`gen` 命令用以自动化从数据库直接生成采用了 `Active Record` 设计模式的模型文件。该命令将会根据数据表名生成对应的目录，该目录名称即数据表包名。目录下自动生成3个文件：

1. `数据表名.go` 自定义文件，开发者可以自由定义填充的代码文件，仅会生成一次，每一次模型生成不会覆盖。
2. `数据表名_entity.go` 表结构文件，根据数据表结构生成的结构体定义文件，包含字段注释。数据表在外部变更后，可使用 `gen` 命令重复生成更新该文件。
3. `数据表名_model.go` 表模型文件，为数据表提供了许多便捷的 `CRUD` 操作方法，并可直接查询返回该表的结构体对象。数据表在外部变更后，可使用 `gen` 命令重复生成更新该文件。


**使用方式：**

进入项目根目录执行 `gf gen model` 即可。以下为命令行帮助信息。

```bash
$ gf gen model -h
USAGE
    gf gen model [OPTION]

OPTION
    -/--path             directory path for generated files.
    -l, --link           database configuration, the same as the ORM configuration of GoFrame.
    -t, --tables         generate models only for given tables, multiple table names separated with ','
    -g, --group          specifying the configuration group name for database,
                         it's not necessary and the default value is "default"
    -c, --config         used to specify the configuration file for database, it's commonly not necessary.
                         If "-l" is not passed, it will search "./config.toml" and "./config/config.toml"
                         in current working directory in default.
    -p, --prefix         add prefix for all table of specified link/database tables.
    -r, --removePrefix   remove specified prefix of the table, multiple prefix separated with ','
    -m, --mod            module name for generated golang file imports.

CONFIGURATION SUPPORT
    Options are also supported by configuration file. The configuration node name is "gf.gen", which also supports
    multiple databases, for example:
    [gfcli]
        [[gfcli.gen.model]]
            link   = "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
            tables = "order,products"
        [[gfcli.gen.model]]
            link   = "mysql:root:12345678@tcp(127.0.0.1:3306)/primary"
            path   = "./my-app"
            prefix = "primary_"
            tables = "user, userDetail"

EXAMPLES
    gf gen model
    gf gen model -l "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
    gf gen model -path ./model -c config.yaml -g user-center -t user,user_detail,user_login
    gf gen model -r user_

DESCRIPTION
    The "gen" command is designed for multiple generating purposes.
    It's currently supporting generating go files for ORM models.
```