---
slug: '/docs/core/gdb-chaining-query-where'
title: 'Model Query - Where'
sidebar_position: 0
hide_title: true
keywords: [GoFrame, ORM, query, Where conditions, condition queries, database, conditional methods, Go language, data processing, GoFrame framework]
description: "A detailed discussion of the various conditional query methods provided by the ORM component in the GoFrame framework, including ways to use methods like Where, WhereOr, Wheref, etc., and how they perform conditional grouping. Through examples, it demonstrates how to use these methods for complex database queries and explores the advantages of using primary key queries."
---

The `ORM` component provides some commonly used conditional query methods, and the conditional methods support multiple data type inputs.

```go
func (m *Model) Where(where interface{}, args...interface{}) *Model
func (m *Model) Wheref(format string, args ...interface{}) *Model
func (m *Model) WherePri(where interface{}, args ...interface{}) *Model
func (m *Model) WhereBetween(column string, min, max interface{}) *Model
func (m *Model) WhereLike(column string, like interface{}) *Model
func (m *Model) WhereIn(column string, in interface{}) *Model
func (m *Model) WhereNull(columns ...string) *Model
func (m *Model) WhereLT(column string, value interface{}) *Model
func (m *Model) WhereLTE(column string, value interface{}) *Model
func (m *Model) WhereGT(column string, value interface{}) *Model
func (m *Model) WhereGTE(column string, value interface{}) *Model

func (m *Model) WhereNotBetween(column string, min, max interface{}) *Model
func (m *Model) WhereNotLike(column string, like interface{}) *Model
func (m *Model) WhereNotIn(column string, in interface{}) *Model
func (m *Model) WhereNotNull(columns ...string) *Model

func (m *Model) WhereOr(where interface{}, args ...interface{}) *Model
func (m *Model) WhereOrBetween(column string, min, max interface{}) *Model
func (m *Model) WhereOrLike(column string, like interface{}) *Model
func (m *Model) WhereOrIn(column string, in interface{}) *Model
func (m *Model) WhereOrNull(columns ...string) *Model
func (m *Model) WhereOrLT(column string, value interface{}) *Model
func (m *Model) WhereOrLTE(column string, value interface{}) *Model
func (m *Model) WhereOrGT(column string, value interface{}) *Model
func (m *Model) WhereOrGTE(column string, value interface{}) *Model

func (m *Model) WhereOrNotBetween(column string, min, max interface{}) *Model
func (m *Model) WhereOrNotLike(column string, like interface{}) *Model
func (m *Model) WhereOrNotIn(column string, in interface{}) *Model
func (m *Model) WhereOrNotNull(columns ...string) *Model
```

Below, we provide a brief introduction to several commonly used methods; other conditional query methods are similar in usage.

## `Where/WhereOr` Query Conditions

### Introduction

These two methods are used to pass query condition parameters, and the supported parameters can be any `string/map/slice/struct/*struct` type.

It is recommended to use a string parameter method for `Where` condition parameters (using `?` as a placeholder for preprocessing) because `map`/`struct` types as query parameters cannot guarantee order, and in some cases (the database may help you automatically optimize query indexes), the order of the database index and the order of your query condition has a certain relationship.

When using multiple `Where` methods to connect query conditions, the conditions are connected using `And`. In addition, when multiple query conditions exist, `gdb` will default to enclosing each condition in `()` brackets, allowing for friendly support for query condition grouping.

Example usage:

```go
// WHERE `uid`=1
Where("uid=1")
Where("uid", 1)
Where("uid=?", 1)
Where(g.Map{"uid" : 1})
// WHERE `uid` <= 1000 AND `age` >= 18
Where(g.Map{
    "uid <=" : 1000,
    "age >=" : 18,
})

// WHERE (`uid` <= 1000) AND (`age` >= 18)
Where("uid <=?", 1000).Where("age >=?", 18)

// WHERE `level`=1 OR `money`>=1000000
Where("level=? OR money >=?", 1, 1000000)

// WHERE (`level`=1) OR (`money`>=1000000)
Where("level", 1).WhereOr("money >=", 1000000)

// WHERE `uid` IN(1,2,3)
Where("uid IN(?)", g.Slice{1,2,3})
```

Example using `struct` parameters, where the `orm` `tag` is used to specify the mapping relationship between `struct` attributes and table fields:

```go
type Condition struct{
    Sex int `orm:"sex"`
    Age int `orm:"age"`
}
Where(Condition{1, 18})
// WHERE `sex`=1 AND `age`=18
```

### Example Usage

`Where + string`, using string and preprocessing as condition parameters.

```go
// Query multiple records with Limit pagination
// SELECT * FROM user WHERE uid>1 LIMIT 0,10
g.Model("user").Where("uid > ?", 1).Limit(0, 10).All()

// Using the Fields method to specify query fields
// Default query is * when Fields method is not used to specify query fields
// SELECT uid,name FROM user WHERE uid>1 LIMIT 0,10
g.Model("user").Fields("uid,name").Where("uid > ?", 1).Limit(0, 10).All()

// Supporting multiple Where condition parameter types
// SELECT * FROM user WHERE uid=1 LIMIT 1
g.Model("user").Where("uid=1").One()
g.Model("user").Where("uid", 1).One()
g.Model("user").Where("uid=?", 1).One()

// SELECT * FROM user WHERE (uid=1) AND (name='john') LIMIT 1
g.Model("user").Where("uid", 1).Where("name", "john").One()
g.Model("user").Where("uid=?", 1).Where("name=?", "john").One()

// SELECT * FROM user WHERE (uid=1) OR (name='john') LIMIT 1
g.Model("user").Where("uid=?", 1).WhereOr("name=?", "john").One()
```

