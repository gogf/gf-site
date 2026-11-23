# Charset Conversion

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

> Page: https://goframe.org/en/docs/components/encoding-gcharset
