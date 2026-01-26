---
slug: '/docs/components/os-grpool'
title: 'Goroutine'
sidebar_position: 16
hide_title: true
keywords: [GoFrame, GoFrame Framework, goroutine, coroutine pool, high concurrency, grpool, task queue, resource management, asynchronous execution, memory optimization]
description: "A lightweight coroutine management tool in Go, grpool, discussing its performance advantages and resource reuse under high concurrency. Through pooling technology, it manages a large number of goroutines to reduce memory usage and optimize global scheduling, suitable for scenarios requiring asynchronous tasks and high memory usage."
---

## Introduction

While `goroutine` in Go is relatively lightweight compared to system threads (with an initial stack size of only `2KB` and supports dynamic expansion), threads started using languages such as `Java` or `C++` are generally kernel-mode threads occupying about `4MB` of memory. Assuming our server CPU has `4GB` of memory, it's clear that the total number of concurrent kernel-mode threads is limited to about `1024`. In contrast, the number of goroutines in Go can reach `4*1024*1024/2=2 million`. This illustrates why Go naturally supports high concurrency.

## Pain Points

### Resource Consumption of Coroutine Execution

However, under high concurrency, the frequent creation and destruction of `goroutine` can be a performance bottleneck and create pressure on `GC`. Reusing `goroutine` to reduce the overhead of creation/destruction is the purpose of `grpool`, which pools `goroutine`. For example, for `1 million` tasks, creating and destroying `1 million` `goroutine` is required, but with `grpool`, only a few ten thousand `goroutine` might be needed to execute all tasks effectively.

Tests show that goroutine pooling offers little improvement in execution efficiency for business logic (reducing execution time/CPU usage). It might even be slower than native goroutine execution because the scheduling of pooled goroutines is not as efficient as the underlying Go scheduler. However, due to the reuse design, memory usage decreases significantly with pooling.

### Large Number of Coroutines Affect Global Scheduling

Some business modules need to dynamically create coroutines to execute tasks, such as asynchronous collection tasks and metric calculation tasks. These tasks are not the core logic of the service but can lead to an explosion in coroutines in extreme cases, affecting the global scheduling of the Go engine and causing significant service execution delays.

For example, an asynchronous collection task might execute every `5` seconds, creating `100` coroutines each time to collect data from different targets. If network delays occur, tasks from previous executions might not finish before new coroutines are created, potentially causing an explosion in coroutines and affecting global service execution. In such scenarios, pooling techniques can be used to execute tasks quantitatively. After a certain number of tasks accumulate, subsequent tasks should block. For example, if the maximum number of tasks in a pool is set to `10,000`, execution blocks when this limit is exceeded, but it does not delay global service execution.

## Concept Introduction

### `Pool`

Goroutine pool used to manage several reusable `goroutine` resources.

### `Job`

Tasks waiting for execution added to the pool's task queue. A `Job` is a method of type `Func` and can only be obtained and executed by one `Worker`. `Func` is defined as:

```go
type Func func(ctx context.Context)
```

### `Worker`

A `goroutine` in the pool involved in task execution. A `Worker` can execute several `Job`s until there are no more `Job`s waiting in the queue.

## Usage Introduction

**Usage:**

```go
import "github.com/gogf/gf/v2/os/grpool"
```

**Scenarios:**

Managing a large number of asynchronous tasks, reusing asynchronous coroutines, and reducing memory usage.

**Interface Documentation:**

```go
func Add(ctx context.Context, f Func) error
func AddWithRecover(ctx context.Context, userFunc Func, recoverFunc RecoverFunc) error
func Jobs() int
func Size() int
func New(limit ...int) *Pool
    func (p *Pool) Add(ctx context.Context, f Func) error
    func (p *Pool) AddWithRecover(ctx context.Context, userFunc Func, recoverFunc RecoverFunc) error
    func (p *Pool) Cap() int
    func (p *Pool) Close()
    func (p *Pool) IsClosed() bool
    func (p *Pool) Jobs() int
    func (p *Pool) Size() int
```

Create a `goroutine pool` object using `grpool.New`. The parameter `limit` is optional and used to limit the number of worker `goroutine` in the pool, with no limit by default. Tasks can be continuously added to the pool without restriction, but the number of worker `goroutine` can be limited. Use `Size()` to check the current number of worker `goroutine` and `Jobs()` to check the current number of pending tasks in the pool.

For convenience, the `grpool` package provides a default `goroutine` pool, which does not limit the number of `goroutine`, and tasks can be added directly to the default pool via `grpool.Add`, with task parameters required to be functions/methods of type `func()`.

The most common question about this module is how to pass parameters to tasks within `grpool` from the outside. Please see example 2 for details.

## Usage Examples

### Using the Default `goroutine` Pool, Restrict `100` `goroutine` to Execute `1000` Tasks

```go
package main

import (
     "context"
     "fmt"
     "github.com/gogf/gf/v2/os/gctx"
     "github.com/gogf/gf/v2/os/grpool"
     "github.com/gogf/gf/v2/os/gtimer"
     "time"
)

var (
    ctx = gctx.New()
)

func job(ctx context.Context) {
     time.Sleep(1 * time.Second)
}

func main() {
     pool := grpool.New(100)
     for i := 0; i < 1000; i++ {
         pool.Add(ctx, job)
     }
     fmt.Println("worker:", pool.Size())
     fmt.Println(" jobs:", pool.Jobs())
     gtimer.SetInterval(ctx, time.Second, func(ctx context.Context) {
         fmt.Println("worker:", pool.Size())
         fmt.Println(" jobs:", pool.Jobs())
         fmt.Println()
     })

     select {}
}
```

