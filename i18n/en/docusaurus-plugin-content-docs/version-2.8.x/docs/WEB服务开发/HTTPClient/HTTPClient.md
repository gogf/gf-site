---
slug: '/docs/web/http-client'
title: 'HTTPClient'
sidebar_position: 9
hide_title: true
keywords: [GoFrame,GoFrame Framework,HTTP Client,gclient,HTTP Request,Chain Operations,HTTP Methods,Custom Requests,Connection Pool,Return Objects]
description: "The powerful HTTP client component gclient provided by the GoFrame framework supports convenient chain operations for HTTP requests. The client supports custom request settings and return object operations, with detailed instructions on setting parameters such as timeout, Cookie, Header, etc."
---

## Introduction

The `GoFrame` framework offers a powerful and easy-to-use `HTTP` client, implemented by the `gclient` component. Object creation can be done through the package method `gclient.New()` or by calling the `g.Client()` method. It is recommended to use `g.Client()` to conveniently create an `HTTP` client object. Since `gclient.Client` is internally extended from the standard library's `http.Client` object, any features present in `http.Client` are also supported by `gclient.Client`.

**Method List**: [https://pkg.go.dev/github.com/gogf/gf/v2/net/gclient](https://pkg.go.dev/github.com/gogf/gf/v2/net/gclient)

**Brief Explanation**:

1. You can use `New` to create a custom HTTP client object `Client`, which can then be used to execute requests. This object employs a connection pool design internally, so it does not have a `Close` method. An `HTTP` client object can also be created via the `g.Client()` shortcut method.
2. The client provides a series of methods named after `HTTP Methods`. Invoking these methods will initiate the corresponding `HTTP Method` requests. The commonly used methods are `Get` and `Post`, while `DoRequest` is the core request method that users can call to implement custom `HTTP Method` requests.
3. The result of the request is a `*ClientResponse` object. You can obtain the corresponding return results through this object. The `ReadAll`/`ReadAllString` methods can be used to obtain the returned content. After use, this object needs to be closed through the `Close` method to prevent memory overflow.
4. The `*Bytes` method is used to obtain the binary data returned by the server. If the request fails, it returns `nil`; the `*Content` method is used to request string result data. If the request fails, it returns an empty string; the `Set*` method is for setting parameters of the `Client`.
5. The `*Var` method directly requests and retrieves HTTP API results as a generic type for easy conversion. If the request fails or the request result is empty, an empty `g.Var` generic object is returned, which does not affect the invocation of conversion methods.
6. As can be seen, the data parameter `data` for the client's request parameters is of the `interface{}` type, meaning any data type can be passed. Common parameter data types are `string`/`map`. If the parameter is of `map` type, the parameter value will be automatically `urlencode` encoded.

:::warning
Please use the given methods to create a `Client` object, and do not use `new(ghttp.Client)` or `&ghttp.Client{}` to create a client object, otherwise, hmm.
:::
## Chain Operations

The client in the `GoFrame` framework supports convenient chain operations. The commonly used methods are as follows (the document method list may lag behind the source code, so it is recommended to check the API documentation or source code [https://pkg.go.dev/github.com/gogf/gf/v2/net/gclient](https://pkg.go.dev/github.com/gogf/gf/v2/net/gclient)):

```go
func (c *Client) Timeout(t time.Duration) *Client
func (c *Client) Cookie(m map[string]string) *Client
func (c *Client) Header(m map[string]string) *Client
func (c *Client) HeaderRaw(headers string) *Client
func (c *Client) ContentType(contentType string) *Client
func (c *Client) ContentJson() *Client
func (c *Client) ContentXml() *Client
func (c *Client) BasicAuth(user, pass string) *Client
func (c *Client) Retry(retryCount int, retryInterval time.Duration) *Client
func (c *Client) Prefix(prefix string) *Client
func (c *Client) Proxy(proxyURL string) *Client
func (c *Client) RedirectLimit(redirectLimit int) *Client
func (c *Client) Dump(dump ...bool) *Client
func (c *Client) Use(handlers ...HandlerFunc) *Client
```

Brief Explanation:

1. The `Timeout` method is used to set the current request timeout.
2. The `Cookie` method is used to set custom `Cookie` information for the current request.
3. The `Header*` methods are used to set custom `Header` information for the current request.
4. The `Content*` methods are used to set the `Content-Type` information for the current request, and they support automatically checking submitted parameters and encoding according to this information.
5. The `BasicAuth` method is used to set the `HTTP Basic Auth` validation information.
6. The `Retry` method is used to set the number of retries and retry interval after a request failure.
7. The `Proxy` method is used to set up an http access proxy.
8. The `RedirectLimit` method is used to limit the number of redirect hops.

## Return Objects

`gclient.Response` is the corresponding return result object of an HTTP request, which inherits from `http.Response` and can use all methods of `http.Response`. It also adds the following methods:

```go
func (r *Response) GetCookie(key string) string
func (r *Response) GetCookieMap() map[string]string
func (r *Response) Raw() string
func (r *Response) RawDump()
func (r *Response) RawRequest() string
func (r *Response) RawResponse() string
func (r *Response) ReadAll() []byte
func (r *Response) ReadAllString() string
func (r *Response) Close() error
```

It should be noted that `Response` requires a manual call to the `Close` method to close it. This means that regardless of whether you use the returned `Response` object or not, you need to assign this return object to a variable and manually call its `Close` method for closure (often using `defer r.Close()`), otherwise, it will cause file handle overflow and memory overflow.

## Important Notes

1. The `ghttp` client defaults to disabling the `KeepAlive` feature and the verification function for the server's `TLS` certificate. If you need to enable it, you can customize the client's `Transport` attribute.
2. These advanced functions such as **Connection Pool Parameter Setting** and **Connection Proxy Settings** can also be achieved by customizing the client's `Transport` attribute. This data inherits from the standard library's `http.Transport` object.

## Documentation

import DocCardList from '@theme/DocCardList';

<DocCardList />