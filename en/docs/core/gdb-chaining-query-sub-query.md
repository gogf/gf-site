# Model Query - Subquery

The `ORM` component currently supports three common subquery syntaxes: `Where` subquery, `Having` subquery, and `From` subquery.

## `Where` Subquery

We can use subquery statements in the `Where` condition, for example:

```go
g.Model("orders").Where("amount > ?", g.Model("orders").Fields("AVG(amount)")).Scan(&orders)
// SELECT * FROM "orders" WHERE amount > (SELECT AVG(amount) FROM "orders")
```

## `Having` Subquery

We can use subquery statements in the `Having` condition, for example:

```go
subQuery := g.Model("users").Fields("AVG(age)").WhereLike("name", "name%")
g.Model("users").Fields("AVG(age) as avgage").Group("name").Having("AVG(age) > ?", subQuery).Scan(&results)
// SELECT AVG(age) as avgage FROM `users` GROUP BY `name` HAVING AVG(age) > (SELECT AVG(age) FROM `users` WHERE name LIKE "name%")
```

## `From` Subquery

We can use subquery statements when creating models using the `Model` method, for example:

```go
g.Model("? as u", g.Model("users").Fields("name", "age")).Where("age", 18).Scan(&users)
// SELECT * FROM (SELECT `name`,`age` FROM `users`) as u WHERE `age` = 18

subQuery1 := g.Model("users").Fields("name")
subQuery2 := g.Model("pets").Fields("name")
g.Model("? as u, ? as p", subQuery1, subQuery2).Scan(&users)
// SELECT * FROM (SELECT `name` FROM `users`) as u, (SELECT `name` FROM `pets`) as p
```

> Page: https://goframe.org/en/docs/core/gdb-chaining-query-sub-query
