---
slug: '/docs/core/gconv-scan'
title: 'Type Conversion - Scan'
sidebar_position: 4
hide_title: true
keywords: [GoFrame, GoFrame framework, type conversion, Scan method, struct conversion, map conversion, Go language, auto recognition, parameter conversion, programming example]
description: "Learn how to use the powerful Scan method in the GoFrame framework to automatically convert arbitrary parameters into structs, struct arrays, maps, and map arrays. This article introduces the definition of the Scan method and its application in the Go language, providing multiple programming examples to help quickly understand and master this function, offering developers an efficient and convenient type conversion solution."
---

If the previous complex type conversion functionality is not sufficient, you can explore the `Scan` conversion method. This method can convert arbitrary parameters to `struct/struct arrays/map/map arrays` and automatically recognize and execute conversion based on the developer's input target parameters.

The method is defined as follows:

```go
// Scan automatically calls MapToMap, MapToMaps, Struct or Structs function according to
// the type of parameter `pointer` to implement the converting.
// It calls function MapToMap if `pointer` is type of *map to do the converting.
// It calls function MapToMaps if `pointer` is type of *[]map/*[]*map to do the converting.
// It calls function Struct if `pointer` is type of *struct/**struct to do the converting.
// It calls function Structs if `pointer` is type of *[]struct/*[]*struct to do the converting.
func Scan(params interface{}, pointer interface{}, mapping ...map[string]string) (err error)
```

Let's look at a few examples for a quick understanding.

## Auto-recognition Conversion `Struct`

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
    if err := gconv.Scan(params, &user); err != nil {
        panic(err)
    }
    g.Dump(user)
}
```

After execution, the output result is:

```
{
    Uid:  1,
    Name: "john",
}
```

## Auto-recognition Conversion `Struct` Array

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
    if err := gconv.Scan(params, &users); err != nil {
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

## Auto-recognition Conversion to Map

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    var (
        user   map[string]string
        params = g.Map{
            "uid":  1,
            "name": "john",
        }
    )
    if err := gconv.Scan(params, &user); err != nil {
        panic(err)
    }
    g.Dump(user)
}
```

After execution, the output result is:

```
{
    "uid":  "1",
    "name": "john",
}
```

## Auto-recognition Conversion `Map` Array

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    var (
        users  []map[string]string
        params = g.Slice{
            g.Map{
                "uid":  1,
                "name": "john",
            },
            g.Map{
                "uid":  2,
                "name": "smith",
            },
        }
    )
    if err := gconv.Scan(params, &users); err != nil {
        panic(err)
    }
    g.Dump(users)
}
```

After execution, the output result is:

```
[
    {
        "uid":  "1",
        "name": "john",
    },
    {
        "uid":  "2",
        "name": "smith",
    },
]
```