---
slug: '/docs/components/encoding-gjson-struct-converting'
title: 'General Codec - Struct'
sidebar_position: 2
hide_title: true
keywords: [GoFrame Framework, Struct Conversion, JSON Parsing, Data Format Conversion, Object Conversion, gjson Library, Encoding, Go Language, Data Scanning, User Struct]
description: "Using the Struct method in the GoFrame framework to convert JSON data into a specified data format or object. The example demonstrates how to parse JSON data and use the gjson library to scan it as a custom user struct. This type of data format conversion is very useful when dealing with complex data structures, especially in Go programming."
---

## `Struct` Conversion

The `Struct` method is used to convert the entire data content contained in `Json` into a specified data format or object.

```
data :=
    `
{
    "count" : 1,
    "array" : ["John", "Ming"]
}`
if j, err := gjson.DecodeToJson(data); err != nil {
    panic(err)
} else {
    type Users struct {
        Count int
        Array []string
    }
    users := new(Users)
    if err := j.Scan(users); err != nil {
        panic(err)
    }
    fmt.Printf(`%+v`, users)
}

// Output:
// &{Count:1 Array:[John Ming]}
```