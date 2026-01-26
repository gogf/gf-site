---
slug: '/docs/core/gdb-chaining-query-exist'
title: 'ORM查询-Exist'
sidebar_position: 3
hide_title: true
keywords: [GoFrame,GoFrame框架,ORM查询,Exist方法,数据检索,MySQL表结构,模型查询,Where条件,Go语言,查询效率]
description: '使用GoFrame框架的Exist方法能够有效判断满足特定条件的数据是否存在而无需获取完整数据结果。配合MySQL表结构，通过SELECT 1方式提升查询效率，降低不必要的数据传输。本文包含方法定义、MySQL表结构示例及实际使用情境，帮助开发者更好地优化模型查询环节。'
---

`Exist`方法可以更高效地检索所给的`Where`条件数据是否存在，而不是查询完整的数据结果后返回。

方法定义：
```go
func (m *Model) Exist(where ...interface{}) (bool, error)
```

## 示例SQL
这是后续示例代码中用到的`MySQL`表结构。

```sql
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

## 使用示例

查询完整数据：
```go
// SELECT * FROM `user` WHERE (id > 1) AND `deleted_at`=0
g.Model("user").Where("id > ?", 1).All()
```

使用`Exist`方法：
```go
// SELECT 1 FROM `user` WHERE (id > 1) AND `deleted_at`=0 LIMIT 1
g.Model("user").Where("id > ?", 1).Exist()
```

可以看到底层是使用`SELECT 1`来查询结果，即如果结果存在则返回`1`，否则什么也不返回。