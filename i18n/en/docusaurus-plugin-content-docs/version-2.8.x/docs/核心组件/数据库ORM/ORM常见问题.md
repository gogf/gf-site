---
slug: '/docs/core/gdb-faq'
title: 'ORM - FAQ'
sidebar_position: 11
hide_title: true
keywords: [ORM FAQ, GoFrame, GoFrame framework, database connection pool, MaxLifeTime, SQL query, database driver, debug log, empty array condition, character set settings]
description: "Common issues that may be encountered while performing ORM operations with the GoFrame framework and their solutions, including connection errors caused by expired database connection pools, ineffective update and insert operations, inability to find database drivers, problems with query conditions having WHERE 0=1, and encoding issues with storing emojis in MySQL tables. Some configuration recommendations are also provided to optimize the experience."
---

## `driver: bad connection`

![](/markdown/7b384b6f57115b11938d9c0a30dde732.png)

If this error occurs during database execution, it may be due to the local database connection pool connections having expired. You can check if the `MaxLifeTime` configuration set on the client exceeds the maximum timeout set by the database server. For more client configurations, please refer to the section: [ORM - Configuration](./ORM使用配置/ORM使用配置.md)

## `update/insert` operations ineffective

When using `orm`, in the configuration file:

```toml
dryRun = "(optional) ORM dry run (read-only, no write)"
```

This line of configuration must be deleted or set to 0

Otherwise, `update insert` operations will not be effective.

## `cannot find database driver for specified database type "xxx", did you misspell type name "xxx" or forget importing the database driver?`

The program code has not included the dependent database driver. It is important to note that from `GoFrame v2.1` onwards, community drivers need to be manually introduced. Please refer to:

- [https://github.com/gogf/gf/tree/master/contrib/drivers](https://github.com/gogf/gf/tree/master/contrib/drivers)

## After enabling `DEBUG` log for the database, `SQL` statements show `WHERE 0=1`

The occurrence of `WHERE 0=1` happens due to the presence of an array condition in the query condition with an array length of `0`. The `ORM` cannot automatically filter out these empty array conditions (such filtering might cause business exceptions). Developers need to explicitly call `OmitEmpty` or `OmitEmptyWhere` based on the business scenario to instruct the `ORM` to filter these empty array conditions.

## Emoji storage in MYSQL tables results in encoding issues

![](/markdown/867e951b823bb2652a6b7d62f70a1ff3.png)

Solution:

In the `config.toml` file, set the database configuration `charset` to `utf8mb4` instead of the default `utf8`.

When storing emojis in `MySQL`, note the following:

- Database encoding is `utf8mb4`
- Table encoding is `utf8mb4`
- Content fields in the table are `utf8mb4`