---
slug: '/docs/core/gdb-faq'
title: 'ORM常见问题'
sidebar_position: 11
hide_title: true
keywords: [ORM常见问题,GoFrame,GoFrame框架,数据库连接池,MaxLifeTime,SQL查询,数据库驱动,调试日志,空数组条件,字符集设置]
description: '本文档介绍了在使用GoFrame框架进行ORM操作时可能遇到的几种常见问题及其解决方案，包括数据库连接池过期导致的连接错误、update和insert操作不生效、无法找到数据库驱动、查询条件带有WHERE 0=1的问题以及MySQL表情存储乱码问题等。同时给出了一些配置建议以优化使用体验。'
---

## `driver: bad connection`

![](/markdown/7b384b6f57115b11938d9c0a30dde732.png)

如果数据库执行出现该错误，可能是由于本地数据库连接池的连接已经过期，可以检查一下客户端配置的 `MaxLifeTime` 配置是否超过数据库服务端设置的连接最大超时时间。更多客户端配置请参考章节： [ORM使用配置](./ORM使用配置/ORM使用配置.md)

## `update/insert` 操作不生效

使用 `orm` 时,配置文件中：

```toml
dryRun = "(可选)ORM空跑(只读不写)"
```

这行配置一定要删掉或者设置为0

否则出现 `update insert` 操作不生效的现象。

## `cannot find database driver for specified database type "xxx"， did you misspell type name "xxx" or forget importing the database driver?`

程序代码没有引入依赖的数据库驱动，需要注意从 `GoFrame v2.1` 版本开始，需要手动引入社区驱动，请参考：

- [https://github.com/gogf/gf/tree/master/contrib/drivers](https://github.com/gogf/gf/tree/master/contrib/drivers)

## 数据库打开 `DEBUG` 日志后，查询的 `SQL` 语句中发现出现 `WHERE 0=1` 的语句

出现 `WHERE 0=1` 的情况是由于查询条件中存在数组条件，并且数组的长度为 `0`。这种情况 `ORM` 无法自动过滤这种空数组条件（这种条件过滤可能会引起业务异常），需要开发者根据业务场景，显示调用 `OmitEmpty` 或者 `OmitEmptyWhere` 来告诉 `ORM` 可以过滤这些空数组的条件。

## MYSQL中的表情,用SQL查询后,乱码问题

![](/markdown/867e951b823bb2652a6b7d62f70a1ff3.png)

解决办法:

`config.toml` 文件 数据库配置的 `charset` 设置为 `utf8mb4` 默认是 `utf8`

`MySQL` 存储表情时注意：

- 数据库编码 `utf8mb4`
- 表的编码是 `utf8mb4`
- 表中内容字段是 `utf8mb4`