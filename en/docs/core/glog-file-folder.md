# Logging - File Directory

## Log Files

By default, log file names are named with the current date and time, formatted as `YYYY-MM-DD.log`. We can use the `SetFile` method to set the format of the file name, and the file name format supports [Time](https://goframe.org/en/docs/components/os-gtime.md) time format. Simple example:

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gfile"
    "github.com/gogf/gf/v2/os/glog"
)

// Set log level
func main() {
    ctx := context.TODO()
    path := "./glog"
    glog.SetPath(path)
    glog.SetStdoutPrint(false)
    // Use the default file name format
    glog.Print(ctx, "Standard file name format, using the current date and time")
    // Set file name format via SetFile
    glog.SetFile("stdout.log")
    glog.Print(ctx, "Set the log output file name to a single file")
    // Chained operation to set file name format
    glog.File("stderr.log").Print(ctx, "Supports chained operations")
    glog.File("error-{Ymd}.log").Print(ctx, "File name supports gtime date format")
    glog.File("access-{Ymd}.log").Print(ctx, "File name supports gtime date format")

    list, err := gfile.ScanDir(path, "*")
    g.Dump(err)
    g.Dump(list)
}

```

After execution, the output is:

```html
<nil>
[
    "C:\hailaz\test\glog\2021-12-31.log",
    "C:\hailaz\test\glog\access-20211231.log",
    "C:\hailaz\test\glog\error-20211231.log",
    "C:\hailaz\test\glog\stderr.log",
    "C:\hailaz\test\glog\stdout.log",
]
```

As you can see, if you need to use the `gtime` time format in the file name format, you need to include the format content in `{xxx}`. This example also uses the feature of `chained operations`. For details, see the subsequent explanation.

## Log Directory

By default, `glog` will output log content to the standard output. We can set the directory path for log output through the `SetPath` method, so that log content will be written to the log file. Thanks to the internal use of the `gfpool` file pointer pool, the efficiency of file writing is quite excellent. Simple example:

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gfile"
    "github.com/gogf/gf/v2/os/glog"
)

// Set log level
func main() {
    ctx := context.TODO()
    path := "./glog"
    glog.SetPath(path)
    glog.Print(ctx, "Log content")
    list, err := gfile.ScanDir(path, "*")
    g.Dump(err)
    g.Dump(list)
}

```

After execution, the output is:

```html
2021-12-31 11:32:16.742 Log content
<nil>
[
    "C:\hailaz\test\glog\2021-12-31.log",
]
```

When setting the output directory of the log through `SetPath`, if the directory does not exist, it will recursively create the directory path. As you can see, after executing `Println`, the log directory `glog` was created under `/tmp`, and a log file was generated under it. Also, we can see that the log content is output not only to the file but by default also to the terminal. We can disable terminal log output using the `SetStdoutPrint(false)` method, so the log content will only be output to the log file.

> Page: https://goframe.org/en/docs/core/glog-file-folder
