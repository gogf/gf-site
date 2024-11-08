---
slug: '/docs/components/os-gcron-differ-with-gtimer'
title: '定时任务-gcron与gtimer'
sidebar_position: 3
hide_title: true
keywords: [GoFrame,GoFrame框架,定时任务,gcron,gtimer,性能模块,crontab,时间间隔,TCP通信,游戏开发]
description: '本文档介绍了GoFrame框架中定时任务模块gcron与定时器模块gtimer的区别。gtimer是高性能模块，适用于各种定时任务场景，包括TCP通信和游戏开发。gcron支持crontab语法，基于gtimer实现，为用户提供了便捷的定时任务管理方式。'
---

## `gcron` 与 `gtimer` 区别

[定时任务-gcron](定时任务-gcron.md) 与 [定时器-gtimer](../定时器-gtimer/定时器-gtimer.md) 区别:

- `gtimer` 属于高性能模块，是框架核心模块，构建任何定时任务的基础，任何方法操作耗时均在 `纳秒` 级别。
- `gtimer` 可适用于任何的定时任务场景中，例如: TCP通信、游戏开发等场景。
- `gcron` 支持经典的 `crontab` 形式的定时任务语法，最小时间设定间隔为 `秒`。
- `gcron` 底层实现基于 `gtimer`。

| 相似模块 | 说明 | 性能 | 类Linux Crontab模式 | 底层实现 |
| --- | --- | --- | --- | --- |
| [定时任务-gcron](定时任务-gcron.md) | 定时任务。<br />较上层封装，时间刻度以自然秒为单位。 | 一般 | 支持 | 基于 `gtimer` |
| [定时器-gtimer](../定时器-gtimer/定时器-gtimer.md) | 定时器。<br />底层组件，时间刻度以时间槽为单位（时间槽可自定义）。 | 高效 | 不支持 | 基于 `PriorityQueue` 数据结构自实现 |