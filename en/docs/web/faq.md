# FAQ

## Frequent `context cancel` Errors on the Server Side

When the **client actively cancels a request** (for example, actively cancels, or the request exceeds the time set by the client), especially when a browser visit directly cancels the request, the server may encounter a `context canceled` error. This is a normal phenomenon, and the `Golang` standard library's `http server` is designed this way. When the client no longer needs the result of this request, it will cancel the request, and there is no point in the server continuing execution. If you mind this error, you can use a custom middleware to add handling logic for `NeverDoneCtx`. In this case, the server will ignore the client's cancellation request and continue execution.

```go
// MiddlewareNeverDoneCtx sets the context never done for current process.
func MiddlewareNeverDoneCtx(r *Request) {
    r.SetCtx(r.GetNeverDoneCtx())
    r.Middleware.Next()
}
```

> Page: https://goframe.org/en/docs/web/faq
