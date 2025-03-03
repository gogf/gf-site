---
slug: '/docs/components/encoding-gbinary'
title: 'Binary'
sidebar_position: 1
hide_title: true
keywords: [GoFrame, GoFrame Framework, gbinary, binary encoding/decoding, data conversion, network communication, data encoding, decoding, integer processing, bit manipulation]
description: "The gbinary package in the GoFrame framework provides encoding and decoding functionality for converting between binary data and various data types. It is widely used in network communication and data file operations. It supports precise bit processing for integer data and offers a range of encoding and decoding interfaces to ensure efficient data conversion across different types and platforms."
---

## Introduction

The `GoFrame` framework provides an independent binary data operation package `gbinary`, which is mainly used for mutual conversion between various data types and `[]byte` binary types; it also provides precise bit processing functions for integer data. It is commonly used for data encoding/decoding during network communication and data file operations.

**Usage**:

```go
import "github.com/gogf/gf/v2/encoding/gbinary"
```

**Interface Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/encoding/gbinary](https://pkg.go.dev/github.com/gogf/gf/v2/encoding/gbinary)

The interface documentation for binary data structure conversion processing is as follows:

```go
func Encode(vs ...interface{}) ([]byte, error)
func EncodeInt(i int) []byte
func EncodeInt8(i int8) []byte
func EncodeInt16(i int16) []byte
func EncodeInt32(i int32) []byte
func EncodeInt64(i int64) []byte
func EncodeUint(i uint) []byte
func EncodeUint8(i uint8) []byte
func EncodeUint16(i uint16) []byte
func EncodeUint32(i uint32) []byte
func EncodeUint64(i uint64) []byte
func EncodeBool(b bool) []byte
func EncodeFloat32(f float32) []byte
func EncodeFloat64(f float64) []byte
func EncodeString(s string) []byte

func Decode(b []byte, vs ...interface{}) error
func DecodeToInt(b []byte) int
func DecodeToInt8(b []byte) int8
func DecodeToInt16(b []byte) int16
func DecodeToInt32(b []byte) int32
func DecodeToInt64(b []byte) int64
func DecodeToUint(b []byte) uint
func DecodeToUint8(b []byte) uint8
func DecodeToUint16(b []byte) uint16
func DecodeToUint32(b []byte) uint32
func DecodeToUint64(b []byte) uint64
func DecodeToBool(b []byte) bool
func DecodeToFloat32(b []byte) float32
func DecodeToFloat64(b []byte) float64
func DecodeToString(b []byte) string
```

The interface documentation for bit-level processing support is as follows:

```go
func EncodeBits(bits []Bit, i int, l int) []Bit
func EncodeBitsWithUint(bits []Bit, ui uint, l int) []Bit
func EncodeBitsToBytes(bits []Bit) []byte
func DecodeBits(bits []Bit) uint
func DecodeBitsToUint(bits []Bit) uint
func DecodeBytesToBits(bs []byte) []Bit
```

The `Bit` type represents a binary digit (0 or 1), defined as follows:

```go
type Bit int8
```

## Usage Example

Let's look at a comprehensive example of binary operations, demonstrating most binary conversion operations.

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/encoding/gbinary"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    // Use gbinary.Encode to perform binary packing on basic data types
    if buffer := gbinary.Encode(18, 300, 1.01); buffer != nil {
        // glog.Error(err)
    } else {
        fmt.Println(buffer)
    }

    // Use gbinary.Decode for integer binary unpacking. Note that the second and subsequent parameters are pointers to fixed-length integer variables.
    // Examples include: int8/16/32/64, uint8/16/32/64, float32/64
    // 1.01 here defaults to float64 type (on a 64-bit system)
    if buffer := gbinary.Encode(18, 300, 1.01); buffer != nil {
        // glog.Error(err)
    } else {
        var i1 int8
        var i2 int16
        var f3 float64
        if err := gbinary.Decode(buffer, &i1, &i2, &f3); err != nil {
            glog.Error(gctx.New(), err)
        } else {
            fmt.Println(i1, i2, f3)
        }
    }

    // Encode/Decode int, automatically recognize variable length
    fmt.Println(gbinary.DecodeToInt(gbinary.EncodeInt(1)))
    fmt.Println(gbinary.DecodeToInt(gbinary.EncodeInt(300)))
    fmt.Println(gbinary.DecodeToInt(gbinary.EncodeInt(70000)))
    fmt.Println(gbinary.DecodeToInt(gbinary.EncodeInt(2000000000)))
    fmt.Println(gbinary.DecodeToInt(gbinary.EncodeInt(500000000000)))

    // Encode/Decode uint, automatically recognize variable length
    fmt.Println(gbinary.DecodeToUint(gbinary.EncodeUint(1)))
    fmt.Println(gbinary.DecodeToUint(gbinary.EncodeUint(300)))
    fmt.Println(gbinary.DecodeToUint(gbinary.EncodeUint(70000)))
    fmt.Println(gbinary.DecodeToUint(gbinary.EncodeUint(2000000000)))
    fmt.Println(gbinary.DecodeToUint(gbinary.EncodeUint(500000000000)))

    // Encode/Decode int8/16/32/64
    fmt.Println(gbinary.DecodeToInt8(gbinary.EncodeInt8(int8(100))))
    fmt.Println(gbinary.DecodeToInt16(gbinary.EncodeInt16(int16(100))))
    fmt.Println(gbinary.DecodeToInt32(gbinary.EncodeInt32(int32(100))))
    fmt.Println(gbinary.DecodeToInt64(gbinary.EncodeInt64(int64(100))))

    // Encode/Decode uint8/16/32/64
    fmt.Println(gbinary.DecodeToUint8(gbinary.EncodeUint8(uint8(100))))
    fmt.Println(gbinary.DecodeToUint16(gbinary.EncodeUint16(uint16(100))))
    fmt.Println(gbinary.DecodeToUint32(gbinary.EncodeUint32(uint32(100))))
    fmt.Println(gbinary.DecodeToUint64(gbinary.EncodeUint64(uint64(100))))

    // Encode/Decode string
    fmt.Println(gbinary.DecodeToString(gbinary.EncodeString("I'm string!")))
}
```

The result of the above program execution is:

```
[18 44 1 41 92 143 194 245 40 240 63]
18 300 1.01
1
300
70000
2000000000
500000000000
1
300
70000
2000000000
500000000000
100
100
100
100
100
100
100
100
I'm string!
```

1. **Encoding**

The `gbinary.Encode` method is a very powerful and flexible method that can convert all basic types to binary type (`[]byte`). Inside the `gbinary.Encode` method, the variable length is calculated automatically, using the smallest binary length to store the binary value of the variable. For example, for an `int` type variable with a value of `1`, `gbinary.Encode` will use only `1` byte to store it, while a variable with a value of `300` will use `2` bytes to store it, minimizing the storage space of the binary result. Therefore, when parsing, pay great attention to the length of `[]byte`. It is recommended to use fixed-length basic types like `int8/16/32/64` when encoding/decoding binary to ensure the correct variable form is used during parsing, reducing the chance of errors.

The `gbinary` package also provides a series of `gbinary.Encode*` methods for converting basic data types to binary. In particular, `gbinary.EncodeInt/gbinary.EncodeUint` internally recognizes the variable value size and returns a variable-length `[]byte` value, with a length range of `1/2/4/8`.

2. **Decoding**

In binary type parsing operations, the length of the binary (`[]byte` length) is crucial. Only with the correct length can correct parsing be executed. Therefore, the length of the variables given to `gbinary.Decode` must be of a specific length type, such as `int8/16/32/64`, `uint8/16/32/64`, or `float32/64`. If the second variable address given corresponds to the `int/uint` variable type, which has an indeterminate length, parsing will fail.

Furthermore, the `gbinary` package also provides a series of `gbinary.DecodeTo*` methods for converting binary to specific data types. Importantly, the `gbinary.DecodeToInt/gbinary.DecodeToUint` methods automatically recognize and parse the binary length, supporting binary parameter lengths in the range of `1-8`.