# Redis - Do

## `Do` Method

`Do` is a universal command interaction method that executes synchronous instructions by sending corresponding `Redis API` commands to the `Redis Server` to utilize the `Redis Server` services. The biggest feature of the `Do` method is its strong extensibility by interacting with the server using `Redis` commands, which can implement other commands not provided by the `Redis` operation methods. Usage example:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx = gctx.New()
    )
    v, _ := g.Redis().Do(ctx, "SET", "k", "v")
    fmt.Println(v.String())
}
```

## Automatic Serialization/Deserialization

When the given parameters are `map`, `slice`, or `struct`, `gredis` internally supports automatic `json` serialization and can use the conversion functions of `gvar.Var` for deserialization when reading data.

### `map` Access

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gvar"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx = gctx.New()
        err    error
        result *gvar.Var
        key    = "user"
        data   = g.Map{
            "id":   10000,
            "name": "john",
        }
    )
    _, err = g.Redis().Do(ctx, "SET", key, data)
    if err != nil {
        panic(err)
    }
    result, err = g.Redis().Do(ctx,"GET", key)
    if err != nil {
        panic(err)
    }
    fmt.Println(result.Map())
}
```

### `struct` Access

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gvar"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    type User struct {
        Id   int
        Name string
    }

    var (
        ctx = gctx.New()
        err    error
        result *gvar.Var
        key    = "user"
        user   = g.Map{
            "id":   10000,
            "name": "john",
        }
    )

    _, err = g.Redis().Do(ctx, "SET", key, user)
    if err != nil {
        panic(err)
    }
    result, err = g.Redis().Do(ctx, "GET", key)
    if err != nil {
        panic(err)
    }

    var user2 *User
    if err = result.Struct(&user2); err != nil {
        panic(err)
    }
    fmt.Println(user2.Id, user2.Name)
}
```

> Page: https://goframe.org/en/docs/components/contrib-nosql-redis-do-and-serialization
