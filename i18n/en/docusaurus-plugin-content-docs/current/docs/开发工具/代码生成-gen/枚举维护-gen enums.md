---
slug: '/docs/cli/gen-enums'
title: 'Enum Maintenance - Gen Enums'
sidebar_position: 3
hide_title: true
---
:::tip
This feature is an **experimental feature**, provided starting from version `v2.4`.
:::
## Basic Introduction

This command is used to analyze the source code in the specified code directory, generate enum value information, and `Go` code files according to specifications, primarily for improving the maintenance of enum values in `OpenAPIv3` documentation.

## Solving Pain Points

### Pain Point Description

- The issue of enum value types in `API` documentation not displaying the possible options of enum values.
- The difficulty in maintaining enum values in `API` documentation, and the problem of code and documentation being maintained separately, which reduces collaboration efficiency with the calling end, especially front-end and back-end.

> For example, in the following interface definition, tasks include various statuses, all of which are enum values. If maintained by the back-end, the cost is high, and it is easy to overlook the maintenance of statuses, leading to incomplete status enum values.

![Interface Definition](/markdown/3e2d58612c094dcf26ed2f17371ae482.png)

### Pain Point Solution

By parsing the source code with tools, enum values are analyzed and generated into the startup package `Go` files. The enum values are automatically loaded when the service runs, reducing manual maintenance costs and avoiding the omission of enum value maintenance.

> For example, in the following interface definition, enum values are maintained through tools, improving development efficiency.

![Interface Definition with Tools](/markdown/4f5b0d82a3fa65b8c83fcd3f93a8c02a.png)

## Command Usage

```bash
$ gf gen enums -h
USAGE
    gf gen enums [OPTION]

OPTION
    -s, --src        source folder path to be parsed
    -p, --path       output go file path storing enums content
    -x, --prefixes   only exports packages that start with specified prefixes
    -h, --help       more information about this command

EXAMPLE
    gf gen enums
    gf gen enums -p internal/boot/boot_enums.go
    gf gen enums -p internal/boot/boot_enums.go -s .
    gf gen enums -x github.com/gogf
```

Parameter Description:

| Name | Required | Default Value | Meaning |
| --- | --- | --- | --- |
| `src` | No | `.` | Specifies the source code directory path for analysis, default is the current project root directory |
| `path` | No | `internal/boot/boot_enums.go` | Specifies the generated enum value registration Go code file path |
| `prefixes` | No | - | Only generates enum values with package names starting with specified keywords, supports multiple prefix configurations |

## Using the Generated File

After executing the `gf gen enums` command to generate the enum analysis file `internal/boot/boot_enums.go`, the generated file needs to be anonymously imported in the project's entry file:

```go
import (
    _ "project module name/internal/boot"
)
```

## How to Standardize Enum Definitions

Please refer to the section: [Golang Enum Value Management](/docs/design/enums)

## How to Validate Enum Values

If enum values are defined in a standardized manner and the enum value maintenance file is generated through the command, then in parameter validation, the `enums` rule can be used to validate enum value fields. For specific rule introductions, please refer to the section: [Data Validation - Validation Rules](/docs/core/gvalid-rules)