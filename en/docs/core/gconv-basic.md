# Type Conversion - Types

The conversion methods for common basic types are relatively simple. We will demonstrate the usage and effects of conversion methods with an example here.

## Basic Example

**Tip**

For more type conversion methods, please refer to the API documentation: [https://pkg.go.dev/github.com/gogf/gf/v2/util/gconv](https://pkg.go.dev/github.com/gogf/gf/v2/util/gconv)

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    i := 123.456
    fmt.Printf("%10s %v\n", "Int:",        gconv.Int(i))
    fmt.Printf("%10s %v\n", "Int8:",       gconv.Int8(i))
    fmt.Printf("%10s %v\n", "Int16:",      gconv.Int16(i))
    fmt.Printf("%10s %v\n", "Int32:",      gconv.Int32(i))
    fmt.Printf("%10s %v\n", "Int64:",      gconv.Int64(i))
    fmt.Printf("%10s %v\n", "Uint:",       gconv.Uint(i))
    fmt.Printf("%10s %v\n", "Uint8:",      gconv.Uint8(i))
    fmt.Printf("%10s %v\n", "Uint16:",     gconv.Uint16(i))
    fmt.Printf("%10s %v\n", "Uint32:",     gconv.Uint32(i))
    fmt.Printf("%10s %v\n", "Uint64:",     gconv.Uint64(i))
    fmt.Printf("%10s %v\n", "Float32:",    gconv.Float32(i))
    fmt.Printf("%10s %v\n", "Float64:",    gconv.Float64(i))
    fmt.Printf("%10s %v\n", "Bool:",       gconv.Bool(i))
    fmt.Printf("%10s %v\n", "String:",     gconv.String(i))
    fmt.Printf("%10s %v\n", "Bytes:",      gconv.Bytes(i))
    fmt.Printf("%10s %v\n", "Strings:",    gconv.Strings(i))
    fmt.Printf("%10s %v\n", "Ints:",       gconv.Ints(i))
    fmt.Printf("%10s %v\n", "Floats:",     gconv.Floats(i))
    fmt.Printf("%10s %v\n", "Interfaces:", gconv.Interfaces(i))
}

```

After execution, the output results are:

```
      Int: 123
     Int8: 123
    Int16: 123
    Int32: 123
    Int64: 123
     Uint: 123
    Uint8: 123
   Uint16: 123
   Uint32: 123
   Uint64: 123
  Float32: 123.456
  Float64: 123.456
     Bool: true
   String: 123.456
    Bytes: [119 190 159 26 47 221 94 64]
  Strings: [123.456]
     Ints: [123]
   Floats: [123.456]
Interfaces: [123.456]
```

## Precautions

Number conversion methods such as `gconv.Int/Uint`, etc., will automatically recognize hexadecimal and octal when the given conversion parameter is a string.

### Hexadecimal Conversion

`gconv` treats numeric strings starting with `0x` as hexadecimal conversions. For example, `gconv.Int("0xff")` will return `255`.

> Page: https://goframe.org/en/docs/core/gconv-basic
