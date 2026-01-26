---
slug: '/docs/core/glog-writer'
title: 'Logging - Writer Interface'
sidebar_position: 11
hide_title: true
keywords: [GoFrame, GoFrame Framework, Log Component, Writer Interface, Custom Log Output, Custom Writer, glog Module, Log HOOK, Graylog, Centralized Log Management]
description: "Use the Writer interface of the glog module in the GoFrame framework to customize log output. By implementing a custom Writer object, logs can be flexibly output to different targets such as files, standard output, and Graylog. Additionally, sample code is provided to demonstrate how to implement log HOOK functionality to promptly notify monitoring services of serious errors."
---
:::tip
The `Writer` interface is the lowest-level `IO` writing interface. If your business needs to customize the log content printing, it is recommended to use the `Handler` feature. Refer to the section: [Logging - Handler](日志组件-Handler.md)
:::
## Custom `Writer` Interface

The `glog` module implements log content printing for both standard output and file output. Of course, developers can also implement custom log content output by customizing the `io.Writer` interface. `io.Writer` is a content output interface provided by the standard library, defined as follows:

```go
type Writer interface {
    Write(p []byte) (n int, err error)
}
```

We can implement custom `Writer` output using the `SetWriter` method or the chaining method `To`. Developers can define operations in this `Writer`, and they can also integrate other module functions within it.

Additionally, the `glog.Logger` object has already implemented the `io.Writer` interface, making it very convenient for developers to integrate `glog` into other modules.

## Example 1: Implementing Log `HOOK`

In this example, we implement a custom `Writer` object `MyWriter`. In the `Writer` interface implementation of this object, we evaluate the log content. If a `PANI` or `FATA` error occurs, it indicates a severe error, and the interface will first notify the `Monitor` monitoring service through an `HTTP` interface. Then, the log content is written to files and standard output using the `glog` module according to the configuration.

```go
package main

import (
    "context"
    "fmt"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/text/gregex"
)

type MyWriter struct {
    logger *glog.Logger
}

func (w *MyWriter) Write(p []byte) (n int, err error) {
    var (
        s   = string(p)
        ctx = context.Background()
    )
    if gregex.IsMatchString(`PANI|FATA`, s) {
        fmt.Println("SERIOUS ISSUE OCCURRED!! I'd better tell monitor in first time!")
        g.Client().PostContent(ctx, "http://monitor.mydomain.com", s)
    }
    return w.logger.Write(p)
}

func main() {
    var ctx = context.Background()
    glog.SetWriter(&MyWriter{
        logger: glog.New(),
    })
    glog.Fatal(ctx, "FATAL ERROR")
}
```

After execution, the output result is:

```html
SERIOUS ISSUE OCCURRED!! I'd better tell monitor in first time!
2019-05-23 20:14:49.374 [FATA] FATAL ERROR
Stack:
1. /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/geg/os/glog/glog_writer_hook.go:27
```

## Example 2: Integrating with `Graylog`

Suppose we need to output logs to both files and standard output, and simultaneously output logs to `Graylog`. Clearly, this can only be achieved by customizing the `Writer`. Similarly, we can customize the output to other log collection components or databases.

> `Graylog` is a centralized log management solution comparable to `ELK`, supporting data collection, retrieval, and visualized Dashboards.

Example code:

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/os/glog"
    "github.com/robertkowalski/graylog-golang"
)

type MyGrayLogWriter struct {
    gelf    *gelf.Gelf
    logger  *glog.Logger
}

func (w *MyGrayLogWriter) Write(p []byte) (n int, err error) {
    w.gelf.Send(p)
    return w.logger.Write(p)
}

func main() {
    var ctx = context.Background()
    glog.SetWriter(&MyGrayLogWriter{
        logger : glog.New(),
        gelf   : gelf.New(gelf.Config{
            GraylogPort     : 80,
            GraylogHostname : "graylog-host.com",
            Connection      : "wan",
            MaxChunkSizeWan : 42,
            MaxChunkSizeLan : 1337,
        }),
    })
    glog.Println(ctx, "test log")
}
```