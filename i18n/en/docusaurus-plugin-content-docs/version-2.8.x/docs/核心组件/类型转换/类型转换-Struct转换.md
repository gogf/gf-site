---
slug: '/docs/core/gconv-struct'
title: 'Type Conversion - Struct'
sidebar_position: 2
hide_title: true
keywords: [GoFrame,gconv,struct conversion,data mapping,struct conversion,automatic object creation,recursive conversion,mapping rules,struct,Go framework]
description: "Using the gconv module of GoFrame for struct conversion, including mapping from various data types to structs, automatic object creation, recursive conversion, and mapping rules, among other practical features, to help developers enhance coding efficiency and project maintenance capabilities."
---

In projects, we frequently encounter the use of a large number of `struct`, and conversions/assignments from various data types to `struct` (especially `json`/`xml`/various protocol encoding conversions). To improve coding and project maintenance efficiency, the `gconv` module provides developers with substantial benefits by offering greater flexibility in data parsing.

The `gconv` module performs `struct` type conversion through the `Struct` method, defined as follows:

```go
// Struct maps the params key-value pairs to the corresponding struct object's attributes.
// The third parameter `mapping` is unnecessary, indicating the mapping rules between the
// custom key name and the attribute name(case sensitive).
//
// Note:
// 1. The `params` can be any type of map/struct, usually a map.
// 2. The `pointer` should be type of *struct/**struct, which is a pointer to struct object
//    or struct pointer.
// 3. Only the public attributes of struct object can be mapped.
// 4. If `params` is a map, the key of the map `params` can be lowercase.
//    It will automatically convert the first letter of the key to uppercase
//    in mapping procedure to do the matching.
//    It ignores the map key, if it does not match.
func Struct(params interface{}, pointer interface{}, mapping ...map[string]string) (err error)
```

Where:

1. `params` is the variable parameter to be converted to a `struct`. It can be of any data type, commonly a `map`.
2. `pointer` is the target `struct` object for conversion. This parameter must be a pointer to the `struct` object; the object's attributes will be updated upon successful conversion.
3. `mapping` is a custom mapping between `map key name` and `struct attribute`. In this case, the `params` parameter must be of `map` type, otherwise the parameter is meaningless. In most cases, this parameter can be omitted, using the default conversion rules instead.

:::tip
For more `struct` related conversion methods, please refer to the interface documentation: [https://pkg.go.dev/github.com/gogf/gf/v2/util/gconv](https://pkg.go.dev/github.com/gogf/gf/v2/util/gconv)
:::

## Conversion Rules

The `gconv` module's `struct` conversion feature is powerful, supporting mapping conversion from any data type to `struct` attributes. Without custom `mapping` conversion rules, the default conversion rules are as follows:

1. Attributes in the `struct` that need to be matched must be **public attributes** (capitalized first letter).
2. Depending on the type of `params`, the logic varies:
   - If `params` is of type `map`: The key name will be automatically matched to the struct attribute in a **case-insensitive** and **special character ignored** manner.
   - If `params` is of another type: The value will be matched against the first attribute of the `struct`.
   - Additionally, if the attribute of the `struct` is a complex data type such as `slice`, `map`, `struct`, recursive matching and assignment will be performed.
3. If matching is successful, the key value is assigned to the attribute, otherwise the key value is ignored.

## Matching Rules Priority (only for map to struct conversion)

1. If the `mapping` parameter is not empty, it maps according to the `key` to `struct field name` relationship.
2. If a field `tag` is set, it will use the `tag` to match the `key` of the `params` parameter.
   If no `tag` is set, gconv will look for the field `tag` in the order of `gconv, param, c, p, json`.
3. Match according to `field name`.
4. If none of the above matches, gconv will iterate through all `key`s in `params`, matching according to the following rules:
   - `Field name`: ignore case and underscores
   - `Key`: ignore case, underscores, and special characters

Tip

:::warning
Unless there are special circumstances, please try to satisfy the first three rules as the fourth rule is less performant.
:::

Here are some examples of `map` key names and `struct` attribute names:

```
map key     struct attribute   match?
name        Name               match
Email       Email              match
nickname    NickName           match
NICKNAME    NickName           match
Nick-Name   NickName           match
nick_name   NickName           match
nick name   NickName           match
NickName    Nick_Name          match
Nick-name   Nick_Name          match
nick_name   Nick_Name          match
nick name   Nick_Name          match
```

## Automatic Object Creation

When the given `pointer` parameter type is `**struct`, the `Struct` method will automatically create the `struct` object and modify the pointer address to which the variable points.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    type User struct {
        Uid  int
        Name string
    }
    params := g.Map{
        "uid":  1,
        "name": "john",
    }
    var user *User
    if err := gconv.Struct(params, &user); err != nil {
        panic(err)
    }
    g.Dump(user)
}
```

After execution, the output is:

```
{
    Uid:  1,
    Name: "john",
}
```

## `Struct` Recursive Conversion

Recursive conversion refers to the capability to map `params` parameter data (the first parameter) recursively onto sub-objects when a `struct` object contains sub-objects that are defined in an `embedded` manner. It is often used in `struct` objects with inherited objects.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    type Ids struct {
        Id         int    `json:"id"`
        Uid        int    `json:"uid"`
    }
    type Base struct {
        Ids
        CreateTime string `json:"create_time"`
    }
    type User struct {
        Base
        Passport   string `json:"passport"`
        Password   string `json:"password"`
        Nickname   string `json:"nickname"`
    }
    data := g.Map{
        "id"          : 1,
        "uid"         : 100,
        "passport"    : "john",
        "password"    : "123456",
        "nickname"    : "John",
        "create_time" : "2019",
    }
    user := new(User)
    gconv.Struct(data, user)
    g.Dump(user)
}
```

