# Response - File Downloading

The `Response` object supports file downloading.

Related methods:

```go
func (r *Response) ServeFile(path string, allowIndex ...bool)
func (r *Response) ServeFileDownload(path string, name ...string)
```

## `ServeFile`

With the given file path `path`, the `ServeFile` method will automatically recognize the file format. If it's a directory or text content, it will directly display the file content. If the `path` parameter is a directory, then the second parameter `allowIndex` controls whether the file list under the directory can be displayed.

Example usage:


```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.ServeFile("test.txt")
    })
    s.SetPort(8999)
    s.Run()
}
```

Visit [http://127.0.0.1:8999](http://127.0.0.1:8999) to see that the file content is displayed on the page.

## `ServeFileDownload`

`ServeFileDownload` is a relatively frequently used method for directly guiding the client to download a file from a specified path and can assign a new name for the downloaded file. The `ServeFileDownload` method uses streaming download control, which has low memory usage. In the example below, we modify the `ServeFile` method from the above example to the `ServeFileDownload` method:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.ServeFileDownload("test.txt")
    })
    s.SetPort(8999)
    s.Run()
}
```

Visit [http://127.0.0.1:8999](http://127.0.0.1:8999) to see that the file is guided to download rather than displaying the page content.

> Page: https://goframe.org/en/docs/web/response-file-downloading
