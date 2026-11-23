# Cron Job

## Difference between `gcron` and `gtimer`

Differences between [Cron Job](https://goframe.org/en/docs/components/os-gcron.md) and [Timer](https://goframe.org/en/docs/components/os-gtimer.md):

- `gtimer` is a high-performance module, a core framework module, serving as the foundation for building any scheduled task, with method operation times measured in `nanoseconds`.
- `gtimer` is applicable in any scheduled task scenario, such as TCP communication, game development, etc.
- `gcron` supports the classic `crontab` syntax for scheduled tasks, with a minimum time setting interval of `seconds`.
- `gcron` is implemented based on `gtimer`.

| Similar Module | Description | Performance | Linux-like Crontab Pattern | Underlying Implementation |
| --- | --- | --- | --- | --- |
| [Cron Job](https://goframe.org/en/docs/components/os-gcron.md) | Scheduled task.<br />Higher-level encapsulation, time scale in natural seconds. | General | Supported | Based on `gtimer` |
| [Timer](https://goframe.org/en/docs/components/os-gtimer.md) | Timer.<br />Low-level component, time scale in terms of time slots (customizable). | Efficient | Not supported | Custom implementation based on `PriorityQueue` data structure |

> Page: https://goframe.org/en/docs/components/os-gcron-differ-with-gtimer
