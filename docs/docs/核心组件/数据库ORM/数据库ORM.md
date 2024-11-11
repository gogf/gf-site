---
slug: '/docs/core/gdb'
title: '数据库ORM🔥'
sidebar_position: 10
hide_title: true
keywords: [GoFrame,GoFrame框架,数据库ORM,gdb模块,数据库驱动,链接池,预处理,自动化,可观测性,DAO设计]
description: '本文档介绍了如何在GoFrame框架中使用gdb模块实现数据库的ORM功能，强调了连接池设计、预处理SQL参数以及自动识别Map/Struct的特点。GoFrame ORM组件支持事务嵌套、接口化设计，并兼容主流数据库驱动，具备强大的配置管理和调试特性。'
---

## 驱动引入🔥

为了将数据库驱动与框架主库解耦，从 `v2.1` 版本开始，所有的数据库驱动都需要通过社区包手动引入。

数据库驱动的安装和引入请参考： [https://github.com/gogf/gf/tree/master/contrib/drivers](https://github.com/gogf/gf/tree/master/contrib/drivers)

## 基本介绍

`GoFrame` 框架的 `ORM` 功能由 `gdb` 模块实现，用于常用关系型数据库的 `ORM` 操作。
:::tip
`gdb` 数据库引擎底层采用了 **链接池设计**，当链接不再使用时会自动关闭，因此链接对象不用的时候不需要显式使用 `Close` 方法关闭数据库连接。
:::
:::note
注意：为提高数据库操作安全性，在 `ORM` 操作中不建议直接将参数拼接成 `SQL` 字符串执行，建议使用预处理的方式（充分使用 `?` 占位符）来传递 `SQL` 参数。 `gdb` 的底层实现中均采用的是预处理的方式处理开发者传递的参数，以充分保证数据库操作安全性。
:::
**接口文档：**

[https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb)

## 组件特性

`GoFrame ORM` 组件具有以下显著特点：

01. 全自动化支持嵌套事务。
02. 面向接口化设计、易使用易扩展。
03. 内置支持主流数据库类型驱动，并易于扩展。
04. 强大的配置管理，使用框架统一的配置组件。
05. 支持单例模式获取配置同一分组数据库对象。
06. 支持原生SQL方法操作、ORM链式操作两种方式。
07. 支持 `OpenTelemetry` 可观测性：链路跟踪、日志记录、指标上报。
08. 通过 `Scan` 方法自动识别 `Map/Struct` 接收查询结果，自动化查询结果初始化、结构体类型转换。
09. 通过返回结果 `nil` 识别为空，无需 `sql.ErrNoRows` 识别查询数据为空的情况。
10. 全自动化的结构体属性-字段映射，无需显示定义结构体标签维护属性-字段映射关系。
11. 自动化的给定 `Map/Struct/Slice` 参数类型中的字段识别、过滤，大大提高查询条件输入、结果接收。
12. 完美支持 `GoFrame` 框架层面的 `DAO` 设计，全自动化 `Model/DAO` 代码生成，极大提高开发效率。
13. 支持调试模式、日志输出、 `DryRun`、自定义 `Handler`、自动类型类型转换、自定义接口转换等等高级特性。
14. 支持查询缓存、软删除、自动化时间更新、模型关联、数据库集群配置（软件主从模式）等等实用特性。

## 知识图谱

![](/markdown/74298ab82a6dd23550ed8a4432fa4327.png)

`GoFrame ORM Features`

## 组件关联

![](/markdown/cf10ab2ff4d4b341190d5e5a47692061.png)

`GoFrame ORM Dependencies`

## `g.DB` 与 `gdb.New`、 `gdb.Instance`

获取数据库操作对象有三种方式，一种是使用 `g.DB` 方法（推荐），一种是使用原生 `gdb.New` 方法，还有一种是使用包原生单例方法 `gdb.Instance`，而第一种是推荐的使用方式。这三种方式的区别如下：

1. `g.DB` 对象管理方式获取的是单例对象，整合了配置文件的管理功能，支持配置文件热更新。
2. `gdb.New` 是根据给定的数据库节点配置创建一个新的数据库对象(非单例)，无法使用配置文件。
3. `gdb.Instance` 是包原生单例管理方法，需要结合配置方法一起使用，通过分组名称(非必需)获取对应配置的数据库单例对象。
:::tip
有这么多对象获取方式原因在于 `GoFrame` 是一个模块化设计的框架，每个模块皆可单独使用。
:::
### `New` 创建数据库对象

```go
db, err := gdb.New(gdb.ConfigNode{
    Link: "mysql:root:12345678@tcp(127.0.0.1:3306)/test",
})
```

### 获取数据库对象单例

```go
// 获取默认配置的数据库对象(配置名称为"default")
db := g.DB()

// 获取配置分组名称为"user"的数据库对象
db := g.DB("user")

// 使用原生单例管理方法获取数据库对象单例
db, err := gdb.Instance()
db, err := gdb.Instance("user")
```

## 相关文档
import DocCardList from '@theme/DocCardList';

<DocCardList />