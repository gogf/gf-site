---
slug: '/docs/core/gconv-converter'
title: 'Type Conversion - Converter'
sidebar_position: 5
hide_title: true
keywords: [type conversion, Converter feature, GoFrame, custom conversion, struct conversion, attribute conversion, alias type, gconv.Scan, gconv.ConvertWithRefer, data structure]
description: "From version v2.6.2 of the GoFrame framework, the conversion component adds the Converter feature, allowing developers to customize type conversion logic. This document showcases how to use the Converter feature for registering and applying custom conversion methods for data structures and alias types, as well as how to handle these types of conversions with the help of gconv.Scan and gconv.ConvertWithRefer methods."
---

Starting from version v2.6.2 of the framework, the conversion component provides the `Converter` feature, allowing developers to customize conversion methods to specify conversion logic between specific types.

## Conversion Method Definition

The conversion method is defined as follows:

```go
func(T1) (T2, error)
```

Where `T1` needs to be a non-pointer object, and `T2` needs to be a pointer type. If the types are incorrect, the registration of the conversion method will result in an error.
:::tip
The design requiring the input parameter (`T1`) to be a non-pointer object aims to ensure the safety of input parameters, minimizing potential issues outside the scope of the conversion method.
:::
The function to register a conversion method is as follows:

```go
// RegisterConverter to register custom converter.
// It must be registered before you use this custom converting feature.
// It is suggested to do it in boot procedure of the process.
//
// Note:
//  1. The parameter `fn` must be defined as pattern `func(T1) (T2, error)`.
//     It will convert type `T1` to type `T2`.
//  2. The `T1` should not be type of pointer, but the `T2` should be type of pointer.
func RegisterConverter(fn interface{}) (err error)
```

## Struct Type Conversion

A common custom data structure conversion involves conversion between structs. Let's look at two examples.

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/util/gconv"
)

type Src struct {
    A int
}

type Dst struct {
    B int
}

type SrcWrap struct {
    Value Src
}

type DstWrap struct {
    Value Dst
}

func SrcToDstConverter(src Src) (dst *Dst, err error) {
    return &Dst{B: src.A}, nil
}

// SrcToDstConverter is custom converting function for custom type.
func main() {
    // register custom converter function.
    err := gconv.RegisterConverter(SrcToDstConverter)
    if err != nil {
        panic(err)
    }

    // custom struct converting.
    var (
        src = Src{A: 1}
        dst *Dst
    )
    err = gconv.Scan(src, &dst)
    if err != nil {
        panic(err)
    }

    fmt.Println("src:", src)
    fmt.Println("dst:", dst)

    // custom struct attributes converting.
    var (
        srcWrap = SrcWrap{Src{A: 1}}
        dstWrap *DstWrap
    )
    err = gconv.Scan(srcWrap, &dstWrap)
    if err != nil {
        panic(err)
    }

    fmt.Println("srcWrap:", srcWrap)
    fmt.Println("dstWrap:", dstWrap)
}
```

In this example code, two conversion scenarios are demonstrated: custom struct conversion and automatic conversion of structs as attributes. The conversion method used is the generic struct conversion method `gconv.Scan`. The internal implementation will automatically determine if a custom type conversion function exists and prioritize its use; otherwise, the default conversion logic will be used.

Upon execution, the terminal outputs:

```
src: {1}
dst: &{1}
srcWrap: {{1}}
dstWrap: &{{1}}
```

In addition to using the `gconv.Scan` method, we can also use the `gconv.ConvertWithRefer` method to achieve type conversion, both of which have the same effect:

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/util/gconv"
)

type Src struct {
    A int
}

type Dst struct {
    B int
}

type SrcWrap struct {
    Value Src
}

type DstWrap struct {
    Value Dst
}

// SrcToDstConverter is custom converting function for custom type.
func SrcToDstConverter(src Src) (dst *Dst, err error) {
    return &Dst{B: src.A}, nil
}

func main() {
    // register custom converter function.
    err := gconv.RegisterConverter(SrcToDstConverter)
    if err != nil {
        panic(err)
    }

    // custom struct converting.
    var src = Src{A: 1}
    dst := gconv.ConvertWithRefer(src, Dst{})
    fmt.Println("src:", src)
    fmt.Println("dst:", dst)

    // custom struct attributes converting.
    var srcWrap = SrcWrap{Src{A: 1}}
    dstWrap := gconv.ConvertWithRefer(srcWrap, &DstWrap{})
    fmt.Println("srcWrap:", srcWrap)
    fmt.Println("dstWrap:", dstWrap)
}
```

