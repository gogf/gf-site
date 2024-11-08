---
slug: '/docs/components/os-gproc'
title: '进程管理-gproc'
sidebar_position: 14
hide_title: true
keywords: [进程管理,进程间通信,本地socket,gproc模块,GoFrame,Shell指令,异步执行,子进程管理,gogf,进程资源]
description: '本文档介绍了通过GoFrame框架的gproc模块实现进程管理和进程间通信的方法。gproc使用本地socket机制进行通信，提供了多种接口如Shell、ShellExec、ShellRun以不同方式执行Shell命令，可以借助goroutine实现异步执行。在本文档中，您将了解到如何使用Manager对象进行多子进程管理，以及如何获取和控制特定的进程资源。'
---


## 基本介绍
进程管理以及进程间的通信是通过 `gproc` 模块实现的，其中进程间通信采用的是本地socket通信机制。

**使用方式**：

```go
import "github.com/gogf/gf/v2/os/gproc"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gproc](https://pkg.go.dev/github.com/gogf/gf/v2/os/gproc)

**简要说明：**

1. `Manager` 对象为进程管理对象，可以同时管理多个子进程(当前执行进程为父进程)；
2. `Process` 为进程对象，表示特定执行或者获取的一个进程资源；
3. 我们可以通过 `Shell`、 `ShellExec`、 `ShellRun` 来执行Shell指令：
   - `Shell` 表示一个原生的Shell指令执行方式，带自定义的输入和输出控制；
   - `ShellExec` 执行命令后将会返回输出的结果内容；
   - `ShellRun` 执行命令后将会直接将返回内容输出到标准输出；
   - 我们可以使用 `goroutine` 来实现异步的执行，如： `go ShellRun(...)` 等等；


## 相关文档

import DocCardList from '@theme/DocCardList';

<DocCardList />