---
slug: '/docs/web/senior-websocket'
title: 'WebSocket'
sidebar_position: 7
hide_title: true
keywords: [WebSocket,GoFrame,WebSocket Service,GoFrame Framework,WebSocket Development,WebSocket Client,HTTPS Support,WebSocket Security,WebSocket Connection,GoFrame Example]
description: "Developing WebSocket services using the GoFrame framework, including HTML5 clients, WebSocket server, HTTPS support, and security validation. The example code demonstrates the connection and message transmission mechanism of WebSocket, and provides a detailed explanation of the communication process and data handling methods between the server and client, enabling readers to quickly get started and implement a fully functional WebSocket service."
---

Using the `goframe` framework for `websocket` development is quite straightforward. Below, we demonstrate the use of the `goframe` framework's `websocket` by implementing a simple `echo server` (the client is implemented using HTML5).

## HTML5 Client

Here's the `H5` client code:

```
<!DOCTYPE html>
<html lang="zh">
<head>
    <title>gf websocket echo server</title>
     <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
    <link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
</head>
<body>
<div class="container">
    <div class="list-group" id="divShow"></div>
    <div>
        <div><input class="form-control" id="txtContent" autofocus placeholder="Please enter content to send"></div>
        <div><button class="btn btn-default" id="btnSend" style="margin-top:15px">Send</button></div>
    </div>
</div>
</body>
</html>

<script type="application/javascript">
    // Display info message
    function showInfo(content) {
        $("<div class=\"list-group-item list-group-item-info\">" + content + "</div>").appendTo("#divShow")
    }
    // Display warning message
    function showWaring(content) {
        $("<div class=\"list-group-item list-group-item-warning\">" + content + "</div>").appendTo("#divShow")
    }
    // Display success message
    function showSuccess(content) {
        $("<div class=\"list-group-item list-group-item-success\">" + content + "</div>").appendTo("#divShow")
    }
    // Display error message
    function showError(content) {
        $("<div class=\"list-group-item list-group-item-danger\">" + content + "</div>").appendTo("#divShow")
    }

    $(function () {
        const url = "ws://127.0.0.1:8199/ws";
        let ws  = new WebSocket(url);
        try {
            // ws connection successful
            ws.onopen = function () {
                showInfo("WebSocket Server [" + url +"] connected successfully!");
            };
            // ws connection closed
            ws.onclose = function () {
                if (ws) {
                    ws.close();
                    ws = null;
                }
                showError("WebSocket Server [" + url +"] connection closed!");
            };
            // ws connection error
            ws.onerror = function () {
                if (ws) {
                    ws.close();
                    ws = null;
                }
                showError("WebSocket Server [" + url +"] connection closed!");
            };
            // ws data returned
            ws.onmessage = function (result) {
                showWaring(" > " + result.data);
            };
        } catch (e) {
            alert(e.message);
        }

        // Button click to send data
        $("#btnSend").on("click", function () {
            if (ws == null) {
                showError("WebSocket Server [" + url +"] connection failed, please refresh the page with F5!");
                return;
            }
            const content = $.trim($("#txtContent").val()).replace("/[\n]/g", "");
            if (content.length <= 0) {
                alert("Please enter content to send!");
                return;
            }
            $("#txtContent").val("")
            showSuccess(content);
            ws.send(content);
        });

        // Enter button triggers send click event
        $("#txtContent").on("keydown", function (event) {
            if (event.keyCode === 13) {
                $("#btnSend").trigger("click");
            }
        });
    })

</script>
```

Note that the server connection address here is: `ws://127.0.0.1:8199/ws`.

The client's functionality is quite simple, mainly implementing these features:

- Maintaining the connection status with the server's `websocket` and information display;
- Inputting content in the API and sending information to the `websocket` server;
- Echoing the returned information from the `websocket` on the API;

## WebSocket Server

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gfile"
    "github.com/gogf/gf/v2/os/glog"
)

var ctx = gctx.New()

func main() {
    s := g.Server()
    s.BindHandler("/ws", func(r *ghttp.Request) {
        ws, err := r.WebSocket()
        if err != nil {
            glog.Error(ctx, err)
            r.Exit()
        }
        for {
            msgType, msg, err := ws.ReadMessage()
            if err != nil {
                return
            }
            if err = ws.WriteMessage(msgType, msg); err != nil {
                return
            }
        }
    })
    s.SetServerRoot(gfile.MainPkgPath())
    s.SetPort(8199)
    s.Run()
}

