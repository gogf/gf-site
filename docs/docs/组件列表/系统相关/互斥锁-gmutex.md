---
slug: '/docs/components/os-gmutex'
title: '互斥锁-gmutex'
sidebar_position: 2
hide_title: true
keywords: [GoFrame框架,gmutex互斥锁,互斥锁教程,并发读写控制,锁机制优化,TryLock方法,Func方法示例,基准测试,并发安全,Go编程]
description: '本文介绍了GoFrame框架中的gmutex互斥锁，该锁支持并发读写控制，与标准库sync.RWMutex类似。其特点是包含Try*方法和*Func方法，用于非阻塞锁机制和特定作用域锁控制。通过示例代码展示了其便捷的使用方式，以及与标准库锁的基准测试对比，展示了其性能优势。适用于需要高效锁机制的并发编程场景。'
---

`gmutex.Mutex` 互斥锁对象支持读写控制，互斥锁功能逻辑与标准库 `sync.RWMutex` 类似，可并发读但不可并发写。

> 互斥锁的设计细节，推荐阅读轻量级高清版的实现源码： [https://github.com/gogf/gf/blob/master/os/gmutex/gmutex.go](https://github.com/gogf/gf/blob/master/os/gmutex/gmutex.go)

**使用方式**：

```go
import "github.com/gogf/gf/v2/os/gmutex"
```

**接口文档**：

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

1. 该互斥锁模块最大的特点是支持 `Try*` 方法以及 `*Func` 方法。
2. `Try*` 方法用于实现尝试获得特定类型的锁，如果获得锁成功则立即返回 `true`，否则立即返回 `false`，不会阻塞等待，这对于需要使用非阻塞锁机制的业务逻辑非常实用。
3. `*Func` 方法使用闭包匿名函数的方式实现特定作用域的并发安全锁控制，这对于特定代码块的并发安全控制特别方便，由于内部使用了 `defer` 来释放锁，因此即使函数内部产生异常错误，也不会影响锁机制的安全性控制。

### 基准测试

`gmutex.Mutex` 与标准库的 `sync.Mutex` 及 `sync.RWMutex` 的基准测试对比结果： [gmutex\_bench\_test.go](https://github.com/gogf/gf/v2/blob/master/os/gmutex/gmutex_bench_test.go)

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

### 示例1，基本使用

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

执行后，终端输出：

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

这里使用 `glog` 打印的目的，是可以方便地看到打印输出的时间。可以看到，在第3秒的时候，读锁抢占到了机会，由于 `gmutex.Mutex` 对象支持并发读但不支持并发写，因此读锁抢占后迅速执行完毕；而写锁依旧保持每秒打印一条日志继续执行。

### 示例2， `*Func` 使用

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

执行后，终端输出：

```html
2019-07-13 16:28:10.381 lock func1
2019-07-13 16:28:11.385 lock func2
```

可以看到，使用 `*Func` 方法实现特定作用域的锁控制非常方便。