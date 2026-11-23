# Template Funcs - Custom

## Introduction

Developers can define custom template functions and globally bind them to specified view objects.

**Tip**

Custom objects can also be assigned to templates, allowing method calls on those objects.

## Example

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
)

// Test built-in function with parameters
func funcHello(name string) string {
    return fmt.Sprintf(`Hello %s`, name)
}

func main() {
    // Bind global template function
    g.View().BindFunc("hello", funcHello)

    // Pass parameters in a regular way
    parsed1, err := g.View().ParseContent(context.TODO(), `{{hello "GoFrame"}}`, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(string(parsed1))

    // Pass parameters through a pipeline
    parsed2, err := g.View().ParseContent(context.TODO(), `{{"GoFrame" | hello}}`, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(string(parsed2))
}
```

After execution, the output is:

```
Hello GoFrame
Hello GoFrame
```

> Page: https://goframe.org/en/docs/core/gview-funcs-custom
