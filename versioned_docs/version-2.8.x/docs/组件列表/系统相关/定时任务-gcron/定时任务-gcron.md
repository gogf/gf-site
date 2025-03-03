---
slug: '/docs/components/os-gcron'
title: '定时任务-gcron'
sidebar_position: 7
hide_title: true
keywords: [GoFrame,GoFrame框架,gcron,定时任务,crontab,CRON语法,任务管理,编程接口,框架教程,Go语言]
description: 'GoFrame框架中gcron模块的使用，提供类似crontab的定时任务管理功能，支持秒级管理。介绍了如何创建、添加、管理和删除定时任务，并强调了全局时区对定时任务执行的影响，适用于需要编写定时任务的开发者。'
---

## 基本介绍

`gcron` 模块提供了对定时任务的实现，支持类似 `crontab` 的配置管理方式，并支持最小粒度到 `秒` 的定时任务管理。

**使用方式**：

```go
import "github.com/gogf/gf/v2/os/gcron"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gcron](https://pkg.go.dev/github.com/gogf/gf/v2/os/gcron)

**简要说明：**

1. `New` 方法用于创建自定义的定时任务管理对象。
2. `Add` 方法用于添加定时任务，其中：
    - \- `pattern` 参数使用 `CRON语法格式`(具体说明见本章后续相关说明)。
    - \- `job` 参数为需要执行的任务方法(方法地址)。
    - \- `name` 为非必需参数，用于给定时任务指定一个 **唯一的** 名称，注意如果已存在相同名称的任务，那么添加定时任务将会失败。
3. `AddSingleton` 方法用于添加单例定时任务，即同时只能有一个该任务正在运行（在内存中进行去重判断）。
4. `AddOnce` 方法用于添加只运行一次的定时任务，当运行一次数后该定时任务自动销毁。
5. `AddTimes` 方法用于添加运行指定次数的定时任务，当运行 `times` 次数后该定时任务自动销毁。
6. `Entries` 方法用于获取当前所有已注册的定时任务信息。
7. `Remove` 方法用于根据名称删除定时任务(停止并删除)。
8. `Search` 方法用于根据名称进行定时任务搜索(返回定时任务 `*Entry` 对象指针)。
9. `Start` 方法用于启动定时任务( `Add` 后自动启动定时任务), 可通过 `name` 参数指定需要启动的任务名称。
10. `Stop` 方法用于停止定时任务( `Remove` 会停止并删除), 可通过 `name` 参数指定需要停止的任务名称。
11. `Close` 方法用于关闭自定义的定时任务管理对象。

## 注意事项

- 进程全局时区的影响：由于定时任务严格依赖时间计算，因此进程的全局时区对定时任务执行影响比较大。在添加定时任务时，请注意当前进程的全局时区设置，在没有设置全局时区时，默认使用的是系统时区。关于时区设置更多信息请参考： [时间管理-时区设置](../时间管理-gtime/时间管理-时区设置.md)

## 相关文档
import DocCardList from '@theme/DocCardList';

<DocCardList />