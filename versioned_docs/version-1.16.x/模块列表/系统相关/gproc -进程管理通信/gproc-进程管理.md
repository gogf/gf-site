---
title: 'gproc-进程管理'
sidebar_position: 0
hide_title: true
---

## 执行Shell命令

```go
package main

import (
    "github.com/gogf/gf/os/gproc"
    "fmt"
)

func main () {
    r, err := gproc.ShellExec(`sleep 3s; echo "hello gf!";`)
    fmt.Println("result:", r)
    fmt.Println(err)
}

```

执行后，可以看到程序等待了3秒之后，输出结果为：

```html
result: hello gf!

<nil>

```

## 主进程与子进程

由 `gproc.Manager` 对象创建的进程都默认带子进程标识，在子进程程序中可以通过 `gproc.IsChild()` 方法来判断自身是否为子进程。

```go
package main

import (
    "os"
    "time"
    "github.com/gogf/gf/os/glog"
    "github.com/gogf/gf/os/gproc"
)

func main () {
    if gproc.IsChild() {
        glog.Printf("%d: Hi, I am child, waiting 3 seconds to die", gproc.Pid())
        time.Sleep(time.Second)
        glog.Printf("%d: 1", gproc.Pid())
        time.Sleep(time.Second)
        glog.Printf("%d: 2", gproc.Pid())
        time.Sleep(time.Second)
        glog.Printf("%d: 3", gproc.Pid())
    } else {
        m := gproc.NewManager()
        p := m.NewProcess(os.Args[0], os.Args, os.Environ())
        p.Start()
        p.Wait()
        glog.Printf("%d: child died", gproc.Pid())
    }
}

```

执行后，终端打印结果如下：

```shell
2018-05-18 14:35:41.360 28285: Hi, I am child, waiting 3 seconds to die
2018-05-18 14:35:42.361 28285: 1
2018-05-18 14:35:43.361 28285: 2
2018-05-18 14:35:44.361 28285: 3
2018-05-18 14:35:44.362 28278: child died

```

## 多进程管理

`gproc` 除了能够创建子进程，管理子进程之外，也能管理非自身创建的其他进程。 `gproc` 可以同时管理多个进程，这里以单个进程为例来演示对进程的管理功能。

1. 我们使用 `gedit` 软件(Linux下常用的文本编辑器)随意打开一个文件，在进程当中我们看到该gedit的进程ID为 `28536`




```shell
    $ ps aux | grep gedit
    john  28536  3.6  0.6 946208 56412 ?  Sl  14:39  0:00 gedit /home/john/Documents/text
```

2. 我们的程序如下：




```go
package main


import (
       "fmt"
       "github.com/gogf/gf/os/gproc"
)


func main () {
       pid := 28536
       m   := gproc.NewManager()
       m.AddProcess(pid)
       m.KillAll()
       m.WaitAll()
       fmt.Printf("%d was killed\n", pid)
}

```


执行后， `gedit` 被关闭，终端输出信息为：




```shell
28536 was killed

```