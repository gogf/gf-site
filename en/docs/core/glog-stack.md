# Logging - Stack Printing

Error log information supports the `Stack` feature, which can automatically print the stack information of the current invocation of log component methods. This stack information can be triggered by error log output methods like `Notice*/Warning*/Error*/Critical*/Panic*/Fatal*`, or obtained/printed via `GetStack/PrintStack`. The `stack` information of error messages is quite useful for debugging.

### Example 1, Triggered by `Error` Method

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/os/glog"
)

func Test(ctx context.Context) {
    glog.Error(ctx, "This is error!")
}

func main() {
    ctx := context.TODO()
    Test(ctx)
}

```

The printed result is as follows:

```html
2022-01-05 15:08:54.998 [ERRO] This is error!
Stack:
1.  main.Test
    C:/hailaz/test/main.go:10
2.  main.main
    C:/hailaz/test/main.go:15
```

### Example 2, Print via `Stack` Method

```go
package main

import (
    "context"
    "fmt"

    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    ctx := context.TODO()
    glog.PrintStack(ctx)
    glog.New().PrintStack(ctx)

    fmt.Println(glog.GetStack())
    fmt.Println(glog.New().GetStack())
}

```

After execution, the output is:

```html
2019-07-12 22:20:28.070 Stack:
1. main.main
   /home/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/geg/os/glog/glog_stack.go:11

2019-07-12 22:20:28.070 Stack:
1. main.main
   /home/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/geg/os/glog/glog_stack.go:12

1. main.main
   /home/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/geg/os/glog/glog_stack.go:14

1. main.main
   /home/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/geg/os/glog/glog_stack.go:15
```

### Example 3, Print `gerror.Error`

The `glog` logging module supports stack printing for both standard errors and `gerror` errors.

```go
package main

import (
    "context"
    "errors"

    "github.com/gogf/gf/v2/errors/gerror"
    "github.com/gogf/gf/v2/os/glog"
)

func MakeError() error {
    return errors.New("connection closed with normal error")
}

func MakeGError() error {
    return gerror.New("connection closed with gerror")
}

func TestGError(ctx context.Context) {
    err1 := MakeError()
    err2 := MakeGError()
    glog.Error(ctx, err1)
    glog.Errorf(ctx, "%+v", err2)
}

func main() {
    ctx := context.TODO()
    TestGError(ctx)
}

```

After execution, the terminal output is:

```html
2019-07-12 22:23:11.467 [ERRO] connection closed with normal error
Stack:
1. main.TestGError
   /home/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/geg/os/glog/glog_gerror.go:20
2. main.main
   /home/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/geg/os/glog/glog_gerror.go:25

2019-07-12 22:23:11.467 [ERRO] connection closed with gerror
1. connection closed with gerror
    1). main.MakeGError
        /home/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/geg/os/glog/glog_gerror.go:14
    2). main.TestGError
        /home/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/geg/os/glog/glog_gerror.go:19
    3). main.main
        /home/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/geg/os/glog/glog_gerror.go:25
Stack:
1. main.TestGError
   /home/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/geg/os/glog/glog_gerror.go:21
2. main.main
   /home/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/geg/os/glog/glog_gerror.go:25
```

> Page: https://goframe.org/en/docs/core/glog-stack
