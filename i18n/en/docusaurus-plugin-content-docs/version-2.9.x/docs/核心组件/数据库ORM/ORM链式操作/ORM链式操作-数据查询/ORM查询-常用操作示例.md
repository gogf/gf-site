---
slug: '/docs/core/gdb-chaining-query-example'
title: 'Model Query - Operators'
sidebar_position: 9
hide_title: true
keywords: [GoFrame, ORM Query, Database Operations, Chaining Queries, Common Conditions, Statistical Methods, Field Uniqueness, Query Examples, GoFrame Framework, Parameter Filtering]
description: "Common operation examples for ORM queries using the GoFrame framework, including IN, LIKE, MIN/MAX/AVG/SUM operations. It also introduces the use of chaining query methods like WhereIn, WhereNotIn, WhereBetween, etc., and helps understand different query strategies and parameter filtering through examples."
---

## `in` Query

Use string or `slice` parameter types. When using the `slice` parameter type, only one `?` placeholder is needed.

```go
// SELECT * FROM user WHERE uid IN(100,10000,90000)
g.Model("user").Where("uid IN(?,?,?)", 100, 10000, 90000).All()
g.Model("user").Where("uid", g.Slice{100, 10000, 90000}).All()

// SELECT * FROM user WHERE gender=1 AND uid IN(100,10000,90000)
g.Model("user").Where("gender=? AND uid IN(?)", 1, g.Slice{100, 10000, 90000}).All()

// SELECT COUNT(*) FROM user WHERE age in(18,50)
g.Model("user").Where("age IN(?,?)", 18, 50).Count()
g.Model("user").Where("age", g.Slice{18, 50}).Count()
```

Use any `map` parameter type.

```go
// SELECT * FROM user WHERE gender=1 AND uid IN(100,10000,90000)
g.Model("user").Where(g.Map{
    "gender" : 1,
    "uid"    : g.Slice{100,10000,90000},
}).All()
```

Use `struct` parameter type, note that the order of query conditions depends on the order of struct attribute definitions.

```go
type User struct {
    Id     []int  `orm:"uid"`
    Gender int    `orm:"gender"`
}
// SELECT * FROM `user` WHERE uid IN(100,10000,90000) AND gender=1
g.Model("user").Where(User{
    Gender: 1,
    Id:     []int{100, 10000, 90000},
}).All()

```

For usability, if the passed `slice` parameter is empty or `nil`, the query will not throw an error but convert to a `false` condition statement.

```go
// SELECT * FROM `user` WHERE 0=1
g.Model("user").Where("uid", g.Slice{}).All()
// SELECT * FROM `user` WHERE `uid` IS NULL
g.Model("user").Where("uid", nil).All()
```

The `ORM` also provides common condition methods `WhereIn/WhereNotIn/WhereOrIn/WhereOrNotIn` for common `In` query condition filtering. Method definitions are as follows:

```go
func (m *Model) WhereIn(column string, in interface{}) *Model
func (m *Model) WhereNotIn(column string, in interface{}) *Model
func (m *Model) WhereOrIn(column string, in interface{}) *Model
func (m *Model) WhereOrNotIn(column string, in interface{}) *Model
```

Examples:

```go
// SELECT * FROM `user` WHERE (`gender`=1) AND (`type` IN(1,2,3))
g.Model("user").Where("gender", 1).WhereIn("type", g.Slice{1,2,3}).All()

// SELECT * FROM `user` WHERE (`gender`=1) AND (`type` NOT IN(1,2,3))
g.Model("user").Where("gender", 1).WhereNotIn("type", g.Slice{1,2,3}).All()

// SELECT * FROM `user` WHERE (`gender`=1) OR (`type` IN(1,2,3))
g.Model("user").Where("gender", 1).WhereOrIn("type", g.Slice{1,2,3}).All()

// SELECT * FROM `user` WHERE (`gender`=1) OR (`type` NOT IN(1,2,3))
g.Model("user").Where("gender", 1).WhereOrNotIn("type", g.Slice{1,2,3}).All()
```

## `like` Query

