---
title: '枚举维护-gen enums'
sidebar_position: 4
hide_title: true
---

该功能特性为 **实验性特性**，从 `v2.4` 版本开始提供。

## 基本介绍

该命令用于分析指定代码目录源码，按照规范生成枚举值信息以及 `Go` 代码文件，用以完善 `API` 文档中的枚举值维护。

## 解决痛点

### 痛点描述

- `API` 文档中枚举值类型参数不展示枚举值可选项的问题。
- `API` 文档中的枚举值维护困难的问题，代码与文档脱离维护的问题。降低了与调用端，特别是前后端的协作效率

> 例如，以下接口定义中，任务包含多种状态，这些状态都是枚举值，如果后端来维护成本比较高，并且容易遗漏状态的维护，造成状态枚举值不完整。

![](/markdown/2173a65222a2e87967dd70890ae5e48f.png)

### 痛点解决

通过工具解析源码，将枚举值解析生成到启动包 `Go` 文件中，在服务运行时自动加载枚举值，降低手工维护成本，避免枚举值遗漏维护问题。

> 例如，在以下接口定义中，通过工具来维护枚举值，提高了开发效率。

![](/markdown/08acbd771e95adf45c9a6086d075a209.png)

## 命令使用

```bash
$ gf gen enums -h
USAGE
    gf gen enums [OPTION]

OPTION
    -s, --src      source folder path to be parsed
    -p, --path     output go file path storing enums content
    -x, --prefix   only exports packages that starts with specified prefix
    -h, --help     more information about this command

EXAMPLE
    gf gen enums
    gf gen enums -p internal/boot/boot_enums.go
    gf gen enums -p internal/boot/boot_enums.go -s .
    gf gen enums -x github.com/gogf
```

参数说明：

| 名称 | 必须 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `src` | 否 | `.` | 指定分析的源码目录路径，默认为当前项目根目录 |
| `path` | 否 | `internal/boot/boot_enums.go` | 指定生成的枚举值注册Go代码文件路径 |
| `prefix` | 否 | - | 只会生成包名称前缀的带有指定关键字的枚举值 |

## 生成文件的使用

然后执行 `gf gen enums` 命令生成枚举分析文件 `internal/boot/boot_enums.go`，生成文件之后，需要在项目入口文件匿名引入：

```go
import (
    _ "项目模块名/internal/boot"
)
```

## 如何规范定义枚举值

请参考章节：Golang枚举值管理