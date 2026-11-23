# ORM Model - Object Input

The `Data/Where/WherePri/And/Or` methods support any `string/map/slice/struct/*struct` data type parameters, which provides `gdb` with great flexibility. When using `struct`/ `*struct` objects as input parameters, they will be automatically parsed as `map` types. Only the **public attributes** of the `struct` can be converted, and the `orm`/ `gconv`/ `json` tags are supported to define the key names after conversion, that is, the mapping relationship with the table fields.

For example:

```go
type User struct {
    Uid      int    `orm:"user_id"`
    Name     string `orm:"user_name"`
    NickName string `orm:"nick_name"`
}
// Or
type User struct {
    Uid      int    `gconv:"user_id"`
    Name     string `gconv:"user_name"`
    NickName string `gconv:"nick_name"`
}
// Or
type User struct {
    Uid      int    `json:"user_id"`
    Name     string `json:"user_name"`
    NickName string `json:"nick_name"`
}
```

In this, the attributes of `struct` should be public (first letter capitalized), and the `orm` tag corresponds to the field name of the data table. The tags for table field mapping relationships can use `orm`, `gconv`, or the traditional `json` tag. However, when all three tags are present, the `orm` tag takes precedence. To avoid conflicts with `JSON` encoding tags when converting `struct` objects to `JSON` data format, it is recommended to use the `orm` tag to achieve the database `ORM` mapping relationship. For more detailed conversion rules, please refer to the [Type Conversion - Map](https://goframe.org/en/docs/core/gconv-map.md) section.

> Page: https://goframe.org/en/docs/core/gdb-chaining-object-parameter
