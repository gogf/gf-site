# Template Engine - XSS

By default, the template engine does not use `HTML` encoding for all variable outputs, which means that if not handled properly by developers, there might be XSS vulnerabilities.

No worries, the `GoFrame` framework has taken this into full consideration and provides developers with flexible configuration parameters to control whether to encode `HTML` content of variable outputs by default. This feature can be enabled/disabled via the `AutoEncode` configuration item or the `SetAutoEncode` method.

**Tip**

It is important to note that this feature does not affect the built-in function of `include` templates.

Usage example:

1. Configuration file

```toml
[viewer]
    delimiters  =  ["${", "}"]
    autoencode  =  true
```

2. Sample code

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    result, _ := g.View().ParseContent(context.TODO(), "Name: ${.name}", g.Map{
        "name": "<script>alert('john');</script>",
    })
    fmt.Println(result)
}
```

3. Execution output

```html
Name: &lt;script&gt;alert(&#39;john&#39;);&lt;/script&gt;
```

> Page: https://goframe.org/en/docs/core/gview-xss
