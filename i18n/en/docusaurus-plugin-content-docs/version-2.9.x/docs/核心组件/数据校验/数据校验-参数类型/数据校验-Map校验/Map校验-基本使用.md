---
slug: '/docs/core/gvalid-parameter-type-map-example'
title: 'Map Validation - Example'
sidebar_position: 0
hide_title: true
keywords: [GoFrame, GoFrame Framework, Parameter Validation, Map Validation, Custom Error Messages, Default Error Messages, Framework Usage, Validation Rules, Code Example, Data Validation]
description: "In the GoFrame framework, Map validation is demonstrated with both default and custom error messages. Example code shows how to validate parameters and output corresponding error messages on validation failures, helping developers better implement data validation and error handling mechanisms."
---

## Default Error Messages

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx    = gctx.New()
        params = map[string]interface{}{
            "passport":  "",
            "password":  "123456",
            "password2": "1234567",
        }
        rules = map[string]string{
            "passport":  "required|length:6,16",
            "password":  "required|length:6,16|same:password2",
            "password2": "required|length:6,16",
        }
    )
    err := g.Validator().Rules(rules).Data(params).Run(ctx)
    if err != nil {
        g.Dump(err.Maps())
    }
}
```

After execution, the terminal outputs:

```javascript
{
    "passport": {
        "required": "The passport field is required",
        "length":   "The passport value `` length must be between 6 and 16",
    },
    "password": {
        "same": "The password value `123456` must be the same as field password2",
    },
}
```

## Custom Error Messages

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx    = gctx.New()
        params = map[string]interface{}{
            "passport":  "",
            "password":  "123456",
            "password2": "1234567",
        }
        rules = map[string]string{
            "passport":  "required|length:6,16",
            "password":  "required|length:6,16|same:password2",
            "password2": "required|length:6,16",
        }
        messages = map[string]interface{}{
            "passport": "账号不能为空|账号长度应当在{min}到{max}之间",
            "password": map[string]string{
                "required": "密码不能为空",
                "same":     "两次密码输入不相等",
            },
        }
    )

    err := g.Validator().Messages(messages).Rules(rules).Data(params).Run(ctx)
    if err != nil {
        g.Dump(err.Maps())
    }
}
```

This example also demonstrates two data types for passing custom error messages through `messages`, either `string` or `map[string]string`. For `map[string]string`, you need to specify corresponding error messages for each field and rule, forming a two-dimensional associative array. After executing this example, the terminal outputs:

```javascript
{
    "passport": {
            "length": "账号长度应当在6到16之间",
            "required": "账号不能为空"
    },
    "password": {
            "same": "两次密码输入不相等"
    }
}
```