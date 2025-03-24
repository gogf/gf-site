---
slug: '/docs/web/api-document-swagger-ui'
title: 'API Document - Custom UI'
sidebar_position: 1
hide_title: true
keywords: [GoFrame,GoFrame Framework,SwaggerUI,API Documentation,OpenAPI,UI Template,Custom API,gogf,API Docs,Redoc]
description: "Use SwaggerUI in the GoFrame framework to customize the API documentation UI, replacing the default Redoc component UI. Demonstrate how to quickly implement API documentation replacement with example code, connect internal enterprise resources, and avoid external dependencies. Detailed demonstration of integrating API documentation with third-party platforms, using GoFrame Server for UI template switching, enhancing the flexibility and customizability of document display."
---

## Introduction

The `OpenAPI` API documentation UI provided by default in `GoFrame`'s `Server` is the open-source `redoc` component, which does not support the `Try It Out` feature on the page. Many developers ask if it's possible to use the `SwaggerUI` page to display the `OpenAPI` API documentation. Some enterprises do not support connecting to certain external resources, so can the internal API documentation UI be replaced with resources accessible internally?

Anyone familiar with `OpenAPI` knows that it is merely a general API definition specification, and the displayed API documentation UI can be easily replaced. Moreover, there are many such UI APIs and platforms! Switching the API documentation UI page in `GoFrame Server`, or integrating the API documentation into a third-party documentation platform, is very simple! For details, see the example: [gf/example/httpserver/swagger-set-template/main.go](https://github.com/gogf/gf/blob/master/example/httpserver/swagger-set-template/main.go).

## Usage Example

Let's use code to illustrate how to quickly switch the API documentation UI to `SwaggerUI`. Links related to `SwaggerUI`:

- [https://github.com/swagger-api/swagger-ui](https://github.com/swagger-api/swagger-ui)
- [https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/installation.md](https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/installation.md)

main.go

```go
package main

import (
    "context"
    "fmt"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

// HelloReq hello request
type HelloReq struct {
    g.Meta `path:"/hello" method:"get" sort:"1"`
    Name   string `v:"required" dc:"Your name"`
}

// HelloRes hello response
type HelloRes struct {
    Reply string `dc:"Reply content"`
}

// Hello Controller
type Hello struct{}

// Say function
func (Hello) Say(ctx context.Context, req *HelloReq) (res *HelloRes, err error) {
    g.Log().Debugf(ctx, `receive say: %+v`, req)
    res = &HelloRes{
        Reply: fmt.Sprintf(`Hi %s`, req.Name),
    }
    return
}

const (
    MySwaggerUITemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="SwaggerUI"/>
    <title>SwaggerUI</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.5/swagger-ui.min.css" />
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.5/swagger-ui-bundle.js" crossorigin></script>
<script>
    window.onload = () => {
        window.ui = SwaggerUIBundle({
            url:    '{SwaggerUIDocUrl}',
            dom_id: '#swagger-ui',
        });
    };
</script>
</body>
</html>
`
)

func main() {
    s := g.Server()
    s.Use(ghttp.MiddlewareHandlerResponse)
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.Bind(
            new(Hello),
        )
    })
    s.SetSwaggerUITemplate(MySwaggerUITemplate)
    s.Run()
}
```

config.yaml

```yaml
server:
  address:     ":8199"
  openapiPath: "/api.json"
  swaggerPath: "/swagger"
```

Here we define a single `Hello` API. As you can see, we use an endpoint to display the `SwaggerUI` `HTML` page and define the path to the `OpenAPI` API file as `/api.json`, without using the server's built-in UI page. After execution, the terminal outputs:

```html
2022-05-18 20:41:09.160 [INFO] openapi specification is serving at address: http://127.0.0.1:8199/api.json
2022-05-18 20:41:09.161 [INFO] pid[57888]: http server started listening on [:8199]

  ADDRESS | METHOD |   ROUTE   |                             HANDLER                             |    MIDDLEWARE
----------|--------|-----------|-----------------------------------------------------------------|--------------------
  :8199   | ALL    | /*        | github.com/gogf/gf/v2/net/ghttp.internalMiddlewareServerTracing | GLOBAL MIDDLEWARE
----------|--------|-----------|-----------------------------------------------------------------|--------------------
  :8199   | ALL    | /api.json | github.com/gogf/gf/v2/net/ghttp.(*Server).openapiSpec           |
----------|--------|-----------|-----------------------------------------------------------------|--------------------
  :8199   | GET    | /hello    | main.(*Hello).Say                                               |
----------|--------|-----------|-----------------------------------------------------------------|--------------------
  :8199   | GET    | /swagger  | main.main.func1.1                                               |
----------|--------|-----------|-----------------------------------------------------------------|--------------------
```

Visit this link: [http://127.0.0.1:8199/swagger/](http://127.0.0.1:8199/swagger/)

The page is displayed as follows:

![](/markdown/c4942cfdd7b4a35c570e4e741619d6c0.png)

Developers customize other API documentation UIs in a similar way.

## Common UI Templates

### swagger-ui

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="SwaggerUI"/>
    <title>SwaggerUI</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.5/swagger-ui.min.css" />
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.5/swagger-ui-bundle.js" crossorigin></script>
<script>
    window.onload = () => {
        window.ui = SwaggerUIBundle({
            url:    '{SwaggerUIDocUrl}',
            dom_id: '#swagger-ui',
        });
    };
</script>
</body>
</html>
```

### openapi-ui

```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>openAPI UI</title>
  </head>
  <body>
    <div id="openapi-ui-container" spec-url="{SwaggerUIDocUrl}" theme="light"></div>
    <script src="https://cdn.jsdelivr.net/npm/openapi-ui-dist@latest/lib/openapi-ui.umd.js"></script>
  </body>
</html>
```