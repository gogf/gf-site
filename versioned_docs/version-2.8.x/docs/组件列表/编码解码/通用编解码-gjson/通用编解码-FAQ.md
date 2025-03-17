---
slug: '/docs/components/encoding-gjson-faq'
title: '通用编解码-FAQ'
sidebar_position: 6
hide_title: true
keywords: [GoFrame,GoFrame框架,JSON,编码,解码,大数字精度,gjson,Go语言,FAQ,问题解决]
description: '在使用GoFrame框架处理JSON数据时可能遇到的大数字精度丢失问题，并提供了具体的解决方案示例代码。通过调整gjson选项，可以避免精度丢失，确保数据的准确性。同时，文中还提供了相关链接供进一步参考。'
---

## JSON中的大数字精度丢失问题

### 问题描述

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

执行后输出为：

```
"{\"Id\":1492404095703580700,\"Name\":\"Jason\"}"
```

### 解决方案

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

执行后输出为：

```
"{\"Id\":1492404095703580672,\"Name\":\"Jason\"}"
```

### 相关连接

- [https://github.com/gogf/gf/issues/1603](https://github.com/gogf/gf/issues/1603)