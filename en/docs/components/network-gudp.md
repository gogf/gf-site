# UDP

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

Child pages:

- [UDP - Object](https://goframe.org/en/docs/components/network-gudp-conn.md)
- [UDP - Methods](https://goframe.org/en/docs/components/network-gudp-funcs.md)

> Page: https://goframe.org/en/docs/components/network-gudp
