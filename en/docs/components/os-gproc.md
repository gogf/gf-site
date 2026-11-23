# Process

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

Child pages:

- [Process - Usage](https://goframe.org/en/docs/components/os-gproc-example.md)
- [Process - Communication](https://goframe.org/en/docs/components/os-gproc-communication-between-processes.md)
- [Process - Signal](https://goframe.org/en/docs/components/os-gproc-signal.md)
- [Process - Tracing](https://goframe.org/en/docs/components/os-gproc-tracing.md)

> Page: https://goframe.org/en/docs/components/os-gproc
