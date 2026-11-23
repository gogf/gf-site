# Type Conversion

## Introduction

The `GoFrame` framework provides a very powerful and easy-to-use type conversion package `gconv`, which can convert common data types into specified data types, seamlessly converting between common basic data types, and also supports conversion of any type to a `struct` object. Since the `gconv` module internally prioritizes the use of assertions over reflection, the execution efficiency is very high.

**Notes:**

The primary goal of the `gconv` package is to provide simple and efficient type conversion functionality. Developers should be aware of the input parameters for the conversion and the current business scenario being used. If some methods fail to convert, the method will not return the reason for the error, nor will it cause a `panic`, but will directly return the value after the conversion fails. Therefore, developers often need to comprehensively judge the correctness of the result based on the return value and the current business scenario.

**Usage:**

```go
import "github.com/gogf/gf/v2/util/gconv"
```

**API Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/util/gconv](https://pkg.go.dev/github.com/gogf/gf/v2/util/gconv)

**Method List:**

The method list may lag behind the code, please refer to the API documentation for details.

## Documentation

Child pages:

- [Type Conversion - Types](https://goframe.org/en/docs/core/gconv-basic.md)
- [Type Conversion - Map](https://goframe.org/en/docs/core/gconv-map.md)
- [Type Conversion - Struct](https://goframe.org/en/docs/core/gconv-struct.md)
- [Type Conversion - Structs](https://goframe.org/en/docs/core/gconv-structs.md)
- [Type Conversion - Scan](https://goframe.org/en/docs/core/gconv-scan.md)
- [Type Conversion - Interface](https://goframe.org/en/docs/core/gconv-unmarshal-value.md)
- [Type Conversion - Performance](https://goframe.org/en/docs/core/gconv-benchmark.md)
- [Type Conversion - Converter](https://goframe.org/en/docs/core/gconv-converter.md)
- [Type Conversion - Custom Type Conversion](https://goframe.org/en/docs/core/gconv-register-converter-func.md)

> Page: https://goframe.org/en/docs/core/gconv