After execution, the output in the terminal is:

```
{
    Id:         1,
    Uid:        100,
    CreateTime: "2019",
    Passport:   "john",
    Password:   "123456",
    Nickname:   "John",
}
```

## Example 1: Basic Usage

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

type User struct {
    Uid      int
    Name     string
    SiteUrl  string
    NickName string
    Pass1    string `c:"password1"`
    Pass2    string `c:"password2"`
}

func main() {
    var user *User

    // Use default mapping rules to bind attribute values to objects
    user = new(User)
    params1 := g.Map{
        "uid":       1,
        "Name":      "john",
        "site_url":  "https://goframe.org",
        "nick_name": "johng",
        "PASS1":     "123",
        "PASS2":     "456",
    }
    if err := gconv.Struct(params1, user); err == nil {
        g.Dump(user)
    }

    // Use struct tag mapping to bind attribute values to objects
    user = new(User)
    params2 := g.Map{
        "uid":       2,
        "name":      "smith",
        "site-url":  "https://goframe.org",
        "nick name": "johng",
        "password1": "111",
        "password2": "222",
    }
    if err := gconv.Struct(params2, user); err == nil {
        g.Dump(user)
    }
}
```

As seen, you can directly bind a `map` to a `struct` using the `Struct` method with default rules or flexibly configure using the `struct tag`. Additionally, the `Struct` method has the third `map` parameter to specify custom parameter name to attribute name mappings.

After execution, the output is:

```
{
    Uid:      1,
    Name:     "john",
    SiteUrl:  "https://goframe.org",
    NickName: "johng",
    Pass1:    "123",
    Pass2:    "456",
}
{
    Uid:      2,
    Name:     "smith",
    SiteUrl:  "https://goframe.org",
    NickName: "johng",
    Pass1:    "111",
    Pass2:    "222",
}
```

## Example 2: Complex Attribute Types

Attributes support conversion of `struct` objects or `struct` object pointers (if the target is a pointer and `nil`, it will be initialized during conversion).

```go
package main

import (
    "github.com/gogf/gf/v2/util/gconv"
    "github.com/gogf/gf/v2/frame/g"
    "fmt"
)

func main() {
    type Score struct {
        Name   string
        Result int
    }
    type User1 struct {
        Scores Score
    }
    type User2 struct {
        Scores *Score
    }

    user1  := new(User1)
    user2  := new(User2)
    scores := g.Map{
        "Scores": g.Map{
            "Name":   "john",
            "Result": 100,
        },
    }

    if err := gconv.Struct(scores, user1); err != nil {
        fmt.Println(err)
    } else {
        g.Dump(user1)
    }
    if err := gconv.Struct(scores, user2); err != nil {
        fmt.Println(err)
    } else {
        g.Dump(user2)
    }
}
```

After execution, the output is:

```
{
    Scores: {
        Name:   "john",
        Result: 100,
    },
}
{
    Scores: {
        Name:   "john",
        Result: 100,
    },
}
```