# SameSite

## Introduction to SameSite

### Reference Documents

[https://web.dev/samesite-cookies-explained/](https://web.dev/samesite-cookies-explained/)

[https://web.dev/samesite-cookie-recipes/](https://web.dev/samesite-cookie-recipes/)

[https://web.dev/schemeful-samesite/](https://web.dev/schemeful-samesite/)

### Beginning with Chrome89, different protocols are also considered cross-site requests

[https://www.chromestatus.com/feature/5096179480133632](https://www.chromestatus.com/feature/5096179480133632)

## How to Set?

```go
func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Cookie.SetHttpCookie(&http.Cookie{
            Name:     "test",
            Value:    "1234",
            Secure:   true,
            SameSite: http.SameSiteNoneMode,// Custom SameSite, used together with secure
        })
    })
    s.SetAddr("127.0.0.1:8080")
    s.Run()
}
```

> Page: https://goframe.org/en/docs/web/senior-same-site
