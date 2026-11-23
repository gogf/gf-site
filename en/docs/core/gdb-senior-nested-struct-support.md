# ORM Senior - Embedded Struct

The `GoFrame ORM` component provides excellent support for `struct` embedded structures, including parameter passing and result processing. For example:

```go
type Base struct {
    Uid        int         `orm:"uid"`
    CreateAt   *gtime.Time `orm:"create_at"`
    UpdateAt   *gtime.Time `orm:"update_at"`
    DeleteAt   *gtime.Time `orm:"delete_at"`
}
type User struct {
    Base
    Passport   string `orm:"passport"`
    Password   string `orm:"password"`
    Nickname   string `orm:"nickname"`
}
```

Furthermore, regardless of how many levels of `struct` nesting there are, `ORM` supports parameter passing and result processing.

> Page: https://goframe.org/en/docs/core/gdb-senior-nested-struct-support
