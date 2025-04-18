---
title: 'PProf服务性能分析'
sidebar_position: 9
hide_title: true
---

`GoFrame` 框架的 `Web Server` 提供了非常强大和简便的服务性能分析功能，内部完美集成了 `pprof` 性能分析工具，可以在任何时候通过 `EnablePProf` 方法启用性能分析特性，并可自定义性能分析工具页面路由地址，不传递路由地址时，默认URI地址为 `/debug/pprof`。

## `PProf` 启用

`PProf` 特性的启用会对程序性能产生一定影响，具体影响程度需要根据当前业务场景在 `PProd` 启用前后进行对比。

### `EnablePProf`

我们来看一个简单的例子：

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "runtime"
)

func main() {
    runtime.SetMutexProfileFraction(1) // (非必需)开启对锁调用的跟踪
    runtime.SetBlockProfileRate(1)     // (非必需)开启对阻塞操作的跟踪

    s := g.Server()
    s.EnablePProf()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Writeln("哈喽世界！")
    })
    s.SetPort(8199)
    s.Run()
}
```

这个例子使用了 `s.EnablePProf()` 启用了性能分析，默认会自动注册以下几个路由规则：

```html
/debug/pprof/*action
/debug/pprof/cmdline
/debug/pprof/profile
/debug/pprof/symbol
/debug/pprof/trace
```

其中 `/debug/pprof/*action` 为页面访问的路由，其他几个地址为 `go tool pprof` 命令准备的。

### `StartPProfServer`

也可以使用 `StartPProfServer` 方法，快速开启一个独立的 `PProf Server`，常用于一些没有 `HTTP Server` 的常驻的进程中（例如定时任务、 `GRPC` 服务中），可以快速开启一个 `PProf Server` 用于程序性能分析。该方法的定义如下：

```go
func StartPProfServer(port int, pattern ...string)
```

一般的场景是使用异步 `goroutine` 运行该 `PProd Server`，即往往是这么来使用：

```go
package main

import (
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    go ghttp.StartPProfServer(8199)
    // 其他服务启动、运行
    // ...
}
```

以上示例可以改进为：

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    go ghttp.StartPProfServer(8299)

    s := g.Server()
    s.EnablePProf()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Writeln("哈喽世界！")
    })
    s.SetPort(8199)
    s.Run()
}
```

## `PProf` 指标

- `heap`: 报告内存分配样本；用于监视当前和历史内存使用情况，并检查内存泄漏。
- `threadcreate`: 报告了导致创建新OS线程的程序部分。
- `goroutine`: 报告所有当前 `goroutine` 的堆栈跟踪。
- `block`: 显示 `goroutine` 在哪里阻塞同步原语（包括计时器通道）的等待。默认情况下未启用，需要手动调用 `runtime.SetBlockProfileRate` 启用。
- `mutex`: 报告锁竞争。默认情况下未启用，需要手动调用 `runtime.SetMutexProfileFraction` 启用。

## `PProf` 页面

简单的性能分析我们直接访问 `/debug/pprof` 地址即可，内容如下：

1、 `pprof` 页面

![](/markdown/b6eba3aaefe6c5ada95351c6b8f6353c.png)

2、堆使用量

![](/markdown/7189fca139192714ffe0c98f95ef8d95.png)

3、当前进程中的 `goroutine` 详情

![](/markdown/f15e0cb78981c397886f5ff4536768b0.png)

## 性能采集分析

如果想要进行详细的性能分析，基本上离不开 `go tool pprof` 命令行工具的支持，在开启性能分析支持后，我们可以使用以下命令执行性能采集分析：

```bash
go tool pprof "http://127.0.0.1:8199/debug/pprof/profile"
```

执行后 `pprof` 工具经过约 `30` 秒左右的接口信息采集（这 `30` 秒期间 `WebServer` 应当有流量进入，我们这里不停地访问hello world页面以作测试），然后生成性能分析报告，随后可以通过 `top10`/ `web` 等pprof命令查看报告结果，更多命令可使用 `go tool pprof` 查看。关于 `pprof` 的详细使用介绍，请查看Golang官方： [blog.golang.org/profiling-go-programs](https://blog.golang.org/profiling-go-programs)

### CPU性能分析

本示例中的命令行性能分析结果如下：

```html
$ go tool pprof "http://127.0.0.1:8199/debug/pprof/profile"
Fetching profile over HTTP from http://127.0.0.1:8199/debug/pprof/profile
Saved profile in /home/john/pprof/pprof.___go_build_pprof_go.samples.cpu.001.pb.gz
File: ___go_build_pprof_go
Type: cpu
Time: Apr 17, 2018 at 10:53pm (CST)
Duration: 30s, Total samples = 80ms ( 0.27%)
Entering interactive mode (type "help" for commands, "o" for options)
(pprof) top10
Showing nodes accounting for 80ms, 100% of 80ms total
Showing top 10 nodes out of 49
      flat  flat%   sum%        cum   cum%
      10ms 12.50% 12.50%       10ms 12.50%  github.com/gogf/gf/v2/net/ghttp.(*Cookie).Get /home/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/http_server_cookie.go
      10ms 12.50% 25.00%       10ms 12.50%  internal/poll.runtime_pollReset /home/john/Softs/go1.9.2/src/runtime/netpoll.go
      10ms 12.50% 37.50%       10ms 12.50%  runtime.futex /home/john/Softs/go1.9.2/src/runtime/sys_linux_amd64.s
      10ms 12.50% 50.00%       10ms 12.50%  runtime.getitab /home/john/Softs/go1.9.2/src/runtime/iface.go
      10ms 12.50% 62.50%       10ms 12.50%  runtime.newarray /home/john/Softs/go1.9.2/src/runtime/slice.go
      10ms 12.50% 75.00%       10ms 12.50%  runtime.rawstringtmp /home/john/Softs/go1.9.2/src/runtime/string.go
      10ms 12.50% 87.50%       10ms 12.50%  runtime.usleep /home/john/Softs/go1.9.2/src/runtime/sys_linux_amd64.s
      10ms 12.50%   100%       10ms 12.50%  sync.(*RWMutex).Lock /home/john/Softs/go1.9.2/src/sync/rwmutex.go
         0     0%   100%       10ms 12.50%  bufio.(*Writer).Flush /home/john/Softs/go1.9.2/src/bufio/bufio.go
         0     0%   100%       10ms 12.50%  github.com/gogf/gf/v2/container/gqueue.(*Queue).PopFront /home/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/container/gqueue/gqueue.go
(pprof) web
Failed to execute dot. Is Graphviz installed? Error: exec: "dot": executable file not found in $PATH
(pprof) web
(pprof)
```

其中 `web` 命令用以图形展示接口之间的调用关系以及性能情况，但是需要安装 `Graphviz` 图形化工具，以我目前的系统为 `Ubuntu` 为例，直接执行 `sudo apt-get install graphviz` 命令即可安装完成图形化工具（如果是 `MacOS`，使用 `brew install Graphviz` 安装），随后再次使用 `web` 命令，最终生成以下图表：

![](/markdown/c0d6d6e1d63b99c523121acf80d62432.png)

### 内存使用分析

与CPU性能分析类似，内存使用分析同样使用到 `go tool pprof` 命令：

```bash
$ go tool pprof http://127.0.0.1:8299/debug/pprof/heap
Fetching profile over HTTP from http://127.0.0.1:8299/debug/pprof/heap
Saved profile in /Users/john/pprof/pprof.alloc_objects.alloc_space.inuse_objects.inuse_space.004.pb.gz
Type: inuse_space
Time: May 24, 2021 at 8:01pm (CST)
Entering interactive mode (type "help" for commands, "o" for options)
(pprof) top
Showing nodes accounting for 1536.39kB, 100% of 1536.39kB total
Showing top 10 nodes out of 19
      flat  flat%   sum%        cum   cum%
  512.19kB 33.34% 33.34%   512.19kB 33.34%  runtime.malg
  512.14kB 33.33% 66.67%   512.14kB 33.33%  github.com/gogf/gf/v2/container/gmap.(*StrAnyMap).doSetWithLockCheck
  512.06kB 33.33%   100%   512.06kB 33.33%  net.newFD (inline)
         0     0%   100%   512.14kB 33.33%  github.com/gogf/gf/v2/container/gmap.(*StrAnyMap).GetOrSetFuncLock
         0     0%   100%   512.06kB 33.33%  github.com/gogf/gf/v2/net/ghttp.(*Server).startServer.func1
         0     0%   100%   512.06kB 33.33%  github.com/gogf/gf/v2/net/ghttp.(*gracefulServer).ListenAndServe
         0     0%   100%   512.06kB 33.33%  github.com/gogf/gf/v2/net/ghttp.(*gracefulServer).doServe
         0     0%   100%   512.14kB 33.33%  github.com/gogf/gf/v2/os/gres.Instance
         0     0%   100%   512.14kB 33.33%  github.com/gogf/gf/v2/os/gres.init
         0     0%   100%   512.06kB 33.33%  net.(*TCPListener).Accept
(pprof) web
(pprof)
```

通过 `web` 图形展示，类似这样的：

![](/markdown/a38310ea1ad818c131b801c4e99f4849.png)