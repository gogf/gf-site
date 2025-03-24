---
slug: '/docs/cli/gen-pbentity'
title: 'DB Table To Protobuf'
sidebar_position: 5
hide_title: true
keywords: [GoFrame, Golang entity object, proto data structure, GRPC services, database configuration, GF command line tools, data table generation, entity file generation, pbentity, naming format]
description: "Use the GoFrame framework's command line tool gf to generate proto data structure files pbentity based on database tables. Includes details on command usage, option configuration, and explanations, as well as the differences from the entity files generated in the gen dao module. Applicable for generating data entity structures for HTTP and GRPC services, supporting configuration of generation rules for multiple databases."
---

:::tip
This feature is available starting from version `v2.4`.
:::
## Introduction

This command is used to read the configured database and generate the corresponding `proto` data structure files based on the data tables.

## Command Usage

```text
$ gf gen pbentity -h
USAGE
    gf gen pbentity [OPTION]

OPTION
    -p, --path                 directory path for generated files storing
    -k, --package              package path for all entity proto files
    -l, --link                 database configuration, the same as the ORM configuration of GoFrame
    -t, --tables               generate models only for given tables, multiple table names separated with ','
    -f, --prefix               add specified prefix for all entity names and entity proto files
    -r, --removePrefix         remove specified prefix of the table, multiple prefix separated with ','
    -rf, --removeFieldPrefix   remove specified prefix of the field, multiple prefix separated with ','
    -n, --nameCase             case for message attribute names, default is "Camel":
                               | Case            | Example            |
                               |---------------- |--------------------|
                               | Camel           | AnyKindOfString    |
                               | CamelLower      | anyKindOfString    | default
                               | Snake           | any_kind_of_string |
                               | SnakeScreaming  | ANY_KIND_OF_STRING |
                               | SnakeFirstUpper | rgb_code_md5       |
                               | Kebab           | any-kind-of-string |
                               | KebabScreaming  | ANY-KIND-OF-STRING |
    -j, --jsonCase             case for message json tag, cases are the same as "nameCase", default "CamelLower".
                               set it to "none" to ignore json tag generating.
    -o, --option               extra protobuf options
    -h, --help                 more information about this command

EXAMPLE
    gf gen pbentity
    gf gen pbentity -l "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
    gf gen pbentity -p ./protocol/demos/entity -t user,user_detail,user_login
    gf gen pbentity -r user_ -k github.com/gogf/gf/example/protobuf
    gf gen pbentity -r user_

CONFIGURATION SUPPORT
    Options are also supported by configuration file.
    It's suggested using configuration file instead of command line arguments making producing.
    The configuration node name is "gf.gen.pbentity", which also supports multiple databases, for example(config.yaml):
    gfcli:
      gen:
      - pbentity:
            link:    "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
            path:    "protocol/demos/entity"
            tables:  "order,products"
            package: "demos"
      - pbentity:
            link:    "mysql:root:12345678@tcp(127.0.0.1:3306)/primary"
            path:    "protocol/demos/entity"
            prefix:  "primary_"
            tables:  "user, userDetail"
            package: "demos"
            option:  |
              option go_package    = "protobuf/demos";
              option java_package  = "protobuf/demos";
              option php_namespace = "protobuf/demos";
```
:::tip
If you are using the framework's recommended project scaffolding and have `make` installed, you can also use the `make pbentity` shortcut command.
:::
Parameter Description:

| Name | Default Value | Meaning | Example |
| --- | --- | --- | --- |
| `gfcli.gen.pbentity` |  | Code generation configuration items, which can contain multiple configuration items as an array, supporting multiple databases. Different databases can set different generation rules, such as generating to different locations or files. | - |
| `path` | `manifest/protobuf/pbentity` | The directory address for storing the generated `proto` files. | `protobuf/pbentity` |
| `package` | Automatically recognize `go.mod` | The `go_package` path in the generated `proto` file, and automatically recognizes the `package` name | - |
| `link` |  | Consists of two parts, the first indicating the type of database you are connecting to such as `mysql`, `postgresql`, etc., and the second being the `dsn` information for connecting to the database. Refer to the chapter [ORM - Configuration](../../核心组件/数据库ORM/ORM使用配置/ORM使用配置.md) for details. | - |
| `prefix` |  | The prefix for generating database objects and files, to distinguish between different databases or identical table names in different databases, preventing table name conflicts. | `order_`<br />`user_` |
| `removePrefix` |  | Removes the specified prefix from the table names. Multiple prefixes are separated by commas. | `gf_` |
| `removeFieldPrefix` |  | Removes the specified prefix from field names. Multiple prefixes are separated by commas. | `f_` |
| `tables` |  | Designates tables in the current database for code generation. If empty, all tables in the database will be generated. | `user, user_detail` |
| `nameCase` | `CamelLower` | The name format for generated `message` attribute fields. Optional parameters are: `Camel`, `CamelLower`, `Snake`, `SnakeScreaming`, `SnakeFirstUpper`, `Kebab`, `KebabScreaming`. Refer to the command line help example for details. | `Snake` |
| `option` |  | Additional `proto option` configuration list. |  |

## Differences from `gen dao`'s `entity`

### Similarities

- Both generate `entity` content, i.e., creating corresponding `Golang` entity objects from data collections (database tables) for easier program use. Both are one-way generation, meaning they can only generate entity object code from data collections, ensuring synchronization of entity object data structures.
- The `entity` data entity objects generated by `gen dao` are primarily used for `HTTP` protocol services, although they are generic for the `Golang` language. In `HTTP` services, the `entity` generated in `gen dao`, although under the `internal` directory, will ultimately be part of the `HTTP API` response serving the client.

### Differences

- In `GRPC` services, the `entity` data structures generated by `gen dao` cannot be used by `GRPC` interfaces because `GRPC` data structures need to be defined using `proto` files. Therefore, in `GRPC` services, the `pbentity proto` files generated by `gen pbentity` are needed. Moreover, in `GRPC` microservice development, the `entity` generated by `gen dao` no longer has specific functions.
- The name `pbentity` is used instead of `entity` to avoid conflicts with the `entity` in `gen dao`.