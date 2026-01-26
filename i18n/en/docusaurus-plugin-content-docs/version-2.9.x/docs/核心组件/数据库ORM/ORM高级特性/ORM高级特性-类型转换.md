---
slug: '/docs/core/gdb-senior-type-converting'
title: 'ORM Senior - Type Conversion'
sidebar_position: 7
hide_title: true
keywords: [GoFrame, GoFrame Framework, ORM, Type Conversion, gdb, gvar.Var, Database Operations, Data Structures, Product Table, Data Type Conversion]
description: "Using the gdb module in the GoFrame framework to achieve advanced ORM features, focusing on the data type conversion function of database record results. The gdb module flexibly supports multiple data type conversions and demonstrates with examples how to retrieve and process product information from database tables in Go code."
---

The data record result (`Value`) of `gdb` supports very flexible type conversion and has built-in support for dozens of common data types.

> The `Value` type is an alias for the `*gvar.Var` type, so you can use all the conversion methods of the `gvar.Var` data type. For details, please refer to the [Generic](../../../组件列表/数据结构/泛型类型-gvar/泛型类型-gvar.md) section.

Example usage:

First, the data table is defined as follows:

```
# Product Table
CREATE TABLE `goods` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(300) NOT NULL COMMENT 'Product Name',
  `price` decimal(10,2) NOT NULL COMMENT 'Product Price',
  ...
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```

Next, the data in the table is as follows:

```
id   title     price
1    IPhoneX   5999.99
```

Finally, the sample code is as follows:

```go
if r, err := g.Model("goods").FindOne(1); err == nil {
    fmt.Printf("goods    id: %d\n",   r["id"].Int())
    fmt.Printf("goods title: %s\n",   r["title"].String())
    fmt.Printf("goods proce: %.2f\n", r["price"].Float32())
} else {
    g.Log().Error(gctx.New(), err)
}
```

After execution, the output is:

```
goods    id: 1
goods title: IPhoneX
goods proce: 5999.99
```