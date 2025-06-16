---
title: Proxy
slug: /examples/httpserver/proxy
keywords: [http, server, proxy, reverse, goframe]
description: A reverse proxy server using GoFrame framework
hide_title: true
---

# HTTP Server Proxy

Github Source: https://github.com/gogf/examples/tree/main/httpserver/proxy



## Description

This example demonstrates how to create a reverse proxy server using `GoFrame`. The example consists of two servers:

1. A backend server running on port 8198 that provides the actual service
2. A proxy server running on port 8199 that forwards requests to the backend server

The proxy server implements the following features:
- Reverse proxy functionality using `httputil.NewSingleHostReverseProxy`
- Custom error handling for proxy failures
- URL path rewriting
- Request body handling
- Detailed logging of proxy operations

## Requirements

- [Go](https://golang.org/dl/) `1.22` or higher
- [Git](https://git-scm.com/downloads)
- [GoFrame](https://goframe.org)

## Structure

- `go.mod`: The Go module file.
- `main.go`: The main application entry point.

## Features

- Simple and efficient reverse proxy implementation
- Automatic URL path rewriting
- Error handling for backend server failures
- Logging of proxy operations
- Support for all HTTP methods

## Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/gogf/examples.git
    cd examples/httpserver/proxy
    ```

2. Install the dependencies:
    ```bash
    go mod tidy
    ```

3. Run the application:
    ```bash
    go run main.go
    ```

## Usage

1. Run the example:
   ```bash
   go run main.go
   ```

2. The example will start two servers:
   - Backend server at: http://127.0.0.1:8198
   - Proxy server at: http://127.0.0.1:8199

3. Test the proxy:
   - Access through proxy: http://127.0.0.1:8199/proxy/user/1
   - Direct backend access: http://127.0.0.1:8198/user/1

## Implementation Details

The proxy server uses Go's built-in `httputil.NewSingleHostReverseProxy` for implementing the reverse proxy functionality. All requests to the proxy server with the path prefix `/proxy/*` are forwarded to the backend server after removing the `/proxy` prefix.

The implementation includes:
- Request path rewriting
- Error handling for backend failures
- Request body handling for proper forwarding
- Logging of proxy operations for debugging

## Notes

- The proxy server modifies the request URL path before forwarding
- All HTTP methods are supported
- Backend server errors result in a 502 Bad Gateway response
