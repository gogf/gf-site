# Struct Validation - Assoc

## Introduction

To avoid confusion caused by default values in structs, starting from version `goframe v2.0`, we have added an `Assoc` method. This method allows struct validation to be strictly based on the given parameters rather than on the struct's property values (to avoid the effect of default struct property values). The validation rules will still be automatically read from the `gvalid tag` within the struct.

**Tip**

This is particularly useful for scenarios that require validation of client request parameters.

## Usage Example

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    type User struct {
        Name string `v:"required#Please enter user name"`
        Type int    `v:"required#Please select user type"`
    }
    var (
        ctx  = gctx.New()
        user = User{}
        data = g.Map{
            "name": "john",
        }
    )
    err := g.Validator().Assoc(data).Data(user).Run(ctx)
    if err != nil {
        g.Dump(err.Items())
    }
}
```

After execution, the terminal output is:

```
[
    {
        "Type": {
            "required": "Please select user type"
        }
    }
]
```

As you can see, the validation rule `required` for the `Type` attribute in the struct was not affected by the default value and was still executed as expected.

> Page: https://goframe.org/en/docs/core/gvalid-parameter-type-struct-assoc
