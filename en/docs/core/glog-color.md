# Logging - Color Printing

## Color Printing

It can enhance the visibility of logs. When printing logs, the error level text is highlighted by adding font colors.

## Effect Example

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    ctx := context.TODO()
    g.Log().Debug(ctx, "Debug")
    g.Log().Info(ctx, "Info")
    g.Log().Notice(ctx, "Notice")
    g.Log().Warning(ctx, "Warning")
    g.Log().Error(ctx, "Error")
}
```


## Using Configuration

The console will naturally have color output, and file logs do not have colors by default.

If you need logs in files to also have colors, you can add configuration in the configuration file.

```yaml
logger:
  stdoutColorDisabled: false # Whether to disable terminal color printing. Default is no, which means terminal color output is enabled.
  writerColorEnable:   false # Whether to enable Writer color printing. Default is no, which means no color output to custom Writers or files.
```

You can also add it in the code

```go
g.Log().SetWriterColorEnable(true)
```

The effect is as follows (the red box shows the effect after adding file log color, while the other part shows the effect when it is not enabled)

## Default Color Correspondence Table

By default, different log levels correspond to the following colors:

```go
// \v2\os\glog\glog_logger_color.go
var defaultLevelColor = map[int]int{
    LEVEL_DEBU: COLOR_YELLOW,
    LEVEL_INFO: COLOR_GREEN,
    LEVEL_NOTI: COLOR_CYAN,
    LEVEL_WARN: COLOR_MAGENTA,
    LEVEL_ERRO: COLOR_RED,
    LEVEL_CRIT: COLOR_HI_RED,
    LEVEL_PANI: COLOR_HI_RED,
    LEVEL_FATA: COLOR_HI_RED,
}
```

> Page: https://goframe.org/en/docs/core/glog-color
