---
slug: '/docs/core/gdb-chaining-soft-time-option'
title: 'Time Fields - SoftTimeOption'
sidebar_position: 3
hide_title: true
keywords: [GoFrame, Time Maintenance, SoftTimeOption, Database Operation, Time Granularity, Millisecond Timestamp, MySQL Table Structure, ORM Operation, Time Field, Big Integer Storage]
description: "Introduction on how to use SoftTimeOption in the GoFrame framework to control time writing granularity, converting from second-level to millisecond-level timestamps, and providing relevant MySQL table structures and example code to help developers flexibly configure time fields, supporting multiple time granularity options to meet different project needs, and inserting data through ORM methods"
---

In the previous [Time Fields - Integer Fields](./时间维护-整型字段.md) example, the time fields are written with second-level timestamps. But what if we want to control the granularity of time writing and write millisecond-level timestamps? We can use `SoftTimeOption` to control the granularity of the written time values.

## Example SQL
Here's the `MySQL` table structure used in the following example code. Since we need to write values with a granularity finer than seconds, the field type uses `big int` for storage.

```sql
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `status` tinyint DEFAULT 0,
  `created_at` bigint unsigned DEFAULT NULL,
  `updated_at` bigint unsigned DEFAULT NULL,
  `deleted_at` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

:::tip
If you try to test and view the `SQL` statements executed by `ORM` operations, it is recommended to enable `debug` mode (Documents: [ORM Senior - Debug Mode](../../ORM高级特性/ORM高级特性-调试模式.md)), and the `SQL` statements will automatically be printed in the log output.
:::

## `created_at` Write Time

```go
// INSERT INTO `user`(`name`,`created_at`,`updated_at`,`deleted_at`) VALUES('john',1731484186556,1731484186556,0)
g.Model("user").SoftTime(gdb.SoftTimeOption{
  SoftTimeType: gdb.SoftTimeTypeTimestampMilli,
}).Data(g.Map{"name": "john"}).Insert()
```

The `SoftTimeType` controls the time granularity, with the following granularity options:
```go
const (
    SoftTimeTypeAuto           SoftTimeType = 0 // (Default) Auto detect the field type by table field type.
    SoftTimeTypeTime           SoftTimeType = 1 // Using datetime as the field value.
    SoftTimeTypeTimestamp      SoftTimeType = 2 // In unix seconds.
    SoftTimeTypeTimestampMilli SoftTimeType = 3 // In unix milliseconds.
    SoftTimeTypeTimestampMicro SoftTimeType = 4 // In unix microseconds.
    SoftTimeTypeTimestampNano  SoftTimeType = 5 // In unix nanoseconds.
)
```