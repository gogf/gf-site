# Logging - FAQ

## How to print the stack of an `error` variable rather than the stack at the time the log method is called

Using the following method will only print the string description of the `error`, and the stack is just the stack at the time the log method `Error` is called:

```go
g.Log().Error(ctx, err)
```

If you want to print the stack of the `error` variable, and not the stack when the `Error` method is called, you can do it as follows:

```go
g.Log().Printf(ctx, "%+v", err)
```

Reference links:

- [https://github.com/gogf/gf/issues/1640](https://github.com/gogf/gf/issues/1640)
- [Error Handling - Other Features](https://goframe.org/en/docs/core/gerror-other.md)

> Page: https://goframe.org/en/docs/core/glog-faq
