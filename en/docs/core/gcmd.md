# Command

## Introduction

Programs need to manage program start entries through command lines, making command line management components one of the core components of the framework. The `GoFrame` framework provides a powerful command line management module, implemented by the `gcmd` component.

**Usage:**

```go
import "github.com/gogf/gf/v2/os/gcmd"
```

**API Documentation:**

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gcmd](https://pkg.go.dev/github.com/gogf/gf/v2/os/gcmd)

## Features

The `gcmd` component has the following notable features:

- Easy to use and powerful
- Flexible command line parameter management
- Support for flexible custom parsing through `Parser`
- Support for multi-level command line management and richer command line information
- Structured input/output management for large-scale command lines using object mode
- Automatic type conversion and validation for structured parameters
- Ability to read data from configuration components in a structured manner
- Automatic generation of command line help information
- Terminal input functionality support

## Comparison with `Cobra`

`Cobra` is a widely used command line management library in `Golang`. The open-source project can be found here: [https://github.com/spf13/cobra](https://github.com/spf13/cobra)

When compared to `Cobra`, the `gcmd` command line component of the `GoFrame` framework shows similarities in basic functions, but with significant differences in parameter management and observability support:

- The `gcmd` component supports structured parameter management with hierarchical object command line management, and method automatic generation without manual definition and parsing of parameter variables by developers.
- The `gcmd` component supports automated parameter type conversion for both basic and complex types.
- The `gcmd` component provides configurable common parameter validation capabilities to enhance parameter maintenance efficiency.
- The `gcmd` component allows reading parameters via configuration components when there are no terminal arguments.
- The `gcmd` component supports tracing to facilitate the transfer of trace information between parent and child processes.

## Documentation

Child pages:

- [Command - Concepts](https://goframe.org/en/docs/core/gcmd-intro.md)
- [Command - Methods](https://goframe.org/en/docs/core/gcmd-funcs.md)
- [Command - Args Parsing](https://goframe.org/en/docs/core/gcmd-parser.md)
- [Command - Object](https://goframe.org/en/docs/core/gcmd-command.md)
- [Command - Structure](https://goframe.org/en/docs/core/gcmd-struct.md)
- [Command - Interaction](https://goframe.org/en/docs/core/gcmd-scan.md)
- [Command - Tracing](https://goframe.org/en/docs/core/gcmd-tracing.md)

> Page: https://goframe.org/en/docs/core/gcmd