`Where + slice`, preprocessing parameters can be directly provided through the `slice` parameter.

```go
// SELECT * FROM user WHERE age>18 AND name like '%john%'
g.Model("user").Where("age>? AND name like ?", g.Slice{18, "%john%"}).All()

// SELECT * FROM user WHERE status=1
g.Model("user").Where("status=?", g.Slice{1}).All()
```

`Where + map`, using any `map` type to pass condition parameters.

```go
// SELECT * FROM user WHERE uid=1 AND name='john' LIMIT 1
g.Model("user").Where(g.Map{"uid" : 1, "name" : "john"}).One()

// SELECT * FROM user WHERE uid=1 AND age>18 LIMIT 1
g.Model("user").Where(g.Map{"uid" : 1, "age>" : 18}).One()
```

`Where + struct/*struct`, `struct` tags support `orm/json`, mapping properties to field names.

```go
type User struct {
    Id       int    `json:"uid"`
    UserName string `orm:"name"`
}
// SELECT * FROM user WHERE uid =1 AND name='john' LIMIT 1
g.Model("user").Where(User{ Id : 1, UserName : "john"}).One()

// SELECT * FROM user WHERE uid =1 LIMIT 1
g.Model("user").Where(&User{ Id : 1}).One()
```

The query conditions above are relatively simple. Let's look at a more complex query example.

```go
condition := g.Map{
    "title like ?"         : "%Jiuzhai%",
    "online"               : 1,
    "hits between ? and ?" : g.Slice{1, 10},
    "exp > 0"              : nil,
    "category"             : g.Slice{100, 200},
}
// SELECT * FROM article WHERE title like '%Jiuzhai%' AND online=1 AND hits between 1 and 10 AND exp > 0 AND category IN(100,200)
g.Model("article").Where(condition).All()
```

## `Wheref` Formatted Condition String

In some scenarios, entering a conditional statement with strings often requires the use of `fmt.Sprintf` to format the condition (note to use placeholders in the string instead of directly formatting the variable), so a convenient method combining `Where+fmt.Sprintf`, `Wheref`, is provided. Usage example:

```go
// WHERE score > 100 and status in('succeeded','completed')
Wheref(`score > ? and status in (?)`, 100, g.Slice{"succeeded", "completed"})
```

## `WherePri` Supports Primary Key Query Conditions

The `WherePri` method functions the same way as `Where`, but it provides intelligent recognition of table primary keys and is commonly used for convenient data queries based on primary keys. Suppose the primary key of the `user` table is `uid`, let's see the difference between `Where` and `WherePri`:

```go
// WHERE `uid`=1
Where("uid", 1)
WherePri(1)

// WHERE `uid` IN(1,2,3)
Where("uid", g.Slice{1,2,3})
WherePri(g.Slice{1,2,3})
```

As you can see, when using the `WherePri` method and the given parameter is a single basic type or a `slice` type, it will be recognized as the value of the primary key query condition.

## `WhereBuilder` Complex Condition Combinations

`WhereBuilder` is used to generate complex `Where` conditions.

### Object Creation

We can use the `Builder` method of `Model` to generate a `WhereBuilder` object. The method is defined as follows:

```go
// Builder creates and returns a WhereBuilder.
func (m *Model) Builder() *WhereBuilder
```

### Usage Example

```go
// SELECT * FROM `user` WHERE `id`=1 AND `address`="USA" AND (`status`="active" OR `status`="pending")
m := g.Model("user")
all, err := m.Where("id", 1).Where("address", "USA").Where(
    m.Builder().Where("status", "active").WhereOr("status", "pending"),
).All()
```

## Note: `0=1` Condition Triggered by Empty Array Condition

Let's look at an example:

`SQL1`:

```go
m := g.Model("auth")
m.Where("status", g.Slice{"permitted", "inherited"}).Where("uid", 1).All()
// SELECT * FROM `auth` WHERE (`status` IN('permitted','inherited')) AND (`uid`=1)
```

`SQL2`:

```go
m := g.Model("auth")
m.Where("status", g.Slice{}).Where("uid", 1).All()
// SELECT * FROM `auth` WHERE (0=1) AND (`uid`=1)
```

As you can see, when the given array condition is an empty array, the resulting `SQL` has a `0=1` invalid condition. Why is that?

When developers do not explicitly declare the intention to filter empty array conditions, `ORM` does not automatically filter empty array conditions to avoid program logic bypassing `SQL` restriction conditions, which could cause unpredictable business issues. If the developer determines that the `SQL` restriction condition can be filtered, they can explicitly call the `OmitEmpty/OmitEmptyWhere` methods to perform empty condition filtering, as shown below:

```go
m := g.Model("auth")
m.Where("status", g.Slice{}).Where("uid", 1).OmitEmpty().All()
// SELECT * FROM `auth` WHERE `uid`=1
```