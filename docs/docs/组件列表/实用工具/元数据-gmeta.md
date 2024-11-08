---
slug: '/docs/components/util-gmeta'
title: '元数据-gmeta'
sidebar_position: 2
hide_title: true
keywords: [GoFrame,GoFrame框架,gmeta,元数据,标签,动态获取,结构体,接口文档,数据方法,获取方法]
description: '本页面介绍了如何在GoFrame框架中使用gmeta包来为用户自定义的结构体添加元数据标签，并通过特定的方法在运行时动态获取这些标签内容，包括如何使用Data方法和Get方法获取指定对象的元数据标签信息。'
---

## 基本介绍

主要用于嵌入到用户自定义的结构体中，并且通过标签的形式给 `gmeta` 包的结构体打上自定义的标签内容（元数据），并在运行时可以特定方法动态获取这些自定义的标签内容。

**使用方式：**

```go
import "github.com/gogf/gf/v2/util/gmeta"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/util/gmeta](https://pkg.go.dev/github.com/gogf/gf/v2/util/gmeta)

**方法列表：**

```go
func Data(object interface{}) map[string]interface{}
func Get(object interface{}, key string) *gvar.Var
```

## 使用示例

### `Data` 方法

`Data` 方法用于获取指定 `struct` 对象的元数据标签，构成 `map` 返回。

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gmeta"
)

func main() {
    type User struct {
        gmeta.Meta `orm:"user" db:"mysql"`
        Id         int
        Name       string
    }
    g.Dump(gmeta.Data(User{}))
}
```

执行后，终端输出：

```
{
    "db": "mysql",
    "orm": "user"
}
```

### `Get` 方法

`Get` 方法用于获取指定 `struct` 对象中指定名称的元数据标签信息。

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/util/gmeta"
)

func main() {
    type User struct {
        gmeta.Meta `orm:"user" db:"mysql"`
        Id         int
        Name       string
    }
    user := User{}
    fmt.Println(gmeta.Get(user, "orm").String())
    fmt.Println(gmeta.Get(user, "db").String())
}
```

执行后，终端输出：

```user
mysql
```