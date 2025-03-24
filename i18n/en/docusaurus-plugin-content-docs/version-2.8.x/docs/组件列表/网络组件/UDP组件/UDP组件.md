---
slug: '/docs/components/network-gudp'
title: 'UDP'
sidebar_position: 1
hide_title: true
keywords: [GoFrame, UDP Component, UDP Protocol, Connectionless Protocol, gudp.Server, gudp.Conn, API Documentation, gudp Usage, NewServer, SetAddress]
description: "UDP component in the GoFrame framework, implementing a simple unreliable information delivery service using gudp.Server and gudp.Conn for the UDP protocol. Provides example code on creating and running a UDP server, along with related API documentation links for reference."
---

## Introduction
`UDP (User Datagram Protocol)` is a connectionless transport layer protocol that provides a simple unreliable information delivery service oriented towards transactions. The `UDP` server is implemented through `gudp.Server`, while the client is implemented using the `gudp.ClientConn` object or utility methods.

**Usage**:

```go
import "github.com/gogf/gf/v2/net/gudp"
```

**API Documentation**: [https://pkg.go.dev/github.com/gogf/gf/v2/net/gudp](https://pkg.go.dev/github.com/gogf/gf/v2/net/gudp)


## Usage Example

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/net/gudp"
)

func main() {
    handler := func(conn *gudp.ServerConn) {
        defer conn.Close()
        for {
            if data, addr, _ := conn.Recv(-1); len(data) > 0 {
                fmt.Println(string(data), addr.String())
            }
        }
    }
    err := gudp.NewServer("127.0.0.1:8999", handler).Run()
    if err != nil {
        fmt.Println(err)
    }
}
```

`UDPServer` runs in a blocking manner. Users can perform concurrent processing in the custom callback function based on the read content.

On `Linux`, you can use the following command to send `UDP` data to the server for testing, and then check whether there is output on the server side:

```bash
echo "hello" > /dev/udp/127.0.0.1/8999
```

## Documentation
import DocCardList from '@theme/DocCardList';

<DocCardList />