# Process - Tracing

## Introduction

The process management component supports cross-process tracinging features, which are especially useful for some temporarily running processes. The overall tracinging of the framework adopts the `OpenTelemetry` specification.

## Usage Example

### Main Process

`main.go`

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gproc"
)

func main() {
    ctx := gctx.GetInitCtx()
    g.Log().Debug(ctx, `this is main process`)
    if err := gproc.ShellRun(ctx, `go run sub.go`); err != nil {
        panic(err)
    }
}
```

### Subprocess

`sub.go`

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    ctx := gctx.GetInitCtx()
    g.Log().Debug(ctx, `this is sub process`)
}
```

### Execution Result

After execution, the terminal outputs the following:

```bash
$ go run main.go
2022-06-21 20:35:06.196 [DEBU] {00698a61e2a2fa1661da5d7993d72e8c} this is main process
2022-06-21 20:35:07.482 [DEBU] {00698a61e2a2fa1661da5d7993d72e8c} this is sub process
```

As you can see, the trace information has been automatically passed to the subprocess.

> Page: https://goframe.org/en/docs/components/os-gproc-tracing
