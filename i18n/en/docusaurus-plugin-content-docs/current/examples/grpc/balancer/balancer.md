---
title: Load Balancing
slug: /examples/grpc/balancer
keywords: [grpc, load balancing, service discovery, goframe]
description: gRPC load balancing in GoFrame
hide_title: true
---

# `gRPC` - Load Balancing

Code Source: https://github.com/gogf/examples/tree/main/grpc/balancer


## Description

This example demonstrates how to implement `gRPC` load balancing in `GoFrame` applications. It shows how to:
- Configure `gRPC` load balancers
- Implement different balancing strategies
- Build resilient distributed systems

## Structure

```text
.
├── client/         # Client example
│   └── client.go   # Client implementation with load balancing
├── controller/     # Service controllers
│   └── hello.go    # Hello service implementation
├── protobuf/       # Protocol buffer definitions
├── server/         # Server example
│   ├── config.yaml # Server configuration
│   └── server.go   # Server implementation
├── go.mod          # Go module file
└── go.sum          # Go module checksums
```

## Features

The example showcases the following features:
1. Load Balancing
   - Round-robin balancing
   - Weight-based balancing
   - Least connection balancing
   - Custom balancing strategies

2. Service Management
   - Service registration
   - Health checking
   - Failover handling
   - Connection management

3. Protocol Support
   - `gRPC` services
   - Protocol buffer messages
   - Custom metadata handling
   - Stream processing

## Requirements

- [Go](https://golang.org/dl/) 1.22 or higher
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

## Usage

1. Generate protocol buffer code:
   ```bash
   cd protobuf
   protoc --go_out=paths=source_relative:. --go-grpc_out=paths=source_relative:. *.proto
   ```

2. Start multiple server instances:
   ```bash
   cd server
   # Start first instance on a random free port
   go run server.go
   
   # Start second instance on a random free port
   go run server.go
   ```

3. Run the client:
   ```bash
   cd client
   go run client.go
   ```

# Implementation Details

The example demonstrates:
1. Load balancer configuration with `gRPC`
2. Service registration process
3. Connection management
4. Load balancing strategies
