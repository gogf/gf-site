---
slug: '/docs/web/senior-websocket'
title: 'WebSocket服务'
sidebar_position: 7
hide_title: true
---

使用 `goframe` 框架进行 `websocket` 开发相当简单。我们以下通过实现一个简单的 `echo服务器` 来演示 `goframe` 框架的 `websocket` 的使用（客户端使用HTML5实现）。

## HTML5客户端

先上 `H5` 客户端的代码

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
        <div><input class="form-control" id="txtContent" autofocus placeholder="请输入发送内容"></div>
        <div><button class="btn btn-default" id="btnSend" style="margin-top:15px">发 送</button></div>
    </div>
</div>
</body>
</html>

<script type="application/javascript">
    // 显示提示信息
    function showInfo(content) {
        $("<div class=\"list-group-item list-group-item-info\">" + content + "</div>").appendTo("#divShow")
    }
    // 显示警告信息
    function showWaring(content) {
        $("<div class=\"list-group-item list-group-item-warning\">" + content + "</div>").appendTo("#divShow")
    }
    // 显示成功信息
    function showSuccess(content) {
        $("<div class=\"list-group-item list-group-item-success\">" + content + "</div>").appendTo("#divShow")
    }
    // 显示错误信息
    function showError(content) {
        $("<div class=\"list-group-item list-group-item-danger\">" + content + "</div>").appendTo("#divShow")
    }

    $(function () {
        const url = "ws://127.0.0.1:8199/ws";
        let ws  = new WebSocket(url);
        try {
            // ws连接成功
            ws.onopen = function () {
                showInfo("WebSocket Server [" + url +"] 连接成功！");
            };
            // ws连接关闭
            ws.onclose = function () {
                if (ws) {
                    ws.close();
                    ws = null;
                }
                showError("WebSocket Server [" + url +"] 连接关闭！");
            };
            // ws连接错误
            ws.onerror = function () {
                if (ws) {
                    ws.close();
                    ws = null;
                }
                showError("WebSocket Server [" + url +"] 连接关闭！");
            };
            // ws数据返回处理
            ws.onmessage = function (result) {
                showWaring(" > " + result.data);
            };
        } catch (e) {
            alert(e.message);
        }

        // 按钮点击发送数据
        $("#btnSend").on("click", function () {
            if (ws == null) {
                showError("WebSocket Server [" + url +"] 连接失败，请F5刷新页面!");
                return;
            }
            const content = $.trim($("#txtContent").val()).replace("/[\n]/g", "");
            if (content.length <= 0) {
                alert("请输入发送内容!");
                return;
            }
            $("#txtContent").val("")
            showSuccess(content);
            ws.send(content);
        });

        // 回车按钮触发发送点击事件
        $("#txtContent").on("keydown", function (event) {
            if (event.keyCode === 13) {
                $("#btnSend").trigger("click");
            }
        });
    })

</script>
```

注意我们这里的服务端连接地址为： `ws://127.0.0.1:8199/ws`。

客户端的功能很简单，主要实现了这几个功能：

- 与服务端 `websocket` 连接状态保持及信息展示；
- 界面输入内容并发送信息到 `websocket` 服务端；
- 接收到 `websocket` 的返回信息后回显在界面上；

## WebSocket服务端

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

可以看到，服务端的代码相当简单，这里需要着重说明的是这几个地方：

1. **WebSocket方法**

`websocket` 服务端的路由注册方式和普通的 `http` 回调函数注册方式一样，但是在接口处理中我们需要通过 `ghttp.Request.WebSocket` 方法（这里直接使用指针对象 `r.WebSocket()`）将请求转换为 `websocket` 操作，并返回一个 `WebSocket对象`，该对象用于后续的 `websocket` 通信操作。当然，如果客户端请求并非为 `websocket` 操作时，转换将会失败，该方法会返回错误信息，使用时请注意判断方法的 `error` 返回值。

1. **ReadMessage & WriteMessage**

读取消息以及写入消息对应的是 `websocket` 的数据读取以及写入操作( `ReadMessage & WriteMessage`)，需要注意的是这两个方法都有一个 `msgType` 的变量，表示请求读取及写入数据的类型，常见的两种数据类型为：字符串数据或者二进制数据。在使用过程中，由于接口双方都会约定统一的数据格式，因此读取和写入的 `msgType` 几乎都是一致的，所以在本示例中的返回消息时，数据类型参数直接使用的是读取到的 `msgType`。

## HTTPS的WebSocket

如果需要支持 `HTTPS` 的 `WebSocket` 服务，只需要依赖的 `WebServer` 支持 `HTTPS` 即可，访问的 `WebSocket` 地址需要使用 `wss://` 协议访问。以上客户端 `HTML5` 页面中的 `WebSocket` 访问地址需要修改为： `wss://127.0.0.1:8199/wss`。服务端示例代码：

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

## 示例结果展示

我们首先执行示例代码 `main.go`，随后访问页面 [http://127.0.0.1:8199/](http://127.0.0.1:8199/)，随意输入请求内容并提交，随后在服务端关闭程序。可以看到，页面会回显提交的内容信息，并且即时展示 `websocket` 的连接状态的改变，当服务端关闭时，客户端也会即时地打印出关闭信息。

![](/markdown/670be5bdaae78e5cd183fade39dc20e7.png)

## Websocket安全校验

`GoFrame` 框架的 `websocket` 模块并不会做同源检查( `origin`)，也就是说，这种条件下的websocket允许完全跨域。

安全的校验需要由业务层来处理，安全校验主要包含以下几个方面：

1. `origin` 的校验: 业务层在执行 `r.WebSocket()` 之前需要进行 `origin` 同源请求的校验；或者按照自定义的处理对请求进行校验(如果请求提交参数)；如果未通过校验，那么调用 `r.Exit()` 终止请求。
2. `websocket` 通信数据校验: 数据通信往往都有一些自定义的数据结构，在这些通信数据中加上鉴权处理逻辑；

## WebSocket Client 客户端

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
    client.HandshakeTimeout = time.Second    // 设置超时时间
    client.Proxy = http.ProxyFromEnvironment // 设置代理
    client.TLSClientConfig = &tls.Config{}   // 设置 tls 配置

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