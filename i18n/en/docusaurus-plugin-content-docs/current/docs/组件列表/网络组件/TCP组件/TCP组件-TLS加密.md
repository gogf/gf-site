---
slug: '/docs/components/network-gtcp-tls'
title: 'TCP - TLS'
sidebar_position: 2
hide_title: true
keywords: [GoFrame, GoFrame Framework, gtcp, TLS Encryption, Network Communication, Go Language, Server, Client, Secure Communication, Network Security]
description: "Using GoFrame framework's gtcp module to implement TLS encrypted communication in environments with high security requirements. Through provided sample code, we explain how to create TLS servers and clients, how to use certificates for encrypted data transmission, and how to handle potential certificate expiration issues. This is crucial for developers who need to securely transmit data."
---

The `gtcp` module supports `TLS` encrypted communication servers and clients, which are essential in scenarios with high security demands. A `TLS` server can be created using either the `NewServerTLS` or `NewServerKeyCrt` methods. A `TLS` client can be created using either the `NewConnKeyCrt` or `NewConnTLS` methods.

Examples:

[https://github.com/gogf/gf/tree/master/.example/net/gtcp/tls](https://github.com/gogf/gf/tree/master/.example/net/gtcp/tls)

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/gtcp"
    "github.com/gogf/gf/v2/util/gconv"
    "time"
)

func main() {
    address := "127.0.0.1:8999"
    crtFile := "server.crt"
    keyFile := "server.key"
    // TLS Server
    go gtcp.NewServerKeyCrt(address, crtFile, keyFile, func(conn *gtcp.Conn) {
        defer conn.Close()
        for {
            data, err := conn.Recv(-1)
            if len(data) > 0 {
                fmt.Println(string(data))
            }
            if err != nil {
                // if client closes, err will be: EOF
                g.Log().Error(err)
                break
            }
        }
    }).Run()

    time.Sleep(time.Second)

    // Client
    conn, err := gtcp.NewConnKeyCrt(address, crtFile, keyFile)
    if err != nil {
        panic(err)
    }
    defer conn.Close()
    for i := 0; i < 10; i++ {
        if err := conn.Send([]byte(gconv.String(i))); err != nil {
            g.Log().Error(err)
        }
        time.Sleep(time.Second)
        if i == 5 {
            conn.Close()
            break
        }
    }

    // exit after 5 seconds
    time.Sleep(5 * time.Second)
}
```

After execution, you may see an error reported when the client is running:

```
panic: x509: certificate has expired or is not yet valid
```

This is because our certificate was manually created and has expired. For demonstration purposes, we ignored the client's verification of the certificate in the client code.

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/net/gtcp"
    "github.com/gogf/gf/v2/util/gconv"
    "time"
)

func main() {
    address := "127.0.0.1:8999"
    crtFile := "server.crt"
    keyFile := "server.key"
    // TLS Server
    go gtcp.NewServerKeyCrt(address, crtFile, keyFile, func(conn *gtcp.Conn) {
        defer conn.Close()
        for {
            data, err := conn.Recv(-1)
            if len(data) > 0 {
                fmt.Println(string(data))
            }
            if err != nil {
                // if client closes, err will be: EOF
                g.Log().Error(err)
                break
            }
        }
    }).Run()

    time.Sleep(time.Second)

    // Client
    tlsConfig, err := gtcp.LoadKeyCrt(crtFile, keyFile)
    if err != nil {
        panic(err)
    }
    tlsConfig.InsecureSkipVerify = true

    conn, err := gtcp.NewConnTLS(address, tlsConfig)
    if err != nil {
        panic(err)
    }
    defer conn.Close()
    for i := 0; i < 10; i++ {
        if err := conn.Send([]byte(gconv.String(i))); err != nil {
            g.Log().Error(err)
        }
        time.Sleep(time.Second)
        if i == 5 {
            conn.Close()
            break
        }
    }

    // exit after 5 seconds
    time.Sleep(5 * time.Second)
}
```

Upon execution, the terminal output is:

```0
1
2
3
4
5
2019-06-05 00:13:12.488 [ERRO] EOF
Stack:
1. /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/geg/net/gtcp/tls/gtcp_server_client.go:25
```

Here, the client closes the connection after `5` seconds, resulting in the server receiving an `EOF` error when receiving data. In practice, this kind of error can be ignored; the server can simply close the client's connection upon encountering this error.