---
title: Raw gRPC Example
slug: /examples/grpc/rawgrpc
keywords: [grpc, raw, implementation, goframe]
description: raw gRPC implementation in GoFrame
hide_title: true
sidebar_position: 9
---

# `gRPC` - Raw Implementation

Github Source: https://github.com/gogf/examples/tree/main/grpc/rawgrpc


## Description

This example demonstrates how to implement raw `gRPC` services in `GoFrame` without additional abstractions. It shows how to:
- Create raw `gRPC` servers and clients
- Use protocol buffers directly
- Implement service handlers
- Make direct `RPC` calls

## Structure

```text
.
├── client/           # Client example
│   └── client.go     # Raw gRPC client implementation
├── helloworld/       # Protocol buffer definitions
│   └── helloworld.proto # Service and message definitions
├── server/           # Server example
│   └── server.go     # Raw gRPC server implementation
├── go.mod            # Go module file
└── go.sum            # Go module checksums
```

## Features

The example showcases the following features:
1. Raw `gRPC` Implementation
   - Direct protocol buffer usage
   - Manual service implementation
   - Basic `RPC` communication
   - Error handling

2. Client Usage
   - Direct connection management
   - Raw `RPC` calls
   - Basic error handling
   - Connection configuration

3. Server Features
   - Raw service implementation
   - Request processing
   - Response handling
   - Basic configuration

## Requirements

- [Go](https://golang.org/dl/) `1.22` or higher
- [Git](https://git-scm.com/downloads)
- [GoFrame](https://goframe.org)
- [gRPC](https://grpc.io/docs/languages/go/quickstart/)

## Prerequisites

1. Protocol buffer compiler installed:
   ```bash
   # For macOS
   brew install protobuf
   
   # Install protoc-gen-go and protoc-gen-go-grpc
   go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
   go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
   ```

# Usage

1. Generate protocol buffer code:
   ```bash
   cd helloworld
   protoc --go_out=paths=source_relative:. --go-grpc_out=paths=source_relative:. *.proto
   ```

2. Start the server:
   ```bash
   cd server
   go run server.go
   ```

3. Run the client:
   ```bash
   cd client
   go run client.go
   ```

# Implementation Details

The example demonstrates:
1. Raw `gRPC` service implementation
2. Direct client/server usage
