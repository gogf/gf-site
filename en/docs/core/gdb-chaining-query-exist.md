# Model Query - Exist

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

> Page: https://goframe.org/en/docs/core/gdb-chaining-query-exist
