---
slug: '/docs/components/os-gmutex'
title: 'Mutex'
sidebar_position: 2
hide_title: true
keywords: [GoFrame Framework, gmutex mutex, mutex tutorial, concurrent read/write control, lock mechanism optimization, TryLock method, Func method example, benchmark, concurrency safety, Go programming]
description: "The gmutex mutex in the GoFrame framework supports concurrent read/write control, similar to the standard library's sync.RWMutex. It features Try* methods and *Func methods for non-blocking lock mechanisms and specific scope lock control. Example code demonstrates its convenient usage and benchmark comparisons with standard library locks, showing its performance advantages. Suitable for concurrent programming scenarios needing efficient lock mechanisms."
---

`gmutex.Mutex` mutex objects support read/write control, with functionality similar to the standard library's `sync.RWMutex`, allowing concurrent reads but not concurrent writes.

> For design details of the mutex, it's recommended to read the lightweight high-definition version of the implementation source code: [https://github.com/gogf/gf/blob/master/os/gmutex/gmutex.go](https://github.com/gogf/gf/blob/master/os/gmutex/gmutex.go)

**Usage:**

```go
import "github.com/gogf/gf/v2/os/gmutex"
```

**Interface Documentation:**

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gmutex](https://pkg.go.dev/github.com/gogf/gf/v2/os/gmutex)

```go
type Mutex
    func (m *Mutex) LockFunc(f func())
    func (m *Mutex) TryLockFunc(f func()) (result bool)
type RWMutex
    func New() *RWMutex
    func (m *RWMutex) LockFunc(f func())
    func (m *RWMutex) RLockFunc(f func())
    func (m *RWMutex) TryLockFunc(f func()) (result bool)
    func (m *RWMutex) TryRLockFunc(f func()) (result bool)
```

1. The standout feature of this mutex module is the support for `Try*` methods and `*Func` methods.
2. `Try*` methods are used to attempt to acquire a specific type of lock. If the lock is acquired successfully, it immediately returns `true`; otherwise, it returns `false` without blocking, which is very practical for business logic requiring non-blocking lock mechanisms.
3. `*Func` methods use closure anonymous functions for concurrent safety lock control in specific scopes, which is particularly convenient for concurrent safety control of specific code blocks. As it uses `defer` internally to release locks, even if exceptions or errors occur within the function, it will not affect the safety control of the locking mechanism.

### Benchmark

Benchmark comparison results of `gmutex.Mutex` with the standard library's `sync.Mutex` and `sync.RWMutex`: [gmutex\_bench\_test.go](https://github.com/gogf/gf/blob/master/os/gmutex/gmutex_bench_test.go)

```
goos: linux
goarch: amd64
pkg: github.com/gogf/gf/v2/os/gmutex
Benchmark_Mutex_LockUnlock-4           50000000            31.5 ns/op
Benchmark_RWMutex_LockUnlock-4         30000000            54.1 ns/op
Benchmark_RWMutex_RLockRUnlock-4       50000000            27.9 ns/op
Benchmark_GMutex_LockUnlock-4          50000000            27.2 ns/op
Benchmark_GMutex_TryLock-4             100000000           16.7 ns/op
Benchmark_GMutex_RLockRUnlock-4        50000000            38.0 ns/op
Benchmark_GMutex_TryRLock-4            100000000           16.8 ns/op
```

### Example 1, Basic Usage

```go
package main

import (
    "time"

    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/os/gmutex"
)

func main() {
    ctx := gctx.New()
    mu := gmutex.New()
    for i := 0; i < 10; i++ {
        go func(n int) {
            mu.Lock()
            defer mu.Unlock()
            glog.Print(ctx, "Lock:", n)
            time.Sleep(time.Second)
        }(i)
    }
    for i := 0; i < 10; i++ {
        go func(n int) {
            mu.RLock()
            defer mu.RUnlock()
            glog.Print(ctx, "RLock:", n)
            time.Sleep(time.Second)
        }(i)
    }
    time.Sleep(15 * time.Second)
}
```

After execution, the terminal output:

```html
2019-07-13 16:19:55.417 Lock: 0
2019-07-13 16:19:56.421 Lock: 1
2019-07-13 16:19:57.424 RLock: 0
2019-07-13 16:19:57.424 RLock: 4
2019-07-13 16:19:57.425 RLock: 8
2019-07-13 16:19:57.425 RLock: 2
2019-07-13 16:19:57.425 RLock: 7
2019-07-13 16:19:57.425 RLock: 5
2019-07-13 16:19:57.425 RLock: 9
2019-07-13 16:19:57.425 RLock: 1
2019-07-13 16:19:57.425 RLock: 6
2019-07-13 16:19:57.425 RLock: 3
2019-07-13 16:19:58.429 Lock: 3
2019-07-13 16:19:59.433 Lock: 4
2019-07-13 16:20:00.438 Lock: 5
2019-07-13 16:20:01.443 Lock: 6
2019-07-13 16:20:02.448 Lock: 7
2019-07-13 16:20:03.452 Lock: 8
2019-07-13 16:20:04.456 Lock: 9
2019-07-13 16:20:05.461 Lock: 2
```

The purpose of using `glog` for printing is to conveniently observe the print output time. You can see that in the third second, the read lock seized the opportunity. Since `gmutex.Mutex` objects support concurrent reads but not concurrent writes, the read lock quickly executed after seizing; meanwhile, the write lock continues executing with one log per second.

### Example 2, `*Func` Usage

```go
package main

import (
    "time"

    "github.com/gogf/gf/v2/os/glog"

    "github.com/gogf/gf/v2/os/gmutex"
)

func main() {
    mu := gmutex.New()
    go mu.LockFunc(func() {
        glog.Println("lock func1")
        time.Sleep(1 * time.Second)
    })
    time.Sleep(time.Millisecond)
    go mu.LockFunc(func() {
        glog.Println("lock func2")
    })
    time.Sleep(2 * time.Second)
}
```

After execution, the terminal output:

```html
2019-07-13 16:28:10.381 lock func1
2019-07-13 16:28:11.385 lock func2
```

As you can see, using `*Func` methods for lock control in specific scopes is very convenient.