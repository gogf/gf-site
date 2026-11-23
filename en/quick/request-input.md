# Parameters Retrieving

Now that we've created a basic web server, let's learn how to handle client-submitted parameters. For simplicity, we'll focus on parameters passed via query strings.

## Handling Parameters

Let's modify our "Hello World" example to handle user input:

```go title="main.go"
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Writef(
            "Hello %s! Your Age is %d",
            r.Get("name", "unknown").String(),
            r.Get("age").Int(),
        )
    })
    s.SetPort(8000)
    s.Run()
}
```

The `GoFrame` framework makes parameter handling straightforward. In this example, we use the `r.Get` method, which can retrieve parameters from any HTTP method (Query String, Form, Body, etc.). It automatically detects and parses the submission format, including `json` and `xml`.

Here's the method signature:
```go
func (r *Request) Get(key string, def ...interface{}) *gvar.Var
```

The `Get` method takes two parameters:
1. The parameter name to look up
2. An optional default value to use if the parameter is missing

It returns a `*gvar.Var` object - a versatile type provided by `GoFrame` that can be converted to various data types as needed.

## Testing the API

Let's test with parameters at http://127.0.0.1:8000/?name=john&age=18:

And without parameters at http://127.0.0.1:8000/:

Notice how the default values kick in:
- When `name` is missing, it defaults to "unknown"
- When `age` is missing, it defaults to 0 (the zero value for integers)

## Room for Improvement

While we've successfully handled parameters, there are some issues with this approach:
1. Hardcoding parameter names is error-prone - a simple typo could cause bugs that are hard to track down
2. There's no clear way to document:
   - The business purpose of each parameter
   - Expected data types
   - Validation rules
   - Parameter descriptions

In the next section, we'll solve these problems by introducing structured parameter objects.

> Page: https://goframe.org/en/quick/request-input
