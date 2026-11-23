# Regular Expressions - Usage

A simple example:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/text/gregex"
)

func main() {
    match, _ := gregex.MatchString(`(\w+).+\-\-\s*(.+)`, `GoFrame is best! -- John`)
    fmt.Printf(`%s says "%s" is the one he loves!`, match[2], match[1])
}
```

After execution, the output result is:

```
John says "GoFrame" is the one he loves!
```

> Page: https://goframe.org/en/docs/components/text-gregex-example
