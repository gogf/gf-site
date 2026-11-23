# Context

## Introduction

The `gctx` component implements encapsulation of context operations to simplify trace tracing and the management of process initialization context objects.

## Common Methods

Here are just a few common methods; for other methods, please refer to the component API documentation or source code.

### `New`

Used to create a context object with trace tracing capabilities.

### `GetInitCtx`

Used in the startup process or init package methods to obtain the current process's context object with trace tracing capabilities, and also for transferring trace tracing information between processes.

> Page: https://goframe.org/en/docs/components/os-gctx
