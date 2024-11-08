---
slug: '/docs/web/senior-same-site'
title: 'SameSite设置'
sidebar_position: 10
hide_title: true
keywords: [SameSite设置,GoFrame,cookie,chrome89,协议,跨站请求,http,secure,GoFrame框架,服务器配置]
description: '本文档介绍了如何在使用GoFrame框架构建的服务器中设置SameSite属性。通过详细的代码例子，您可以学习如何配置SameSite以确保cookie安全性，尤其是在chrome89及以上版本中处理不同协议的跨站请求。'
---

## SameSite 介绍

### 参考文档

[https://web.dev/samesite-cookies-explained/](https://web.dev/samesite-cookies-explained/)

[https://web.dev/samesite-cookie-recipes/](https://web.dev/samesite-cookie-recipes/)

[https://web.dev/schemeful-samesite/](https://web.dev/schemeful-samesite/)

### chrome89开始协议不同也属于跨站请求

[https://www.chromestatus.com/feature/5096179480133632](https://www.chromestatus.com/feature/5096179480133632)

## 如何设置？

```go
func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Cookie.SetHttpCookie(&http.Cookie{
            Name:     "test",
            Value:    "1234",
            Secure:   true,
            SameSite: http.SameSiteNoneMode,// 自定义samesite，配合secure一起使用
        })
    })
    s.SetAddr("127.0.0.1:8080")
    s.Run()
}
```