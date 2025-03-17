---
slug: '/docs/core/gconv-scan'
title: '类型转换-Scan转换'
sidebar_position: 4
hide_title: true
keywords: [GoFrame,GoFrame框架,类型转换,Scan方法,struct转换,map转换,Go语言,自动识别,参数转换,编程示例]
description: '了解如何使用GoFrame框架中强大的Scan方法实现任意参数到struct、struct数组、map、map数组的自动识别转换。本文介绍Scan方法的定义及其在Go语言中的应用，同时提供多个编程示例帮助快速理解和掌握此功能，为开发者提供高效便捷的类型转换解决方案。'
---

前面关于复杂类型的转换功能如果大家觉得还不够的话，那么您可以了解下 `Scan` 转换方法，该方法可以实现对任意参数到 `struct/struct数组/map/map数组` 的转换，并且根据开发者输入的转换目标参数自动识别执行转换。

该方法定义如下：

```go
// Scan automatically calls MapToMap, MapToMaps, Struct or Structs function according to
// the type of parameter `pointer` to implement the converting.
// It calls function MapToMap if `pointer` is type of *map to do the converting.
// It calls function MapToMaps if `pointer` is type of *[]map/*[]*map to do the converting.
// It calls function Struct if `pointer` is type of *struct/**struct to do the converting.
// It calls function Structs if `pointer` is type of *[]struct/*[]*struct to do the converting.
func Scan(params interface{}, pointer interface{}, mapping ...map[string]string) (err error)
```

我们接下来看几个示例便可快速理解。

## 自动识别转换 `Struct`

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

执行后，输出结果为：

```
{
    Uid:  1,
    Name: "john",
}
```

## 自动识别转换 `Struct` 数组

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

执行后，终端输出：

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

## 自动识别转换Map

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

执行后，输出结果为：

```
{
    "uid":  "1",
    "name": "john",
}
```

## 自动识别转换 `Map` 数组

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

执行后，输出结果为：

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