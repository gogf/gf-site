---
slug: '/docs/core/glog-flags'
title: '日志组件-Flags特性'
sidebar_position: 12
hide_title: true
keywords: [GoFrame,GoFrame框架,glog,日志组件,Flags特性,日志异步输出,调用行号信息,时间格式,日期时间,毫秒]
description: '本文档介绍了GoFrame框架中日志组件的Flags特性，说明如何通过不同的常量组合来控制日志输出的额外特性，包括异步输出、调用行号信息打印以及多种时间格式的选择。这些特性能够帮助开发者实现更灵活的日志记录和调试。'
---

`flags` 用于控制日志组件的额外特性开关，这些属性使用常量进行组合控制，包括：

```go
F_ASYNC      = 1 << iota // 开启日志异步输出
F_FILE_LONG              // 打印调用行号信息，完整绝对路径，例如：/a/b/c/d.go:23
F_FILE_SHORT             // 打印调用行号信息，仅打印文件名，例如：d.go:23，覆盖 F_FILE_LONG.
F_TIME_DATE              // 打印当前日期，如：2009-01-23
F_TIME_TIME              // 打印当前时间，如：01:23:23
F_TIME_MILLI             // 打印当前时间+毫秒，如：01:23:23.675
F_TIME_STD = F_TIME_DATE | F_TIME_MILLI // (默认)打印当前日期+时间+毫秒，如：2009-01-23 01:23:23.675
```

使用示例：

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    ctx := context.TODO()
    l := glog.New()
    l.SetFlags(glog.F_TIME_TIME | glog.F_FILE_SHORT)
    l.Print(ctx, "time and short line number")
    l.SetFlags(glog.F_TIME_MILLI | glog.F_FILE_LONG)
    l.Print(ctx, "time with millisecond and long line number")
    l.SetFlags(glog.F_TIME_STD | glog.F_FILE_LONG)
    l.Print(ctx, "standard time format and long line number")
}

```

执行后，终端输出结果为：

```html
PS C:\hailaz\test> go run .\main.go
16:05:35 main.go:13: time and short line number
16:05:35.108 C:/hailaz/test/main.go:15: time with millisecond and long line number
2022-01-05 16:05:35.109 C:/hailaz/test/main.go:17: standard time format and long line number

```