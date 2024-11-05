---
slug: '/docs/core/gconv-converter'
title: '类型转换-Converter特性'
sidebar_position: 5
hide_title: true
---

从框架 v2.6.2 版本开始，转换组件提供了 `Converter` 特性，允许开发者可以自定义 `Converter`转换方法指定特定类型之间的转换逻辑。

## 转换方法定义

转换方法定义如下:

```go
func(T1) (T2, error)
```

其中 `T1` 需要为非指针对象， `T2` 需要为指针类型，如果类型不正确转换方法注册将会报错。
:::tip
输入参数( `T1`)必须为非指针对象的设计，目的是为了保证输入参数的安全，尽可能避免在转换方法内部修改输入参数引起作用域外问题。
:::
注册转换方法的函数如下:

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

## 结构体类型转换

常见的自定义数据结构是结构体之间的类型转换。我们来看两个例子。

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

在该示例代码中，演示了两种类型转换场景:自定义结构体转换，以及结构体作为属性的自动转换。转换方法使用的是通用的结构体转换方法 `gconv.Scan`，该方法在内部实现中会自动判断如果存在自定义类型转换函数，会优先使用自定义类型转换函数，否则会走默认的转换逻辑。

执行后，终端输出：

```
src: {1}
dst: &{1}
srcWrap: {{1}}
dstWrap: &{{1}}
```

除了使用 `gconv.Scan` 方法外，我们也可以使 `gconv.ConvertWithRefer` 方法实现类型转换，两者的效果都是一样的：

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

## 别名类型转换

我们也可以使用 `Converter`特性实现 **别名类型** 的转换。别名类型不限于结构体，也可以是 `int, string` 等基础类型的别名。我们来看两个例子。

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

代码中的 `type xxx = yyy`是由于 `*gtime.Time` 类型的需要，其他类型可根据需要是否使用别名符号 `=`，例如基础类型 `int, string` 等是不需要别名符号的。

执行后，终端输出：

```
src: {2024-01-22 21:45:28}
dst: &{2024-01-22}
srcWrap: {{2024-01-22 21:45:28}}
dstWrap: &{{2024-01-22}}
```

同样的，除了使用 `gconv.Scan` 方法外，我们也可以使用 `gconv.ConvertWithRefer` 方法实现类型转换，两者的效果都是一样的：

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