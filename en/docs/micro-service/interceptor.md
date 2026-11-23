# GRPC Interceptor Component

`GRPC` supports interceptor features, enhancing the flexibility and extensibility of `GRPC`.

## Interceptor Usage

### Server

Use `grpcx.Server.ChainUnary` to add extra server interceptors:

```go
c := grpcx.Server.NewConfig()
c.Options = append(c.Options, []grpc.ServerOption{
    grpcx.Server.ChainUnary(
        grpcx.Server.UnaryValidate,
    )}...,
)
s := grpcx.Server.New(c)
user.Register(s)
s.Run()
```

### Client

Use `grpcx.Client.ChainUnary` to add extra server interceptors:

```
conn = grpcx.Client.MustNewGrpcClientConn("demo", grpcx.Client.ChainUnary(
    grpcx.Client.UnaryTracing,
))
```

## Interceptor List

The `grpcx` component of the framework offers a series of commonly used interceptors, some built-in and others optional.

| Interceptor | Usage Part | Built-in | Description |
| --- | --- | --- | --- |
| `UnaryError` | Client | Yes | Supports the framework's error handling component. |
| `UnaryTracing` | Client | Yes | Supports link tracing. |
| `StreamTracing` | Client | Yes | Supports link tracing (long connection). |
| `UnaryError` | Server | Yes | Supports the framework's error handling component. |
| `UnaryRecover` | Server | Yes | Supports automatic capture of server `panic` without crashing. |
| `UnaryAllowNilRes` | Server | Yes | Supports returning `nil` `Res` objects. |
| `UnaryValidate` | Server | No | Supports the framework's automatic error validation, based on struct tags. Needs to be manually introduced. |
| `UnaryTracing` | Server | Yes | Supports link tracing. |
| `StreamTracing` | Server | Yes | Supports link tracing (long connection). |

> Page: https://goframe.org/en/docs/micro-service/interceptor
