---
slug: '/docs/components/encoding-gurl'
title: 'URL'
sidebar_position: 5
hide_title: true
keywords: [GoFrame,GoFrame Framework,URL Encoding and Decoding,gurl,URL Parameter Construction,URL Parameter Encoding,URL Parameter Decoding,URL Parsing,Encoding and Decoding,Go Language]
description: "Perform URL encoding and decoding using the gurl package in the GoFrame framework, including how to construct URL parameters, encode and decode URL parameters, and parse URLs to obtain their different components. These features are very useful for network programming and data transmission in the Go language, suitable for developers with similar needs to reference."
---

`URL` encoding and decoding.

**Usage**:

```go
import "github.com/gogf/gf/v2/encoding/gurl"
```

**API Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/encoding/gurl](https://pkg.go.dev/github.com/gogf/gf/v2/encoding/gurl)

## `URL` Parameter Construction

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/encoding/gurl"
    "net/url"
)

func main() {
    // Construct URL parameters
    values := url.Values{}
    values.Add("name", "gopher")
    values.Add("limit", "20")
    values.Add("page", "7")

    // Generate URL encoded query string limit=20&name=gopher&page=7
    urlStr := gurl.BuildQuery(values)
    fmt.Println(urlStr)
}
```

After execution, the output will be:

```
limit=20&name=gopher&page=7
```

## `URL` Parameter Encoding and Decoding

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/encoding/gurl"
    "log"
)

func main() {
    // Encode string for safe placement in URL queries.
    encodeStr := gurl.Encode("limit=20&name=gopher&page=7")
    fmt.Println(encodeStr)

    // Perform URL decoding
    decodeStr, err := gurl.Decode("limit%3D20%26name%3Dgopher%26page%3D7")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(decodeStr)
}
```

After execution, the output will be:

```
limit%3D20%26name%3Dgopher%26page%3D7
limit=20&name=gopher&page=7
```

## Parsing `URL`

`component` parameter value options:

| Parameter Value | Description |
| --- | --- |
| -1 | all |
| 1 | scheme |
| 2 | host |
| 4 | port |
| 8 | user |
| 16 | pass |
| 32 | path |
| 64 | query |
| 128 | fragment |

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/encoding/gurl"
    "log"
)

func main() {
    // Parse URL and return its components
    data, err := gurl.ParseURL("http://127.0.0.1:8199/goods?limit=20&name=gopher&page=7", -1)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(data)
    fmt.Println(data["host"])
    fmt.Println(data["query"])
    fmt.Println(data["path"])
    fmt.Println(data["scheme"])
    fmt.Println(data["fragment"])
}
```

After execution, the output will be:

```
map[fragment: host:127.0.0.1 pass: path:/goods port:8199 query:limit=20&name=gopher&page=7 scheme:http user:]
127.0.0.1
limit=20&name=gopher&page=7
/goods
http
```