## Alias Type Conversion

We can also use the `Converter` feature to implement conversions for **alias types**. Alias types are not limited to structs and can also be aliases for basic types such as `int, string`, etc. Here are two examples.

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/os/gtime"
    "github.com/gogf/gf/v2/util/gconv"
)

type MyTime = *gtime.Time

type Src struct {
    A MyTime
}

type Dst struct {
    B string
}

type SrcWrap struct {
    Value Src
}

type DstWrap struct {
    Value Dst
}

// SrcToDstConverter is custom converting function for custom type.
func SrcToDstConverter(src Src) (dst *Dst, err error) {
    return &Dst{B: src.A.Format("Y-m-d")}, nil
}

// SrcToDstConverter is custom converting function for custom type.
func main() {
    // register custom converter function.
    err := gconv.RegisterConverter(SrcToDstConverter)
    if err != nil {
        panic(err)
    }

    // custom struct converting.
    var (
        src = Src{A: gtime.Now()}
        dst *Dst
    )
    err = gconv.Scan(src, &dst)
    if err != nil {
        panic(err)
    }

    fmt.Println("src:", src)
    fmt.Println("dst:", dst)

    // custom struct attributes converting.
    var (
        srcWrap = SrcWrap{Src{A: gtime.Now()}}
        dstWrap *DstWrap
    )
    err = gconv.Scan(srcWrap, &dstWrap)
    if err != nil {
        panic(err)
    }

    fmt.Println("srcWrap:", srcWrap)
    fmt.Println("dstWrap:", dstWrap)
}
```

The `type xxx = yyy` in the code is due to the needs of the `*gtime.Time` type. Other types can choose whether to use the alias symbol `=` as needed. For example, basic types such as `int, string` do not need the alias symbol.

Upon execution, the terminal outputs:

```
src: {2024-01-22 21:45:28}
dst: &{2024-01-22}
srcWrap: {{2024-01-22 21:45:28}}
dstWrap: &{{2024-01-22}}
```

Similarly, in addition to using the `gconv.Scan` method, we can also use the `gconv.ConvertWithRefer` method to achieve type conversion, both of which have the same effect:

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/os/gtime"
    "github.com/gogf/gf/v2/util/gconv"
)

type MyTime = *gtime.Time

type Src struct {
    A MyTime
}

type Dst struct {
    B string
}

type SrcWrap struct {
    Value Src
}

type DstWrap struct {
    Value Dst
}

// SrcToDstConverter is custom converting function for custom type.
func SrcToDstConverter(src Src) (dst *Dst, err error) {
    return &Dst{B: src.A.Format("Y-m-d")}, nil
}

// SrcToDstConverter is custom converting function for custom type.
func main() {
    // register custom converter function.
    err := gconv.RegisterConverter(SrcToDstConverter)
    if err != nil {
        panic(err)
    }

    // custom struct converting.
    var src = Src{A: gtime.Now()}
    dst := gconv.ConvertWithRefer(src, &Dst{})
    fmt.Println("src:", src)
    fmt.Println("dst:", dst)

    // custom struct attributes converting.
    var srcWrap = SrcWrap{Src{A: gtime.Now()}}
    dstWrap := gconv.ConvertWithRefer(srcWrap, &DstWrap{})
    fmt.Println("srcWrap:", srcWrap)
    fmt.Println("dstWrap:", dstWrap)
}
```