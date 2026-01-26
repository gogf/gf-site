---
slug: '/docs/components/network-gtcp-funcs'
title: 'TCP - Methods'
sidebar_position: 1
hide_title: true
keywords: [GoFrame, GoFrame Framework, TCP Component, gtcp Module, Go Language, Network Programming, TLS Encryption, Data Communication, Short Connections, Utility Methods]
description: "The gtcp module in the GoFrame framework and some common utility methods allow for the creation of TCP connections, TLS secure encrypted communication, and data sending and receiving functions, and provide a concrete example showing how to access a specified web site via TCP."
---

The `gtcp` module also provides some common utility methods.

**Usage**:

```go
import "github.com/gogf/gf/v2/net/gtcp"
```

**API Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/net/gtcp](https://pkg.go.dev/github.com/gogf/gf/v2/net/gtcp)

```go
func LoadKeyCrt(crtFile, keyFile string) (*tls.Config, error)
func NewNetConn(addr string, timeout ...int) (net.Conn, error)
func NewNetConnKeyCrt(addr, crtFile, keyFile string) (net.Conn, error)
func NewNetConnTLS(addr string, tlsConfig *tls.Config) (net.Conn, error)
func Send(addr string, data []byte, retry ...Retry) error
func SendPkg(addr string, data []byte, option ...PkgOption) error
func SendPkgWithTimeout(addr string, data []byte, timeout time.Duration, option ...PkgOption) error
func SendRecv(addr string, data []byte, receive int, retry ...Retry) ([]byte, error)
func SendRecvPkg(addr string, data []byte, option ...PkgOption) ([]byte, error)
func SendRecvPkgWithTimeout(addr string, data []byte, timeout time.Duration, option ...PkgOption) ([]byte, error)
func SendRecvWithTimeout(addr string, data []byte, receive int, timeout time.Duration, retry ...Retry) ([]byte, error)
func SendWithTimeout(addr string, data []byte, timeout time.Duration, retry ...Retry) error
```

1. `NewNetConn` is used to simplify the creation of the standard library connection object `net.Conn`;
2. `NewNetConnTLS` and `NewNetConnKeyCrt` are used to create TCP clients that support TLS secure encrypted communication;
3. The `Send*` series of methods send data directly through the given address and obtain the returned results of the request, which are used for short connection requests;

Below is a simple example where we use utility methods to access the specified web site:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/net/gtcp"
)

func main() {
    data, err := gtcp.SendRecv("www.baidu.com:80", []byte("HEAD / HTTP/1.1\n\n"), -1)
    if err != nil {
        panic(err)
    }
    fmt.Println(string(data))
}
```

In this example, we access the Baidu homepage via TCP, simulate the HTTP request header information, and receive the return result. After execution, the output result is as follows:

```
HTTP/1.1 302 Found
Connection: Keep-Alive
Content-Length: 17931
Content-Type: text/html
Date: Tue, 04 Jun 2019 15:53:09 GMT
Etag: "54d9749e-460b"
Server: bfe/1.0.8.18
```