# Template Engine - Variables

## Built-in Variables

Please refer to the [Response - Template Parsing](https://goframe.org/en/docs/web/response-template.md) section for `WebServer` built-in variables.

## Variable Objects

We can use custom objects in templates and access the properties of objects and invoke their methods within the template.

Example:

```go
package main

import (
    "context"
    "github.com/gogf/gf/v2/frame/g"
)

type T struct {
    Name string
}

func (t *T) Hello(name string) string {
    return "Hello " + name
}

func (t *T) Test() string {
    return "This is test"
}

func main() {
    t := &T{"John"}
    v := g.View()
    content := `{{.t.Hello "there"}}, my name's {{.t.Name}}. {{.t.Test}}.`
    if r, err := v.ParseContent(context.TODO(), content, g.Map{"t": t}); err != nil {
        g.Dump(err)
    } else {
        g.Dump(r)
    }
}
```

Here, the variables assigned to the template can be either `object pointers` or `object variables`. However, note the defined object methods: if it is an object pointer, you can only call methods where the receiver is an object pointer; if it is an object variable, you can only call methods where the receiver is an object.

After execution, the output is:

```
Hello there, my name's John. This is test.
```

> Page: https://goframe.org/en/docs/core/gview-variable
