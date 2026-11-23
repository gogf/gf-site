# Data Validation

## Introduction

The `goframe` framework provides a powerful, easy-to-use, flexible, and easily extensible data/form validation component implemented by the `gvalid` component. The `gvalid` component implements a very powerful data validation functionality, with dozens of built-in common validation rules. It supports single data multiple rule validation, multi-data multi-rule batch validation, custom error messages, custom regular expression validation, custom validation rule registration, supports `i18n` internationalization processing, supports `struct tag` rules and prompt information binding and other features, making it currently the most powerful `Go` data validation module.

**Tip**

The design inspiration for data validation comes from the classic `PHP Laravel` framework [https://laravel.com/docs/8.x/validation](https://laravel.com/docs/8.x/validation). Thank you `Laravel` ❤️

**Usage**：

```go
import "github.com/gogf/gf/v2/util/gvalid"
```

**API Documentation**：

[https://pkg.go.dev/github.com/gogf/gf/v2/util/gvalid](https://pkg.go.dev/github.com/gogf/gf/v2/util/gvalid)

## Features

The `gvalid` component has the following notable features:

- Built-in dozens of common data validation rules, supporting most business scenarios
- Supports `Server` layer and command-line component automated validation
- Supports basic types and complex object type parameter validation
- Supports sequential validation and flexible validation result handling
- Supports custom validation error messages
- Supports recursive validation of struct attributes
- Supports custom validation rules
- Supports internationalization feature `I18n`

## Documentation

Child pages:

- [Data Validation - Rules](https://goframe.org/en/docs/core/gvalid-rules.md)
- [Data Validation - Object](https://goframe.org/en/docs/core/gvalid-validator.md)
- [Data Validation - Result](https://goframe.org/en/docs/core/gvalid-result-handling.md)
- [Data Validation - Optional Rule](https://goframe.org/en/docs/core/gvalid-optional-rule.md)
- [Data Validation - Recursive](https://goframe.org/en/docs/core/gvalid-recursive-validating.md)
- [Data Validation - Error Msg](https://goframe.org/en/docs/core/gvalid-custom-validating-message.md)
- [Data Validation - Methods](https://goframe.org/en/docs/core/gvalid-funcs.md)
- [Data Validation - FAQ](https://goframe.org/en/docs/core/gvalid-faq.md)
- [Data Validation - Data Type](https://goframe.org/en/docs/core/gvalid-parameter-type.md)
- [Data Validation - Custom](https://goframe.org/en/docs/core/gvalid-custom-rules.md)

> Page: https://goframe.org/en/docs/core/gvalid
