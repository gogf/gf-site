# General Codec - FAQ

## Precision Loss of Large Numbers in JSON

### Problem Description

```go
package main

import (
    "github.com/gogf/gf/v2/encoding/gjson"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    str := `{"Id":1492404095703580672,"Name":"Jason"}`
    strJson := gjson.New(str)
    g.Dump(strJson)
}
```

The output is:

```
"{\"Id\":1492404095703580700,\"Name\":\"Jason\"}"
```

### Solution

```go
package main

import (
    "github.com/gogf/gf/v2/encoding/gjson"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    str := `{"Id":1492404095703580672,"Name":"Jason"}`
    strJson := gjson.NewWithOptions(str, gjson.Options{
        StrNumber: true,
    })
    g.Dump(strJson)
}
```

The output is:

```
"{\"Id\":1492404095703580672,\"Name\":\"Jason\"}"
```

### Related Links

- [https://github.com/gogf/gf/issues/1603](https://github.com/gogf/gf/issues/1603)

> Page: https://goframe.org/en/docs/components/encoding-gjson-faq
