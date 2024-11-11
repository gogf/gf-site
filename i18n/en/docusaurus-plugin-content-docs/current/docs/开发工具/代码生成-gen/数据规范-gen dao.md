---
slug: '/docs/cli/gen-dao'
title: 'Data Specification - Gen Dao'
sidebar_position: 1
hide_title: true
---

The `gen dao` command is one of the most frequently used commands in `CLI` and is also a key command for the accurate implementation of the framework's engineering specifications. This command is used to generate `dao` data access objects, `do` data transformation models, and `entity` instance data model `Go` code files. Due to the numerous parameters and options of this command, we recommend using a configuration file to manage generation rules.

:::tip
For an introduction to the framework project engineering specifications, please refer to the [Code Layer Design](docs/design/project-layer) section.
:::

## Usage

In most scenarios, simply execute `gf gen dao` in the project root directory. Below is the command line help information.

```bash
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
```
:::tip
If you are using the project engineering scaffold recommended by the framework and have the `make` tool installed on your system, you can also use the `make dao` shortcut command.
:::

## Configuration Example

`/hack/config.yaml`

```yaml
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

    # sqlite requires self-compilation with sqlite driver. Download the library code and modify the import package in the file path (gf\cmd\gf\internal\cmd\cmd_gen_dao.go), uncomment to use. sqlite driver depends on gcc.
    - link: "sqlite:./file.db"
```

## Parameter Description

| Name | Default Value | Meaning | Example |
| --- | --- | --- | --- |
| `gfcli.gen.dao` |  | `dao` code generation configuration item, can have multiple configuration items to form an array, supports multiple database generations. Different databases can set different generation rules, such as generating to different locations or files. | - |
| `link`<br />**Required Parameter** |  | Divided into two parts, the first part indicates the type of database you are connecting to, such as `mysql`, `postgresql`, etc., and the second part is the `dsn` information for connecting to the database. For details, please refer to the [ORM Usage Configuration](/docs/core/gdb-config) section. | - |
| `path` | `internal` | The **directory** address for storing generated `dao` and `model` files. | `./app` |
| `group` | `default` | The database group name in the database configuration. Only one name can be configured. The group name of the database in the configuration file is often determined and not changed afterwards. | `default`<br />`order`<br />`user` |
| `prefix` |  | The prefix for generating database objects and files to distinguish between different databases or the same table names in different databases, preventing data table name coverage. | `order_`<br />`user_` |
| `removePrefix` |  | Remove the specified prefix name of the data table. Multiple prefixes are separated by `,`. | `gf_` |
| `removeFieldPrefix` |  | Remove the specified prefix name of the field. Multiple prefixes are separated by `,`. | `f_` |
| `tables` |  | Specify the data tables in the current database that need to perform code generation. If empty, it means all tables in the database will be generated. | `user, user_detail` |
| `tablesEx` |  | `Tables Excluding`, specify the data tables in the current database that need to be excluded from code generation. | `product, order` |
| `jsonCase` | `CamelLower` | Specify the `json` tag name rule in the data entity object generated in the `model`, the parameter is not case-sensitive. Parameters can be: `Camel`, `CamelLower`, `Snake`, `SnakeScreaming`, `SnakeFirstUpper`, `Kebab`, `KebabScreaming`. For details, please refer to the naming line help example. | `Snake` |
| `stdTime` | `false` | When the data table field type is a time type, the property type of the generated code uses the standard library's `time.Time` instead of the framework's `*gtime.Time` type. | `true` |
| `withTime` | `false` | Add a creation time comment for each automatically generated code file |  |
| `gJsonSupport` | `false` | When the data table field type is `JSON`, the property type of the generated code uses `*gjson.Json` type. | `true` |
| `overwriteDao` | `false` | Whether to regenerate and overwrite `dao` files both inside and outside the `internal` folder every time `dao` code is generated. Note that files outside the `dao/internal` folder may be custom-extended by developers, and overwriting may pose risks. | `true` |
| `importPrefix` | Automatically detected through `go.mod` | Used to specify the `import` path prefix for generated `Go` files. Especially when using the `gen dao` command not under the project root directory, or wanting to generate code files into custom directories, this parameter is very necessary. | `github.com/gogf/gf` |
| `descriptionTag` | `false` | Used to specify whether to add a `description` tag for the data model structure attributes, with the content being the corresponding data table field comments. | `true` |
| `noJsonTag` | `false` | The generated data model does not have a json tag for each field |  |
| `noModelComment` | `false` | Used to specify whether to disable the automatic generation of comments for data model structure attributes, with the content being the comments of the corresponding data table fields. | `true` |
| `clear` | `false` | Automatically delete local `dao/do/entity` code files that do not have corresponding data tables in the database. Please use this parameter with caution! |  |
| `typeMapping` | `decimal:`<br />`  type: float64`<br />`money:`<br />`  type: float64`<br />`numeric:`<br />`  type: float64`<br />`smallmoney:`<br />`  type: float64` | **Supported from version v2.5.**<br />Used to customize the mapping of data table field types to the corresponding attribute types in the generated Go files. This configuration supports the introduction of third-party packages through `import` configuration, for example:<br />`decimal:`<br />`  type:   decimal.Decimal`<br />`  import: github.com/shopspring/decimal` |  |
| `daoPath` | `dao` | Directory for storing generated `DAO` files |  |
| `doPath` | `model/do` | Directory for storing generated `DO` files |  |
| `entityPath` | `model/entity` | Directory for storing generated `Entity` files |  |
| `tplDaoIndexPath` |  | Custom `DAO Index` code generation template file path, please refer to the source code when using this parameter |  |
| `tplDaoInternalPath` |  | Custom `DAO Internal` code generation template file path, please refer to the source code when using this parameter |  |
| `tplDaoDoPath` |  | Custom `DO` code generation template file path, please refer to the source code when using this parameter |  |
| `tplDaoEntityPath` |  | Custom `Entity` code generation template file path, please refer to the source code when using this parameter |  |

