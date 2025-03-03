---
slug: '/docs/core/glog-context'
title: 'Logging - Context'
sidebar_position: 5
hide_title: true
keywords: [GoFrame,GoFrame framework,glog,log component,Context,CtxKeys,log output,OpenTelemetry,trace,Handler]
description: "Usage of glog log component in the GoFrame framework, particularly how to achieve log printing through Context variables. The article provides a detailed explanation on configuring and using custom CtxKeys, and offers functionalities supporting trace. Additionally, it covers the implementation of the log Handler to help developers better integrate logging features."
---

Starting from version `v2`, the `glog` component uses the `ctx` context variable as a necessary parameter for log printing.

## Custom `CtxKeys`

The log component supports custom key-value printing by reading from the `ctx` context variable.

### Configuration Usage

```yaml
# Log component configuration
logger:
  Level:   "all"
  Stdout:  true
  CtxKeys: ["RequestId", "UserId"]
```

Here, `CtxKeys` is used to configure the key names that need to be read and output from the `context.Context` interface object.

### Log Output

With the above configuration, when outputting logs, specify the output `context.Context` interface object using the `Ctx` chained operation method. Please note **not to use a custom type as the Key**, otherwise, it cannot be output to the log file, for example:

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    var ctx = context.Background()

    // You can directly use String as Key
    ctx = context.WithValue(ctx, "RequestId", "123456789")

    // To extract the Key as a public variable, you can use the gctx.StrKey type, or directly use string type
    const userIdKey gctx.StrKey = "UserId" // or const userIdKey = "UserId"
    ctx = context.WithValue(ctx, userIdKey, "10000")

    // Cannot use custom type
    type notPrintKeyType string
    const notPrintKey notPrintKeyType = "NotPrintKey"
    ctx = context.WithValue(ctx, notPrintKey, "notPrintValue") // Will not print notPrintValue

    g.Log().Error(ctx, "runtime error")
}
```

After execution, the terminal output will be:

```html
2024-09-26 11:45:33.790 [ERRO] {123456789, 10000} runtime error
Stack:
1.  main.main
    /Users/teemo/GolandProjects/gogf/demo/main.go:24

```

### Log Example

![](/markdown/d9b17863576dca859b0b13b98041130e.png)

## Delivery to `Handler`

If a developer customizes a `Handler` for the log object, each `ctx` context variable passed during log printing will be delivered to the `Handler`. For an introduction to log `Handler`, please refer to the section: [Logging - Handler](日志组件-Handler.md)

## Trace Support

The `glog` component supports the OpenTelemetry standard trace feature, which is built-in and requires no setup from the developer. For more information, please refer to the section: [Service Tracing](../../服务可观测性/服务链路跟踪/服务链路跟踪.md)

![](/markdown/a6ade54c58ba067b6be203a6e17b15e5.png)