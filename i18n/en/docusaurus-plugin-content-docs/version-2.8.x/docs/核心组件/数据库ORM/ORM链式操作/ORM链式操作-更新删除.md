---
slug: '/docs/core/gdb-chaining-update-delete'
title: 'ORM Model - Update/Delete'
sidebar_position: 2
hide_title: true
keywords: [GoFrame, GoFrame framework, ORM chaining operations, data update, data delete, Counter feature, increment operation, decrement operation, RawSQL, soft delete]
description: "Performing ORM chaining operations for data update and delete in the GoFrame framework. Emphasizes the importance of using the Update and Delete methods with Where conditions. Additionally, explores the feature of using Counter parameters to increase or decrease field values, and using the Increment and Decrement methods for field operations. It also explains techniques for embedding native SQL statements and implementing soft delete to ensure flexibility and security in data processing."
---
:::warning
For security assurance and to prevent mistakes, the `Update` and `Delete` methods must have `Where` conditions to be executed; otherwise, an error will return with a message like: `there should be WHERE condition statement for XXX operation`. `goframe` is an enterprise-grade framework with rigorous module design and detailed handling of engineering practices.
:::
## `Update` Method

`Update` is used for data updates and often needs to be used in conjunction with `Data` and `Where` methods. The `Data` method specifies the data to be updated, while the `Where` method specifies the condition range for the update. The `Update` method also supports directly passing data and condition parameters.

Example usage:

```go
// UPDATE `user` SET `name`='john guo' WHERE name='john'
g.Model("user").Data(g.Map{"name" : "john guo"}).Where("name", "john").Update()
g.Model("user").Data("name='john guo'").Where("name", "john").Update()

// UPDATE `user` SET `status`=1 WHERE `status`=0 ORDER BY `login_time` asc LIMIT 10
g.Model("user").Data("status", 1).Order("login_time asc").Where("status", 0).Limit(10).Update()

// UPDATE `user` SET `status`=1 WHERE 1
g.Model("user").Data("status=1").Where(1).Update()
g.Model("user").Data("status", 1).Where(1).Update()
g.Model("user").Data(g.Map{"status" : 1}).Where(1).Update()
```

You can also directly pass `data` and `where` parameters to the `Update` method:

```go
// UPDATE `user` SET `name`='john guo' WHERE name='john'
g.Model("user").Update(g.Map{"name" : "john guo"}, "name", "john")
g.Model("user").Update("name='john guo'", "name", "john")

// UPDATE `user` SET `status`=1 WHERE 1
g.Model("user").Update("status=1", 1)
g.Model("user").Update(g.Map{"status" : 1}, 1)
```

## `Counter` Update Feature

You can use the `Counter` type parameter to numerically operate on specific fields, such as increasing and decreasing.

`Counter` data structure definition:

```go
// Counter is the type for update count.
type Counter struct {
    Field string
    Value float64
}
```

Example using `Counter` for field increment:

```go
updateData := g.Map{
    "views": &gdb.Counter{
        Field: "views",
        Value: 1,
    },
}
// UPDATE `article` SET `views`=`views`+1 WHERE `id`=1
result, err := db.Update("article", updateData, "id", 1)
```

`Counter` can also be used for incrementing by a non-own field, for example:

```go
updateData := g.Map{
    "views": &gdb.Counter{
        Field: "clicks",
        Value: 1,
    },
}
// UPDATE `article` SET `views`=`clicks`+1 WHERE `id`=1
result, err := db.Update("article", updateData, "id", 1)
```

## `Increment/Decrement`

We can use the `Increment` and `Decrement` methods to perform commonly used operations for incrementing/decrementing specified fields. The definitions for the two methods are as follows:

```go
// Increment increments a column's value by a given amount.
func (m *Model) Increment(column string, amount float64) (sql.Result, error)

// Decrement decrements a column's value by a given amount.
func (m *Model) Decrement(column string, amount float64) (sql.Result, error)
```

Example usage:

```go
// UPDATE `article` SET `views`=`views`+10000 WHERE `id`=1
g.Model("article").Where("id", 1).Increment("views", 10000)
// UPDATE `article` SET `views`=`views`-10000 WHERE `id`=1
g.Model("article").Where("id", 1).Decrement("views", 10000)
```

## `RawSQL` Statement Embedding

`gdb.Raw` is a string type, and the parameter of this type will be directly embedded as an `SQL` fragment into the SQL statement submitted to the underlying layer. It will not be automatically converted to a string parameter type, nor treated as a pre-processing parameter. For more detailed introduction, please refer to the chapter: [ORM Senior - RawSQL](../ORM高级特性/ORM高级特性-RawSQL.md). For example:

```go
// UPDATE `user` SET login_count='login_count+1',update_time='now()' WHERE id=1
g.Model("user").Data(g.Map{
    "login_count": "login_count+1",
    "update_time": "now()",
}).Where("id", 1).Update()
// Execution error: Error Code: 1136. Column count doesn't match value count at row 1
```

Revised with `gdb.Raw`:

```go
// UPDATE `user` SET login_count=login_count+1,update_time=now() WHERE id=1
g.Model("user").Data(g.Map{
    "login_count": gdb.Raw("login_count+1"),
    "update_time": gdb.Raw("now()"),
}).Where("id", 1).Update()
```

## `Delete` Method

The `Delete` method is used for data deletion.

Example usage:

```go
// DELETE FROM `user` WHERE uid=10
g.Model("user").Where("uid", 10).Delete()
// DELETE FROM `user` ORDER BY `login_time` asc LIMIT 10
g.Model("user").Order("login_time asc").Limit(10).Delete()
```

You can also directly pass `where` parameters to the `Delete` method:

```go
// DELETE FROM `user` WHERE `uid`=10
g.Model("user").Delete("uid", 10)
// DELETE FROM `user` WHERE `score`<60
g.Model("user").Delete("score < ", 60)
```

## Soft Delete Feature

For soft delete feature details, please refer to the chapter: [ORM Model - Time Fields](ORM链式操作-时间维护/ORM链式操作-时间维护.md)