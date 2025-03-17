---
slug: '/docs/core/gvalid-parameter-type-struct-example'
title: 'Struct Validation - Example'
sidebar_position: 0
hide_title: true
keywords: [Struct Validation, GoFrame Framework, gvalid, Parameter Validation, Field Alias, Validation Rules, Chain Operation, Nested Validation, Recursive Validation, Go]
description: "Conducting validation for Struct type data using the GoFrame framework, including detailed explanations of validation tag rules and methods for different data types, such as basic validation, using map for custom rules, and recursive validation of structs. Example code demonstrates how to set field aliases and customize error messages, implementing complex validation logic for different attributes within a struct object."
---

`Struct` validation is often used in the following chain operation method:

```go
g.Validator().Data(object).Run(ctx)
```

## Validation `tag` Rules Introduction

Before introducing `Struct` parameter type validation, let's introduce some common validation `tag` rules. The rules are as follows:

```
[FieldAlias@]ValidationRule[#ErrorMessage]
```

Where:

- `FieldAlias` and `ErrorMessage` are **optional fields**, and `ValidationRule` is a **mandatory field.**
- `FieldAlias` is an optional field, specifying the alias of the corresponding `struct` field used in validation. The `error` object returned after validation will use this alias. This is particularly useful when dealing with request forms, as field names in forms often do not match the property names in the `struct`. In most scenarios, you don't need to set the field alias and can directly use the property name by default.
- `ValidationRule` is the validation rule for the current property. Multiple validation rules can be combined using the `|` symbol, for example: `required|between:1,100`.
- `ErrorMessage` is an optional field, representing a custom error message that overrides the default error message when the rule validation fails.

## Validation `tag` Usage Example

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

type User struct {
    Uid   int    `v:"uid      @integer|min:1#|Please enter the user ID"`
    Name  string `v:"name     @required|length:6,30#Please enter the user name|Invalid length for user name"`
    Pass1 string `v:"password1@required|password3"`
    Pass2 string `v:"password2@required|password3|same:Pass1#|Invalid password format|The two passwords do not match, please re-enter"`
}

func main() {
    var (
        ctx  = gctx.New()
        user = &User{
            Name:  "john",
            Pass1: "Abc123!@#",
            Pass2: "123",
        }
    )

    err := g.Validator().Data(user).Run(ctx)
    if err != nil {
        g.Dump(err.Items())
    }
}
```

As you can see, we can bind validation rules and error messages using `gvalid tag` when defining the `struct`. In this sample code, the rule `same:password1` is the same as using `same:Pass1`. **This means that data validation can use both the original `struct` property name and the alias simultaneously. However, the returned result will only use the alias, which is the primary purpose of the alias.** Also, when validating a `struct` object, you can pass validation and error message parameters, which will override the corresponding parameters bound when the `struct` is defined.

After executing the above example, the output is:

```
[
    {
        "uid": {
            "min": "Please enter the user ID",
        },
    },
    {
        "name": {
            "length": "Invalid length for user name",
        },
    },
    {
        "password2": {
            "password3": "Invalid password format",
        },
    },
]
```

## Using `map` to Specify Validation Rules

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    type User struct {
        Age  int
        Name string
    }
    var (
        ctx   = gctx.New()
        user  = User{Name: "john"}
        rules = map[string]string{
            "Name": "required|length:6,16",
            "Age":  "between:18,30",
        }
        messages = map[string]interface{}{
            "Name": map[string]string{
                "required": "Name cannot be empty",
                "length":   "Name length must be between {min} and {max} characters",
            },
            "Age": "Age must be between 18 to 30 years old",
        }
    )

    err := g.Validator().Rules(rules).Messages(messages).Data(user).Run(ctx)
    if err != nil {
        g.Dump(err.Maps())
    }
}
```

In the above example, the `Age` property has a default value of `0`, which can cause the `required` rule to be ineffective. Therefore, we use the `between` rule for validation instead. After executing the example, the terminal outputs:

```
{
    "Age": {
        "between": "Age must be between 18 to 30 years old"
    },
    "Name": {
        "length": "Name length must be between 6 to 16 characters"
    }
}
```

## Struct Recursive Validation (Nested Validation)

Supports recursive struct validation (nested validation), meaning if a property is a struct (nested structs are also supported), it will automatically perform recursive validation on that property. Example usage:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    type Pass struct {
        Pass1 string `v:"password1@required|same:password2#Please enter your password|The two passwords do not match"`
        Pass2 string `v:"password2@required|same:password1#Please re-enter your password|The two passwords do not match"`
    }
    type User struct {
        Pass
        Id   int
        Name string `valid:"name@required#Please enter your name"`
    }
    var (
        ctx  = gctx.New()
        user = &User{
            Name: "john",
            Pass: Pass{
                Pass1: "1",
                Pass2: "2",
            },
        }
    )
    err := g.Validator().Data(user).Run(ctx)
    g.Dump(err.Maps())
}
```

Or when properties are nested structs (`embedded`):

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    type Pass struct {
        Pass1 string `v:"password1@required|same:password2#Please enter your password|The two passwords do not match"`
        Pass2 string `v:"password2@required|same:password1#Please re-enter your password|The two passwords do not match"`
    }
    type User struct {
        Id   int
        Name string `valid:"name@required#Please enter your name"`
        Pass Pass
    }
    var (
        ctx  = gctx.New()
        user = &User{
            Name: "john",
            Pass: Pass{
                Pass1: "1",
                Pass2: "2",
            },
        }
    )
    err := g.Validator().Data(user).Run(ctx)
    g.Dump(err.Maps())
}
```

Once executed, the terminal output is:

```
{
    "password1": {
        "same": "The two passwords do not match",
    },
    "password2": {
        "same": "The two passwords do not match",
    },
}
```

For more introductions on recursive validation, please refer to the section: [Data Validation - Recursive](../../数据校验-递归校验.md)