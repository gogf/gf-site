# Hello World

The `Web Server` module is a core component of `GoFrame`, a comprehensive modular framework. We'll start our journey with web service development, as it's an excellent way to introduce the framework's capabilities.

## Hello World

Let's create a simple web server:

```go title="main.go"
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Write("Hello World!")
    })
    s.SetPort(8000)
    s.Run()
}
```

Let's break down this code:
- The `g.Server()` method returns a default `Server` object implemented as a **singleton**. This means multiple calls return the same instance. The `g` package is a convenience wrapper that initializes and provides access to commonly used components.
- Routes and their handlers are registered using the `Server` object's `BindHandler` method. In this example, we've mapped the root path `/` to a handler that returns "Hello World".
- The handler function receives a `*ghttp.Request` parameter (`r`) containing the current request's context. Here, we use `r.Response.Write` to send our response.
- The `SetPort` method configures the server's listening port (8000 in this case). If not specified, a random port is assigned.
- Finally, the `Run()` method starts the server and blocks until the program is terminated.

## Running the Server

When you run the program, you'll see output similar to this in your terminal:
```html
$ go run main.go
2024-10-27 21:30:39.412 [INFO] pid[58889]: http server started listening on [:8000]
2024-10-27 21:30:39.412 [INFO] {08a0b0086e5202184111100658330800} openapi specification is disabled

  ADDRESS | METHOD | ROUTE |     HANDLER     | MIDDLEWARE
----------|--------|-------|-----------------|-------------
  :8000   | ALL    | /     | main.main.func1 |
----------|--------|-------|-----------------|-------------
```

The output provides several key pieces of information:
- Process ID (`58889`) and listening address (`:8000`, which means the server is listening on all local IP addresses on port `8000`)
- A notice about OpenAPI specification being disabled (the framework includes automatic API documentation generation, which we'll cover in detail later)
- A routing table showing:
  - `ADDRESS`: The listening address for each route. Note that a single process can host multiple `Server` instances, each with its own address
  - `METHOD`: The HTTP methods the route handles (`ALL` means it accepts any method: GET, POST, PUT, DELETE, etc.)
  - `ROUTE`: The URL path pattern
  - `HANDLER`: The route's callback function name (shown as `main.main.func1` since we used an anonymous function)
  - `MIDDLEWARE`: Any middleware attached to the route (we'll cover middleware, a powerful request interceptor feature, in later chapters)

Visit http://127.0.0.1:8000/ in your browser to see the result:

## What's Next

Great job! You've just created your first web server with `GoFrame`!

In the next section, we'll explore how to handle client-submitted data in your web server.

> Page: https://goframe.org/en/quick/hello-world
