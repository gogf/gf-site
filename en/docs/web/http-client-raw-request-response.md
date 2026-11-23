# HTTPClient - Raw

## Introduction

The `http` client supports obtaining and printing the raw input and output information of HTTP requests, which is convenient for debugging. The related methods are as follows:

```go
func (r *Response) Raw() string
func (r *Response) RawDump()
func (r *Response) RawRequest() string
func (r *Response) RawResponse() string
```

As you can see, all methods are bound to the `Response` object, which means they can only be printed after the request is completed.

## Usage Example

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    response, err := g.Client().Post(
        gctx.New(),
        "https://goframe.org",
        g.Map{
            "name": "john",
        },
    )
    if err != nil {
        panic(err)
    }
    response.RawDump()
}
```

After execution, the terminal output is:

```
+---------------------------------------------+
|                   REQUEST                   |
+---------------------------------------------+
POST / HTTP/1.1
Host: goframe.org
User-Agent: GoFrameHTTPClient v2.0.0-beta
Content-Length: 9
Content-Type: application/x-www-form-urlencoded
Accept-Encoding: gzip

name=john

+---------------------------------------------+
|                   RESPONSE                  |
+---------------------------------------------+
HTTP/1.1 405 Method Not Allowed
Connection: close
Transfer-Encoding: chunked
Allow: GET
Cache-Control: no-store
Content-Security-Policy: frame-ancestors 'self'
Content-Type: text/html;charset=UTF-8
Date: Fri, 03 Dec 2021 09:43:29 GMT
Expires: Thu, 01 Jan 1970 00:00:00 GMT
Server: nginx
...
```

> Page: https://goframe.org/en/docs/web/http-client-raw-request-response