```

As you can see, the server code is quite simple. Here are a few points worth noting:

1. **WebSocket Method**

The route registration method for a `websocket` server is the same as that for a regular `http` callback function. However, in handling the API, we need to convert the request into a `websocket` operation using the `ghttp.Request.WebSocket` method (using the pointer object `r.WebSocket()`) and return a `WebSocket object`, which is used for subsequent `websocket` communication operations. Of course, if the client's request is not a `websocket` operation, the conversion will fail. The method will return an error message, so please note to check the `error` return value when using this method.

1. **ReadMessage & WriteMessage**

Reading and writing messages correspond to the data reading and writing operations of `websocket` (`ReadMessage & WriteMessage`). It's important to note that both of these methods have a `msgType` variable that indicates the type of data to be read and written. The two common data types are: string data or binary data. During usage, since both sides of the API will agree on a unified data format, the `msgType` for reading and writing is almost always the same. Therefore, in this example, when returning a message, the data type parameter directly uses the read `msgType`.

## HTTPS WebSocket

If `HTTPS` WebSocket support is needed, all that is required is for the `WebServer` to support `HTTPS`, and the `WebSocket` access address needs to use the `wss://` protocol. In the client `HTML5` page above, the `WebSocket` access address needs to be changed to: `wss://127.0.0.1:8199/wss`. Server example code:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gfile"
    "github.com/gogf/gf/v2/os/glog"
)

var ctx = gctx.New()

func main() {
    s := g.Server()
    s.BindHandler("/wss", func(r *ghttp.Request) {
        ws, err := r.WebSocket()
        if err != nil {
            glog.Error(ctx, err)
            r.Exit()
        }
        for {
            msgType, msg, err := ws.ReadMessage()
            if err != nil {
                return
            }
            if err = ws.WriteMessage(msgType, msg); err != nil {
                return
            }
        }
    })
    s.SetServerRoot(gfile.MainPkgPath())
    s.EnableHTTPS("../../https/server.crt", "../../https/server.key")
    s.SetPort(8199)
    s.Run()
}
```

## Example Result Display

First, execute the example code `main.go`, then visit the page [http://127.0.0.1:8199/](http://127.0.0.1:8199/). Enter the request content and submit it, then close the program on the server side. You will see that the page echoes the submitted content and instantly displays the change in `websocket` connection status. When the server is closed, the client will instantly print out the closure message.

![](/markdown/670be5bdaae78e5cd183fade39dc20e7.png)

## Websocket Security Validation

The `websocket` module in the `GoFrame` framework does not perform same-origin checks (`origin`), which means that websockets under these conditions allow complete cross-origin access.

Security validation needs to be handled at the business layer, which mainly includes the following aspects:

1. Validation of `origin`: Before executing `r.WebSocket()`, the business layer needs to validate `origin` for the same-origin request, or perform custom checks on the request (if request parameters are submitted). If the validation fails, call `r.Exit()` to terminate the request.
2. Validation of `websocket` communication data: Data communication often involves some custom data structures, and authentication logic should be added to these communication data;

## WebSocket Client

```
 package main

import (
    "crypto/tls"
    "fmt"
    "net/http"
    "time"

    "github.com/gogf/gf/v2/net/gclient"
    "github.com/gorilla/websocket"
)

func main() {
    client := gclient.NewWebSocket()
    client.HandshakeTimeout = time.Second    // Set timeout
    client.Proxy = http.ProxyFromEnvironment // Set proxy
    client.TLSClientConfig = &tls.Config{}   // Set TLS configuration

    conn, _, err := client.Dial("ws://127.0.0.1:8199/ws", nil)
    if err != nil {
        panic(err)
    }
    defer conn.Close()

    err = conn.WriteMessage(websocket.TextMessage, []byte("hello word"))
    if err != nil {
        panic(err)
    }

    mt, data, err := conn.ReadMessage()
    if err != nil {
        panic(err)
    }
    fmt.Println(mt, string(data))
}
```