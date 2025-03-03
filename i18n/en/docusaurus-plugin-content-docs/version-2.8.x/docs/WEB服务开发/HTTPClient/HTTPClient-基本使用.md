---
slug: '/docs/web/http-client-example'
title: 'HTTPClient - Examples'
sidebar_position: 0
hide_title: true
keywords: [HTTP,GoFrame,GoFrame framework,HTTP client,GET request,POST request,JSON data,DELETE request,ghttp client,network request]
description: "Use the GoFrame framework to send GET, POST, DELETE requests through basic HTTP client operations and process the return values. This article also discusses how to send JSON data with the POST method, use multiple parameters, and map type parameters for requests. Additionally, it provides a brief introduction to *Bytes, *Content, and *Var methods to help developers handle HTTP requests and responses more conveniently."
---

The most basic usage of an `HTTP` client is to send requests using several operation methods named after the `HTTP Method`. **It's important to note that the resulting object returned needs to execute `Close` to prevent memory overflow**. Let's look at some simple examples of `HTTP` client requests.

## Sending a `GET` request and printing the return value

```go
if r, err := g.Client().Get(ctx, "https://goframe.org"); err != nil {
    panic(err)
}
defer r.Close()
fmt.Println(r.ReadAllString())
```

## Sending a `GET` request to download a remote file

```go
if r, err := g.Client().Get(ctx, "https://goframe.org/cover.png"); err != nil {
    panic(err)
}
defer r.Close()
gfile.PutBytes("/Users/john/Temp/cover.png", r.ReadAll())
```

Downloading a file is very simple for small files. It's worth noting that if the remote file is quite large, the server will return data in batches. Thus, the client will need to make multiple `GET` requests, each time requesting the batch file range length through the `Header`. Those interested can research the relevant details.

## Sending a `POST` request and printing the return value

```go
if r, err := g.Client().Post(ctx, "http://127.0.0.1:8199/form", "name=john&age=18"); err != nil {
    panic(err)
}
defer r.Close()
fmt.Println(r.ReadAllString())
```

When passing multiple arguments, users can use the `&` symbol to connect them. Note that parameter values often need to be encoded using `gurl.Encode`.

## Sending a `POST` request with parameters as a `map` type and printing the return value

```go
if r, err := g.Client().Post(
    ctx,
    "http://127.0.0.1:8199/form",
    g.Map{
        "submit"   : "1",
        "callback" : "http://127.0.0.1/callback?url=http://baidu.com",
    }
)); err != nil {
    panic(err)
}
defer r.Close()
fmt.Println(r.ReadAllString())
```

When passing multiple arguments, users can use the `&` symbol to connect them or directly use `map` (**as previously mentioned, any data type is supported, including `struct`**).

## Sending a `POST` request with parameters as `JSON` data and printing the return value

```go
if r, err := g.Client().Post(
    ctx,
    "http://user.svc/v1/user/create",
    `{"passport":"john","password":"123456","password-confirm":"123456"}`,
); err != nil {
    panic(err)
}
defer r.Close()
fmt.Println(r.ReadAllString())
```

As you can see, it's very convenient to send `JSON` data requests via the `ghttp` client, simply by using the `Post` method to submit. When `ContentType` is not explicitly set, the client will automatically recognize the parameter type and set the request's `Content-Type` to `application/json`.

## Sending a `DELETE` request and printing the return value

```go
if r, err := g.Client().Delete(ctx, "http://user.svc/v1/user/delete/1", "10000"); err != nil {
    panic(err)
}
defer r.Close()
fmt.Println(r.ReadAllString())
```

## `*Bytes` and `*Content` Methods

Request methods ending with the `Bytes` and `Content` suffix are **shortcut methods** for directly obtaining the return content. These methods will automatically read the content returned by the server **and automatically close the request connection**. The `*Bytes` methods are used to obtain results of type `[]byte`, while the `*Content` methods get results of type `string`. **It's important to note that if the request execution fails, the returned content will be empty.**

## Sending a `GET` request and printing the return value

```go
// The returned content is of type []byte
content := g.Client().GetBytes(ctx, "https://goframe.org")
```

```go
// The returned content is of type string
content := g.Client().GetContent(ctx, "https://goframe.org")
```

## Sending a `POST` request and printing the return value

```go
// The returned content is of type []byte
content := g.Client().PostBytes(
    ctx,
    "http://user.svc/v1/user/create",
    `{"passport":"john","password":"123456","password-confirm":"123456"}`,
)
```

```go
// The returned content is of type string
content := g.Client().PostContent(
    ctx,
    "http://user.svc/v1/user/create",
    `{"passport":"john","password":"123456","password-confirm":"123456"}`,
)
```

## `*Var` Method

Request methods ending with the `Var` suffix directly request and obtain `HTTP` API results as the generic type `g.Var`, **making it easy to execute type conversions, especially converting request results into struct objects**. It is generally used when the server returns data in `JSON/XML` format. By leveraging the returned `g.Var` generic object, you can perform automatic parsing based on your needs. Moreover, if the request fails or the request result is empty, an empty `g.Var` generic object will be returned, ensuring it doesn't affect the conversion method invocation.

Example usage:

```go
type User struct {
    Id   int
    Name string
}
```

```go
// For a struct
var user *User
g.Client().GetVar(ctx, url).Scan(&user)
```

```go
// For an array of structs
var users []*User
g.Client().GetVar(ctx, url).Scan(&users)
```