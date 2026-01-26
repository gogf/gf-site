---
slug: '/docs/web/http-client-file-uploading'
title: 'HTTPClient - File Uploading'
sidebar_position: 1
hide_title: true
keywords: [GoFrame,HTTP Client,File Uploading,Server API,Form File,GoFrame Framework,Single File Upload,Multiple File Upload,File Path,Upload Parameters]
description: "Using the GoFrame framework for HTTP client file uploading, a convenient file upload feature is implemented, and three major APIs are provided to support single and multiple file uploads. Detailed explanations of both server and client implementation code are provided, along with methods for custom file naming and standardized routing to receive uploaded files, suitable for scenarios requiring integration of file upload functionality."
---

`GoFrame` supports very convenient form file uploading functionality, and the HTTP client has encapsulated the upload functionality to simplify the calling of the upload feature significantly.
:::warning
Note: The upload file size is affected by the `ClientMaxBodySize` configuration of `ghttp.Server`: [https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#ServerConfig](https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#ServerConfig). The default supported upload file size is `8MB`.
:::
## Server

On the server side, use the `Request` object to get the uploaded files:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

// Upload uploads files to /tmp .
func Upload(r *ghttp.Request) {
    files := r.GetUploadFiles("upload-file")
    names, err := files.Save("/tmp/")
    if err != nil {
        r.Response.WriteExit(err)
    }
    r.Response.WriteExit("upload successfully: ", names)
}

// UploadShow shows uploading single file page.
func UploadShow(r *ghttp.Request) {
    r.Response.Write(`
    <html>
    <head>
        <title>GoFrame Upload File Demo</title>
    </head>
        <body>
            <form enctype="multipart/form-data" action="/upload" method="post">
                <input type="file" name="upload-file" />
                <input type="submit" value="upload" />
            </form>
        </body>
    </html>
    `)
}

// UploadShowBatch shows uploading multiple files page.
func UploadShowBatch(r *ghttp.Request) {
    r.Response.Write(`
    <html>
    <head>
        <title>GoFrame Upload Files Demo</title>
    </head>
        <body>
            <form enctype="multipart/form-data" action="/upload" method="post">
                <input type="file" name="upload-file" />
                <input type="file" name="upload-file" />
                <input type="submit" value="upload" />
            </form>
        </body>
    </html>
    `)
}

func main() {
    s := g.Server()
    s.Group("/upload", func(group *ghttp.RouterGroup) {
        group.POST("/", Upload)
        group.ALL("/show", UploadShow)
        group.ALL("/batch", UploadShowBatch)
    })
    s.SetPort(8199)
    s.Run()
}
```

The server provides three APIs:

1. [http://127.0.0.1:8199/upload/show](http://127.0.0.1:8199/upload/show) for displaying a single file upload H5 page;
2. [http://127.0.0.1:8199/upload/batch](http://127.0.0.1:8199/upload/batch) for displaying a multiple files upload H5 page;
3. [http://127.0.0.1:8199/upload](http://127.0.0.1:8199/upload) API for real form file uploading, supporting both single and multiple file uploads.

Visit [http://127.0.0.1:8199/upload/show](http://127.0.0.1:8199/upload/show) to choose a single file to upload. After submitting, you can see that the file has been successfully uploaded to the server.

**Key Code Explanation**

1. On the server side, we can obtain all uploaded file objects using the `r.GetUploadFiles` method, or a single uploaded file object using `r.GetUploadFile`.
2. The parameter `"upload-file"` in `r.GetUploadFiles("upload-file")` is the form file field name during the client-side upload in this example. Developers can define this on the client-side according to front-end and back-end agreements to facilitate the server-side's reception of form file fields.
3. Using `files.Save`, you can conveniently save multiple uploaded files to the specified directory and return the successfully saved file names. If a batch save operation is taking place, any single file save failure will immediately return an error. Additionally, the `Save` method's second parameter supports randomly auto-naming the uploaded files.
4. The route registered with `group.POST("/", Upload)` only supports access via `POST`.

## Client

### Single File Upload

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    var (
        ctx  = gctx.New()
        path = "/home/john/Workspace/Go/github.com/gogf/gf/v2/version.go"
    )
    result, err := g.Client().Post(ctx, "http://127.0.0.1:8199/upload", "upload-file=@file:"+path)
    if err != nil {
        glog.Fatalf(ctx, `%+v`, err)
    }
    defer result.Close()
    fmt.Println(result.ReadAllString())
}
```

Did you notice? The file upload parameter format uses `parameter-name=@file:file-path`. The HTTP client will automatically parse the file content corresponding to the **file path** and read it to the server. The originally complicated file upload operation is encapsulated by `gf`, and users only need to use `@file:+file-path` to form the parameter value. The `file-path` should use the local file's absolute path.

First, run the server program, then run this upload client (make sure to modify the upload file path to the actual file path locally), and upon execution, you can see the file being successfully uploaded to the specified path on the server.

### Multiple File Upload

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    var (
        ctx   = gctx.New()
        path1 = "/Users/john/Pictures/logo1.png"
        path2 = "/Users/john/Pictures/logo2.png"
    )
    result, err := g.Client().Post(
        ctx,
        "http://127.0.0.1:8199/upload",
        fmt.Sprintf(`upload-file=@file:%s&upload-file=@file:%s`, path1, path2),
    )
    if err != nil {
        glog.Fatalf(ctx, `%+v`, err)
    }
    defer result.Close()
    fmt.Println(result.ReadAllString())
}
```

As can be seen, the multiple file upload submission parameter format is `parameter-name=@file:xxx&parameter-name=@file:xxx...`, and can also be in the form of `parameter-name[]=@file:xxx&parameter-name[]=@file:xxx...`.

First, run the server program, then run this upload client (make sure to modify the upload file path to the actual file path locally), and upon execution, you can see the files being successfully uploaded to the specified path on the server.

## Custom File Name

It's very simple, modify the `FileName` property.

```go
s := g.Server()
s.BindHandler("/upload", func(r *ghttp.Request) {
    file := r.GetUploadFile("TestFile")
    if file == nil {
        r.Response.Write("empty file")
        return
    }
    file.Filename = "MyCustomFileName.txt"
    fileName, err := file.Save(gfile.TempDir())
    if err != nil {
        r.Response.Write(err)
        return
    }
    r.Response.Write(fileName)
})
s.SetPort(8999)
s.Run()
```

## Standardized Routing to Receive Uploaded Files

If the server uses standardized routing, structured parameters can be used to retrieve uploaded files:

- The data type for receiving parameters uses `*ghttp.UploadFile`.
- If the API documentation should also support file types, set `type` to `file` in the parameter tags.

![](/markdown/3146c1c8d37ca3745a3519f96361de6a.png)

![](/markdown/57f441f1e4666f73cc320a4e3d47f50b.png)