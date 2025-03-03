---
slug: '/docs/cli/gen-dao'
title: 'Dao/Do/Entity Generating'
sidebar_position: 1
hide_title: true
keywords: [GoFrame,gen dao,data access object,data transformation model,Go code generation,configuration file management,command line tool,database connection,ORM configuration,project engineering specification]
description: "Usage and parameter configuration of the gen dao command in the GoFrame framework. The gen dao command is a key tool for generating data access objects, data transformation models, and entity data models, supporting detailed configuration through command line parameters and configuration files, applicable to various database types. By flexibly using command options, different project code generation requirements can be met, ensuring the implementation of engineering design specifications."
---

The `gen dao` command is the most frequently used command in the `CLI` and is crucial for the accurate implementation of the framework’s engineering specifications. This command is used to generate `dao` data access objects, `do` data transformation models, and `entity` instance data model `Go` code files. Due to the numerous parameters and options for this command, it is recommended to manage generation rules using configuration files.
:::tip
For an introduction to the framework's project engineering specifications, please see the section [Code Layering](../../框架设计/工程开发设计/代码分层设计.md).
:::
## Usage

In most scenarios, execute `gf gen dao` in the project's root directory. Below is the command line help information.

```text
$ gf gen dao -h
USAGE
    gf gen dao [OPTION]

OPTION
    -p, --path                  directory path for generated files
    -l, --link                  database configuration, the same as the ORM configuration of GoFrame
    -t, --tables                generate models only for given tables, multiple table names separated with ','
    -x, --tablesEx              generate models excluding given tables, multiple table names separated with ','
    -g, --group                 specifying the configuration group name of database for generated ORM instance,
                                it's not necessary and the default value is "default"
    -f, --prefix                add prefix for all table of specified link/database tables
    -r, --removePrefix          remove specified prefix of the table, multiple prefix separated with ','
    -rf, --removeFieldPrefix    remove specified prefix of the field, multiple prefix separated with ','
    -j, --jsonCase              generated json tag case for model struct, cases are as follows:
                                | Case            | Example            |
                                |---------------- |--------------------|
                                | Camel           | AnyKindOfString    |
                                | CamelLower      | anyKindOfString    | default
                                | Snake           | any_kind_of_string |
                                | SnakeScreaming  | ANY_KIND_OF_STRING |
                                | SnakeFirstUpper | rgb_code_md5       |
                                | Kebab           | any-kind-of-string |
                                | KebabScreaming  | ANY-KIND-OF-STRING |
    -i, --importPrefix          custom import prefix for generated go files
    -d, --daoPath               directory path for storing generated dao files under path
    -o, --doPath                directory path for storing generated do files under path
    -e, --entityPath            directory path for storing generated entity files under path
    -t1, --tplDaoIndexPath      template file path for dao index file
    -t2, --tplDaoInternalPath   template file path for dao internal file
    -t3, --tplDaoDoPath         template file path for dao do file
    -t4, --tplDaoEntityPath     template file path for dao entity file
    -s, --stdTime               use time.Time from stdlib instead of gtime.Time for generated time/date fields of tables
    -w, --withTime              add created time for auto produced go files
    -n, --gJsonSupport          use gJsonSupport to use *gjson.Json instead of string for generated json fields of
                                tables
    -v, --overwriteDao          overwrite all dao files both inside/outside internal folder
    -c, --descriptionTag        add comment to description tag for each field
    -k, --noJsonTag             no json tag will be added for each field
    -m, --noModelComment        no model comment will be added for each field
    -a, --clear                 delete all generated go files that do not exist in database
    -y, --typeMapping           custom local type mapping for generated struct attributes relevant to fields of table
    -fm, --fieldMapping         custom local type mapping for generated struct attributes relevant to specific fields of
                                table
    -/--genItems                
    -h, --help                  more information about this command

EXAMPLE
    gf gen dao
    gf gen dao -l "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
    gf gen dao -p ./model -g user-center -t user,user_detail,user_login
    gf gen dao -r user_

CONFIGURATION SUPPORT
    Options are also supported by configuration file.
    It's suggested using configuration file instead of command line arguments making producing.
    The configuration node name is "gfcli.gen.dao", which also supports multiple databases, for example(config.yaml):
    gfcli:
      gen:
        dao:
        - link:     "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
          tables:   "order,products"
          jsonCase: "CamelLower"
        - link:   "mysql:root:12345678@tcp(127.0.0.1:3306)/primary"
          path:   "./my-app"
          prefix: "primary_"
          tables: "user, userDetail"
          typeMapping:
            decimal:
              type:   decimal.Decimal
              import: github.com/shopspring/decimal
            numeric:
              type: string
          fieldMapping:
            table_name.field_name:
              type:   decimal.Decimal
              import: github.com/shopspring/decimal
```
:::tip
If using the framework-recommended project engineering scaffold and the system has the `make` tool installed, the shortcut command `make dao` can also be used.
:::
## Configuration Example