## Usage Example

Repository address: [https://github.com/gogf/focus-single](https://github.com/gogf/focus-single)

![Usage Example](/markdown/a02af38b70bb31224361565570e40789.png)

1. The following `3` directories' files are generated by the `dao` command:

| Path | Description | Details |
| --- | --- | --- |
| `/internal/dao` | Data Operation Object | Access the underlying data source through object-oriented methods, based on the `ORM` component. Often used in conjunction with `entity` and `do`. Developers can extend and modify the files in this directory, but it is usually unnecessary. |
| `/internal/model/do` | Data Transformation Model | Used for the transformation of business models to data models, maintained by the tool and should not be modified by users. The tool will overwrite the code files in this directory every time it generates code. For more information on `do` files, please refer to:<br />- [Data Model and Business Model](../../Framework Design/Engineering Development Design/Data Model and Business Model.md)<br />- [DAO-Engineering Pain Points and Improvements](../../Framework Design/Engineering Development Design/DAO封装 Design/DAO-Engineering Pain Points and Improvements.md)<br />- [Using Pointer Attributes and Do Objects to Implement Flexible Modification Interfaces](../../Core Components/Database ORM/ORM Best Practices/Using Pointer Attributes and Do Objects to Implement Flexible Modification Interfaces.md) |
| `/internal/model/entity` | Data Model | Maintained by the tool and should not be modified by users. The tool will overwrite the code files in this directory every time it generates code. |

2. The models in `model` are divided into two categories: **Data Models** and **Business Models**.

**Data Models:** Automatically generated by the `CLI` tool in the `model/entity` directory files, all database data tables will be generated under this directory, and the models corresponding to the files in this directory are data models. Data models are data structures that correspond one-to-one with data tables. Developers often do not need to modify and should not modify them. Data models are only automatically updated when the data table structure changes through the `CLI` tool. Data models are generated and maintained by the `CLI` tool.

**Business Models:** Business models are data structures related to business, defined as needed, such as input and output data structure definitions of `service`, internal data structure definitions, etc. Business models are defined and maintained by developers according to business needs and are defined in the `model` directory.

3. The files in `dao` are named according to the data table name, one file per data table and one corresponding `DAO` object. Operating on data tables is achieved through `DAO` objects and related operational methods. `dao` operations are designed in a standardized manner, requiring the transmission of a `ctx` parameter, and objects must be created through `Ctx` or `Transaction` methods in the generated code for chain operations on data tables.

![DAO Operations](/markdown/f0da330685c6cfd82ba1c0254dfdbe39.png)

## Notes

### Database Types That Require Manual Compilation

The `gen dao` command, when involving code generation related to data access, supports several common types of databases by default. If you need support for the `Oracle` database type, developers need to modify the source code file themselves and then compile and generate the `CLI` tool locally for installation, as the drivers for these databases require `CGO` support and cannot be pre-compiled for direct use.

![Manual Compilation](/markdown/7f849959c13d224393b93d6b371e8ae0.png)

### Regarding `bool` Type Corresponding to Data Table Fields

Since most database types do not have a `bool` type for data table fields, we recommend using `bit(1)` as a substitute for the `bool` type. The `gen dao` command will automatically recognize `bit(1)` data table fields and generate properties of type `bool`. In addition, we do not recommend using `tinyint(1)` as a `bool` type.

For example, table fields:

![Table Fields](/markdown/50992d00a792555d2946d294975e9ec4.png)

Generated properties:

![Generated Properties](/markdown/4bb766d64e607a33c1a6fbf20c742924.png)