```go
// SELECT * FROM `user` WHERE name like '%john%'
g.Model("user").Where("name like ?", "%john%").All()
// SELECT * FROM `user` WHERE birthday like '1990-%'
g.Model("user").Where("birthday like ?", "1990-%").All()

```

Starting from `goframe v1.16`, `goframe`'s `ORM` also provides common condition methods `WhereLike/WhereNotLike/WhereOrLike/WhereOrNotLike` for common `Like` query condition filtering. Method definitions are as follows:

```go
func (m *Model) WhereLike(column string, like interface{}) *Model
func (m *Model) WhereNotLike(column string, like interface{}) *Model
func (m *Model) WhereOrLike(column string, like interface{}) *Model
func (m *Model) WhereOrNotLike(column string, like interface{}) *Model
```

Examples:

```go
// SELECT * FROM `user` WHERE (`gender`=1) AND (`name` LIKE 'john%')
g.Model("user").Where("gender", 1).WhereLike("name", "john%").All()

// SELECT * FROM `user` WHERE (`gender`=1) AND (`name` NOT LIKE 'john%')
g.Model("user").Where("gender", 1).WhereNotLike("name", "john%").All()

// SELECT * FROM `user` WHERE (`gender`=1) OR (`name` LIKE 'john%')
g.Model("user").Where("gender", 1).WhereOrLike("name", "john%").All()

// SELECT * FROM `user` WHERE (`gender`=1) OR (`name` NOT LIKE 'john%')
g.Model("user").Where("gender", 1).WhereOrNotLike("name", "john%").All()
```

## `min/max/avg/sum`

We directly apply the statistical method on the `Fields` method, for example:

```go
// SELECT MIN(score) FROM `user` WHERE `uid`=1 LIMIT 1
g.Model("user").Fields("MIN(score)").Where("uid", 1).Value()

// SELECT MAX(score) FROM `user` WHERE `uid`=1 LIMIT 1
g.Model("user").Fields("MAX(score)").Where("uid", 1).Value()

// SELECT AVG(score) FROM `user` WHERE `uid`=1 LIMIT 1
g.Model("user").Fields("AVG(score)").Where("uid", 1).Value()

// SELECT SUM(score) FROM `user` WHERE `uid`=1  LIMIT 1
g.Model("user").Fields("SUM(score)").Where("uid", 1).Value()
```

Starting from `goframe v1.16`, `goframe`'s `ORM` also provides common statistical methods `Min/Max/Avg/Sum` for common field statistical queries. Method definitions are as follows:

```go
func (m *Model) Min(column string) (float64, error)
func (m *Model) Max(column string) (float64, error)
func (m *Model) Avg(column string) (float64, error)
func (m *Model) Sum(column string) (float64, error)
```

The above examples using shortcut statistical methods:

```go
// SELECT MIN(`score`) FROM `user` WHERE `uid`=1 LIMIT 1
g.Model("user").Where("uid", 1).Min("score")

// SELECT MAX(`score`) FROM `user` WHERE `uid`=1 LIMIT 1
g.Model("user").Where("uid", 1).Max("score")

// SELECT AVG(`score`) FROM `user` WHERE `uid`=1 LIMIT 1
g.Model("user").Where("uid", 1).Avg("score")

// SELECT SUM(`score`) FROM `user` WHERE `uid`=1 LIMIT 1
g.Model("user").Where("uid", 1).Sum("score")
```

## `count` Query

```go
// SELECT COUNT(1) FROM `user` WHERE `birthday`='1990-10-01'
g.Model("user").Where("birthday", "1990-10-01").Count()
// SELECT COUNT(uid) FROM `user` WHERE `birthday`='1990-10-01'
g.Model("user").Fields("uid").Where("birthday", "1990-10-01").Count()

```

Starting from `goframe v1.16`, `goframe`'s `ORM` also provides a common method `CountColumn` for `Count` by field. Method definition is as follows:

```go
func (m *Model) CountColumn(column string) (int, error)
```

Example:

```go
g.Model("user").Where("birthday", "1990-10-01").CountColumn("uid")
```

## `distinct` Query

