---
slug: '/docs/components/os-gproc'
title: 'Process'
sidebar_position: 14
hide_title: true
keywords: [process management, inter-process communication, local socket, gproc module, GoFrame, shell commands, asynchronous execution, subprocess management, gogf, process resources]
description: "Methods for implementing process management and inter-process communication using the gproc module of the GoFrame framework. gproc uses local socket mechanisms for communication and provides various interfaces such as Shell, ShellExec, ShellRun to execute shell commands in different ways. With the help of goroutines, asynchronous execution can be achieved. In this document, you will learn how to use the Manager object for multi-subprocess management, as well as how to obtain and control specific process resources."
---

## Introduction
Process management and inter-process communication are implemented through the `gproc` module, where inter-process communication uses a local socket communication mechanism.

**Usage**:

```go
import "github.com/gogf/gf/v2/os/gproc"
```

**API Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gproc](https://pkg.go.dev/github.com/gogf/gf/v2/os/gproc)

**Brief Description**:

1. The `Manager` object is a process management object that can manage multiple subprocesses (the current executing process is the parent process) simultaneously;
2. `Process` is a process object, representing a specific execution or acquired process resource;
3. We can use `Shell`, `ShellExec`, `ShellRun` to execute shell commands:
   - `Shell` represents a native shell command execution method with custom input and output control;
   - `ShellExec` will return the output result content after executing the command;
   - `ShellRun` will directly output the return content to standard output after executing the command;
   - We can use `goroutine` to achieve asynchronous execution, such as: `go ShellRun(...)`, etc.

## Documentation

import DocCardList from '@theme/DocCardList';

<DocCardList />