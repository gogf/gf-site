---
slug: '/docs/core/gdb-chaining-fields-filtering'
title: 'ORM Model - Fields Filtering'
sidebar_position: 6
hide_title: true
keywords: [GoFrame, GoFrame Framework, ORM, Field Filtering, Fields, FieldsEx, OmitEmpty, OmitNil, GoFrame DAO, Table]
description: "How to perform field filtering when operating databases with the GoFrame framework. It describes in detail the purposes and examples of the Fields and FieldsEx methods, and explores how the OmitEmpty and OmitNil features help filter out empty data during database writing. Additionally, it discusses the impact of null values on query conditions."
---

## `Fields/FieldsEx` Field Filtering

1. `Fields` is used to specify the fields of the table to be operated on, including query fields, write fields, update fields, etc.;
2. `FieldsEx` is used for specifying exception fields and can be used for query fields, write fields, update fields, etc.;

### `Fields` Example

1. Suppose the `user` table has 4 fields: `uid`, `nickname`, `passport`, `password`.
2. Query field filtering
    ```go
    // SELECT `uid`,`nickname` FROM `user` ORDER BY `uid` asc
    g.Model("user").Fields("uid, nickname").Order("uid asc").All()
    ```

3. Write field filtering
    ```go
    m := g.Map{
        "uid"      : 10000,
        "nickname" : "John Guo",
        "passport" : "john",
        "password" : "123456",
    }
    g.Model(table).Fields("nickname,passport,password").Data(m).Insert()
    // INSERT INTO `user`(`nickname`,`passport`,`password`) VALUES('John Guo','john','123456')
    ```
4. Supports `gdb.Raw` input
    ```go
    // SELECT 1 FROM `user` WHERE `id`=10
    g.Model("user").Fields(gdb.Raw("1")).Where("id", 10).Value()
    ```

### `FieldsEx` Example

1. Suppose the `user` table has 4 fields: `uid`, `nickname`, `passport`, `password`.
2. Query field exclusion

    ```go
    // SELECT `uid`,`nickname` FROM `user`
    g.Model("user").FieldsEx("passport, password").All()
    ```

1. Write field exclusion
    ```go
    m := g.Map{
        "uid"      : 10000,
        "nickname" : "John Guo",
        "passport" : "john",
        "password" : "123456",
    }
    g.Model(table).FieldsEx("uid").Data(m).Insert()
    // INSERT INTO `user`(`nickname`,`passport`,`password`) VALUES('John Guo','john','123456')
    ```


## `OmitEmpty` Empty Value Filtering

When there are empty values like `nil`, `""`, `0` in a `map`/ `struct`, by default, `gdb` will consider them as normal input parameters, and hence, they will be updated to the data table. The `OmitEmpty` feature helps filter out these empty fields before writing data to the database.

Related methods:

```go
func (m *Model) OmitEmpty() *Model
func (m *Model) OmitEmptyWhere() *Model
func (m *Model) OmitEmptyData() *Model
```

The `OmitEmpty` method filters out empty data fields from both `Where` and `Data`, while the `OmitEmptyWhere/OmitEmptyData` methods allow specific field filtering.

### Insert/Update Operations

Empty values affect insert/update operation methods like `Insert`, `Replace`, `Update`, `Save`. As in the following operation (taking `map` as an example, the same applies to `struct`):

```go
// UPDATE `user` SET `name`='john',update_time=null WHERE `id`=1
g.Model("user").Data(g.Map{
    "name"        : "john",
    "update_time" : nil,
}).Where("id", 1).Update()
```

To handle empty values, we can use the `OmitEmpty` method to filter them out. For example, the above example can be modified as follows:

```go
// UPDATE `user` SET `name`='john' WHERE `id`=1
g.Model("user").OmitEmpty().Data(g.Map{
    "name"        : "john",
    "update_time" : nil,
}).Where("id", 1).Update()
```

For `struct` data parameters, we can also perform empty value filtering. An operation example:

```go
type User struct {
    Id         int    `orm:"id"`
    Passport   string `orm:"passport"`
    Password   string `orm:"password"`
    NickName   string `orm:"nickname"`
    CreateTime string `orm:"create_time"`
    UpdateTime string `orm:"update_time"`
}
user := User{
    Id        : 1,
    NickName  : "john",
    UpdateTime: gtime.Now().String(),
}
g.Model("user").OmitEmpty().Data(user).Insert()
// INSERT INTO `user`(`id`,`nickname`,`update_time`) VALUES(1,'john','2019-10-01 12:00:00')
```
:::warning
Note that in batch insert/update operations, the `OmitEmpty` method will be ineffective because fields for each inserted record must be consistent.
:::
Regarding the `omitempty` tag and the `OmitEmpty` method:

