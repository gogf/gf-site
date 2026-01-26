---
slug: '/docs/components/os-gtimer'
title: 'Timer'
sidebar_position: 1
hide_title: true
keywords: [Timer, Concurrent Safe, High Performance, GoFrame, Task Scheduling, Delayed Tasks, Timeout Control, Frequency Control, Task Management, Singleton Mode]
description: "gtimer is a concurrent safe and high-performance timer suitable for scenarios with a large number of scheduled tasks and delayed tasks. It supports timeout control and frequency control. gtimer provides various task management methods, including adding singleton and run-once tasks, and allows customization of timer parameters."
---

## Introduction

`gtimer` is a concurrent safe and high-performance timer, similar to `Java`'s `Timer`. `gtimer` uses a **Priority Queue** to implement its core functionality.

**Use Cases**:

Any scenario involving scheduled tasks, scenarios with a large number of scheduled/delayed tasks, business scenarios that require timeout control/frequency control, or scenarios where the accuracy of the scheduled time is not strictly critical.

**How to Use:**

```go
import "github.com/gogf/gf/v2/os/gtimer"
```

**API Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gtimer](https://pkg.go.dev/github.com/gogf/gf/v2/os/gtimer)

**Brief Explanation:**

1. The `New` method is used to create a custom task timer object and can accept `TimerOptions` parameters upon creation, including:
    - `Interval` to specify the minimum `tick` time interval for the timer.
    - `Quick` to specify whether the timer should execute once upon start (default is `false`).
2. The `Add` method is used to add scheduled tasks, where:
    - The `interval` parameter specifies the execution time interval of the method.
    - The `job` parameter is the task method that needs to be executed.
3. The `AddEntry` method adds scheduled tasks, supporting more parameter controls.
4. The `AddSingleton` method is used to add **singleton** scheduled tasks, meaning **only one task can be running at the same time**.
5. The `AddOnce` method is used to add a task that runs only once and is automatically destroyed after running once.
6. The `AddTimes` method is used to add a task that runs a specified number of times and is automatically destroyed after running `times` times.
7. The `Search` method is used to search for scheduled tasks by name (returns the `*Entry` object pointer of the task).
8. The `Start` method is used to start the timer (the timer is automatically started when created using `New`).
9. The `Stop` method is used to stop the timer.
10. The `Close` method is used to close the timer.

## Default Timer

In most scenarios, the default timer can be used. When using the default timer of `gtimer`, the default detection interval is `100ms`, so the theoretical time interval error range is `0~100ms`. You can modify the parameters of the default timer using the following two methods:

1. Use startup parameters
   - `gf.gtimer.interval=50`: Change the default time scale to `50ms`
2. Use environment variables
   - `GF_GTIMER_INTERVAL=50`
:::warning
It should be noted that the shorter the default detection interval of the timer, the greater the CPU usage.
:::
## Precautions🔥

1. Since modern computers use software-implemented timers, **all timers have inaccuracies**. They will not be completely precise and may delay or even execute ahead of time, but they will not fail to execute. This is particularly noticeable in systems with large time intervals or high concurrency/high load. See the reference link: [https://github.com/golang/go/issues/14410](https://github.com/golang/go/issues/14410)
2. Since inaccuracies are inevitable, any timer implementation (not just framework timers, but also standard library timers) **will not use system time**. Instead, it uses a fixed `tick` interval. Do not use system time to judge intervals in the logic of timer tasks, as this judgment is meaningless.
3. Assuming no inaccuracies, the time interval does not consider the execution time of the task. For example, if a job takes `3` minutes to complete and is scheduled to run every `5` minutes, there will be only `2` minutes of idle time between each task.
4. It should be noted that **the execution time of singleton mode** scheduled tasks will affect the **start time** of the task's next execution. For example, if a task runs every `1` second and takes `1` second to execute, then after starting at **second 1**, the next task will start executing at **second 3** since a running check in between found the current task still running and thus exited waiting for the next execution check.

## Difference Between Timer and `gcron`

Please refer to the section [Cron Job](../定时任务-gcron/定时任务-gcron与gtimer.md)

## Documentation

import DocCardList from '@theme/DocCardList';

<DocCardList />