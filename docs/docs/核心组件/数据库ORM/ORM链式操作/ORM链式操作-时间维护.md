---
slug: '/docs/core/gdb-chaining-soft-time'
title: 'ORM链式操作-时间维护'
sidebar_position: 11
hide_title: true
keywords: [GoFrame,GoFrame框架,ORM,链式操作,时间维护,gdb,自动填充,软删除,表现层,数据操作]
description: '使用GoFrame框架中的gdb模块进行ORM链式操作时的时间维护特性。通过自动填充创建、更新和删除时间，有效提高了开发效率。文章详细讲解了如何启用这些特性以及在执行数据库操作如插入、更新和删除时的实现方式。此外，还提供了针对软删除和忽略时间维护等场景的解决方案。'
---

需要注意，该特性仅对链式操作有效。

`gdb` 模块支持对数据记录的写入、更新、删除时间自动填充，提高开发维护效率。为了便于时间字段名称、类型的统一维护，如果使用该特性，我们约定：

- 字段应当设置允许值为 `null`。
- 字段的类型必须为时间类型，如: `date`, `datetime`, `timestamp`。不支持数字类型字段，如 `int`。
- 字段的名称支持自定义设置，默认名称约定为：
  - `created_at` 用于记录创建时更新，仅会写入一次。
  - `updated_at` 用于记录修改时更新，每次记录变更时更新。
  - `deleted_at` 用于记录的软删除特性，只有当记录删除时会写入一次。

字段名称其实不区分大小写，也会忽略特殊字符，例如 `CreatedAt`, `UpdatedAt`, `DeletedAt` 也是支持的。此外，时间字段名称可以通过配置文件进行自定义修改，并可使用 `TimeMaintainDisabled` 配置完整关闭该特性，具体请参考 [ORM使用配置](../ORM使用配置/ORM使用配置.md) 章节。
:::tip
对时间类型的固定其实是为了形成一种规范。
:::
### 特性的启用

当数据表包含 `created_at`、 `updated_at`、 `deleted_at` 任意一个或多个字段时，该特性自动启用。

以下的示例中，我们默认示例中的数据表均包含了这3个字段。

### `created_at` 写入时间

在执行 `Insert/InsertIgnore/BatchInsert/BatchInsertIgnore` 方法时自动写入该时间，随后保持不变。

```go
// INSERT INTO `user`(`name`,`created_at`,`updated_at`) VALUES('john', `2020-06-06 21:00:00`, `2020-06-06 21:00:00`)
g.Model("user").Data(g.Map{"name": "john"}).Insert()

// INSERT IGNORE INTO `user`(`uid`,`name`,`created_at`,`updated_at`) VALUES(10000,'john', `2020-06-06 21:00:00`, `2020-06-06 21:00:00`)
g.Model("user").Data(g.Map{"uid": 10000, "name": "john"}).InsertIgnore()

// REPLACE INTO `user`(`uid`,`name`,`created_at`,`updated_at`) VALUES(10000,'john', `2020-06-06 21:00:00`, `2020-06-06 21:00:00`)
g.Model("user").Data(g.Map{"uid": 10000, "name": "john"}).Replace()

// INSERT INTO `user`(`uid`,`name`,`created_at`,`updated_at`) VALUES(10001,'john', `2020-06-06 21:00:00`, `2020-06-06 21:00:00`) ON DUPLICATE KEY UPDATE `uid`=VALUES(`uid`),`name`=VALUES(`name`),`updated_at`=VALUES(`updated_at`)
g.Model("user").Data(g.Map{"uid": 10001, "name": "john"}).Save()
```

需要注意的是 `Replace` 方法也会更新该字段，因为该操作相当于删除已存在的旧数据并重新写一条数据。

### `updated_at` 更新时间

在执行 `Insert/InsertIgnore/BatchInsert/BatchInsertIgnore` 方法时自动写入该时间，在执行 `Save/Update` 时更新该时间（注意当写入数据存在时会更新 `updated_at` 时间，不会更新 `created_at` 时间）。

```go
// UPDATE `user` SET `name`='john guo',`updated_at`='2020-06-06 21:00:00' WHERE name='john'
g.Model("user").Data(g.Map{"name" : "john guo"}).Where("name", "john").Update()

// UPDATE `user` SET `status`=1,`updated_at`='2020-06-06 21:00:00' ORDER BY `login_time` asc LIMIT 10
g.Model("user").Data("status", 1).Order("login_time asc").Limit(10).Update()

// INSERT INTO `user`(`id`,`name`,`update_at`) VALUES(1,'john guo','2020-12-29 20:16:14') ON DUPLICATE KEY UPDATE `id`=VALUES(`id`),`name`=VALUES(`name`),`update_at`=VALUES(`update_at`)
g.Model("user").Data(g.Map{"id": 1, "name": "john guo"}).Save()
```
:::warning
需要注意的是 `Replace` 方法也会更新该字段，因为该操作相当于删除已存在的旧数据并重新写一条数据。
:::
### `deleted_at` 数据软删除

软删除会稍微比较复杂一些，当软删除存在时，所有的查询语句都将会自动加上 `deleted_at` 的条件。

```go
// UPDATE `user` SET `deleted_at`='2020-06-06 21:00:00' WHERE uid=10
g.Model("user").Where("uid", 10).Delete()
```

查询的时候会发生一些变化，例如：

```go
// SELECT * FROM `user` WHERE uid>1 AND `deleted_at` IS NULL
g.Model("user").Where("uid>?", 1).All()
```

可以看到当数据表中存在 `deleted_at` 字段时，所有涉及到该表的查询操作都将自动加上 `deleted_at IS NULL` 的条件

#### 联表查询的场景

如果关联查询的几个表都启用了软删除特性时，会发生以下这种情况，即条件语句中会增加所有相关表的软删除时间判断。

```go
// SELECT * FROM `user` AS `u` LEFT JOIN `user_detail` AS `ud` ON (ud.uid=u.uid) WHERE u.uid=10 AND `u`.`deleted_at` IS NULL AND `ud`.`deleteat` IS NULL LIMIT 1
g.Model("user", "u").LeftJoin("user_detail", "ud", "ud.uid=u.uid").Where("u.uid", 10).One()
```

#### `Unscoped` 忽略时间特性

`Unscoped` 用于在链式操作中忽略自动时间更新特性，例如上面的示例，加上 `Unscoped` 方法后：

```go
// SELECT * FROM `user` WHERE uid>1
g.Model("user").Unscoped().Where("uid>?", 1).All()

// SELECT * FROM `user` AS `u` LEFT JOIN `user_detail` AS `ud` ON (ud.uid=u.uid) WHERE u.uid=10 LIMIT 1
g.Model("user", "u").LeftJoin("user_detail", "ud", "ud.uid=u.uid").Where("u.uid", 10).Unscoped().One()
```