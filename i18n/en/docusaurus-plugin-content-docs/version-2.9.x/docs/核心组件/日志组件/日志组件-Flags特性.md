---
slug: '/docs/core/glog-flags'
title: 'Logging - Flags'
sidebar_position: 12
hide_title: true
keywords: [GoFrame, GoFrame Framework, glog, Log Component, Flags Feature, Asynchronous Log Output, Line Number Information, Time Format, Date and Time, Milliseconds]
description: "Flags feature of the log component in the GoFrame framework, explaining how to control additional log output features through different constant combinations, including asynchronous output, call line number information printing, and various time format selections. These features enable developers to achieve more flexible logging and debugging."
---

`flags` are used to control the additional feature switches of the log component. These properties are controlled by combining constants, including:

```go
F_ASYNC      = 1 << iota // Enable asynchronous log output
F_FILE_LONG              // Print call line number information with a full absolute path, e.g., /a/b/c/d.go:23
F_FILE_SHORT             // Print call line number information, only the file name, e.g., d.go:23, overrides F_FILE_LONG.
F_TIME_DATE              // Print the current date, e.g., 2009-01-23
F_TIME_TIME              // Print the current time, e.g., 01:23:23
F_TIME_MILLI             // Print the current time + milliseconds, e.g., 01:23:23.675
F_TIME_STD = F_TIME_DATE | F_TIME_MILLI // (Default) Print the current date + time + milliseconds, e.g., 2009-01-23 01:23:23.675
```

Usage example:

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

After execution, the terminal output is:

```html
PS C:\hailaz\test> go run .\main.go
16:05:35 main.go:13: time and short line number
16:05:35.108 C:/hailaz/test/main.go:15: time with millisecond and long line number
2022-01-05 16:05:35.109 C:/hailaz/test/main.go:17: standard time format and long line number

```