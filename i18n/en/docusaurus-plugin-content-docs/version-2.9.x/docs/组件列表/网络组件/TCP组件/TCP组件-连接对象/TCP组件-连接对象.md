---
slug: '/docs/components/network-gtcp-conn'
title: 'TCP - Object'
sidebar_position: 0
hide_title: true
keywords: [GoFrame, GoFrame framework, gtcp, TCP communication, connection object, timeout handling, data writing, data reading, network programming, error retry]
description: "This page introduces the usage of gtcp module and its TCP connection object provided by the GoFrame framework. It includes how to use gtcp.Conn for reliable TCP communication and handling data sending and receiving. The text also describes the timeout handling mechanism and demonstrates with simple examples how to use these features, showing how to flexibly perform network programming in the GoFrame environment."
---

The `gtcp` module provides an easy-to-use `gtcp.Conn` link operation object.

**Usage:**

```go
import "github.com/gogf/gf/v2/net/gtcp"
```

**API Documentation:**

[https://pkg.go.dev/github.com/gogf/gf/v2/net/gtcp](https://pkg.go.dev/github.com/gogf/gf/v2/net/gtcp)

```go
type Conn
    func NewConn(addr string, timeout ...int) (*Conn, error)
    func NewConnByNetConn(conn net.Conn) *Conn
    func NewConnKeyCrt(addr, crtFile, keyFile string) (*Conn, error)
    func NewConnTLS(addr string, tlsConfig *tls.Config) (*Conn, error)
    func (c *Conn) Close() error
    func (c *Conn) LocalAddr() net.Addr
    func (c *Conn) Recv(length int, retry ...Retry) ([]byte, error)
    func (c *Conn) RecvLine(retry ...Retry) ([]byte, error)
    func (c *Conn) RecvWithTimeout(length int, timeout time.Duration, retry ...Retry) ([]byte, error)
    func (c *Conn) RemoteAddr() net.Addr
    func (c *Conn) Send(data []byte, retry ...Retry) error
    func (c *Conn) SendRecv(data []byte, receive int, retry ...Retry) ([]byte, error)
    func (c *Conn) SendRecvWithTimeout(data []byte, receive int, timeout time.Duration, retry ...Retry) ([]byte, error)
    func (c *Conn) SendWithTimeout(data []byte, timeout time.Duration, retry ...Retry) error
    func (c *Conn) SetDeadline(t time.Time) error
    func (c *Conn) SetRecvBufferWait(bufferWaitDuration time.Duration)
    func (c *Conn) SetRecvDeadline(t time.Time) error
    func (c *Conn) SetSendDeadline(t time.Time) error
```

## Writing Operation

The TCP communication writing operation is implemented by the `Send` method, providing an error retry mechanism via the second optional parameter `retry`. Note that the `Send` method does not have any buffering mechanism, meaning that each call to the `Send` method will immediately invoke the underlying TCP Write method to write data (buffering relies on the system's underlying implementation). Therefore, if you want to control output buffering, please handle it at the business layer.

When performing TCP writes, reliable communication scenarios often involve a write and a read, i.e., starting `Recv` to get the target's feedback result immediately after a successful `Send`. Therefore, `gtcp.Conn` also offers a convenient `SendRecv` method.

## Reading Operation

The TCP communication reading operation is implemented by the `Recv` method, which also provides an error retry mechanism via a second optional parameter `retry`. The `Recv` method offers built-in read buffer control, allowing you to specify the reading length (specified by the `length` parameter). It will immediately return when the specified length of data has been read. If `length < 0`, it will read all readable buffer data and return it. When `length = 0`, it means to get the buffered data once and return immediately.

Using `Recv(-1)` can read all readable buffer data (with indefinite length, possible truncation if the sent data packet is too long), but be cautious of packet parsing issues, which can easily result in incomplete packets. In this case, the business layer needs to ensure data packet integrity based on the predetermined protocol structure. It is recommended to use the simple protocol introduced later via `SendPkg`/ `RecvPkg` to send/receive message packets, as described in subsequent sections.

## Timeout Handling

`gtcp.Conn` provides timeout handling for TCP communication data writing and reading, specified via the `timeout` parameter in the method, which is straightforward and won't be elaborated further.

* * *

Next, we'll look at how to use the `gtcp.Conn` object through some examples.

## Usage Examples

### Example 1, Simple Usage

```go
package main

import (
    "fmt"
    "time"
    "github.com/gogf/gf/v2/net/gtcp"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    // Server
    go gtcp.NewServer("127.0.0.1:8999", func(conn *gtcp.Conn) {
        defer conn.Close()
        for {
            data, err := conn.Recv(-1)
            if len(data) > 0 {
                  fmt.Println(string(data))
            }
            if err != nil {
                break
            }
        }
    }).Run()

    time.Sleep(time.Second)

    // Client
    conn, err := gtcp.NewConn("127.0.0.1:8999")
    if err != nil {
        panic(err)
    }
    for i := 0; i < 10000; i++ {
        if err := conn.Send([]byte(gconv.String(i))); err != nil {
            glog.Error(err)
        }
        time.Sleep(time.Second)
    }
}
```

1. On the `Server` side, received client data is immediately printed to the terminal.
2. On the `Client` side, the same connection object is used to send an incrementing number to the server every second in a loop. This function also demonstrates that underlying `Socket` communication does not use buffering; executing a `Send` immediately sends data to the server. Therefore, the client needs to manage the buffered data to be sent locally.
3. Execution result After execution, you can see the server outputting the following information on the terminal:

```shell
    2018-07-11 22:11:08.650 0
    2018-07-11 22:11:09.651 1
    2018-07-11 22:11:10.651 2
    2018-07-11 22:11:11.651 3
    2018-07-11 22:11:12.651 4
    2018-07-11 22:11:13.651 5
    2018-07-11 22:11:14.652 6
    2018-07-11 22:11:15.652 7
    2018-07-11 22:11:16.652 8
    2018-07-11 22:11:17.652 9
    2018-07-11 22:11:18.652 10
    2018-07-11 22:11:19.653 11
    ...
```

### Example 2, Echo Service

Let's improve the previous echo service:

```go
package main

import (
    "fmt"
    "time"
    "github.com/gogf/gf/v2/net/gtcp"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/os/gtime"
)

func main() {
    // Server
    go gtcp.NewServer("127.0.0.1:8999", func(conn *gtcp.Conn) {
        defer conn.Close()
        for {
            data, err := conn.Recv(-1)
            if len(data) > 0 {
                if err := conn.Send(append([]byte("> "), data...)); err != nil {
                  fmt.Println(err)
                }
            }
            if err != nil {
                break
            }
        }
    }).Run()

    time.Sleep(time.Second)

    // Client
    for {
       if conn, err := gtcp.NewConn("127.0.0.1:8999"); err == nil {
           if b, err := conn.SendRecv([]byte(gtime.Datetime()), -1); err == nil {
               fmt.Println(string(b), conn.LocalAddr(), conn.RemoteAddr())
           } else {
               fmt.Println(err)
           }
           conn.Close()
       } else {
           glog.Error(err)
       }
       time.Sleep(time.Second)
    }
}
```

In this example program, the `Client` sends the current time information to the `Server` every second, and the `Server` returns the original data message upon reception. Upon receiving the server-side return message, the `Client` immediately prints it to the terminal.

Execution results in output as follows:

```
> 2018-07-19 23:25:43 127.0.0.1:34306 127.0.0.1:8999
> 2018-07-19 23:25:44 127.0.0.1:34308 127.0.0.1:8999
> 2018-07-19 23:25:45 127.0.0.1:34312 127.0.0.1:8999
> 2018-07-19 23:25:46 127.0.0.1:34314 127.0.0.1:8999
```

### Example 3, HTTP Client

In this example, we use the gtcp package to implement a simple HTTP client, reading and printing the `header` and `content` of the Baidu homepage.

```go
package main

import (
    "fmt"
    "bytes"
    "github.com/gogf/gf/v2/net/gtcp"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    conn, err := gtcp.NewConn("www.baidu.com:80")
    if err != nil {
        panic(err)
    }
    defer conn.Close()

    if err := conn.Send([]byte("GET / HTTP/1.1\r\n\r\n")); err != nil {
        panic(err)
    }

    header        := make([]byte, 0)
    content       := make([]byte, 0)
    contentLength := 0
    for {
        data, err := conn.RecvLine()
        // Header reading, parsing text length
        if len(data) > 0 {
            array := bytes.Split(data, []byte(": "))
            // Get page content length
            if contentLength == 0 && len(array) == 2 && bytes.EqualFold([]byte("Content-Length"), array[0]) {
                contentLength = gconv.Int(string(array[1][:len(array[1])-1]))           }
            header = append(header, data...)
            header = append(header, '\n')
        }
        // Header reading complete, read text content
        if contentLength > 0 && len(data) == 1 {
            content, _ = conn.Recv(contentLength)
            break
        }
        if err != nil {
            fmt.Errorf("ERROR: %s\n", err.Error())
            break
        }
    }

    if len(header) > 0 {
        fmt.Println(string(header))
    }
    if len(content) > 0 {
        fmt.Println(string(content))
    }
}
```

Execution results in output as follows:

```
HTTP/1.1 200 OK
Accept-Ranges: bytes
Cache-Control: no-cache
Connection: Keep-Alive
Content-Length: 14615
Content-Type: text/html
Date: Sat, 21 Jul 2018 04:21:03 GMT
Etag: "5b3c3650-3917"
Last-Modified: Wed, 04 Jul 2018 02:52:00 GMT
P3p: CP=" OTI DSP COR IVA OUR IND COM "
Pragma: no-cache
Server: BWS/1.1
...
(truncated)
```