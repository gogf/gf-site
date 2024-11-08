---
slug: '/docs/core/gdb-senior-dry-run'
title: 'ORM高级特性-空跑特性'
sidebar_position: 5
hide_title: true
keywords: [GoFrame,GoFrame框架,ORM,空跑特性,DryRun,SQL,调试模式,日志输出,数据库,配置示例]
description: '本文介绍了GoFrame框架中的ORM空跑特性，该特性通过DryRun配置项启用，可以在不开启实际写入、更新、删除操作的情况下调试SQL语句。本文提供了详细的配置示例以及如何利用命令行参数和环境变量全局修改该特性的使用方法，帮助开发者在开发过程中验证SQL执行的正确性。'
---

`ORM` 空跑可以通过 `DryRun` 配置项来启用，默认关闭。当 `ORM` 的空跑特性开启时，读取操作将会提交，而写入、更新、删除操作将会被忽略。该特性往往结合调试模式和日志输出一起使用，用于校验当前的程序（特别是脚本）执行的 `SQL` 是否符合预期。以下是一个开启了空跑特性的配置示例：

```yaml
database:
  default:
  - link:   "mysql:root:12345678@tcp(127.0.0.1:3306)/user"
    debug:  true
    dryRun: true
```

空跑特性也可以通过命令行参数或者环境变量全局修改：

1. 命令行启动参数 \- `gf.gdb.dryrun=true`。
2. 指定的环境变量 \- `GF_GDB_DRYRUN=true`。

例如：

```bash
$ ./app --gf.gdb.dryrun=true
```

```bash
$ ./app --gf.gdb.dryrun true
```