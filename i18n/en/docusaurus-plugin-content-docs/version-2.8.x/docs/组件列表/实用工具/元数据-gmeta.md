---
slug: '/docs/components/util-gmeta'
title: 'Metadata'
sidebar_position: 2
hide_title: true
keywords: [GoFrame, GoFrame framework, gmeta, metadata, tag, dynamic retrieval, struct, API documentation, data method, retrieve method]
description: "Use the gmeta package in the GoFrame framework to add metadata tags to user-defined structs and dynamically retrieve these tags at runtime using specific methods, including how to use the Data method and Get method to obtain metadata tag information of a specified object."
---

## Introduction

Mainly used for embedding into user-defined structs, and through the form of tags to attach custom tag content (metadata) to the struct of the `gmeta` package, and dynamically retrieve these custom tag contents at runtime through specific methods.

**Usage:**

```go
import "github.com/gogf/gf/v2/util/gmeta"
```

**API Documentation:**

[https://pkg.go.dev/github.com/gogf/gf/v2/util/gmeta](https://pkg.go.dev/github.com/gogf/gf/v2/util/gmeta)

**Method List:**

```go
func Data(object interface{}) map[string]interface{}
func Get(object interface{}, key string) *gvar.Var
```

## Usage Example

### `Data` Method

The `Data` method is used to obtain the metadata tags of a specified `struct` object and return them as a `map`.

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gmeta"
)

func main() {
    type User struct {
        g.Meta `orm:"user" db:"mysql"`
        Id         int
        Name       string
    }
    g.Dump(gmeta.Data(User{}))
}
```

:::tip
Most of the time, in struct definitions, we use the alias `g.Meta` for `gmeta.Meta`.
:::

After execution, the terminal outputs:

```json
{
    "db": "mysql",
    "orm": "user"
}
```

### `Get` Method

The `Get` method is used to retrieve metadata tag information of a specified name from a specified `struct` object.

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/util/gmeta"
)

func main() {
    type User struct {
        g.Meta `orm:"user" db:"mysql"`
        Id         int
        Name       string
    }
    user := User{}
    fmt.Println(gmeta.Get(user, "orm").String())
    fmt.Println(gmeta.Get(user, "db").String())
}
```

After execution, the terminal outputs:

```text
user
mysql
```