---
slug: '/docs/core/gvalid-parameter-type-struct-assoc'
title: 'Struct校验-Assoc关联'
sidebar_position: 1
hide_title: true
keywords: [GoFrame,GoFrame框架,gvalid,Struct校验,Assoc方法,参数校验,结构体校验,goframe v2.0,gvalid tag,客户端请求校验]
description: '在GoFrame框架中，为了避免结构体默认值带来的问题，引入了Assoc方法，可以严格按照给定参数进行结构体校验。此方法特别适用于需要处理客户端请求参数的场景，确保校验规则不受默认值影响。'
---

为了避免结构体默认值带来的困惑，从 `goframe v2.0` 版本开始，我们增加了一个 `Assoc` 方法，用于结构体校验时严格按照给定的参数而不是按照结构体的属性值（避免结构体属性默认值的影响），而校验规则同样会自动读取结构体中的 `gvalid tag`。
:::tip
该特定对接收客户端请求参数校验的场景特别有用。
:::
## 使用示例

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    type User struct {
        Name string `v:"required#请输入用户姓名"`
        Type int    `v:"required#请选择用户类型"`
    }
    var (
        ctx  = gctx.New()
        user = User{}
        data = g.Map{
            "name": "john",
        }
    )
    err := g.Validator().Assoc(data).Data(user).Run(ctx)
    if err != nil {
        g.Dump(err.Items())
    }
}
```

执行后，终端输出：

```
[
    {
        "Type": {
            "required": "请选择用户类型"
        }
    }
]
```

可以看到，结构体中的属性 `Type` 校验规则 `required` 并没有受到默认值的影响，仍旧被执行了预期的校验检查。