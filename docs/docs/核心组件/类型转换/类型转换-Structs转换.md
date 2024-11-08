---
slug: '/docs/core/gconv-structs'
title: '类型转换-Structs转换'
sidebar_position: 3
hide_title: true
keywords: [GoFrame,GoFrame框架,类型转换,Struct,Structs,struct数组,转换方法,gconv,使用示例,Go语言]
description: '本文档介绍了GoFrame框架中的类型转换方法，主要聚焦于使用Structs方法实现对struct数组的转换。Structs方法与Struct方法类似，并在其基础上扩展了对struct数组的支持。文中还提供了具体的代码示例，演示了如何在实际应用中使用这一功能。'
---

## 基本介绍

我们之前提到可以使用 `Struct` 方法实现对 `struct` 对象的转换，那么我们当然也可以实现对 `struct` 数组的转换， `struct` 数组转换使用的是 `Structs` 方法实现。 `Structs` 方法建立在 `Struct` 方法的基础之上，所有的转换规则与 `Struct` 相同，只是增加了对 `struct` 数组类型的支持。在了解 `Structs` 方法之前，建议您先了解 `Struct` 方法介绍： [类型转换-Struct转换](类型转换-Struct转换.md)

## 方法定义

`Structs` 方法定义如下：

```go
// Structs converts any slice to given struct slice.
func Structs(params interface{}, pointer interface{}, mapping ...map[string]string) (err error)
```

其中 `pointer` 目标转换参数类型需要为 `*[]struct/*[]*struct`。

## 使用示例

我们来看一个简单示例即可理解。

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