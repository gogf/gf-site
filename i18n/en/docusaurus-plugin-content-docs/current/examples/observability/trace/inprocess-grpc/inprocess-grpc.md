---
title: In-Process Service (gRPC Exporter)
slug: /examples/observability/trace/inprocess-grpc
keywords: [trace, inprocess, grpc, goframe, otlp-grpc]
description: distributed tracing in in-process services using GoFrame with gRPC-based OpenTelemetry exporter
hide_title: true
---

# Tracing - In-Process Service (gRPC Exporter)

Code Source: https://github.com/gogf/examples/tree/main/observability/trace/inprocess-grpc


## Description

This example demonstrates how to implement distributed tracing in in-process services using GoFrame with gRPC-based OpenTelemetry exporter. It shows how to:
- Configure tracing in a single process using gRPC exporter
- Trace function calls and operations
- Propagate trace context through gRPC
- Visualize distributed traces

## Requirements

- [Go](https://golang.org/dl/) 1.22 or higher
- [Git](https://git-scm.com/downloads)
- [GoFrame](https://goframe.org)
- [GoFrame OpenTelemetry gRPC Tracing](https://github.com/gogf/gf/tree/master/contrib/trace/otlpgrpc)

## Structure

```
.
├── main.go         # Main application with gRPC-based tracing
├── go.mod          # Go module file
└── go.sum          # Go module checksums
```

## Features

The example showcases the following features:
1. Distributed Tracing with gRPC Exporter
   - gRPC-based trace data transmission
   - Span management with gRPC context
   - Trace visualization

2. Function Call Tracing
   - Function entry/exit tracing
   - gRPC context propagation
   - Error handling

3. Data Operations
   - User data retrieval
   - Data aggregation
   - Error handling

## Prerequisites

1. Running Jaeger instance:
   ```bash
   docker run --rm --name jaeger \
   -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
   -p 6831:6831/udp \
   -p 6832:6832/udp \
   -p 5778:5778 \
   -p 16686:16686 \
   -p 4317:4317 \
   -p 4318:4318 \
   -p 14250:14250 \
   -p 14268:14268 \
   -p 14269:14269 \
   -p 9411:9411 \
   jaegertracing/all-in-one:1.55
   ```

## Usage

1. Run the application:
   ```bash
   go run main.go
   ```

2. View traces:
   Open http://localhost:16686 in your browser to view traces in Jaeger UI.

## Implementation Details

The example demonstrates:

1. User Data Operations
   ```go
   GetUser(ctx, id)       // Retrieves complete user data
   ├── GetInfo(ctx, id)   // Gets basic user information
   ├── GetDetail(ctx, id) // Gets detailed user information
   └── GetScores(ctx, id) // Gets user scores
   ```

2. Trace Context Flow
   - Main function creates root span with gRPC context
   - Each function creates child span with gRPC metadata
   - Context propagates through gRPC calls
   - All spans are properly ended with gRPC cleanup

3. Error Handling
   - Non-existent user IDs return nil
   - Each function handles errors independently
   - Errors are traced and logged with gRPC status codes

4. gRPC-based Trace Export
   - Uses gRPC protocol for trace data transmission
   - Configures gRPC trace collector endpoint
   - Handles gRPC connection management
   - Supports gRPC authentication and TLS

## Troubleshooting

1. Application Issues:
   - Check if application is running correctly
   - Verify function call outputs
   - Review error logs

2. Tracing Issues:
   - Verify Jaeger is running: `docker ps | grep jaeger`
   - Check Jaeger UI accessibility: http://localhost:16686
   - Ensure gRPC endpoint is correct in configuration

3. gRPC Issues:
   - Check gRPC connection status
   - Verify gRPC endpoint accessibility
   - Review gRPC error messages and status codes
   - Verify gRPC authentication token

## Example Output

For user ID 100:
```go
{
    "id":      100,
    "name":    "john",
    "gender":  1,
    "site":    "https://goframe.org",
    "email":   "john@goframe.org",
    "math":    100,
    "english": 60,
    "chinese": 50
}
```

For non-existent user IDs:
```go
{}
