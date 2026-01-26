---
slug: '/docs/core/gconv-structs'
title: 'Type Conversion - Structs'
sidebar_position: 3
hide_title: true
keywords: [GoFrame,GoFrame framework,Type conversion,Struct,Structs,struct array,conversion method,gconv,usage example,Go language]
description: "Type conversion methods in the GoFrame framework, focusing on using the Structs method for the conversion of struct arrays. The Structs method is similar to the Struct method and extends its support to struct arrays. The article also provides specific code examples demonstrating how to apply this feature in practice."
---

## Introduction

As previously mentioned, the `Struct` method can be used for the conversion of `struct` objects; similarly, the conversion of `struct` arrays is achieved using the `Structs` method. The `Structs` method is built upon the `Struct` method, and all conversion rules are the same as `Struct`, with additional support for `struct` array types. Before understanding the `Structs` method, it is recommended to first understand the introduction to the `Struct` method: [Type Conversion - Struct](类型转换-Struct转换.md)

## Method Definition

The `Structs` method is defined as follows:

```go
// Structs converts any slice to given struct slice.
func Structs(params interface{}, pointer interface{}, mapping ...map[string]string) (err error)
```

Here, the type of `pointer` for the target conversion parameter needs to be `*[]struct/*[]*struct`.

## Usage Example

Let's look at a simple example to understand it.

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
    params := g.Slice{
        g.Map{
            "uid":  1,
            "name": "john",
        },
        g.Map{
            "uid":  2,
            "name": "smith",
        },
    }
    var users []*User
    if err := gconv.Structs(params, &users); err != nil {
        panic(err)
    }
    g.Dump(users)
}
```

After execution, the terminal output is:

```
[
    {
        Uid:  1,
        Name: "john",
    },
    {
        Uid:  2,
        Name: "smith",
    },
]
```