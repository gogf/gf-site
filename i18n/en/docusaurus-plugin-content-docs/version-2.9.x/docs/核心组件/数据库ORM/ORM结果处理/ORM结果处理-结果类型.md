---
slug: '/docs/core/gdb-result-types'
title: 'ORM Result - Types'
sidebar_position: 0
hide_title: true
keywords: [GoFrame, Data Structure, ORM, Result Types, Record, Result, gdb, Database, Go Language, Data Handling]
description: "Several result types for ORM result processing in the GoFrame framework, including the data structure definitions for Value, Record, and Result. Through examples, it details how to convert database table records to struct objects and the application of Result/Record types in specific field retrieval scenarios."
---

## 1. Data Structures

The data structures of the query results are as follows:

```go
type Value  = *gvar.Var              // Returns table record value
type Record   map[string]Value       // Returns table record key-value pairs
type Result   []Record               // Returns a list of table records
```

1. `Value/Record/Result` are result data types for ORM operations.
2. `Result` represents **a list of table records**, `Record` represents **a single table record**, and `Value` represents **a single key-value pair** in a record.
3. `Value` is an alias type for `*gvar.Var`, a runtime generic type to support different field types in database tables, facilitating subsequent data type conversion.

For example:

![](/markdown/c4af671f6f43d161fc776afdffaaa047.png)

![](/markdown/73f857180655a5dc19eb8deb79d3a774.png)

![](/markdown/d8aedba99def08d9ad5e244dd0bde66a.png)

## 2. `Record` Data Record

API documentation: [https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb)

`gdb` provides a high degree of flexibility and simplicity for table record operations, supporting not only access/manipulation of table records in the form of `map` but also converting them to `struct` for processing. Here, we will demonstrate this feature with a simple example.

First, our user table structure is like this (a sample table for simple design):

```sql
CREATE TABLE `user` (
  `uid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL DEFAULT '' COMMENT 'Nickname',
  `site` varchar(255) NOT NULL DEFAULT '' COMMENT 'Homepage',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```

Next, our table data is as follows:

```
uid  name   site
1    john   https://goframe.org
```

Finally, our example program is as follows:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

type User struct {
    Uid  int
    Name string
}

func main() {
    var (
        user *User
        ctx  = gctx.New()
    )
    err := g.DB().Model("user").Where("uid", 1).Scan(&user)
    if err != nil {
        g.Log().Header(false).Fatal(ctx, err)
    }
    if user != nil {
        g.Log().Header(false).Print(ctx, user)
    }
}
```

After execution, the output is:

```json
{"Uid":1,"Name":"john"}
```

Here, we define a custom `struct` containing only `Uid` and `Name` properties. As you can see, its properties do not match the fields of the data table, which is one of the flexible features of `ORM`: supporting specified attribute retrieval.

The `gdb.Model.Scan` method can convert the queried records into `struct` objects or arrays of `struct` objects. Since the parameter passed here is `&user` i.e., `**User` type, it will be converted into a **struct object**. If a `[]*User` type parameter is passed, it will be converted into a **struct array**. Please see subsequent examples for more. For a detailed introduction to the method, please refer to the chaining operations section.

**Attribute Field Mapping Rules:**

Note that the key names in `map` are `uid,name,site`, while the attributes in `struct` are `Uid,Name`. How are they mapped? There are a few simple rules:

1. The matching attribute in `struct` must be `public` (starting with a capital letter).
2. Key names in the results will automatically match `struct` attributes in a **case-insensitive**, and **ignoring `-/_/space` symbols** manner.
3. If the match is successful, the key value is assigned to the attribute. If it cannot be matched, the key value is ignored.

Here are a few matching examples:

```plaintext
Key Name      Struct Attribute     Match
name          Name                 match
Email         Email                match
nickname      NickName             match
NICKNAME      NickName             match
Nick-Name     NickName             match
nick_name     NickName             match
nick_name     Nick_Name            match
NickName      Nick_Name            match
Nick-Name     Nick_Name            match
```
:::tip
The conversion from a database result set to `struct` relies on the `gconv.Struct` method. Therefore, if you want to achieve **custom attribute conversion**, and for more detailed mapping rules, please refer to the section on [Type Conversion - Struct](../../类型转换/类型转换-Struct转换.md).
:::
## 3. `Result` Data Collection

The `Result/Record` data types, based on the requirement to manipulate the result set, often need to use **specific fields** in the records as keys for data retrieval. They include multiple methods for converting to `Map/List`, as well as common conversions to `JSON/XML` data structures.

API documentation: [https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb)

Due to the simplicity of the methods, there are no examples here. However, pay attention to two frequently used methods: `Record.Map` and `Result.List`, which are used to convert the `ORM` query result information into data types suitable for display. Since the field values of the result set are natively of `[]byte` type, although a new `Value` type has been encapsulated and provides dozens of common type conversion methods (for more, please read the section on [Generic](../../../组件列表/数据结构/泛型类型-gvar/泛型类型-gvar.md)), most often we need to directly return the result `Result` or `Record` as `json` or `xml` data structures, requiring conversion.

Usage example:

```go
package main

import (
    "database/sql"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

type User struct {
    Uid  int
    Name string
    Site string
}

func main() {
    var (
        user []*User
        ctx  = gctx.New()
    )
    err := g.DB().Model("user").Where("uid", 1).Scan(&user)
    if err != nil && err != sql.ErrNoRows {
        g.Log().Header(false).Fatal(ctx, err)
    }
    if user != nil {
        g.Log().Header(false).Print(ctx, user)
    }
}
```

After execution, the output is:

```json
[{"Uid":1,"Name":"john","Site":"https://goframe.org"}]
```