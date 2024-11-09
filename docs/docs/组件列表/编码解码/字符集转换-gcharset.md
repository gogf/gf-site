---
slug: '/docs/components/encoding-gcharset'
title: '字符集转换-gcharset'
sidebar_position: 10
hide_title: true
keywords: [GoFrame,GoFrame框架,字符编码转换,gcharset,GBK,UTF-8,字符集转换,编码转换模块,中文字符集,程序示例]
description: '本页面介绍了GoFrame框架中的字符编码转换模块gcharset，支持如GBK、UTF-8等常见字符集的转换，为开发者提供了灵活的字符集兼容性。通过导入相关包，开发者可以实现不同字符集之间的转换，从而满足多语言、多地区用户的需求，提升应用程序的国际化与本地化能力。'
---

`GoFrame` 框架提供了强大的字符编码转换模块 `gcharset`，支持常见字符集的相互转换。

支持的字符集:

| 编码 | 字符集 |
| --- | --- |
| **中文** | `GBK/GB18030/GB2312/Big5` |
| **日文** | `EUCJP/ISO2022JP/ShiftJIS` |
| **韩文** | `EUCKR` |
| **Unicode** | `UTF-8/UTF-16/UTF-16BE/UTF-16LE` |
| **其他编码** | `macintosh/IBM*/Windows*/ISO-*` |

**使用方式**：

```go
import "github.com/gogf/gf/v2/encoding/gcharset"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/encoding/gcharset](https://pkg.go.dev/github.com/gogf/gf/v2/encoding/gcharset)

**使用示例**：

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/encoding/gcharset"
)

func main() {
    var (
        src        = "~{;(<dR;:x>F#,6@WCN^O`GW!#"
        srcCharset = "GB2312"
        dstCharset = "UTF-8"
    )
    str, err := gcharset.Convert(dstCharset, srcCharset, src)
    if err != nil {
        panic(err)
    }
    fmt.Println(str)
}
```

执行后，终端输出结果为：

```
花间一壶酒，独酌无相亲。
```
