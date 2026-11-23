# HTTPClient - Proxy

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

> Page: https://goframe.org/en/docs/web/http-client-proxy
