---

slug: '/docs/web/http-client-example'
title: 'HTTPClient Basic Usage'
sidebar_position: 0
hide_title: true
keywords: [HTTP, GoFrame, GoFrame Framework, HTTP Client, GET Request, POST Request, JSON Data, DELETE Request, ghttp Client, Network Request]
description: 'This article introduces how to use the GoFrame framework to send GET, POST, and DELETE requests through basic HTTP client operations and handle the return values. It also discusses how to send JSON data using the POST method, use multiple parameters, and use map-type parameters for requests. Additionally, it provides a brief introduction to the *Bytes, *Content, and *Var methods to help developers conveniently handle HTTP requests and response content.'

---

## Basic Usage

The most basic HTTP client usage is to send requests through several operation methods named after the HTTP Method. **However, it is important to note that the returned result object requires executing `Close` to prevent memory overflow**. Let's see a few simple examples of HTTP client requests.

### Sending a GET Request and Printing Out the Return Value

```go
if r, err := g.Client().Get(ctx, "https://goframe.org"); err != nil {
    panic(err)
}
defer r.Close()
fmt.Println(r.ReadAllString())
```

### Sending a GET Request to Download a Remote File

```go
if r, err := g.Client().Get(ctx, "https://goframe.org/cover.png"); err != nil {
    panic(err)
}
defer r.Close()
gfile.PutBytes("/Users/john/Temp/cover.png", r.ReadAll())
```

For downloading files, downloading small files is very simple. It is worth noting that if the remote file is relatively large, the server will return data in batches. Therefore, the client will need to send multiple GET requests by requesting the file range length in batches through the Header. Those interested can research the relevant details themselves.

### Sending a POST Request and Printing Out the Return Value

```go
if r, err := g.Client().Post(ctx, "http://127.0.0.1:8199/form", "name=john&age=18"); err != nil {
    panic(err)
}
defer r.Close()
fmt.Println(r.ReadAllString())
```

When passing multiple parameters, users can use the `&` symbol to connect them. Note that parameter values often need to be encoded using `gurl.Encode`.

### Sending a POST Request with Parameters as Map Type and Printing Out the Return Value

```go
if r, err := g.Client().Post(
    ctx,
    "http://127.0.0.1:8199/form",
    g.Map{
        "submit"   : "1",
        "callback" : "http://127.0.0.1/callback?url=http://baidu.com",
    }
); err != nil {
    panic(err)
}
defer r.Close()
fmt.Println(r.ReadAllString())
```

When passing multiple parameters, users can use the `&` symbol to connect them, or they can directly use a map (**as mentioned earlier, all data types are supported, including `struct`**).

### Sending a POST Request with JSON Data and Printing Out the Return Value

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

As you can see, sending JSON data requests through the ghttp client is very convenient. You can directly submit through the Post method. When the `ContentType` is not explicitly set, the client will automatically recognize the parameter type and set the request's `Content-Type` to `application/json`.

### Sending a DELETE Request and Printing Out the Return Value

```go
if r, err := g.Client().Delete(ctx, "http://user.svc/v1/user/delete/1", "10000"); err != nil {
    panic(err)
}
defer r.Close()
fmt.Println(r.ReadAllString())
```

## *Bytes and *Content Methods

The request methods with the suffixes Bytes and Content are shortcut methods for directly obtaining the return content. These methods will automatically read the server's return content **and automatically close the request connection**. The *Bytes method is used to obtain results of type `[]byte`, and the *Content method is used to obtain results of type `string`. **Note that if the request fails, the return content will be empty.**

### Sending a GET Request and Printing Out the Return Value

```go
// Returns content as []bytes type
content := g.Client().GetBytes(ctx, "https://goframe.org")
```

```go
// Returns content as string type
content := g.Client().GetContent(ctx, "https://goframe.org")
```

### Sending a POST Request and Printing Out the Return Value

```go
// Returns content as []bytes type
content := g.Client().PostBytes(
    ctx,
    "http://user.svc/v1/user/create",
    `{"passport":"john","password":"123456","password-confirm":"123456"}`,
)
```

```go
// Returns content as string type
content := g.Client().PostContent(
    ctx,
    "http://user.svc/v1/user/create",
    `{"passport":"john","password":"123456","password-confirm":"123456"}`,
)
```

## *Var Method

The request methods ending with Var directly request and obtain the HTTP interface result as the `g.Var` generic type **to facilitate further type conversion, especially converting the request results into struct objects**. They are often used when the server returns formats like JSON/XML. Through the returned `g.Var` generic object, you can automatically parse as needed. Besides, if the request fails or the request result is empty, it will return an empty `g.Var` generic object without affecting the conversion method call.

Usage example:

```go
type User struct {
    Id   int
    Name string
}
```

```go
// Struct
var user *User
g.Client().GetVar(ctx, url).Scan(&user)
```

```go
// Struct array
var users []*User
g.Client().GetVar(ctx, url).Scan(&users)
```