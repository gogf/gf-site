# Model Query - Scan

The `Scan` method supports converting query results into a struct or struct array. The `Scan` method will automatically identify the type of conversion to execute based on the given parameter type.

## `struct` Object

The `Scan` method supports converting query results into a `struct` object. The query result should be a specific single record, and the `pointer` parameter should be the pointer address of the `struct` object (`*struct` or `**struct`). For example:

```go
type User struct {
    Id         int
    Passport   string
    Password   string
    NickName   string
    CreateTime *gtime.Time
}
user := User{}
g.Model("user").Where("id", 1).Scan(&user)
```

Or

```go
var user = User{}
g.Model("user").Where("id", 1).Scan(&user)
```

The first two methods pre-initialize the object (allocate memory in advance), while the recommended method is:

```go
var user *User
g.Model("user").Where("id", 1).Scan(&user)
```

This method initializes and allocates memory only when data is queried. Note the difference in usage, especially the difference in parameter types (the first two methods pass a `*User` type, while this method actually passes a `**User` type).

## `struct` Array

The `Scan` method supports converting multiple query results into a `[]struct/[]*struct` array. The query result should be a result set composed of multiple records, and the `pointer` should be the pointer address of the array. For example:

```go
var users []User
g.Model("user").Scan(&users)
```

Or

```go
var users []*User
g.Model("user").Scan(&users)
```

> Page: https://goframe.org/en/docs/core/gdb-chaining-query-scan
