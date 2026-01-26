---
slug: '/docs/components/encoding-gcharset'
title: 'Charset Conversion'
sidebar_position: 10
hide_title: true
keywords: [GoFrame, GoFrame Framework, Character Encoding Conversion, gcharset, GBK, UTF-8, Character Set Conversion, Encoding Conversion Module, Chinese Character Set, Program Example]
description: "The character encoding conversion module gcharset in the GoFrame framework supports conversions of common character sets such as GBK and UTF-8, providing developers with flexible character set compatibility. By importing the relevant package, developers can achieve conversions between different character sets to meet the needs of multilingual and international users, enhancing the internationalization and localization capabilities of applications."
---

The `GoFrame` framework provides a powerful character encoding conversion module `gcharset`, supporting mutual conversion of common character sets.

Supported character sets:

| Encoding | Character Set |
| --- | --- |
| **Chinese** | `GBK/GB18030/GB2312/Big5` |
| **Japanese** | `EUCJP/ISO2022JP/ShiftJIS` |
| **Korean** | `EUCKR` |
| **Unicode** | `UTF-8/UTF-16/UTF-16BE/UTF-16LE` |
| **Other Encodings** | `macintosh/IBM*/Windows*/ISO-*` |

**Usage**:

```go
import "github.com/gogf/gf/v2/encoding/gcharset"
```

**API Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/encoding/gcharset](https://pkg.go.dev/github.com/gogf/gf/v2/encoding/gcharset)

**Usage Example**:

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

After execution, the terminal output is:

```
花间一壶酒，独酌无相亲。
```