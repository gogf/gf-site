---
slug: '/docs/core/gdb-result-empty-array'
title: 'ORM Result - Empty Array'
sidebar_position: 2
hide_title: true
keywords: [GoFrame, ORM, Go Language, Database Operations, JSON Encoding, Frontend Development, Data Processing, Backend Development, Empty Array, GoFrame Framework]
description: "Handling ORM query results in the GoFrame framework by initializing an empty array to avoid returning a null value when no data is queried, thereby enhancing user-friendly interaction with the frontend. This improvement ensures the predictability and stability of return formats when data needs to be displayed on web pages."
---

## Pain Point Description

As described in the previous chapters, if a given array is uninitialized (with a value of `nil`), the `ORM` will not automatically initialize that array when no data is queried based on the given conditions. Thus, if this uninitialized array result is encoded via `JSON`, it will be converted to a `null` value.

```go
package main

import (
    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"

    "fmt"

    "github.com/gogf/gf/v2/encoding/gjson"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gtime"
)

func main() {
    type User struct {
        Id        uint64      // Primary Key
        Passport  string      // Account
        Password  string      // Password
        NickName  string      // Nickname
        CreatedAt *gtime.Time // Creation Time
        UpdatedAt *gtime.Time // Update Time
    }
    type Response struct {
        Users []User
    }
    var res = &Response{}
    err := g.Model("user").WhereGT("id", 10).Scan(&res.Users)
    fmt.Println(err)
    fmt.Println(gjson.MustEncodeString(res))
}
```

After execution, the terminal displays the result as:

```html
<nil>
{"Users":null}
```

In most scenarios, the data queried by the `ORM` needs to be rendered on a browser page, which means the returned data needs to be processed by frontend `JS`. To make it more friendly for frontend `JS` to handle backend return data, when no data is queried on the backend, it is expected to return an empty array structure instead of a `null` attribute value.

## Improvement Plan

In this scenario, you can provide an initialized empty array to the `Scan` method of the `ORM`. When the `ORM` doesn't query any data, the array attribute remains an empty array, rather than `nil`, and the returned JSON encoding will not be a `null` value.

```go
package main

import (
    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"

    "fmt"

    "github.com/gogf/gf/v2/encoding/gjson"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gtime"
)

func main() {
    type User struct {
        Id        uint64      // Primary Key
        Passport  string      // Account
        Password  string      // Password
        NickName  string      // Nickname
        CreatedAt *gtime.Time // Creation Time
        UpdatedAt *gtime.Time // Update Time
    }
    type Response struct {
        Users []User
    }
    var res = &Response{
        Users: make([]User, 0),
    }
    err := g.Model("user").WhereGT("id", 10).Scan(&res.Users)
    fmt.Println(err)
    fmt.Println(gjson.MustEncodeString(res))
}
```

After execution, the terminal displays the result as:

```html
<nil>
{"Users":[]}
```


