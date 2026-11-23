# Data Validation - FAQ

## Impact of `Struct` Default Values on the `required` Rule

The properties of a `Struct` have `default values`, which in some cases can cause the `required` rule to become ineffective. For example:

```go
type User struct {
    Name string `v:"required"`
    Age  uint   `v:"required"`
}
```

In this structure validation, the `required` check for the `Age` property will fail because `Age` will have a default value of `0` even if no input is provided.

There are **three** solutions:

1. Change the attribute to a pointer type, such as `*int`, `*float64`, `*g.Var`, etc., taking advantage of the pointer type's default value of `nil` to bypass this issue.
2. Use a combined validation rule to compensate for the impact of default values on the `required` rule. For example, modifying the validation rule of the `Age` attribute in the example above to `required|min:1` will achieve the desired business validation effect.
3. Use the `Assoc` joint validation method in `Struct` validation to set joint validation parameters. When validating parameters of the `Struct` type, the parameter values will be validated according to the parameters given in the `Assoc` method. If using the framework's `Server`, with structured `API` input/output (`XxxReq/XxxRes`), the `Server` will automatically call `Assoc` for validation, so developers need not worry about the impact of default values. Documentation link: [Struct Validation - Assoc](https://goframe.org/en/docs/core/gvalid-parameter-type-struct-assoc.md)

> Page: https://goframe.org/en/docs/core/gvalid-faq
