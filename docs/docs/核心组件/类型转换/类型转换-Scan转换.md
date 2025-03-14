---
slug: '/docs/core/gconv-scan'
title: '类型转换-Scan转换'
sidebar_position: 5000
hide_title: true
keywords: [GoFrame,GoFrame框架,类型转换,Scan方法,struct转换,map转换,Go语言,自动识别,参数转换,编程示例]
description: '了解如何使用GoFrame框架中强大的Scan方法实现任意参数到struct、struct数组、map、map数组的自动识别转换。本文介绍Scan方法的定义及其在Go语言中的应用，同时提供多个编程示例帮助快速理解和掌握此功能，为开发者提供高效便捷的类型转换解决方案。'
---

前面关于复杂类型的转换功能如果大家觉得还不够的话，那么您可以了解下 `Scan` 转换方法，该方法可以实现对任意参数到 `基础数据类型/struct/struct数组/map/map数组` 的转换，并且根据开发者输入的转换目标参数自动识别执行转换。

该方法定义如下：

```go
// Scan automatically checks the type of `pointer` and converts `params` to `pointer`.
// It supports various types of parameter conversions, including:
// 1. Basic types (int, string, float, etc.)
// 2. Pointer types
// 3. Slice types
// 4. Map types
// 5. Struct types
//
// The `paramKeyToAttrMap` parameter is used for mapping between attribute names and parameter keys.
func Scan(srcValue any, dstPointer any, paramKeyToAttrMap ...map[string]string) (err error)
```

## 基础数据类型转换

`Scan` 方法在`v2.9`版本中增强了对基础数据类型的转换支持，可以将各种类型的值转换为基础数据类型，如 `int`、`string`、`bool` 等。

### 整数类型转换

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    // 字符串转整数
    var num int
    if err := gconv.Scan("123", &num); err != nil {
        panic(err)
    }
    g.Dump(num) // 输出: 123
    
    // 浮点数转整数
    var num2 int
    if err := gconv.Scan(123.45, &num2); err != nil {
        panic(err)
    }
    g.Dump(num2) // 输出: 123
    
    // 布尔值转整数
    var num3 int
    if err := gconv.Scan(true, &num3); err != nil {
        panic(err)
    }
    g.Dump(num3) // 输出: 1
}
```

### 字符串类型转换

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    // 整数转字符串
    var str string
    if err := gconv.Scan(123, &str); err != nil {
        panic(err)
    }
    g.Dump(str) // 输出: "123"
    
    // 浮点数转字符串
    var str2 string
    if err := gconv.Scan(123.45, &str2); err != nil {
        panic(err)
    }
    g.Dump(str2) // 输出: "123.45"
    
    // 布尔值转字符串
    var str3 string
    if err := gconv.Scan(true, &str3); err != nil {
        panic(err)
    }
    g.Dump(str3) // 输出: "true"
}
```

### 布尔类型转换

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    // 整数转布尔值
    var b1 bool
    if err := gconv.Scan(1, &b1); err != nil {
        panic(err)
    }
    g.Dump(b1) // 输出: true
    
    // 字符串转布尔值
    var b2 bool
    if err := gconv.Scan("true", &b2); err != nil {
        panic(err)
    }
    g.Dump(b2) // 输出: true
    
    // 0值转布尔值
    var b3 bool
    if err := gconv.Scan(0, &b3); err != nil {
        panic(err)
    }
    g.Dump(b3) // 输出: false
}
```

### 指针类型转换

`Scan` 方法还支持指针类型的转换，可以将值转换为指针类型，或者将指针类型转换为另一个指针类型。

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    // 值转指针
    var numPtr *int
    if err := gconv.Scan(123, &numPtr); err != nil {
        panic(err)
    }
    g.Dump(numPtr)  // 输出: 123 (指针指向的值)
    
    // 指针转指针
    var num = 456
    var numPtr2 *int
    if err := gconv.Scan(&num, &numPtr2); err != nil {
        panic(err)
    }
    g.Dump(numPtr2) // 输出: 456 (指针指向的值)
}
```

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

