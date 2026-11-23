# Cron Job - Logging

`gcron` supports logging functionality, allowing the setting of log output files and levels. By default, it only outputs logs at the `LEVEL_WARN | LEVEL_ERRO | LEVEL_CRIT` error levels (including scheduled task exceptions), with runtime logs recorded at the `LEVEL_DEBUG` level, which are not recorded by default. The `gcron` component uses the unified logging component of the `goframe` framework, allowing reuse of all the logging component features. Relevant methods:

```go
func SetLogger(logger glog.ILogger)
func GetLogger() glog.ILogger
```

**Tip**

For logging component features, please refer to the [Logging](https://goframe.org/en/docs/core/glog.md) section.

Usage example:

```go
package main

import (
    "context"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gcron"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/glog"
    "time"
)

func main() {
    var (
        err    error
        ctx    = gctx.New()
        logger = glog.New()
    )
    logger.SetLevel(glog.LEVEL_ALL)
    gcron.SetLogger(logger)
    _, err = gcron.Add(ctx, "* * * * * ?", func(ctx context.Context) {
        g.Log().Info(ctx, "test")
    })
    if err != nil {
        panic(err)
    }
    time.Sleep(3 * time.Second)
}
```

After execution, the terminal output is:

> Page: https://goframe.org/en/docs/components/os-gcron-logging
