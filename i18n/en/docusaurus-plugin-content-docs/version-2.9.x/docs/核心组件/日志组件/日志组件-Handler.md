---
slug: '/docs/core/glog-handler'
title: 'Logging - Handler'
sidebar_position: 6
hide_title: true
keywords: [GoFrame, log component, Handler feature, log processing, custom output, Json format, Graylog service, log collection, glog, middleware design]
description: "This article introduces the new customizable log processing Handler feature of the glog component in the GoFrame framework starting from version v2.0. Developers can implement custom log output through the Handler, such as converting logs to Json format or outputting them to third-party services like Graylog. Detailed examples demonstrate how to use Handler for log processing in the GoFrame framework."
---

Starting from version `v2.0`, the `glog` component provides a super powerful, customizable log processing `Handler` feature. `Handler` adopts a middleware design approach, allowing developers to register multiple processing `Handlers` for the log object, and also to override the default log component processing logic within the `Handler`.

## Related Definitions

### `Handler` Method Definition

```go
// Handler is function handler for custom logging content outputs.
type Handler func(ctx context.Context, in *HandlerInput)
```

As you can see, the second parameter is the log information to be processed by the log and is of pointer type, meaning that any attribute information of this parameter can be modified within the `Handler`, and the modified content will be passed to the next `Handler`.

### `Handler` Parameter Definition

```go
// HandlerInput is the input parameter struct for logging Handler.
type HandlerInput struct {
    Logger      *Logger       // Current Logger object.
    Buffer      *bytes.Buffer // Buffer for logging content outputs.
    Time        time.Time     // Logging time, which is the time that logging triggers.
    TimeFormat  string        // Formatted time string, like "2016-01-09 12:00:00".
    Color       int           // Using color, like COLOR_RED, COLOR_BLUE, etc. Eg: 34
    Level       int           // Using level, like LEVEL_INFO, LEVEL_ERRO, etc. Eg: 256
    LevelFormat string        // Formatted level string, like "DEBU", "ERRO", etc. Eg: ERRO
    CallerFunc  string        // The source function name that calls logging, only available if F_CALLER_FN set.
    CallerPath  string        // The source file path and its line number that calls logging, only available if F_FILE_SHORT or F_FILE_LONG set.
    CtxStr      string        // The retrieved context value string from context, only available if Config.CtxKeys configured.
    TraceId     string        // Trace id, only available if OpenTelemetry is enabled.
    Prefix      string        // Custom prefix string for logging content.
    Content     string        // Content is the main logging content without error stack string produced by logger.
    Values      []any         // The passed un-formatted values array to logger.
    Stack       string        // Stack string produced by logger, only available if Config.StStatus configured.
    IsAsync     bool          // IsAsync marks it is in asynchronous logging.
}
```

Developers have **two ways** to customize log output content through `Handler`:

- One way is to directly modify the attribute information in `HandlerInput` and then continue to execute `in.Next(ctx)`. The default log output logic will print the attributes in `HandlerInput` as a string output.
- Another way is to write log content into the `Buffer` buffer object. If the default log output logic finds that `Buffer` already contains log content, it will ignore the default log output logic.

### Registering `Handler` to `Logger` Method

```go
// SetHandlers sets the logging handlers for current logger.
func (l *Logger) SetHandlers(handlers ...Handler)
```

## Usage Example

Let's look at two examples to better understand how to use `Handler`.

### Example 1: Convert Log Output to `Json` Format

In this example, we use a pre-middleware design to modify the log output format to `JSON` format through a custom `Handler`.

```go
package main

import (
    "context"
    "encoding/json"
    "os"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/text/gstr"
)

// JsonOutputsForLogger is for JSON marshaling in sequence.
type JsonOutputsForLogger struct {
    Time    string `json:"time"`
    Level   string `json:"level"`
    Content string `json:"content"`
}

// LoggingJsonHandler is a example handler for logging JSON format content.
var LoggingJsonHandler glog.Handler = func(ctx context.Context, in *glog.HandlerInput) {
    jsonForLogger := JsonOutputsForLogger{
        Time:    in.TimeFormat,
        Level:   gstr.Trim(in.LevelFormat, "[]"),
        Content: gstr.Trim(in.Content), // For version 2.7 and above, use in.ValuesContent()
    }
    jsonBytes, err := json.Marshal(jsonForLogger)
    if err != nil {
        _, _ = os.Stderr.WriteString(err.Error())
        return
    }
    in.Buffer.Write(jsonBytes)
    in.Buffer.WriteString("\n")
    in.Next(ctx)
}

func main() {
    g.Log().SetHandlers(LoggingJsonHandler)
    ctx := context.TODO()
    g.Log().Debug(ctx, "Debugging...")
    g.Log().Warning(ctx, "It is warning info")
    g.Log().Error(ctx, "Error occurs, please have a check")
}
```

As you can see, we can control the output log content through the `Buffer` attribute in the `Handler`. If the `Buffer` content is empty after all pre-middleware `Handlers` process, continuing to execute `Next` will execute the default `Handler` logic of the log middleware. After executing the code of this example, the terminal output:

```html
{"time":"2021-12-31 11:03:25.438","level":"DEBU","content":"Debugging..."}
{"time":"2021-12-31 11:03:25.438","level":"WARN","content":"It is warning info"}
{"time":"2021-12-31 11:03:25.438","level":"ERRO","content":"Error occurs, please have a check \nStack:\n1.  main.main\n    C:/hailaz/test/main.go:42"}
```

### Example 2: Output Content to a Third-party Log Collection Service

