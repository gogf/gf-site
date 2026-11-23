# Template Engine - Layout

The `gview` template engine supports two types of `layout` template layouts:

1. `define` + `template` method
2. `include` template embedding method

Both methods support passing template variables.

### `define` + `template`

Since `gview` uses `ParseFiles` in the underlying layer to parse template files in bulk, you can use the `define` tag to define template content blocks and use the `template` tag to introduce specified template content blocks in any other template files. The `template` tag supports cross-template referencing, meaning that the template content block defined by the `define` tag may be in other template files, and the `template` can be freely introduced as well.

**Warning**

Note:
- When passing template variables to a nested child template, use the syntax: `{{template "xxx" .}}`.
- The file extension of the template file should be consistent with the `define template` file extension.

Example Usage:

1. `layout.html`
```html
<!DOCTYPE html>
<html>
<head>
    <title>GoFrame Layout</title>
    {{template "header" .}}
</head>
<body>
    <div class="container">
    {{template "container" .}}
    </div>
    <div class="footer">
    {{template "footer" .}}
    </div>
</body>
</html>
```

2. `header.html`
```html
{{define "header"}}
    <h1>{{.header}}</h1>
{{end}}
```

3. `container.html`
```html
{{define "container"}}
<h1>{{.container}}</h1>
{{end}}
```

4. `footer.html`
```html
{{define "footer"}}
<h1>{{.footer}}</h1>
{{end}}
```

5. `main.go`
```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.WriteTpl("layout.html", g.Map{
            "header":    "This is header",
            "container": "This is container",
            "footer":    "This is footer",
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, visit [http://127.0.0.1:8199](http://127.0.0.1:8199/) and the result is as follows:

### `include` Template Embedding

Of course, we can also use the `include` tag to achieve page layout.

**Warning**

Note: When passing template variables to a nested child template, use the syntax: `{{include "xxx" .}}`.

Example Usage:

1. `layout.html`
```html
{{include "header.html" .}}
{{include .mainTpl .}}
{{include "footer.html" .}}
```

2. `header.html`
```html
<h1>HEADER</h1>
```

3. `footer.html`
```html
<h1>FOOTER</h1>
```

4. `main1.html`
```html
<h1>MAIN1</h1>
```

5. `main2.html`
```html
<h1>MAIN2</h1>
```

6. `main.go`
```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/main1", func(r *ghttp.Request) {
        r.Response.WriteTpl("layout.html", g.Map{
            "mainTpl": "main/main1.html",
        })
    })
    s.BindHandler("/main2", func(r *ghttp.Request) {
        r.Response.WriteTpl("layout.html", g.Map{
            "mainTpl": "main/main2.html",
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, visiting different route addresses will show different results:

1. [http://127.0.0.1:8199/main1](http://127.0.0.1:8199/main1)

2. [http://127.0.0.1:8199/main2](http://127.0.0.1:8199/main2)

> Page: https://goframe.org/en/docs/core/gview-layout
