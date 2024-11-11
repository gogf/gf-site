---
slug: '/docs/core/gdb-chaining-query-where'
title: 'ORM查询-Where/WhereOr/WhereNot'
sidebar_position: 0
hide_title: true
keywords: [GoFrame,ORM,查询,Where条件,条件查询,数据库,条件方法,Go语言,数据处理,GoFrame框架]
description: 'GoFrame框架中ORM组件提供的多种条件查询方法，详细阐述了Where、WhereOr、Wheref等方法的使用方式，及它们如何进行条件组合作用。通过示例展示了如何利用这些方法进行复杂数据库查询，并探讨了使用主键查询的优势。'
---

`ORM` 组件提供了一些常用的条件查询方法，并且条件方法支持多种数据类型输入。

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

下面我们对其中的几个常用方法做简单介绍，其他条件查询方法用法类似。

## `Where/WhereOr` 查询条件

### 基本介绍

这两个方法用于传递查询条件参数，支持的参数为任意的 `string/map/slice/struct/*struct` 类型。

`Where` 条件参数推荐使用字符串的参数传递方式（并使用 `?` 占位符预处理），因为 `map`/ `struct` 类型作为查询参数无法保证顺序性，且在部分情况下（数据库有时会帮助你自动进行查询索引优化），数据库的索引和你传递的查询条件顺序有一定关系。

当使用多个 `Where` 方法连接查询条件时，多个条件之间使用 `And` 进行连接。 此外，当存在多个查询条件时， `gdb` 会默认将多个条件分别使用 `()` 符号进行包含，这种设计可以非常友好地支持查询条件分组。

使用示例：

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

使用 `struct` 参数的示例，其中 `orm` 的 `tag` 用于指定 `struct` 属性与表字段的映射关系：

```go
type Condition struct{
    Sex int `orm:"sex"`
    Age int `orm:"age"`
}
Where(Condition{1, 18})
// WHERE `sex`=1 AND `age`=18
```

### 使用示例

`Where + string`，条件参数使用字符串和预处理。

```go
// 查询多条记录并使用Limit分页
// SELECT * FROM user WHERE uid>1 LIMIT 0,10
g.Model("user").Where("uid > ?", 1).Limit(0, 10).All()

// 使用Fields方法查询指定字段
// 未使用Fields方法指定查询字段时，默认查询为*
// SELECT uid,name FROM user WHERE uid>1 LIMIT 0,10
g.Model("user").Fields("uid,name").Where("uid > ?", 1).Limit(0, 10).All()

// 支持多种Where条件参数类型
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

`Where + slice`，预处理参数可直接通过 `slice` 参数给定。

```go
// SELECT * FROM user WHERE age>18 AND name like '%john%'
g.Model("user").Where("age>? AND name like ?", g.Slice{18, "%john%"}).All()

// SELECT * FROM user WHERE status=1
g.Model("user").Where("status=?", g.Slice{1}).All()
```

`Where + map`，条件参数使用任意 `map` 类型传递。

```go
// SELECT * FROM user WHERE uid=1 AND name='john' LIMIT 1
g.Model("user").Where(g.Map{"uid" : 1, "name" : "john"}).One()

// SELECT * FROM user WHERE uid=1 AND age>18 LIMIT 1
g.Model("user").Where(g.Map{"uid" : 1, "age>" : 18}).One()
```

`Where + struct/*struct`， `struct` 标签支持 `orm/json`，映射属性到字段名称关系。

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

以上的查询条件相对比较简单，我们来看一个比较复杂的查询示例。

```go
condition := g.Map{
    "title like ?"         : "%九寨%",
    "online"               : 1,
    "hits between ? and ?" : g.Slice{1, 10},
    "exp > 0"              : nil,
    "category"             : g.Slice{100, 200},
}
// SELECT * FROM article WHERE title like '%九寨%' AND online=1 AND hits between 1 and 10 AND exp > 0 AND category IN(100,200)
g.Model("article").Where(condition).All()
```

## `Wheref` 格式化条件字符串

在某些场景中，在输入带有字符串的条件语句时，往往需要结合 `fmt.Sprintf` 来格式化条件（当然，注意在字符串中使用占位符代替变量的输入而不是直接将变量格式化），因此我们提供了 `Where+fmt.Sprintf` 结合的便捷方法 `Wheref`。使用示例：

```go
// WHERE score > 100 and status in('succeeded','completed')
Wheref(`score > ? and status in (?)`, 100, g.Slice{"succeeded", "completed"})
```

## `WherePri` 支持主键的查询条件

`WherePri` 方法的功能同 `Where`，但提供了对表主键的智能识别，常用于根据主键的便捷数据查询。假如 `user` 表的主键为 `uid`，我们来看一下 `Where` 与 `WherePri` 的区别：

```go
// WHERE `uid`=1
Where("uid", 1)
WherePri(1)

// WHERE `uid` IN(1,2,3)
Where("uid", g.Slice{1,2,3})
WherePri(g.Slice{1,2,3})
```

可以看到，当使用 `WherePri` 方法且给定参数为单一的参数基本类型或者 `slice` 类型时，将会被识别为主键的查询条件值。

## `WhereBuilder` 复杂条件组合

`WhereBuilder` 用以组合生成复杂的 `Where` 条件。

### 对象创建

我们可以使用 `Model` 的 `Builder` 方法生成 `WhereBuilder` 对象。该方法定义如下：

```go
// Builder creates and returns a WhereBuilder.
func (m *Model) Builder() *WhereBuilder
```

### 使用示例

```go
// SELECT * FROM `user` WHERE `id`=1 AND `address`="USA" AND (`status`="active" OR `status`="pending")
m := g.Model("user")
all, err := m.Where("id", 1).Where("address", "USA").Where(
    m.Builder().Where("status", "active").WhereOr("status", "pending"),
).All()
```

## 注意事项：空数组条件引发的 `0=1` 条件

我们来看例子：

`SQL1`：

```go
m := g.Model("auth")
m.Where("status", g.Slice{"permitted", "inherited"}).Where("uid", 1).All()
// SELECT * FROM `auth` WHERE (`status` IN('permitted','inherited')) AND (`uid`=1)
```

`SQL2`：

```go
m := g.Model("auth")
m.Where("status", g.Slice{}).Where("uid", 1).All()
// SELECT * FROM `auth` WHERE (0=1) AND (`uid`=1)
```

可以看到，当给定的数组条件为空数组时，生成的 `SQL` 出现了 `0=1` 的无效条件，这是为什么呢？

在开发者没有显示声明可以过滤空数组条件时， `ORM` 不会自动过滤空数组条件，以避免程序逻辑绕过 `SQL` 限制条件，引发不可预知的业务问题。如果开发者确定 `SQL` 限制条件是可以过滤的，那么可以显示调用 `OmitEmpty/OmitEmptyWhere` 方法来执行空条件过滤，如下：

```go
m := g.Model("auth")
m.Where("status", g.Slice{}).Where("uid", 1).OmitEmpty().All()
// SELECT * FROM `auth` WHERE `uid`=1
```