In this example, we use a post-middleware design to output a copy of the log content to a third-party `graylog` log collection service through a custom `Handler` without affecting the original log output processing.

> `Graylog` is comparable to `ELK` and is a centralized log management solution that supports data collection, retrieval, and visualization dashboards. In this example, a simple third-party `graylog` client component is used.

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/glog"
    gelf "github.com/robertkowalski/graylog-golang"
)

var grayLogClient = gelf.New(gelf.Config{
    GraylogPort:     80,
    GraylogHostname: "graylog-host.com",
    Connection:      "wan",
    MaxChunkSizeWan: 42,
    MaxChunkSizeLan: 1337,
})

// LoggingGrayLogHandler is an example handler for logging content to remote GrayLog service.
var LoggingGrayLogHandler glog.Handler = func(ctx context.Context, in *glog.HandlerInput) {
    in.Next(ctx)
    grayLogClient.Log(in.Buffer.String())
}

func main() {
    g.Log().SetHandlers(LoggingGrayLogHandler)
    ctx := context.TODO()
    g.Log().Debug(ctx, "Debugging...")
    g.Log().Warning(ctx, "It is warning info")
    g.Log().Error(ctx, "Error occurs, please have a check")
    glog.Print(ctx, "test log")
}
```

## Global Default `Handler`

By default, the log object does not have any `Handlers` set. From version `v2.1`, the framework provides a feature to set a global default `Handler`. The global default `Handler` will be effective for all log printing functions that use this log component and do not have custom `Handlers`. At the same time, the global default `Handler` will affect the log printing behavior of the log package methods.

Developers can use the following two methods to set and get the global default `Handler`.

```go
// SetDefaultHandler sets default handler for package.
func SetDefaultHandler(handler Handler)

// GetDefaultHandler returns the default handler of package.
func GetDefaultHandler() Handler
```

It should be noted that this method of global package configuration is not thread-safe and often needs to be executed at the very top of the project startup logic.

Usage example, where we use `JSON` format for all project log outputs to ensure log content is structured and each log output is single-line for easy log collection during log collection period:

```go
package main

import (
    "context"
    "encoding/json"
    "os"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/text/gstr"
)

// JsonOutputsForLogger is for JSON marshaling in sequence.
type JsonOutputsForLogger struct {
    Time    string `json:"time"`
    Level   string `json:"level"`
    Content string `json:"content"`
}

// LoggingJsonHandler is an example handler for logging JSON format content.
var LoggingJsonHandler glog.Handler = func(ctx context.Context, in *glog.HandlerInput) {
    jsonForLogger := JsonOutputsForLogger{
        Time:    in.TimeFormat,
        Level:   gstr.Trim(in.LevelFormat, "[]"),
        Content: gstr.Trim(in.Content), // For version 2.7 and above, use in.ValuesContent()
    }
    jsonBytes, err := json.Marshal(jsonForLogger)
    if err != nil {
        _, _ = os.Stderr.WriteString(err.Error())
        return
    }
    in.Buffer.Write(jsonBytes)
    in.Buffer.WriteString("\n")
    in.Next(ctx)
}

func main() {
    ctx := context.TODO()
    glog.SetDefaultHandler(LoggingJsonHandler)

    g.Log().Debug(ctx, "Debugging...")
    glog.Warning(ctx, "It is warning info")
    glog.Error(ctx, "Error occurs, please have a check")
}
```

After execution, the terminal output:

```html
{"time":"2022-06-20 10:51:50.235","level":"DEBU","content":"Debugging..."}
{"time":"2022-06-20 10:51:50.235","level":"WARN","content":"It is warning info"}
{"time":"2022-06-20 10:51:50.235","level":"ERRO","content":"Error occurs, please have a check"}
```

## General Component `Handler`

The component provides a number of general-purpose log `Handlers` to facilitate developer use and improve development efficiency.

### `HandlerJson`

This `Handler` can convert log content to `Json` format for printing. Usage example:

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    ctx := context.TODO()
    glog.SetDefaultHandler(glog.HandlerJson)

    g.Log().Debug(ctx, "Debugging...")
    glog.Warning(ctx, "It is warning info")
    glog.Error(ctx, "Error occurs, please have a check")
}
```

After execution, the terminal output:

```html
{"Time":"2022-06-20 20:04:04.725","Level":"DEBU","Content":"Debugging..."}
{"Time":"2022-06-20 20:04:04.725","Level":"WARN","Content":"It is warning info"}
{"Time":"2022-06-20 20:04:04.725","Level":"ERRO","Content":"Error occurs, please have a check","Stack":"1.  main.main\n    /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/.test/main.go:16\n"}
```

### `HandlerStructure`

This `Handler` prints log content in a structured format, primarily to keep the log output content consistent with the `slog` format of the newer versions of `Golang`. It is important to note that the structured log printing feature needs to ensure that all log records use structured output for greater significance. Usage example:

```go
package main

import (
    "context"
    "net"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    ctx := context.TODO()
    glog.SetDefaultHandler(glog.HandlerStructure)

    g.Log().Info(ctx, "caution", "name", "admin")
    glog.Error(ctx, "oops", net.ErrClosed, "status", 500)
}
```

After execution, the terminal output:

```html
Time="2023-11-23 21:00:08.671" Level=INFO Content=caution name=admin
Time="2023-11-23 21:00:08.671" Level=ERRO oops="use of closed network connection" status=500 Stack="1.  main.main\n    /Users/txqiangguo/Workspace/gogf/gf/example/.test/main.go:16\n"
```