# Installation

Welcome to the `GoFrame` Quick Start Guide! `GoFrame` is a modern Go framework designed with modularity and loose coupling in mind. You can use it either as a full-featured application framework or cherry-pick individual components for your specific needs.

This guide will walk you through installing and setting up `GoFrame`, culminating in building your first web service.

**Info**

New to Go? We recommend checking out our [Environment Setup Guide](https://goframe.org/en/docs/install-go.md) first to get your development environment ready.

Stuck or have questions? Feel free to leave a comment 💬. Our community is here to help, and we'll get back to you as quickly as possible 🌟🌟.

## Go Version Requirements

To ensure stability and security, `GoFrame` maintains compatibility with recent Go versions. We typically support the latest release and three previous versions.

Minimum requirement:
```bash
golang version >= 1.20
```

## Getting Started

Install the latest version:
```bash
go get -u -v github.com/gogf/gf/v2
```

Or add this to your `go.mod`:
```bash
require github.com/gogf/gf/v2 latest
```

## Quick Test

Let's verify your installation with a simple program:
```go title="main.go"
package main

import (
    "fmt"

    "github.com/gogf/gf/v2"
)

func main() {
    fmt.Println("Hello GF:", gf.VERSION)
}
```

Run it:
```bash
go run main.go
```

You should see something like:
```bash
Hello GF: v2.7.4
```

Perfect! Now that `GoFrame` is set up, let's build your first HTTP server.

> Page: https://goframe.org/en/quick/install
