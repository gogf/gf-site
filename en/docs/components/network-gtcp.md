# TCP

## Introduction
The `gtcp` module implements an easy-to-use, lightweight `TCPServer`.

**Usage**:

```go
import "github.com/gogf/gf/v2/net/gtcp"
```

**API Documentation**: [https://pkg.go.dev/github.com/gogf/gf/v2/net/gtcp](https://pkg.go.dev/github.com/gogf/gf/v2/net/gtcp)

```go
type Server
    func GetServer(name ...interface{}) *Server
    func NewServer(address string, handler func(*Conn), name ...string) *Server
    func NewServerKeyCrt(address, crtFile, keyFile string, handler func(*Conn), name ...string) *Server
    func NewServerTLS(address string, tlsConfig *tls.Config, handler func(*Conn), name ...string) *Server
    func (s *Server) Close() error
    func (s *Server) Run() (err error)
    func (s *Server) SetAddress(address string)
    func (s *Server) SetHandler(handler func(*Conn))
    func (s *Server) SetTLSConfig(tlsConfig *tls.Config)
    func (s *Server) SetTLSKeyCrt(crtFile, keyFile string) error
```

Among them, `GetServer` uses a singleton pattern to obtain/create a singleton `Server` with a given unique name, which can be dynamically modified later via `SetAddress` and `SetHandler` methods; `NewServer` directly creates a Server object based on given parameters, and a name can be specified.

We demonstrate the use of `TCPServer` by implementing a simple `echo server`:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/net/gtcp"
)

func main() {
    gtcp.NewServer("127.0.0.1:8999", func(conn *gtcp.Conn) {
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
}
```

In this example, we use `Send` and `Recv` to send and receive data. The `Recv` method receives data in a blocking way until the client "finishes sending a piece of data" (executes `Send` once, with no buffering implemented in the underlying socket communication), or closes the connection. For more on the connection object `gtcp.Conn`, please continue reading the following sections.

After execution, we use the `telnet` tool to test:

```bash
john@home:~$ telnet 127.0.0.1 8999
Trying 127.0.0.1...
Connected to 127.0.0.1.
Escape character is '^]'.
hello
> hello
hi there
> hi there
```

For each TCP connection initiated by a client, TCPServer creates a `goroutine` to handle it until the TCP connection is disconnected. Due to the lightweight nature of goroutines, very high levels of concurrency can be supported.

## Documentation

Child pages:

- [TCP - Methods](https://goframe.org/en/docs/components/network-gtcp-funcs.md)
- [TCP - TLS](https://goframe.org/en/docs/components/network-gtcp-tls.md)
- [TCP - Connection Pool](https://goframe.org/en/docs/components/network-gtcp-connection-pool.md)
- [TCP - Object](https://goframe.org/en/docs/components/network-gtcp-conn.md)

> Page: https://goframe.org/en/docs/components/network-gtcp