1. For empty value filtering in `struct`, people might think of the `omitempty` tag. This tag is commonly used for filtering empty values in `json` conversion and in some third-party `ORM` libraries for filtering out `struct` fields with empty values, meaning when a property is empty, it is not converted.
2. The `omitempty` tag and the `OmitEmpty` method achieve the same effect. In `ORM` operations, we do not recommend using the `omitempty` tag on `struct` to control field empty value filtering. Instead, we suggest using the `OmitEmpty` method. Once the tag is applied, it binds to the `struct`, and there is no way to control it flexibly; however, with the `OmitEmpty` method, developers can selectively filter empty values based on the business scenario, allowing for more flexible operations.

### Data Query Operations

Empty values also affect data query operations, mainly impacting `where` condition parameters. We can filter empty values in condition parameters using the `OmitEmpty` method.

Examples of use:

```go
// SELECT * FROM `user` WHERE `passport`='john' LIMIT 1
r, err := g.Model("user").Where(g.Map{
    "nickname" : "",
    "passport" : "john",
}).OmitEmpty().One()
```

```go
type User struct {
    Id         int    `orm:"id"`
    Passport   string `orm:"passport"`
    Password   string `orm:"password"`
    NickName   string `orm:"nickname"`
    CreateTime string `orm:"create_time"`
    UpdateTime string `orm:"update_time"`
}
user := User{
    Passport : "john",
}
r, err := g.Model("user").OmitEmpty().Where(user).One()
// SELECT * FROM `user` WHERE `passport`='john' LIMIT 1
```

## `OmitNil` Empty Value Filtering

### Overview

When there are empty values like `nil` in a `map`/ `struct`, by default, `gdb` will consider them as normal input parameters, and hence, they will be updated to the data table. The `OmitNil` feature helps filter out these empty fields before writing data to the database. The difference between `OmitNil` and `OmitEmpty` is that `OmitNil` only filters fields with `nil` values, while other empty values like `""`, `0` will not be filtered.

Related methods:

```go
func (m *Model) OmitNil() *Model
func (m *Model) OmitNilWhere() *Model
func (m *Model) OmitNilData() *Model
```

The `OmitNil` method filters out empty fields from both `Where` and `Data`, while the `OmitNilWhere/OmitNilData` methods allow specific field filtering.

### Using `do` Objects for Field Filtering

If you use the `GoFrame` project directory and use the `gf gen dao` or `make dao` command, the corresponding table `dao/entity/do` files will be automatically generated based on the configured database. If `do` objects are used in database operations, unassigned fields will be automatically filtered. For example:

Generated `do` object struct definition

```go
// User is the golang structure of table user for DAO operations like Where/Data.
type User struct {
    g.Meta   `orm:"table:user, do:true"`
    Id       interface{} // User ID
    Passport interface{} // User Passport
    Password interface{} // User Password
    Nickname interface{} // User Nickname
    CreateAt *gtime.Time // Created Time
    UpdateAt *gtime.Time // Updated Time
}
```

Data Insertion:

```go
dao.User.Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
    _, err = dao.User.Ctx(ctx).Data(do.User{
        Passport: in.Passport,
        Password: in.Password,
        Nickname: in.Nickname,
    }).Insert()
    return err
})
```

Data Query:

```go
var user *entity.User
err = dao.User.Ctx(ctx).Where(do.User{
    Passport: in.Passport,
    Password: in.Password,
}).Scan(&user)
```

## `Filter` Field Filtering (Built-in)

~~`gdb` can automatically synchronize the **table structure** to the program cache (cache does not expire until the program restarts/redeploys) and can filter out non-compliant table structure items from the submitted parameters. This feature can be achieved using the `Filter` method. It is commonly used in scenarios involving input `map/struct/[]map/[]string` parameters for insert/delete operations.~~

~~Usage example, suppose the `user` table has 4 fields: `uid`, `nickname`, `passport`, `password`:~~

```go
r, err := g.Model("user").Filter().Data(g.Map{
    "id"          : 1,
    "uid"         : 1,
    "passport"    : "john",
    "password"    : "123456",
}).Insert()
// INSERT INTO user(uid,passport,password) VALUES(1, "john", "123456")
```

~~Here, `id` is a non-existent field, and it will be filtered out during data insertion to prevent execution errors in the constructed SQL.~~
:::tip
~~The database is not designed to automatically filter for the `Data` method. Instead, developers need to specify filtering manually by calling the `Filter` method. This aims to kindly remind developers of possible mistakes/wrongly passed field names. Automatically filtering may cause unpredictable business logic anomalies, for example, the `Filter` method can cause the automatic filtering of essential fields due to incorrect spelling of field names, leading to incomplete data in the database.~~
:::
:::warning
From version `GoFrame v1.15.7`, based on overall community feedback, to enhance component usability, the `filter` feature is enabled by default and no longer needs to be explicitly called, making the `Filter` method deprecated.
:::