```go
// SELECT DISTINCT uid,name FROM `user`
g.Model("user").Fields("DISTINCT uid,name").All()
// SELECT COUNT(DISTINCT uid,name) FROM `user`
g.Model("user").Fields("DISTINCT uid,name").Count()

```

Starting from `goframe v1.16`, `goframe`'s `ORM` also provides a method `Distinct` for field uniqueness filtering. Method definition is as follows:

```go
func (m *Model) Distinct() *Model
```

Example:

```go
// SELECT COUNT(DISTINCT `name`) FROM `user`
g.Model("user").Distinct().CountColumn("name")

// SELECT COUNT(DISTINCT uid,name) FROM `user`
g.Model("user").Distinct().CountColumn("uid,name")

// SELECT DISTINCT group,age FROM `user`
g.Model("user").Fields("group, age").Distinct().All()
```

## `between` Query

```go
// SELECT * FROM `user` WHERE age between 18 and 20
g.Model("user").Where("age between ? and ?", 18, 20).All()

```

Starting from `goframe v1.16`, `goframe`'s `ORM` also provides common condition methods `WhereBetween/WhereNotBetween/WhereOrBetween/WhereOrNotBetween` for common `Between` query condition filtering. Method definitions are as follows:

```go
func (m *Model) WhereBetween(column string, min, max interface{}) *Model
func (m *Model) WhereNotBetween(column string, min, max interface{}) *Model
func (m *Model) WhereOrBetween(column string, min, max interface{}) *Model
func (m *Model) WhereOrNotBetween(column string, min, max interface{}) *Model
```

Examples:

```go
// SELECT * FROM `user` WHERE (`gender`=0) AND (`age` BETWEEN 16 AND 20)
g.Model("user").Where("gender", 0).WhereBetween("age", 16, 20).All()

// SELECT * FROM `user` WHERE (`gender`=0) AND (`age` NOT BETWEEN 16 AND 20)
g.Model("user").Where("gender", 0).WhereNotBetween("age", 16, 20).All()

// SELECT * FROM `user` WHERE (`gender`=0) OR (`age` BETWEEN 16 AND 20)
g.Model("user").Where("gender", 0).WhereOrBetween("age", 16, 20).All()

// SELECT * FROM `user` WHERE (`gender`=0) OR (`age` NOT BETWEEN 16 AND 20)
g.Model("user").Where("gender", 0).WhereOrNotBetween("age", 16, 20).All()
```

## `null` Query

The `ORM` provides common condition methods `WhereNull/WhereNotNull/WhereOrNull/WhereOrNotNull` for common `Null` query condition filtering. Method definitions are as follows:

```go
func (m *Model) WhereNull(columns ...string) *Model
func (m *Model) WhereNotNull(columns ...string) *Model
func (m *Model) WhereOrNull(columns ...string) *Model
func (m *Model) WhereOrNotNull(columns ...string) *Model
```

Examples:

```go
// SELECT * FROM `user` WHERE (`created_at`>'2021-05-01 00:00:00') AND (`inviter` IS NULL)
g.Model("user").Where("created_at>?", gtime.New("2021-05-01")).WhereNull("inviter").All()

// SELECT * FROM `user` WHERE (`created_at`>'2021-05-01 00:00:00') AND (`inviter` IS NOT NULL)
g.Model("user").Where("created_at>?", gtime.New("2021-05-01")).WhereNotNull("inviter").All()

// SELECT * FROM `user` WHERE (`created_at`>'2021-05-01 00:00:00') OR (`inviter` IS NULL)
g.Model("user").Where("created_at>?", gtime.New("2021-05-01")).WhereOrNull("inviter").All()

// SELECT * FROM `user` WHERE (`created_at`>'2021-05-01 00:00:00') OR (`inviter` IS NOT NULL)
g.Model("user").Where("created_at>?", gtime.New("2021-05-01")).WhereOrNotNull("inviter").All()
```

Additionally, these methods support multiple field inputs, for example:

```go
// SELECT * FROM `user` WHERE (`created_at`>'2021-05-01 00:00:00') AND (`inviter` IS NULL) AND (`creator` IS NULL)
g.Model("user").Where("created_at>?", gtime.New("2021-05-01")).WhereNull("inviter", "creator").All()
```