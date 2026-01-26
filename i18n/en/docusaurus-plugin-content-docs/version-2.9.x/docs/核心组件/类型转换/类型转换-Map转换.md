---
slug: '/docs/core/gconv-map'
title: 'Type Conversion - Map'
sidebar_position: 1
hide_title: true
keywords: [GoFrame, Type Conversion, Map Conversion, GoFrame Framework, Property Tags, Recursive Conversion, Custom Tags, MapDeep, struct Conversion, gconv]
description: "Use the gconv.Map method in the GoFrame framework for type conversion, including converting any map or struct/*struct type to a map[string]interface{} type. It supports property tags and custom tags, and can achieve recursive conversion through the MapDeep method to parse out the detailed structure of nested objects, suitable for multi-layer data processing."
---

`gconv.Map` supports converting any `map` or `struct`/ `*struct` type to the commonly used `map[string]interface{}` type. When the conversion parameter is of type `struct`/ `*struct`, it automatically recognizes the `c/gconv/json` tags of `struct`, and you can specify custom conversion tags and the priority of multiple tag parsing via the second parameter `tags` of the `Map` method. If the conversion fails, it returns `nil`.
:::tip
Property Tags: When converting `struct`/ `*struct` types, it supports `c/gconv/json` property tags, as well as `-` and `omitempty` tag properties. When using the `-` tag property, it means that the property will not be converted. When using the `omitempty` tag property, it means that the conversion will not be performed when the property is empty (nil pointer, number `0`, string `""`, empty array `[]`, etc.). Please refer to the examples below for details.
:::
Common conversion methods:

```go
func Map(value interface{}, tags ...string) map[string]interface{}
func MapDeep(value interface{}, tags ...string) map[string]interface{}
```

Among them, `MapDeep` supports recursive conversion, which will recursively convert the `struct`/ `*struct` objects within the properties.
:::tip
For more map-related conversion methods, please refer to the interface documentation: [https://pkg.go.dev/github.com/gogf/gf/v2/util/gconv](https://pkg.go.dev/github.com/gogf/gf/v2/util/gconv)
:::
## Basic Example

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    type User struct {
        Uid  int    `c:"uid"`
        Name string `c:"name"`
    }
    // Object
    g.Dump(gconv.Map(User{
        Uid:  1,
        Name: "john",
    }))
    // Object pointer
    g.Dump(gconv.Map(&User{
        Uid:  1,
        Name: "john",
    }))

    // Any map type
    g.Dump(gconv.Map(map[int]int{
        100: 10000,
    }))
}
```

After execution, the terminal outputs:

```
{
    "name": "john",
    "uid": 1,
}

{
    "name": "john",
    "uid": 1,
}

{
    "100": 10000,
}
```

## Property Tags

We can customize the `map` key name after conversion via the `c/gconv/json` tag. When multiple tags exist, the priority is determined by the order of `gconv/c/json` tags.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    type User struct {
        Uid      int
        Name     string `c:"-"`
        NickName string `c:"nickname, omitempty"`
        Pass1    string `c:"password1"`
        Pass2    string `c:"password2"`
    }
    user := User{
        Uid:   100,
        Name:  "john",
        Pass1: "123",
        Pass2: "456",
    }
    g.Dump(gconv.Map(user))
}
```

After execution, the terminal outputs:

```
{
    "Uid": 100,
    "password1": "123",
    "password2": "456",
    "nickname": "",
}
```

## Custom Tags

Besides, we can also customize the tag names of `struct` properties and specify the tag priority during `map` conversion via the second parameter.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    type User struct {
        Id   int    `c:"uid"`
        Name string `my-tag:"nick-name" c:"name"`
    }
    user := &User{
        Id:   1,
        Name: "john",
    }
    g.Dump(gconv.Map(user, "my-tag"))
}
```

After execution, the output result is:

```
{
    "nick-name": "john",
    "uid": 1,
}
```

## Recursive Conversion

When the parameter is of `map`/ `struct`/ `*struct` type, if the key value/property is an object (or an object pointer) and is not an `embedded` struct without any alias tags bound, the `Map` method will convert the object as a key-value in the result. We can use the `MapDeep` method to recursively convert sub-objects of the parameters, i.e., converting properties to `map` type as well. Let's look at an example.

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
    "reflect"
)

func main() {
    type Base struct {
        Id   int    `c:"id"`
        Date string `c:"date"`
    }
    type User struct {
        UserBase Base   `c:"base"`
        Passport string `c:"passport"`
        Password string `c:"password"`
        Nickname string `c:"nickname"`
    }
    user := &User{
        UserBase: Base{
            Id:   1,
            Date: "2019-10-01",
        },
        Passport: "john",
        Password: "123456",
        Nickname: "JohnGuo",
    }
    m1 := gconv.Map(user)
    m2 := gconv.MapDeep(user)
    g.Dump(m1, m2)
    fmt.Println(reflect.TypeOf(m1["base"]))
    fmt.Println(reflect.TypeOf(m2["base"]))
}
```

After execution, the terminal output is:

```
{
    "base":     {
        Id:   1,
        Date: "2019-10-01",
    },
    "passport": "john",
    "password": "123456",
    "nickname": "JohnGuo",
}
{
    "base":     {
        "id":   1,
        "date": "2019-10-01",
    },
    "passport": "john",
    "password": "123456",
    "nickname": "JohnGuo",
}
main.Base
map[string]interface {}
```

Can you see the difference?