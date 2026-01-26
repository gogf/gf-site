---
slug: '/docs/core/gdb-senior-nested-struct-support'
title: 'ORM Senior - Embedded Struct'
sidebar_position: 9
hide_title: true
keywords: [GoFrame,GoFrame framework,ORM,embedded struct,parameter passing,result processing,struct,nested struct,advanced features,database support]
description: "The ORM component in the GoFrame framework supports advanced features for embedded structs, including parameter passing and result processing. Examples demonstrate how to apply these features in practice, supporting multi-level struct nesting and enhancing development efficiency."
---

The `GoFrame ORM` component provides excellent support for `struct` embedded structures, including parameter passing and result processing. For example:

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

Furthermore, regardless of how many levels of `struct` nesting there are, `ORM` supports parameter passing and result processing.