File configuration example:

```yaml title="hack/config.yaml"
gfcli:
  gen:
    dao:
    - link:     "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
      tables:   "order,products"
      jsonCase: "CamelLower"

    - link:   "mysql:root:12345678@tcp(127.0.0.1:3306)/primary"
      path:   "./my-app"
      prefix: "primary_"
      tables: "user, userDetail"

    # sqlite requires manual compilation of gf with sqlite driver, modify the import path file (gf\cmd\gf\internal\cmd\cmd_gen_dao.go) to uncomment for sqlite driver, gcc is required for sqlite driver
    - link: "sqlite:./file.db"
```

## Parameter Description

| Name | Default Value | Meaning | Example |
| --- | --- | --- | --- |
| `gfcli.gen.dao` |  | `dao` code generation configuration items, can have multiple configuration items to form an array, supporting multiple database generation. Different databases can set different generation rules, for example, they can be generated to different locations or files. | - |
| `link`|  | **Required Parameter**. It consists of two parts, the first part represents your connected database type `mysql`, `postgresql`, etc., while the second part is the `dsn` information for the connection. For specific details, please refer to the section [ORM - Configuration](../../核心组件/数据库ORM/ORM使用配置/ORM使用配置.md). | - |
| `path` | `internal` | The storage **directory** address for generated `dao` and `model` files. | `./app` |
| `group` | `default` | Database group name in the database configuration. Only one name can be configured. The group name in the database configuration file is often not modified once determined. | `default`<br />`order`<br />`user` |
| `prefix` |  | Prefixes for the generated database objects and files to distinguish between different databases or the same table names in different databases, to prevent data table name overwriting. | `order_`<br />`user_` |
| `removePrefix` |  | Removes specified prefix names from data tables. Multiple prefixes are separated by commas. | `gf_` |
| `removeFieldPrefix` |  | Removes specified prefix names from field names. Multiple prefixes are separated by commas. | `f_` |
| `tables` |  | Specifies which tables in the current database need code generation. If empty, all tables in the database will be generated. | `user, user_detail` |
| `tablesEx` |  | `Tables Excluding`, specifies which tables in the current database are excluded from code generation. | `product, order` |
| `jsonCase` | `CamelLower` | Specifies the naming rules for `json` tags in generated data entity objects in `model`, the parameter is case-insensitive. Optional parameters: `Camel`, `CamelLower`, `Snake`, `SnakeScreaming`, `SnakeFirstUpper`, `Kebab`, `KebabScreaming`. For a detailed introduction, please refer to the command line help example. | `Snake` |
| `stdTime` | `false` | When a data table field type is a time type, the generated property type uses the standard library `time.Time` instead of the framework's `*gtime.Time` type. | `true` |
| `withTime` | `false` | Adds generation time comments to each automatically generated code file |  |
| `gJsonSupport` | `false` | When a data table field type is `JSON`, the generated property type uses `*gjson.Json` type. | `true` |
| `overwriteDao` | `false` | Whether to regenerate and overwrite files outside the `dao/internal` directory for each `dao` code generation. Note that files outside the `dao/internal` directory may have been custom extended by the developer, and overwriting may introduce risk. | `true` |
| `importPrefix` | Automatically detected via `go.mod` | Used to specify the `import` path prefix for generated `Go` files. Especially necessary when the `gen dao` command is not used at the project's root directory or when intending to generate code files to a custom directory. | `github.com/gogf/gf` |
| `descriptionTag` | `false` | Specifies whether to add a `description` tag with the schema for each data model struct field, where the content is the corresponding data table field comment. | `true` |
| `noJsonTag` | `false` | The generated data model does not include json tags for fields |  |
| `noModelComment` | `false` | Specifies whether to disable automatic generation of comments for model struct fields, where the content is derived from the data table field comments. | `true` |
| `clear` | `false` | Automatically deletes local `dao/do/entity` code files that do not correspond to any data tables in the database. Use this parameter with caution! |  |
| `daoPath` | `dao` | Directory for storing generated `DAO` files |  |
| `doPath` | `model/do` | Directory for storing generated `DO` files |  |
| `entityPath` | `model/entity` | Directory for storing generated `Entity` files |  |
| `tplDaoIndexPath` |  | Custom `DAO Index` code generation template file path, please refer to the source code for use |  |
| `tplDaoInternalPath` |  | Custom `DAO Internal` code generation template file path, please refer to the source code for use |  |
| `tplDaoDoPath` |  | Custom `DO` code generation template file path, please refer to the source code for use |  |
| `tplDaoEntityPath` |  | Custom `Entity` code generation template file path, please refer to the source code for use |  |
| `typeMapping` |  | **Supported from version v2.5**. Used to customize the mapping of data table fields types to corresponding types in generated Go files. |  |
| `fieldMapping` |   | **Supported from version v2.8**. Used to customize the mapping of specific data table fields to corresponding field types in generated Go files.|    | 

