# Cron Job

## Introduction

The `gcron` module provides the implementation of scheduled tasks, supporting a configuration management style similar to `crontab`, and manages scheduled tasks with a minimum granularity of `seconds`.

**Usage**:

```go
import "github.com/gogf/gf/v2/os/gcron"
```

**API Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gcron](https://pkg.go.dev/github.com/gogf/gf/v2/os/gcron)

**Brief Description**:

1. The `New` method is used to create a custom scheduled task management object.
2. The `Add` method is used to add scheduled tasks, where:
    - The `pattern` parameter uses `CRON syntax format` (for details, see the subsequent related description in this chapter).
    - The `job` parameter is the method (address) that needs to be executed.
    - The `name` is an optional parameter used to assign a **unique** name to the scheduled task. Note that if a task with the same name already exists, adding the scheduled task will fail.
3. The `AddSingleton` method is used to add singleton scheduled tasks, meaning only one copy of the task can run simultaneously (deduplication is performed in memory).
4. The `AddOnce` method is used to add scheduled tasks that run only once. When run once, the task automatically destroys itself.
5. The `AddTimes` method is used to add scheduled tasks that run a specified number of times. When run `times` times, the task automatically destroys itself.
6. The `Entries` method is used to obtain information on all currently registered scheduled tasks.
7. The `Remove` method is used to delete scheduled tasks by name (stop and delete).
8. The `Search` method is used to search scheduled tasks by name (returns the `*Entry` object pointer of the task).
9. The `Start` method is used to start a scheduled task (`Add` automatically starts the task). The `name` parameter can be specified to start the task.
10. The `Stop` method is used to stop a scheduled task (`Remove` stops and deletes). The `name` parameter can be specified to stop the task.
11. The `Close` method is used to close the custom scheduled task management object.

## Notes

- Influence of Global Timezone: Scheduled tasks strictly depend on time calculation, so the global timezone of the process greatly affects scheduled task execution. When adding scheduled tasks, pay attention to the global timezone settings of the current process. If no global timezone is set, the system timezone is used by default. For more information on timezone settings, please refer to: [Time - Time Zone](https://goframe.org/en/docs/components/os-gtime-timezone.md)

## Documentation

Child pages:

- [Cron Job - Expressions](https://goframe.org/en/docs/components/os-gcron-pattern.md)
- [Cron Job - Usage](https://goframe.org/en/docs/components/os-gcron-example.md)
- [Cron Job - Logging](https://goframe.org/en/docs/components/os-gcron-logging.md)
- [Cron Job](https://goframe.org/en/docs/components/os-gcron-differ-with-gtimer.md)

> Page: https://goframe.org/en/docs/components/os-gcron
