# ORM - Context

`ORM` supports passing custom `context` variables for asynchronous `IO` control, context information transmission (especially transmission of trace information), and nested transaction support.

We can pass custom context variables to an `ORM` object using the `Ctx` method. The `Ctx` method is essentially a chainable operation, and the context passed in is only effective for the current `DB` interface object. The method is defined as follows:

```go
func Ctx(ctx context.Context) DB
```

## Request Timeout Control

Let's look at an example of controlling the request timeout duration using context variables.

```go
ctx, cancel := context.WithTimeout(context.Background(), time.Second)
defer cancel()
_, err := db.Ctx(ctx).Query("SELECT SLEEP(10)")
fmt.Println(err)
```

In this example, executing `sleep 10` seconds will inevitably cause a timeout. After execution, the output is:

```html
context deadline exceeded, SELECT SLEEP(10)
```

## Trace Information

Context variables can also pass trace information, and when combined with the logging component, can print trace information to logs (only when `ORM` logging is enabled). Please refer to the trace topic chapter: [Service Tracing](https://goframe.org/en/docs/obs/tracing.md).

## Model Context Operations

Model objects also support context variable passing, using the `Ctx` method as well. Let's look at a simple example by modifying the example from the second section using model operations.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    _, err := g.DB().Model("user").Ctx(gctx.New()).All()
    if err != nil {
        panic(err)
    }
}
```

After execution, the terminal output is:

```html
2020-12-28 23:46:56.349 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  5 ms] [default] [rows:0  ] SHOW FULL COLUMNS FROM `user`
2020-12-28 23:46:56.354 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  5 ms] [default] [rows:100] SELECT * FROM `user`
```

**Tip**

The `SHOW FULL COLUMNS FROM `user`` query is used by the `ORM` component to fetch data table fields, which queries each table only once before execution and caches the results in memory.

## Nested Transaction Support

Support for nested transactions relies on hierarchical passing of `Context` variables. For details, please refer to the chapter: [ORM - Transaction](https://goframe.org/en/docs/core/gdb-transaction.md).

> Page: https://goframe.org/en/docs/core/gdb-context