The task function in this program performs `sleep 1 second`, which clearly demonstrates the function of limiting goroutine count. A `gtime.SetInterval` timer is used to print out the number of work `goroutine` and pending tasks every second.

### Asynchronous Parameter Passing: A Common Mistake for Beginners

> This example is not valid in go versions ≥ 1.22, as the loop variable trap no longer exists post go 1.22.

```go
package main

import (
     "context"
     "fmt"
     "github.com/gogf/gf/v2/os/gctx"
     "github.com/gogf/gf/v2/os/grpool"
     "sync"
)

var (
    ctx = gctx.New()
)

func main() {
     wg := sync.WaitGroup{}
     for i := 0; i < 10; i++ {
        wg.Add(1)
        grpool.Add(ctx, func(ctx context.Context) {
               fmt.Println(i)
               wg.Done()
        })
     }
     wg.Wait()
}
```

The goal of this code is to sequentially print numbers from 0-9, but the output is:

```10
10
10
10
10
10
10
10
10
10
```

Why does this happen? This behavior occurs both when using the `go` keyword and `grpool` for execution. The reason is that when the function is registered for asynchronous execution, it hasn't started executing (at registration time, only the memory address of the variable `i` is saved in the goroutine's stack). When it does start executing, it reads the variable `i`'s value, which by then has incremented to `10`. Knowing the reason, the solution is simple: pass the value of `i` at the time of registering for asynchronous execution; alternatively, assign the current value of `i` to a temporary variable and use this in the function instead of directly using `i`.

Revised example code:

**1)** Using the `go` keyword

```go
package main

import (
    "fmt"
    "sync"
)

func main() {
    wg := sync.WaitGroup{}
    for i := 0; i < 10; i++ {
        wg.Add(1)
        go func(v int){
            fmt.Println(v)
            wg.Done()
        }(i)
    }
    wg.Wait()
}

```

The output is:

```0
9
3
4
5
6
7
8
1
2
```

Note, asynchronous execution doesn't guarantee the order of execution matches the function registration order; similarly in the following examples.

**2)** Using a temporary variable

```go
package main

import (
     "context"
     "fmt"
     "github.com/gogf/gf/v2/os/gctx"
     "github.com/gogf/gf/v2/os/grpool"
     "sync"
)

var (
   ctx = gctx.New()
)

func main() {
     wg := sync.WaitGroup{}
     for i := 0; i < 10; i++ {
        wg.Add(1)
        v := i
        grpool.Add(ctx, func(ctx context.Context) {
               fmt.Println(v)
               wg.Done()
        })
     }
     wg.Wait()
}
```

The output is:

```9
0
1
2
3
4
5
6
7
8
```

Here, when registering a task with `grpool`, the registration method is `func(ctx context.Context)`, so it cannot directly register the value of `i` during task registration (avoid passing business parameters via `ctx` if possible). Therefore, use a temporary variable to pass the current value of `i`.

### Automatically Catch `goroutine` Errors: `AddWithRecover`

`AddWithRecover` pushes a new task into the pool with the specified recovery function. If there is a `panic` during the execution of `userFunc`, the optional `Recovery Func` is called. If no `Recovery Func` is provided or it's set to nil, then `panic` from `userFunc` is ignored. The task is executed asynchronously.

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/container/garray"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/grpool"
    "time"
)

var (
    ctx = gctx.New()
)
func main() {
    array := garray.NewArray(true)
    grpool.AddWithRecover(ctx, func(ctx context.Context) {
        array.Append(1)
        array.Append(2)
        panic(1)
    }, func(err error) {
        array.Append(1)
    })
    grpool.AddWithRecover(ctx, func(ctx context.Context) {
        panic(1)
        array.Append(1)
    })
    time.Sleep(500 * time.Millisecond)
    fmt.Print(array.Len())
}
```

### Performance Test: `grpool` vs Native `goroutine`

**1)** `grpool`

```go
package main

import (
     "context"
     "fmt"
     "github.com/gogf/gf/v2/os/gctx"
     "github.com/gogf/gf/v2/os/grpool"
     "github.com/gogf/gf/v2/os/gtime"
     "sync"
     "time"
)

var (
   ctx = gctx.New()
)

func main() {
     start := gtime.TimestampMilli()
     wg := sync.WaitGroup{}
     for i := 0; i < 10000000; i++ {
        wg.Add(1)
        grpool.Add(ctx, func(ctx context.Context) {
               time.Sleep(time.Millisecond)
               wg.Done()
        })
     }
     wg.Wait()
     fmt.Println(grpool.Size())
     fmt.Println("time spent:", gtime.TimestampMilli() - start)
}
```

**2)** `goroutine`

```go
package main

import (
     "fmt"
     "github.com/gogf/gf/v2/os/gtime"
     "sync"
     "time"
)

func main() {
     start := gtime.TimestampMilli()
     wg := sync.WaitGroup{}
     for i := 0; i < 10000000; i++ {
        wg.Add(1)
        go func() {
               time.Sleep(time.Millisecond)
               wg.Done()
        }()
     }
     wg.Wait()
     fmt.Println("time spent:", gtime.TimestampMilli() - start)
}
```

**3)** Comparison of Results

The test results are the averages of three runs for both programs.

```shell
grpool:
    goroutine count: 847313
    memory spent: ~2.1 G
    time spent: 37792 ms

goroutine:
    goroutine count: 1000W
    memory spent: ~4.8 GB
    time spent: 27085 ms
```

It's clear that after pooling, the number of goroutines and memory usage for executing the same number of tasks have reduced significantly. CPU time consumption is also reasonably acceptable.