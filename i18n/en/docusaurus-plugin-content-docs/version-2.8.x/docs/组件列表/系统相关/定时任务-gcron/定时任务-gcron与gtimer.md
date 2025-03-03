---
slug: '/docs/components/os-gcron-differ-with-gtimer'
title: 'Cron Job'
sidebar_position: 3
hide_title: true
keywords: [GoFrame,GoFrame Framework,Scheduled Task,gcron,gtimer,Performance Module,crontab,Time Interval,TCP Communication,Game Development]
description: "The difference between the scheduled task module gcron and the timer module gtimer in the GoFrame framework. gtimer is a high-performance module suitable for various scheduling scenarios, including TCP communication and game development. gcron supports crontab syntax, built on gtimer, providing users with a convenient way to manage scheduled tasks."
---

## Difference between `gcron` and `gtimer`

Differences between [Cron Job](定时任务-gcron.md) and [Timer](../定时器-gtimer/定时器-gtimer.md):

- `gtimer` is a high-performance module, a core framework module, serving as the foundation for building any scheduled task, with method operation times measured in `nanoseconds`.
- `gtimer` is applicable in any scheduled task scenario, such as TCP communication, game development, etc.
- `gcron` supports the classic `crontab` syntax for scheduled tasks, with a minimum time setting interval of `seconds`.
- `gcron` is implemented based on `gtimer`.

| Similar Module | Description | Performance | Linux-like Crontab Pattern | Underlying Implementation |
| --- | --- | --- | --- | --- |
| [Cron Job](定时任务-gcron.md) | Scheduled task.<br />Higher-level encapsulation, time scale in natural seconds. | General | Supported | Based on `gtimer` |
| [Timer](../定时器-gtimer/定时器-gtimer.md) | Timer.<br />Low-level component, time scale in terms of time slots (customizable). | Efficient | Not supported | Custom implementation based on `PriorityQueue` data structure |