---
slug: '/docs/core/gdb-chaining-query-group-order-having'
title: 'Model Query - Group/Order'
sidebar_position: 6
hide_title: true
keywords: [GoFrame, GoFrame Framework, ORM, Group, Order, Having, Sorting, Group Query, Condition Filter, Database Query]
description: "Use GoFrame framework's ORM for query operations including grouping, sorting, and condition filtering. Implement data grouping with the Group method, sorting with the Order method, and condition filtering on query results with the Having method. Provides detailed code examples and method explanations to help users better master database operation skills."
---

## `Group/Order` Grouping and Sorting

The `Group` method is used for query grouping, and the `Order` method is used for query sorting. Example usage:

```go
// SELECT COUNT(*) total, age FROM `user` GROUP BY age
g.Model("user").Fields("COUNT(*) total,age").Group("age").All()

// SELECT * FROM `student` ORDER BY class asc, course asc, score desc
g.Model("student").Order("class asc,course asc,score desc").All()
```

At the same time, `goframe`’s `ORM` offers some common sorting methods:

```go
// Sort in ascending order according to a specified field
func (m *Model) OrderAsc(column string) *Model
// Sort in descending order according to a specified field
func (m *Model) OrderDesc(column string) *Model
// Random sorting
func (m *Model) OrderRandom() *Model
```

Example usage:

```go
// SELECT `id`,`title` FROM `article` ORDER BY `created_at` ASC
g.Model("article").Fields("id,title").OrderAsc("created_at").All()

// SELECT `id`,`title` FROM `article` ORDER BY `views` DESC
g.Model("article").Fields("id,title").OrderDesc("views").All()

// SELECT `id`,`title` FROM `article` ORDER BY RAND()
g.Model("article").Fields("id,title").OrderRandom().All()
```

## `Having` Condition Filtering

The `Having` method is used for condition filtering of query results. Example usage:

```go
// SELECT COUNT(*) total, age FROM `user` GROUP BY age HAVING total>100
g.Model("user").Fields("COUNT(*) total,age").Group("age").Having("total>100").All()

// SELECT * FROM `student` ORDER BY class HAVING score>60
g.Model("student").Order("class").Having("score>?", 60).All()
```