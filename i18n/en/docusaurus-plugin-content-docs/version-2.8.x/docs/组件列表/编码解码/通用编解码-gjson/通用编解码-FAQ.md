---
slug: '/docs/components/encoding-gjson-faq'
title: 'General Codec - FAQ'
sidebar_position: 6
hide_title: true
keywords: [GoFrame, GoFrame Framework, JSON, Encoding, Decoding, Large Number Precision, gjson, Go Language, FAQ, Problem Solving]
description: "The potential issue of loss of large number precision when handling JSON data with the GoFrame framework, along with specific solution example code. By adjusting gjson options, precision loss can be avoided to ensure data accuracy. Additionally, related links are provided for further reference."
---

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