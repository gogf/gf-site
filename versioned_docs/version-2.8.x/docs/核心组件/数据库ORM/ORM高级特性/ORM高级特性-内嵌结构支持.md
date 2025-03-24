---
slug: '/docs/core/gdb-senior-nested-struct-support'
title: 'ORM高级特性-内嵌结构支持'
sidebar_position: 9
hide_title: true
keywords: [GoFrame,GoFrame框架,ORM,内嵌结构,参数传递,结果处理,struct,嵌套struct,高级特性,数据库支持]
description: 'GoFrame框架中ORM组件对内嵌结构的高级特性支持，包括结构体的参数传递和结果处理。通过示例讲解了如何在实践中应用这些功能，支持多层级的struct嵌套，提高开发效率。'
---

`GoFrame ORM` 组件针对于 `struct` 内嵌结构提供了良好的支持，包括参数传递、结果处理。例如：

```go
type Base struct {
    Uid        int         `orm:"uid"`
    CreateAt   *gtime.Time `orm:"create_at"`
    UpdateAt   *gtime.Time `orm:"update_at"`
    DeleteAt   *gtime.Time `orm:"delete_at"`
}
type User struct {
    Base
    Passport   string `orm:"passport"`
    Password   string `orm:"password"`
    Nickname   string `orm:"nickname"`
}
```

并且，无论多少层级的 `struct` 嵌套， `ORM` 的参数传递和结果处理都支持。