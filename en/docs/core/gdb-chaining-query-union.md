# Model Query - Union/UnionAll

`GoFrame ORM` component supports `Union/UnionAll` operations, where the `Union/UnionAll` operator is used to combine the results of two or more `SELECT` statements into a single result set. For more information on `Union/UnionAll` composite queries, refer to the MySQL official documentation [https://dev.mysql.com/doc/refman/8.0/en/union.html](https://dev.mysql.com/doc/refman/8.0/en/union.html). We can achieve `Union/UnionAll` operations through chaining operations or method operations.

## Method Definition

```go
// Union does "(SELECT xxx FROM xxx) UNION (SELECT xxx FROM xxx) ..." statement.
func (c *Core) Union(unions ...*Model) *Model

// UnionAll does "(SELECT xxx FROM xxx) UNION ALL (SELECT xxx FROM xxx) ..." statement.
func (c *Core) UnionAll(unions ...*Model) *Model
```

## `Union`

Using the `Union` operator, multiple `SELECT` statements will remove duplicate data.

```go
// Get the default configured database object (configuration name is "default")
db := g.DB()

db.Union(
    db.Model("user").Where("id", 1),
    db.Model("user").Where("id", 2),
    db.Model("user").WhereIn("id", g.Slice{1, 2, 3}),
).OrderDesc("id").All()
// (SELECT * FROM `user` WHERE `id`=1)
// UNION
// (SELECT * FROM `user` WHERE `id`=2)
// UNION
// (SELECT * FROM `user` WHERE `id` IN (1,2,3)
// ORDER BY `id` DESC) ORDER BY `id` DESC
```

It can also be implemented through `dao` chaining operations:

```go
dao.User.Union(
    dao.User.Where(dao.User.Columns.Id, 1),
    dao.User.Where(dao.User.Columns.Id, 2),
    dao.User.WhereIn(dao.User.Columns.Id, g.Slice{1, 2, 3}),
).OrderDesc(dao.User.Columns.Id).All()
// (SELECT * FROM `user` WHERE `id`=1)
// UNION
// (SELECT * FROM `user` WHERE `id`=2)
// UNION
// (SELECT * FROM `user` WHERE `id` IN (1,2,3)
// ORDER BY `id` DESC) ORDER BY `id` DESC
```

## `UnionAll`

Using the `UnionAll` operator, multiple `SELECT` statements will not remove duplicate data.

```go
db.UnionAll(
    db.Model("user").Where("id", 1),
    db.Model("user").Where("id", 2),
    db.Model(table).WhereIn("id", g.Slice{1, 2, 3}),
).OrderDesc("id").All()
// (SELECT * FROM `user` WHERE `id`=1)
// UNION ALL
// (SELECT * FROM `user` WHERE `id`=2)
// UNION ALL
// (SELECT * FROM `user` WHERE `id` IN (1,2,3)
// ORDER BY `id` DESC) ORDER BY `id` DESC
```

It can also be implemented through `dao` chaining operations:

```go
dao.User.UnionAll(
    dao.User.Where(dao.User.Columns.Id, 1),
    dao.User.Where(dao.User.Columns.Id, 2),
    dao.User.WhereIn(dao.User.Columns.Id, g.Slice{1, 2, 3}),
).OrderDesc(dao.User.Columns.Id).All()
// (SELECT * FROM `user` WHERE `id`=1)
// UNION ALL
// (SELECT * FROM `user` WHERE `id`=2)
// UNION ALL
// (SELECT * FROM `user` WHERE `id` IN (1,2,3)
// ORDER BY `id` DESC) ORDER BY `id` DESC
```

> Page: https://goframe.org/en/docs/core/gdb-chaining-query-union
