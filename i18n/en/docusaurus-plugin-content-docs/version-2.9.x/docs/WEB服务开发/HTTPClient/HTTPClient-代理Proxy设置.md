---
slug: '/docs/web/http-client-proxy'
title: 'HTTPClient - Proxy'
sidebar_position: 7
hide_title: true
keywords: [GoFrame, GoFrame Framework, HTTP Client, Proxy Settings, SetProxy, Proxy Method, HTTP Proxy, SOCKS5 Proxy, Chained Call, HTTP Request]
description: "Set proxy server addresses in the HTTP client of GoFrame framework, supporting both http and socks5 forms. Users can easily configure proxies through SetProxy and Proxy methods to access external resources, including examples of normal calls and chained calls, helping users quickly master the use of proxy functions."
---

## Proxy `Proxy` Settings

When the HTTP client initiates a request, it can set the proxy server address `proxyURL`, which is implemented using `SetProxy*` related methods. The proxy mainly supports two forms: `http` and `socks5`, which are respectively in the form of `http://USER:PASSWORD@IP:PORT` or `socks5://USER:PASSWORD@IP:PORT`.

Method list:

```go
func (c *Client) SetProxy(proxyURL string)
func (c *Client) Proxy(proxyURL string) *Client
```

Let's look at an example of setting `proxyURL` with the client.

## Normal Call Example

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