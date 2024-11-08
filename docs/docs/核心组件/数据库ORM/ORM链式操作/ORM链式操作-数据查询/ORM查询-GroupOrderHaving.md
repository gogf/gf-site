---
slug: '/docs/core/gdb-chaining-query-group-order-having'
title: 'ORM查询-Group/Order/Having'
sidebar_position: 6
hide_title: true
keywords: [GoFrame,GoFrame框架,ORM,Group,Order,Having,排序,分组查询,条件过滤,数据库查询]
description: '本文档介绍如何使用GoFrame框架的ORM进行查询操作，包括分组、排序和条件过滤。通过Group方法实现数据分组，通过Order方法进行排序，以及通过Having方法对查询结果进行条件过滤，提供了详细的代码示例和方法说明，帮助用户更好地掌握数据库操作技能。'
---

## `Group/Order` 分组与排序

`Group` 方法用于查询分组， `Order` 方法用于查询排序。使用示例：

```go
// SELECT COUNT(*) total,age FROM `user` GROUP BY age
g.Model("user").Fields("COUNT(*) total,age").Group("age").All()

// SELECT * FROM `student` ORDER BY class asc,course asc,score desc
g.Model("student").Order("class asc,course asc,score desc").All()
```

同时， `goframe` 的 `ORM` 提供了一些常用的排序方法：

```go
// 按照指定字段递增排序
func (m *Model) OrderAsc(column string) *Model
// 按照指定字段递减排序
func (m *Model) OrderDesc(column string) *Model
// 随机排序
func (m *Model) OrderRandom() *Model
```

使用示例：

```go
// SELECT `id`,`title` FROM `article` ORDER BY `created_at` ASC
g.Model("article").Fields("id,title").OrderAsc("created_at").All()

// SELECT `id`,`title` FROM `article` ORDER BY `views` DESC
g.Model("article").Fields("id,title").OrderDesc("views").All()

// SELECT `id`,`title` FROM `article` ORDER BY RAND()
g.Model("article").Fields("id,title").OrderRandom().All()
```

## `Having` 条件过滤

`Having` 方法用于查询结果的条件过滤。使用示例：

```go
// SELECT COUNT(*) total,age FROM `user` GROUP BY age HAVING total>100
g.Model("user").Fields("COUNT(*) total,age").Group("age").Having("total>100").All()

// SELECT * FROM `student` ORDER BY class HAVING score>60
g.Model("student").Order("class").Having("score>?", 60).All()
```