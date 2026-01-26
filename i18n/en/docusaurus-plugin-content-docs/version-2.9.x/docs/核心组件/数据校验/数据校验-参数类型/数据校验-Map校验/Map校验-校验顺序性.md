---
slug: '/docs/core/gvalid-parameter-type-map-sequence'
title: 'Map Validation - Sequence'
sidebar_position: 1
hide_title: true
keywords: [Map Validation,Validation Order,GoFrame,Parameter Validation,golang,map Type,Rule Order,Validation Error Information,gogf,Data Validation]
description: "Implementing the order of Map validation in the GoFrame framework. By modifying the rule parameter type to []string, the order of the returned error messages can be consistent with the set rules, solving the issue of non-fixed validation results caused by the unordered nature of map types in golang. This tutorial provides detailed example code and execution results to help users understand how to perform order validation using GoFrame."
---

## Introduction

If you execute the previous example code several times, you will find that the returned results are unordered, and the order of the fields and rules is completely random. Even if we use other methods like `FirstItem`, `FirstString()` to obtain validation results, they are the same, and the returned validation results are not fixed. This is because the rules we pass are of the `map` type, and the `map` type in `golang` does not have order, so the validation results are random, and the same validation method may return different result values each time it is executed.

## Sequential Validation

Let's improve the above example: If the validation result does not satisfy the `required` rule, it returns the corresponding error message; otherwise, it returns the subsequent validation error message. In other words, the returned error messages should be consistent with the sequence defined in the rules. As follows:

```go
package main

import (
    "fmt"
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
        rules = []string{
            "passport@required|length:6,16#账号不能为空|账号长度应当在{min}到{max}之间",
            "password@required|length:6,16|same:password2#密码不能为空|密码长度应当在{min}到{max}之间|两次密码输入不相等",
            "password2@required|length:6,16#",
        }
    )
    err := g.Validator().Rules(rules).Data(params).Run(ctx)
    if err != nil {
        fmt.Println(err.Map())
        fmt.Println(err.FirstItem())
        fmt.Println(err.FirstError())
    }
}
```

After execution, the terminal output:

```
map[length:账号长度应当在6到16之间 required:账号不能为空]
passport map[length:账号长度应当在6到16之间 required:账号不能为空]
账号不能为空
```

As you can see, if we want the validation results to maintain order, we just need to change the type of the `rules` parameter to `[]string` and set them according to a certain rule. Furthermore, the `msgs` parameter can be defined directly in the `rules` parameter or passed separately (using a third parameter). For detailed rules on writing validation rules in `rules`, please refer to the chapter [Struct Validation - Example](../数据校验-Struct校验/Struct校验-基本使用.md).