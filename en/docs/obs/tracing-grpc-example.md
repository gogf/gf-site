# Tracing - GRPC Example

In this chapter, we will modify the previously introduced `HTTP Client&Server` example to a `GRPC` microservice and demonstrate how to develop a simple `GRPC` server and client using the `GoFrame` framework and add tracing features to the `GRPC` microservice.

The example code for this chapter is located at: [https://github.com/gogf/gf/tree/master/example/trace/grpc\_with\_db](https://github.com/gogf/gf/tree/master/example/trace/grpc_with_db)

## Directory Structure

## Protobuf

```
syntax = "proto3";

package user;

option go_package = "protobuf/user";

// User service for tracing demo.
service User {
  rpc Insert(InsertReq) returns (InsertRes) {}
  rpc Query(QueryReq) returns (QueryRes) {}
  rpc Delete(DeleteReq) returns (DeleteRes) {}
}

message InsertReq {
  string Name = 1; // v: required#Please input user name.
}
message InsertRes {
  int32 Id = 1;
}

message QueryReq {
  int32 Id = 1; // v: min:1#User id is required for querying.
}
message QueryRes {
  int32  Id = 1;
  string Name = 2;
}

message DeleteReq {
  int32 Id = 1; // v:min:1#User id is required for deleting.
}
message DeleteRes {}
```

Use the `gf gen pb` command to compile this `proto` file, which will generate the corresponding `grpc` interface and data structure files.

## GRPC Server

```go
package main

import (
    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"
    _ "github.com/gogf/gf/contrib/nosql/redis/v2"
    "github.com/gogf/gf/contrib/registry/etcd/v2"
    "github.com/gogf/gf/example/trace/grpc_with_db/protobuf/user"

    "context"
    "fmt"
    "time"

    "github.com/gogf/gf/contrib/rpc/grpcx/v2"
    "github.com/gogf/gf/contrib/trace/otlpgrpc/v2"
    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gcache"
    "github.com/gogf/gf/v2/os/gctx"
)

type Controller struct {
    user.UnimplementedUserServer
}

const (
    serviceName = "otlp-grpc-server"
    endpoint    = "tracing-analysis-dc-bj.aliyuncs.com:8090"
    traceToken  = "******_******"
)

func main() {
    grpcx.Resolver.Register(etcd.New("127.0.0.1:2379"))

    var ctx = gctx.New()
    shutdown, err := otlpgrpc.Init(serviceName, endpoint, traceToken)
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    defer shutdown()

    // Set ORM cache adapter with redis.
    g.DB().GetCache().SetAdapter(gcache.NewAdapterRedis(g.Redis()))

    s := grpcx.Server.New()
    user.RegisterUserServer(s.Server, &Controller{})
    s.Run()
}

// Insert is a route handler for inserting user info into database.
func (s *Controller) Insert(ctx context.Context, req *user.InsertReq) (res *user.InsertRes, err error) {
    result, err := g.Model("user").Ctx(ctx).Insert(g.Map{
        "name": req.Name,
    })
    if err != nil {
        return nil, err
    }
    id, _ := result.LastInsertId()
    res = &user.InsertRes{
        Id: int32(id),
    }
    return
}

// Query is a route handler for querying user info. It firstly retrieves the info from redis,
// if there's nothing in the redis, it then does db select.
func (s *Controller) Query(ctx context.Context, req *user.QueryReq) (res *user.QueryRes, err error) {
    err = g.Model("user").Ctx(ctx).Cache(gdb.CacheOption{
        Duration: 5 * time.Second,
        Name:     s.userCacheKey(req.Id),
        Force:    false,
    }).WherePri(req.Id).Scan(&res)
    if err != nil {
        return nil, err
    }
    return
}

// Delete is a route handler for deleting specified user info.
func (s *Controller) Delete(ctx context.Context, req *user.DeleteReq) (res *user.DeleteRes, err error) {
    err = g.Model("user").Ctx(ctx).Cache(gdb.CacheOption{
        Duration: -1,
        Name:     s.userCacheKey(req.Id),
        Force:    false,
    }).WherePri(req.Id).Scan(&res)
    return
}

func (s *Controller) userCacheKey(id int32) string {
    return fmt.Sprintf(`userInfo:%d`, id)
}
```

Brief explanation of the server code:

1. First, the server needs to initialize `Jaeger` through the `jaeger.Init` method.

2. As you can see, the business logic is entirely consistent with the previous HTTP example project, only the access layer is modified for the GRPC protocol.

3. We still inject Redis cache via the cache adapter:

```go
g.DB().GetCache().SetAdapter(gcache.NewAdapterRedis(g.Redis()))
```

4. Here, we also enable the cache feature of `ORM` using the `Cache` method, which has already been introduced before and will not be elaborated on here.

## GRPC Client

```go
package main

import (
    "github.com/gogf/gf/contrib/registry/etcd/v2"
    "github.com/gogf/gf/contrib/rpc/grpcx/v2"
    "github.com/gogf/gf/contrib/trace/otlpgrpc/v2"
    "github.com/gogf/gf/example/trace/grpc_with_db/protobuf/user"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/gtrace"
    "github.com/gogf/gf/v2/os/gctx"
)

const (
    serviceName = "otlp-grpc-client"
    endpoint    = "tracing-analysis-dc-bj.aliyuncs.com:8090"
    traceToken  = "******_******"
)

func main() {
    grpcx.Resolver.Register(etcd.New("127.0.0.1:2379"))

    var ctx = gctx.New()
    shutdown, err := otlpgrpc.Init(serviceName, endpoint, traceToken)
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    defer shutdown()

    StartRequests()
}

func StartRequests() {
    ctx, span := gtrace.NewSpan(gctx.New(), "StartRequests")
    defer span.End()

    client := user.NewUserClient(grpcx.Client.MustNewGrpcClientConn("demo"))

    // Baggage.
    ctx = gtrace.SetBaggageValue(ctx, "uid", 100)

    // Insert.
    insertRes, err := client.Insert(ctx, &user.InsertReq{
        Name: "john",
    })
    if err != nil {
        g.Log().Fatalf(ctx, `%+v`, err)
    }
    g.Log().Info(ctx, "insert id:", insertRes.Id)

    // Query.
    queryRes, err := client.Query(ctx, &user.QueryReq{
        Id: insertRes.Id,
    })
    if err != nil {
        g.Log().Errorf(ctx, `%+v`, err)
        return
    }
    g.Log().Info(ctx, "query result:", queryRes)

    // Delete.
    _, err = client.Delete(ctx, &user.DeleteReq{
        Id: insertRes.Id,
    })
    if err != nil {
        g.Log().Errorf(ctx, `%+v`, err)
        return
    }
    g.Log().Info(ctx, "delete id:", insertRes.Id)

    // Delete with error.
    _, err = client.Delete(ctx, &user.DeleteReq{
        Id: -1,
    })
    if err != nil {
        g.Log().Errorf(ctx, `%+v`, err)
        return
    }
    g.Log().Info(ctx, "delete id:", -1)
}
```

Brief explanation of the client code:

1. First, the client also needs to initialize `Jaeger` through the `jaeger.Init` method.

2. The client is very simple, internal initialization and setting of default interceptors have been encapsulated by the `Katyusha` framework, developers need only focus on implementing business logic.

## Effect Viewing

**Start the Server:**

**Start the Client:**

At the end of the client execution here, an error was reported, which we did **intentionally**, to demonstrate the link information display when `GRPC` has an error. Let's open `jaeger` to check the tracing information:

You can see that this request involves two services: `tracing-grpc-client` and `tracing-grpc-server`, which are the client and the server. The entire request link involves `17` spans, with the client having `5` spans, the server having `12` spans, and producing `2` errors. Let's click to view the details:

Let's click to check the span situation of the last interface call error:

It looks like a parameter validation error, click to view the request parameters in `Events/Logs`:

Checking the `Log` information in `Process`, it can be seen that the error occurred because the parameter passed was `-1`, which did not meet the validation rules, hence an error was returned during data validation.

### GRPC Client

Since `orm`, `redis`, and `logging` components have previously introduced link information, here we mainly introduce link information for `GRPC Client&Server`.

#### Attributes

| Attribute/Tag | Description |
| --- | --- |
| `net.peer.ip` | Target IP of the request. |
| `net.peer.port` | Target port of the request. |
| `rpc.grpc.status_code` | Internal status code for `GRPC`, `0` indicates success, `non-0` indicates failure. |
| `rpc.service` | Name of the `RPC` service, note that this is `RPC` not `GRPC`, as this is a general definition, and the client supports multiple `RPC` communication protocols, with `GRPC` being one of them. |
| `rpc.method` | Name of the `RPC` method. |
| `rpc.system` | Type of `RPC` protocol, such as: `grpc`, `thrift`, etc. |

#### Events/Logs

| Event/Log | Description |
| --- | --- |
| `grpc.metadata.outgoing` | `GRPC` client request submitted `Metadata` information, which may be large. |
| `grpc.request.baggage` | `GRPC` client request submitted `Baggage` information for service-to-service trace information transmission. |
| `grpc.request.message` | `GRPC` client request submitted `Message` data, which may be large, only `512KB` is recorded, and if it exceeds that size, it is ignored. Only valid for `Unary` request types. |
| `grpc.response.message` | `GRPC` client request received returned `Message` information, which may be large. Only valid for `Unary` request types. |

### GRPC Server

#### Attributes

`GRPC Server` attributes mean the same as `GRPC Client`, with parsed data being almost identical in the same request.

#### Events

The difference in `Events` for the `GRPC Server` compared to the `GRPC Client` is that in the same request, the metadata received by the server is `grpc.metadata.incoming`, while others are the same as the `GRPC Client`.

> Page: https://goframe.org/en/docs/obs/tracing-grpc-example
