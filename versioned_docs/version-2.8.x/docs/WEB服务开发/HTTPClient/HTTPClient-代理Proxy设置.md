---
slug: '/docs/web/http-client-proxy'
title: 'HTTPClient-代理Proxy设置'
sidebar_position: 7
hide_title: true
keywords: [GoFrame,GoFrame框架,HTTP客户端,代理设置,SetProxy,Proxy方法,http代理,socks5代理,链式调用,HTTP请求]
description: '在GoFrame框架的HTTP客户端中设置代理服务器地址，支持http和socks5两种形式。通过SetProxy和Proxy方法，用户可以轻松配置代理，实现对外网资源的访问，包括普通调用示例和链式调用示例，帮助用户快速掌握代理功能的使用。'
---

## 代理 `Proxy` 设置

HTTP客户端发起请求时可以设置代理服务器地址 `proxyURL`，该该特性使用 `SetProxy*` 相关方法实现。代理主要支持 `http` 和 `socks5` 两种形式，分别为 `http://USER:PASSWORD@IP:PORT` 或 `socks5://USER:PASSWORD@IP:PORT` 形式。

方法列表：

```go
func (c *Client) SetProxy(proxyURL string)
func (c *Client) Proxy(proxyURL string) *Client
```

我们来看下客户端设置 `proxyURL` 的示例。

## 普通调用示例

使用 `SetProxy` 配置方法。

```go
client := g.Client()
client.SetProxy("http://127.0.0.1:1081")
client.SetTimeout(5 * time.Second)
response, err := client.Get(gctx.New(), "https://api.ip.sb/ip")
if err != nil {
    fmt.Println(err)
}
response.RawDump()
```

## 链式调用示例

使用 `Proxy` 链式方法。

```go
client := g.Client()
response, err := client.Proxy("http://127.0.0.1:1081").Get(gctx.New(), "https://api.ip.sb/ip")
if err != nil {
    fmt.Println(err)
}
fmt.Println(response.RawResponse())
```