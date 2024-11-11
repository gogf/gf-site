---
slug: '/docs/cli/gen-pbentity'
title: 'Data Table PB - Gen Pbentity'
sidebar_position: 5
hide_title: true
---
:::tip
This feature is available starting from version `v2.4`.
:::
## Basic Introduction

This command is used to read from the configured database and generate corresponding `proto` data structure files based on the data tables.

## Command Usage

```bash
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

### Tip

If you are using the project engineering scaffold recommended by the framework and have the `make` tool installed on your system, you can also use the `make pbentity` shortcut command.

Parameter Description:

| Name | Default Value | Meaning | Example |
| --- | --- | --- | --- |
| `gf.gen.pbentity` |  | Code generation configuration item, can have multiple configuration items to form an array, supports multiple database generations. Different databases can set different generation rules, such as generating to different locations or files. | - |
| `path` | `manifest/protobuf/pbentity` | The **directory** address for storing generated `proto` files. | `protobuf/pbentity` |
| `package` | Automatically detected from `go.mod` | The `go_package` path in the generated `proto` files and automatically detects the `package` name | - |
| `link` |  | Divided into two parts, the first part indicates the type of database you are connecting to, such as `mysql`, `postgresql`, etc., and the second part is the `dsn` information for connecting to the database. For details, please refer to the [ORM Usage Configuration](/docs/core/gdb-config) section. | - |
| `prefix` |  | The prefix for generating database objects and files to distinguish between different databases or the same table names in different databases, preventing data table name coverage. | `order_`<br />`user_` |
| `removePrefix` |  | Remove the specified prefix name of the data table. Multiple prefixes are separated by `,`. | `gf_` |
| `removeFieldPrefix` |  | Remove the specified prefix name of the field. Multiple prefixes are separated by `,`. | `f_` |
| `tables` |  | Specify the data tables in the current database that need to perform code generation. If empty, it means all tables in the database will be generated. | `user, user_detail` |
| `nameCase` | `CamelLower` | The format of the generated `message` attribute field names. Parameters can be: `Camel`, `CamelLower`, `Snake`, `SnakeScreaming`, `SnakeFirstUpper`, `Kebab`, `KebabScreaming`. For details, please refer to the naming line help example. | `Snake` |
| `option` |  | Additional `proto option` configuration list |  |

## Differences Between `gen dao`'s `entity` and `gen pbentity`

### Similarities

- Both generate `entity` content, which is generating corresponding `Golang` entity objects from data collections (database tables) for easy use in the program. Both are one-way generations, meaning they can only generate entity object code from data collections to ensure the synchronization of entity object data structures.
- The `entity` data entity objects generated by `gen dao` are通用的 for the `Golang` language, but currently mainly serve `HTTP` protocols. In `HTTP` services, the `entity` generated by `gen dao`, although under the `internal` directory, will eventually also serve the client as part of the `HTTP API` response.

### Differences

- In `GRPC` services, the `entity` data structures generated by `gen dao` cannot be used for `GRPC` interfaces because `GRPC` data structures need to be defined using `proto` files. Therefore, in `GRPC` services, the `pbentity proto` files generated by `gen pbentity` are required. At the same time, in `GRPC` microservice development, the `entity` generated by `gen dao` no longer has a specific role.
- The name `pbentity` instead of `entity` is to prevent conflicts with the `entity` meaning in `gen dao`.