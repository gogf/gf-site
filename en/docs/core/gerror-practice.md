# Error Handling - Best Practices

## Print Stack Information in Error Objects

When printing error objects via `fmt/glog` or other packages, stack information is not output by default. For example:

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/encoding/gjson"
)

func main() {
    _, err := gjson.Encode(func() {})
    fmt.Printf("err: %v", err)
}
```

After execution, the terminal output:

```html
err: json.Marshal failed: json: unsupported type: func()
```

To print stack information from an error object, use the `%+v` formatting option. For example:

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/encoding/gjson"
)

func main() {
    _, err := gjson.Encode(func() {})
    fmt.Printf("err: %+v", err)
}
```

After execution, the terminal output:

```text
err: json.Marshal failed: json: unsupported type: func()
1. json.Marshal failed
   1).  github.com/gogf/gf/v2/internal/json.Marshal
        /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/internal/json/json.go:30
   2).  github.com/gogf/gf/v2/encoding/gjson.Encode
        /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/encoding/gjson/gjson_stdlib_json_util.go:41
   3).  main.main
        /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/.test/main.go:10
2. json: unsupported type: func()
```

## Avoid Repeated Error Message Printing When Using the Wrap Method

Do not print the error object into the error message when `Wrap`ping an error object, as `Wrap` inherently encapsulates the target error object within the newly created error object. Including the error again in the error string can cause duplications when printing the error stack. For instance (the stack information is not printed for simplification):

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/encoding/gjson"
    "github.com/gogf/gf/v2/errors/gerror"
)

func main() {
    _, err1 := gjson.Encode(func() {})
    err2 := gerror.Wrapf(err1, `error occurred: %v`, err1)
    fmt.Printf("err: %v", err2)
}
```

After execution, the terminal output shows duplicate error messages:

```text
err: error occurred: json.Marshal failed: json: unsupported type: func(): json.Marshal failed: json: unsupported type: func()
```

Let's fix the above code example as shown below:

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/encoding/gjson"
    "github.com/gogf/gf/v2/errors/gerror"
)

func main() {
    _, err1 := gjson.Encode(func() {})
    err2 := gerror.Wrap(err1, `error occurred`)
    fmt.Printf("err: %v", err2)
}
```

After execution, the terminal output:

```text
err: error occurred: json.Marshal failed: json: unsupported type: func()
```

> Page: https://goframe.org/en/docs/core/gerror-practice
