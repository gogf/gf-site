---
slug: '/docs/core/gdb-chaining-query-exist'
title: 'Model Query - Exist'
sidebar_position: 3
hide_title: true
keywords: [GoFrame, GoFrame Framework, ORM Query, Exist Method, Data Retrieval, MySQL Table Structure, Model Query, Where Condition, Go Language, Query Efficiency]
description: "Using the Exist method in the GoFrame framework can effectively determine whether data meeting specific conditions exists without needing to retrieve the complete data result. Combined with MySQL table structures, it improves query efficiency using the SELECT 1 method, reducing unnecessary data transmission. This article includes method definition, MySQL table structure examples, and practical use cases to help developers better optimize model query processes."
---

The `Exist` method can retrieve whether data with the given `Where` conditions exists more efficiently instead of querying the complete data result and returning it.

Method definition:
```go
func (m *Model) Exist(where ...interface{}) (bool, error)
```

## Example SQL
This is the `MySQL` table structure used in the following example code.

```sql
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

## Usage Example

Querying complete data:
```go
// SELECT * FROM `user` WHERE (id > 1) AND `deleted_at`=0
g.Model("user").Where("id > ?", 1).All()
```

Using the `Exist` method:
```go
// SELECT 1 FROM `user` WHERE (id > 1) AND `deleted_at`=0 LIMIT 1
g.Model("user").Where("id > ?", 1).Exist()
```

As you can see, it uses `SELECT 1` at the underlying level to query the result, meaning if the result exists, it returns `1`; otherwise, it returns nothing.