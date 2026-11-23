# Standard Router - Example

## Configuration File

Here we use a `YAML` configuration file: `config.yaml`

```yaml
server:
  address:     ":8199"
  openapiPath: "/api.json"
  swaggerPath: "/swagger"
```

## Sample Code

Let's start with a simple `Hello` example:

```go
package main

import (
    "context"
    "fmt"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

type HelloReq struct {
    g.Meta `path:"/hello" method:"get"`
    Name   string `v:"required" dc:"Your name"`
}
type HelloRes struct {
    Reply string `dc:"Reply content"`
}

type Hello struct{}

func (Hello) Say(ctx context.Context, req *HelloReq) (res *HelloRes, err error) {
    g.Log().Debugf(ctx, `receive say: %+v`, req)
    res = &HelloRes{
        Reply: fmt.Sprintf(`Hi %s`, req.Name),
    }
    return
}

func main() {
    s := g.Server()
    s.Use(ghttp.MiddlewareHandlerResponse)
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.Bind(
            new(Hello),
        )
    })
    s.Run()
}
```

Copy this code and let's run it to see what happens. The terminal will output the following information:

```html
2021-11-19 23:31:35.277 25580: http server started listening on [:8199]

  SERVER  | DOMAIN  | ADDRESS | METHOD |   ROUTE    |                          HANDLER                          |    MIDDLEWARE
----------|---------|---------|--------|------------|-----------------------------------------------------------|--------------------
  default | default | :8199   | ALL    | /*         | github.com/gogf/gf/v2/net/ghttp.MiddlewareHandlerResponse | GLOBAL MIDDLEWARE
----------|---------|---------|--------|------------|-----------------------------------------------------------|--------------------
  default | default | :8199   | ALL    | /api.json  | github.com/gogf/gf/v2/net/ghttp.(*Server).openapiSpec-fm  |
----------|---------|---------|--------|------------|-----------------------------------------------------------|--------------------
  default | default | :8199   | GET    | /hello     | main.(*Hello).Say                                         |
----------|---------|---------|--------|------------|-----------------------------------------------------------|--------------------
  default | default | :8199   | ALL    | /swagger/* | github.com/gogf/gf/v2/net/ghttp.(*Server).swaggerUI-fm    | HOOK_BEFORE_SERVE
----------|---------|---------|--------|------------|-----------------------------------------------------------|--------------------
```

As you can see, in addition to our business route, the `Server` has automatically registered two routes for us: `/api.json` and `/swagger/*`. The former is an auto-generated API documentation based on the standard `OpenAPIv3` protocol, and the latter is an auto-generated SwaggerUI page for developers to view and debug. These two features are disabled by default, and developers can enable them using the `openapiPath` and `swaggerPath` configuration options in the previous example.

## API Documentation

The API documentation is generated through the `OpenAPIv3` protocol, typically requiring corresponding UI tools to view it, at the address: [http://127.0.0.1:8199/api.json](http://127.0.0.1:8199/api.json)

**Tip**

Since `OpenAPIv3` is a standardized API definition protocol, developers can do many things based on the protocol content, such as custom UI display, client code generation, protocol conversion, etc.

## SwaggerUI

Let's take a look at this `SwaggerUI` page: [http://127.0.0.1:8199/swagger/](http://127.0.0.1:8199/swagger/)

There's only one route address and its corresponding input and output structures here. Of course, this is just a simple example; in a real project, you can make the page more colorful through some configuration.

Let's continue to do an API test on this page:

Yes, the API returned a `Json` content with a fixed data format, but you can see the `data` is the return result we need.

**Tip**

Note: The latest version of the `SwaggerUI` page no longer supports API testing features. If you need this functionality, you can customize `SwaggerUI` (refer to [API Document - Custom UI](https://goframe.org/en/docs/web/api-document-swagger-ui.md)), or import the API file `api.json` into third-party tools (such as `apifox`) for testing:

## Return Middleware

Wait a minute, did we miss something? Yes, we used a middleware provided by a `Server` component here. What is it used for? Let's take a look at its method definition:

Yes, when we do not provide a custom return data format middleware, it uses a default middleware to handle our requests and returns a default data format.

> Page: https://goframe.org/en/docs/web/router-registering-strict-router-example