### Parameter: `typeMapping`

The `typeMapping` parameter supports configuring the database field types corresponding to `Go` data types, and the default value is:
```yaml
decimal:
  type: float64
money:
  type: float64
numeric:
  type: float64
smallmoney:
  type: float64
```
This configuration supports importing third-party packages via the `import` configuration item, for example:
```yaml
decimal:
  type:   decimal.Decimal
  import: github.com/shopspring/decimal
```

### Parameter: `fieldMapping`

The `fieldMapping` parameter provides fine-grained field type mapping configuration, supporting the configuration of specific database fields' generated `Go` data types. Apart from a different configuration name, the configuration content is the same as `typeMapping`. Example configuration:
```yaml
paid_orders.amount:
  type:   decimal.Decimal
  import: github.com/shopspring/decimal
```
In the example, `paid_orders` is the table name, `amount` is the field name, `type` represents the data type name in the generated `Go` code, and `import` represents third-party packages that need to be imported in the generated code.

## Usage Example

Repository address: [https://github.com/gogf/focus-single](https://github.com/gogf/focus-single)

![](/markdown/a02af38b70bb31224361565570e40789.png)

1. Files in the following `3` directories are generated by the `dao` command:

| Path | Description | Detailed Introduction |
| --- | --- | --- |
| `/internal/dao` | Data Access Object | Accesses the underlying data source through the object-oriented way, based on the `ORM` component. Often used in combination with `entity` and `do`. Files in this directory can be extended and modified by developers. |
| `/internal/model/do` | Data Transformation Model | The data transformation model is used for converting business models to data models, maintained by tools, and should not be modified by users. The tool will overwrite this directory each time code files are generated. For an introduction to `do` files, please refer to:<br />- [Data and Business Models](../../框架设计/工程开发设计/数据模型与业务模型.md)<br />- [Pain Points and Improvements In Business Project](../../框架设计/工程开发设计/DAO封装设计/DAO-工程痛点及改进.md)<br />- [Utilizing Pointer Properties and Do Objects for Flexible Modification Interfaces](../../核心组件/数据库ORM/ORM最佳实践/利用指针属性和do对象实现灵活的修改接口.md) |
| `/internal/model/entity` | Data Model | The data model is maintained by tools and should not be modified by users. The tool will overwrite this directory each time code files are generated. |

2. Models in the `model` directory are divided into two categories: **Data Models** and **Business Models**.

**Data Models:** Automatically generated by the `CLI` tool in the `model/entity` directory. The database tables will all be generated in this directory, and the files in this directory correspond to data models. Data models are data structures that correspond one-to-one with database tables; developers usually do not need to modify them and should not, as data models are automatically updated by the `CLI` tool when there are changes to the database table structures. Data models are generated and maintained uniformly by the `CLI` tool.

**Business Models:** Business models are data structures related to the business, defined as needed, such as service input and output data structure definitions and some internal data structure definitions. Business models are defined and maintained by developers according to business needs, defined in the `model` directory.

3. Files in the `dao` folder are named after database table names, with one file and its corresponding `DAO` object for each database table. Operations on database tables are implemented through `DAO` objects and related methods. The `dao` operation adopts a standardized design, requiring the `ctx` parameter to be passed, and the generated code must be operated by creating objects through the `Ctx` or `Transaction` method to chain operation on database tables.

![](/markdown/f0da330685c6cfd82ba1c0254dfdbe39.png)

## Notes

### Databases Requiring Manual Compilation

The `gen dao` command involves data access-related code generation and supports several commonly used database types by default. If Oracle database support is needed, developers must modify the source code files and manually compile and install the `CLI` tool locally, as the driver for these databases require `CGO` support and cannot be precompiled for general use.

![](/markdown/7f849959c13d224393b93d6b371e8ae0.png)

### About `bool` Type Corresponding to Database Table Fields

Since most database types do not have `bool` type table field types,
we recommend using `bit(1)` to represent a field’s `bool` type instead of `tinyint(1)` or `int(1)`. Because the `tinyint(1)/int(1)` field type represents a range of `-127~127`, it is usually used as a status field type. While the `bit(1)` type range is `0/1`, which can accurately represent the `bool` type's two values `false/true`.

For example, table fields:

![](/markdown/50992d00a792555d2946d294975e9ec4.png)

Generated properties:

![](/markdown/4bb766d64e607a33c1a6fbf20c742924.png)