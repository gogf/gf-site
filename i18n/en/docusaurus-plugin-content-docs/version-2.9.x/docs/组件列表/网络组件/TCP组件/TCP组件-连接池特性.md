---
slug: '/docs/components/network-gtcp-connection-pool'
title: 'TCP - Connection Pool'
sidebar_position: 3
hide_title: true
keywords: [GoFrame, GoFrame Framework, TCP Connection Pool, gtcp Module, Connection Pool Feature, Short Connection Operations, High Concurrency, Reconnect, Data Transmission, Example Program]
description: "The connection pool feature in the gtcp module of the GoFrame framework, implemented via gtcp.PoolConn, has a fixed lifespan of 600 seconds, with a reconnect mechanism upon data transmission. It is suitable for scenarios with frequent short connection operations and high connection concurrency. The article provides two examples demonstrating the basic use of the connection pool and the reconnect mechanism, helping users deeply understand the practical application of connection pool in network programming."
---

The `gtcp` module offers a connection pool feature, implemented by the `gtcp.PoolConn` object, where the connection pool's cached fixed lifespan is 600 seconds and internally implements a reconnect mechanism during data transmission. The connection pool is particularly suitable for scenarios involving frequent short connection operations and high connection concurrency. Next, we'll demonstrate the capabilities of the connection pool using two examples.

**Usage:**

```go
import "github.com/gogf/gf/v2/net/gtcp"
```

**API Documentation:**

[https://pkg.go.dev/github.com/gogf/gf/v2/net/gtcp](https://pkg.go.dev/github.com/gogf/gf/v2/net/gtcp)

```go
type PoolConn
    func NewPoolConn(addr string, timeout ...int) (*PoolConn, error)
    func (c *PoolConn) Close() error
    func (c *PoolConn) Recv(length int, retry ...Retry) ([]byte, error)
    func (c *PoolConn) RecvLine(retry ...Retry) ([]byte, error)
    func (c *PoolConn) RecvPkg(option ...PkgOption) ([]byte, error)
    func (c *PoolConn) RecvPkgWithTimeout(timeout time.Duration, option ...PkgOption) ([]byte, error)
    func (c *PoolConn) RecvWithTimeout(length int, timeout time.Duration, retry ...Retry) (data []byte, err error)
    func (c *PoolConn) Send(data []byte, retry ...Retry) error
    func (c *PoolConn) SendPkg(data []byte, option ...PkgOption) (err error)
    func (c *PoolConn) SendPkgWithTimeout(data []byte, timeout time.Duration, option ...PkgOption) error
    func (c *PoolConn) SendRecv(data []byte, receive int, retry ...Retry) ([]byte, error)
    func (c *PoolConn) SendRecvPkg(data []byte, option ...PkgOption) ([]byte, error)
    func (c *PoolConn) SendRecvPkgWithTimeout(data []byte, timeout time.Duration, option ...PkgOption) ([]byte, error)
    func (c *PoolConn) SendRecvWithTimeout(data []byte, receive int, timeout time.Duration, retry ...Retry) ([]byte, error)
    func (c *PoolConn) SendWithTimeout(data []byte, timeout time.Duration, retry ...Retry) error
```

Since `gtcp.PoolConn` inherits from `gtcp.Conn`, methods of `gtcp.Conn` can also be used.

## Example 1, Basic Usage

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
       if conn, err := gtcp.NewPoolConn("127.0.0.1:8999"); err == nil {
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

In this example, the Server runs asynchronously using a new goroutine, while the Client runs on the main goroutine. The Server is an echo server, while the Client sends the current time to the Server every second, after which it's echoed back by the Server, and the connection port information of both sides is printed on the Client side.

After execution, the output is as follows:

```
> 2018-07-11 23:29:54 127.0.0.1:55876 127.0.0.1:8999
> 2018-07-11 23:29:55 127.0.0.1:55876 127.0.0.1:8999
> 2018-07-11 23:29:56 127.0.0.1:55876 127.0.0.1:8999
> 2018-07-11 23:29:57 127.0.0.1:55876 127.0.0.1:8999
> 2018-07-11 23:29:58 127.0.0.1:55876 127.0.0.1:8999
...
```

You can see that the Client's port remains unchanged, and each time you get the same `gtcp.Conn` object through `gtcp.NewConn("127.0.0.1:8999")`. Additionally, each time `conn.Close()` does not truly close the connection but rather returns the object to the pool for reuse.

## Example 2, Connection Disconnection Scenario

This example demonstrates how to deal with invalid connection objects when the server side closes the connection.

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
            return
        }
    }).Run()

    time.Sleep(time.Second)

    // Client
    for {
       if conn, err := gtcp.NewPoolConn("127.0.0.1:8999"); err == nil {
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

After execution, the output is as follows:

```
> 2018-07-20 12:56:15 127.0.0.1:59368 127.0.0.1:8999
EOF
> 2018-07-20 12:56:17 127.0.0.1:59376 127.0.0.1:8999
EOF
> 2018-07-20 12:56:19 127.0.0.1:59378 127.0.0.1:8999
EOF
...
```

In this example, the Server closes the connection after processing each request. The Client, after sending the first request, due to the IO reuse feature of the connection pool, will obtain the same connection object for the next request. As the Server connection has been actively closed, the second request write succeeds (actually hasn't been successfully sent to the Server, needing another read operation to detect the link error), but the read fails (`EOF` indicates the target connection is closed). Therefore, at this point, when the Client executes `Close`, it will destroy the connection operation object instead of further reusing it. The next time it gets a connection object through `gtcp.NewPoolConn`, the Client will establish a new connection with the Server for data communication. So you see, the Client's port is constantly changing because the `gtcp.Conn` object is a new connection object, and the previous connection object has been destroyed.

The IO reuse of connection objects involves very subtle changes in connection states. Since point-to-point network communication itself is a complex environment, the state of connection objects may change passively at any time. Therefore, when using the gtcp connection pool feature, it is crucial to pay attention to the reconstruction mechanism of the connection object when a communication error occurs. As soon as an error occurs, immediately discard (`Close`) the object (`gtcp.PoolConn`) and rebuild (`gtcp.NewPoolConn`).