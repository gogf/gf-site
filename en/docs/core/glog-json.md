# Logging - JSON Format

`glog` is very friendly to log analysis tools and supports outputting logs in `JSON` format for easier parsing and analysis of log content later on.

## Using `map/struct` Parameters

Supporting JSON data format log output is very simple; just provide a `map` or `struct` type parameter to the printing method.

Example usage:

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    ctx := context.TODO()
    g.Log().Debug(ctx, g.Map{"uid": 100, "name": "john"})
    type User struct {
        Uid  int    `json:"uid"`
        Name string `json:"name"`
    }
    g.Log().Debug(ctx, User{100, "john"})
}
```

After execution, the terminal outputs:

```html
2019-06-02 15:28:52.653 [DEBU] {"name":"john","uid":100}
2019-06-02 15:28:52.653 [DEBU] {"uid":100,"name":"john"}
```

## Combining `gjson.MustEncode`

Additionally, you can achieve JSON content output in conjunction with `gjson.MustEncode`, for example:

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/encoding/gjson"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    ctx := context.TODO()
    type User struct {
        Uid  int    `json:"uid"`
        Name string `json:"name"`
    }
    g.Log().Debugf(ctx, `user json: %s`, gjson.MustEncode(User{100, "john"}))
}
```

After execution, the terminal outputs:

```html
2022-04-25 18:09:45.029 [DEBU] user json: {"uid":100,"name":"john"}
```

> Page: https://goframe.org/en/docs/core/glog-json
