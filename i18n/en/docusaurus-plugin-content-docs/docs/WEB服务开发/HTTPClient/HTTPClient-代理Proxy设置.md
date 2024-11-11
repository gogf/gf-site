---
slug: '/docs/web/http-client-proxy'
title: 'HTTPClient - Proxy Settings'
sidebar_position: 7
hide_title: true
keywords: [GoFrame, GoFrame Framework, HTTP Client, Proxy Settings, SetProxy, Proxy Method, HTTP Proxy, SOCKS5 Proxy, Chained Calls, HTTP Requests]
description: 'This document explains how to set up a proxy server address for the HTTP client in the GoFrame framework, supporting both HTTP and SOCKS5 formats. With the SetProxy and Proxy methods, users can easily configure proxies to access external resources, including examples of both regular and chained calls, helping users to quickly master the proxy functionality.'
---

## Proxy Settings

When initiating a request, an HTTP client can set a proxy server address using `proxyURL`. This feature is implemented using relevant `SetProxy*` methods. The proxies mainly support `http` and `socks5` formats, represented as `http://USER:PASSWORD@IP:PORT` or `socks5://USER:PASSWORD@IP:PORT`.

List of methods:

```go
func (c *Client) SetProxy(proxyURL string)
func (c *Client) Proxy(proxyURL string) *Client
```

Let's look at examples of setting `proxyURL` for the client.

## Regular Call Example

Using the `SetProxy` configuration method.

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

## Chained Call Example

Using the `Proxy` chained method.

```go
client := g.Client()
response, err := client.Proxy("http://127.0.0.1:1081").Get(gctx.New(), "https://api.ip.sb/ip")
if err != nil {
    fmt.Println(err)
}
fmt.Println(response.RawResponse())
```