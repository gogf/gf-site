---
title: 'gregex (正则表达式)'
sidebar_position: 0
hide_title: true
---

`gregex` 提供了对正则表达式的支持，底层是对标准库 `regexp` 的封装，极大地简化了正则的使用，并采用了解析缓存设计，提高了执行效率。

**使用方式**：

```go
import "github.com/gogf/gf/text/gregex"

```

**接口文档**：

[https://godoc.org/github.com/gogf/gf/text/gregex](https://godoc.org/github.com/gogf/gf/text/gregex)

**简单示例：**

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/text/gregex"
)

func main() {
    match, _ := gregex.MatchString(`(\w+).+\-\-\s*(.+)`, `GF is best! -- John`)
    fmt.Printf(`%s says "%s" is the one he loves!`, match[2], match[1])
}

```

执行后，输出结果为：

```html
John says "GF" is the one he loves!

```