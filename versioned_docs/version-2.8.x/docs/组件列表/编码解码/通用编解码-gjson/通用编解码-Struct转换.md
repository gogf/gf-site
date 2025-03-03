---
slug: '/docs/components/encoding-gjson-struct-converting'
title: '通用编解码-Struct转换'
sidebar_position: 2
hide_title: true
keywords: [GoFrame框架,Struct转换,JSON解析,数据格式转换,对象转换,gjson库,编解码,Go语言,数据扫描,用户结构]
description: '使用GoFrame框架中的Struct方法将JSON数据转换为指定的数据格式或对象。示例展示了如何解析JSON数据并使用gjson库将其扫描为自定义用户结构体。这种数据格式转换在处理复杂数据结构时非常有用，特别是在Go语言编程中。'
---

## `Struct` 转换

`Struct` 方法用于将整个 `Json` 包含的数据内容转换为指定的数据格式或者对象。

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