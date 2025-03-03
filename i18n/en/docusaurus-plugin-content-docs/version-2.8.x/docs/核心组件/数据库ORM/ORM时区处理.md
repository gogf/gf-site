---
slug: '/docs/core/gdb-timezone'
title: 'ORM - Timezone'
sidebar_position: 5
hide_title: true
keywords: [GoFrame framework, ORM timezone handling, MySQL timezone, time.Time, database driver, timezone conversion, loc parameter, timezone settings, configuration file, time.Parse]
description: "Handles timezone issues in ORM operations within the GoFrame framework, especially for timezone conversion when using the MySQL database. We explain how to control the timezone processing of time.Time objects submitted to the database by setting the loc parameter, providing relevant code examples and configuration advice to help developers better manage timezone during database operations."
---

## Introduction

Since this issue is frequently asked, we have created a separate chapter to detail how timezone handling works in `ORM`. Here, we use the `MySQL` database as an example to explain the timezone conversion, with our local timezone set to `+8` and the database timezone also `+8`.

The most commonly used `MySQL` database driver is this third-party package: [https://github.com/go-sql-driver/mysql](https://github.com/go-sql-driver/mysql), which contains a parameter:

![](/markdown/86813361650854a9b17490267709df8a.png)

In essence, this parameter is used to convert the timezone for the `time.Time` when you submit it as a time parameter. When connecting to the database with the `loc=Local` parameter, the `driver` will automatically convert your submitted `time.Time` parameters to the local timezone set by the program; if not manually set, it defaults to the `UTC` timezone. Let's look at two examples.

## Conversion Examples

### Example 1, Setting `loc=Local`

**Configuration File**

```yaml
database:
  link: "mysql:root:12345678@tcp(127.0.0.1:3306)/test?loc=Local"
```

**Code Example**

```go
t1, _ := time.Parse("2006-01-02 15:04:05", "2020-10-27 10:00:00")
t2, _ := time.Parse("2006-01-02 15:04:05", "2020-10-27 11:00:00")
db.Model("user").Ctx(ctx).Where("create_time>? and create_time<?", t1, t2).One()
// SELECT * FROM `user` WHERE create_time>'2020-10-27 18:00:00' AND create_time<'2020-10-27 19:00:00'
```

Here, since the `time.Time` object created by `time.Parse` is in the `UTC` timezone, it will be modified to the `+8` timezone by the underlying `driver` when submitted to the database.

```go
t1, _ := time.ParseInLocation("2006-01-02 15:04:05", "2020-10-27 10:00:00", time.Local)
t2, _ := time.ParseInLocation("2006-01-02 15:04:05", "2020-10-27 11:00:00", time.Local)
db.Model("user").Ctx(ctx).Where("create_time>? and create_time<?", t1, t2).One()
// SELECT * FROM `user` WHERE create_time>'2020-10-27 10:00:00' AND create_time<'2020-10-27 11:00:00'
```

Here, since the `time.Time` object created by `time.ParseInLocation` is in the `+8` timezone, which is consistent with the `loc=Local` timezone, it will not be modified by the underlying `driver` when submitted to the database.
:::warning
Note that when inserting data that includes `time.Time` parameters, attention should also be paid to timezone conversion.
:::
### Example 2, Not Setting the `loc` Parameter

**Configuration File**

```yaml
database:
  link: "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
```

**Code Example**

```go
t1, _ := time.Parse("2006-01-02 15:04:05", "2020-10-27 10:00:00")
t2, _ := time.Parse("2006-01-02 15:04:05", "2020-10-27 11:00:00")
db.Model("user").Ctx(ctx).Where("create_time>? and create_time<?", t1, t2).One()
// SELECT * FROM `user` WHERE create_time>'2020-10-27 10:00:00' AND create_time<'2020-10-27 11:00:00'
```

Since the `time.Time` object created by `time.Parse` is in the `UTC` timezone, it will not be modified by the underlying `driver` when submitted to the database.

```go
t1, _ := time.ParseInLocation("2006-01-02 15:04:05", "2020-10-27 10:00:00", time.Local)
t2, _ := time.ParseInLocation("2006-01-02 15:04:05", "2020-10-27 11:00:00", time.Local)
db.Model("user").Ctx(ctx).Where("create_time>? and create_time<?", t1, t2).One()
// SELECT * FROM `user` WHERE create_time>'2020-10-27 02:00:00' AND create_time<'2020-10-27 03:00:00'
```

Since the `time.Time` object created by `time.ParseInLocation` is in the `+8` timezone, it will be modified to `UTC` timezone by the underlying `driver` when submitted to the database.
:::warning
Note that when inserting data that includes `time.Time` parameters, attention should also be paid to timezone conversion.
:::
## Improvement Suggestions

It is recommended to consistently use the `loc=Local` configuration in your settings, for example (MySQL): `loc=Local&parseTime=true`. Here's a reference configuration:

```yaml
database:
  logger:
    level:  "all"
    stdout: true
  default:
    link:  "mysql:root:12345678@tcp(192.168.1.10:3306)/mydb?loc=Local&parseTime=true"
    debug: true
  order:
    link:  "mysql:root:12345678@tcp(192.168.1.20:3306)/order?loc=Local&parseTime=true"
    debug: true
```