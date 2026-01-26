---
slug: '/docs/components/network-gudp-conn'
title: 'UDP - Object'
sidebar_position: 0
hide_title: true
keywords: [GoFrame, GoFrame Framework, gudp.Conn, UDP Component, UDP Connection, gudp Module, Network Programming, Go Language, Data Communication, Programming Example]
description: "Using the GoFrame framework for UDP component development, specifically the use of the gudp.Conn connection object. The article provides detailed function interface descriptions and a complete example code for client-server communication, helping developers quickly master the specific operations and application scenarios of the UDP connection object."
---

The `gudp` module provides a very simple and easy-to-use `gudp.Conn` link operation object.

**Usage:**

```go
import "github.com/gogf/gf/v2/net/gudp"
```

**API Documentation:** [https://pkg.go.dev/github.com/gogf/gf/v2/net/gudp](https://pkg.go.dev/github.com/gogf/gf/v2/net/gudp)

## Introduction

Most of the operations of `gudp.Conn` are similar to the operation mode of `gtcp` (most of the method names are the same), but since `UDP` is a connectionless protocol, `gudp.Conn` (underlying communication port) can only complete up to one data write and read at a time. The client will need to create a new `Conn` object for communication the next time it communicates with the target server.

## Usage Example

```go
package main

import (
    "context"
    "fmt"
    "time"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/gudp"
    "github.com/gogf/gf/v2/os/gtime"
)

func main() {
    var (
        ctx    = context.Background()
        logger = g.Log()
    )
    // Server
    go gudp.NewServer("127.0.0.1:8999", func(conn *gudp.ServerConn) {
        defer conn.Close()
        for {
            data, addr, err := conn.Recv(-1)
            if len(data) > 0 {
                if err = conn.Send(append([]byte("> "), data...), addr); err != nil {
                    logger.Error(ctx, err)
                }
            }
            if err != nil {
                logger.Error(ctx, err)
            }
        }
    }).Run()

    time.Sleep(time.Second)

    // Client
    for {
        if conn, err := gudp.NewClientConn("127.0.0.1:8999"); err == nil {
            if b, err := conn.SendRecv([]byte(gtime.Datetime()), -1); err == nil {
                fmt.Println(string(b), conn.LocalAddr(), conn.RemoteAddr())
            } else {
                logger.Error(ctx, err)
            }
            conn.Close()
        } else {
            logger.Error(ctx, err)
        }
        time.Sleep(time.Second)
    }
}
```

This example is similar to the communication example in `gtcp.Conn`, with the difference that the client and server cannot maintain a connection, requiring a new connection object for each communication.

After execution, the output is as follows:

```text
> 2018-07-21 23:13:31 127.0.0.1:33271 127.0.0.1:8999
> 2018-07-21 23:13:32 127.0.0.1:45826 127.0.0.1:8999
> 2018-07-21 23:13:33 127.0.0.1:58027 127.0.0.1:8999
> 2018-07-21 23:13:34 127.0.0.1:33056 127.0.0.1:8999
> 2018-07-21 23:13:35 127.0.0.1:39260 127.0.0.1:8999
> 2018-07-21 23:13:36 127.0.0.1:33967 127.0.0.1:8999
> 2018-07-21 23:13:37 127.0.0.1:52359 127.0.0.1:8999
...
```