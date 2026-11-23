# Type Conversion - Structs

## Introduction

As previously mentioned, the `Struct` method can be used for the conversion of `struct` objects; similarly, the conversion of `struct` arrays is achieved using the `Structs` method. The `Structs` method is built upon the `Struct` method, and all conversion rules are the same as `Struct`, with additional support for `struct` array types. Before understanding the `Structs` method, it is recommended to first understand the introduction to the `Struct` method: [Type Conversion - Struct](https://goframe.org/en/docs/core/gconv-struct.md)

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

> Page: https://goframe.org/en/docs/core/gconv-structs
