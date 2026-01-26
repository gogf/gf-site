---
slug: '/docs/core/gdb-senior-type-converting'
title: 'ORM高级特性-类型转换'
sidebar_position: 7
hide_title: true
keywords: [GoFrame,GoFrame框架,ORM,类型转换,gdb,gvar.Var,数据库操作,数据结构,商品表,数据类型转换]
description: '使用GoFrame框架中的gdb模块进行ORM高级特性实现，重点是在数据库记录结果的数据类型转换功能。gdb模块灵活支持多种数据类型的转换，并通过示例展示了如何在Go代码中实现对数据库表中商品信息的获取和处理。'
---

`gdb` 的数据记录结果（ `Value`）支持非常灵活的类型转换，并内置支持常用的数十种数据类型的转换。

> `Value` 类型是 `*gvar.Var` 类型的别名，因此可以使用 `gvar.Var` 数据类型的所有转换方法，具体请查看 [泛型类型-gvar](../../../组件列表/数据结构/泛型类型-gvar/泛型类型-gvar.md) 章节

使用示例：

首先，数据表定义如下：

```
# 商品表
CREATE TABLE `goods` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(300) NOT NULL COMMENT '商品名称',
  `price` decimal(10,2) NOT NULL COMMENT '商品价格',
  ...
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```

其次，数据表中的数据如下：

```
id   title     price
1    IPhoneX   5999.99
```

最后，示例代码如下：

```go
if r, err := g.Model("goods").FindOne(1); err == nil {
    fmt.Printf("goods    id: %d\n",   r["id"].Int())
    fmt.Printf("goods title: %s\n",   r["title"].String())
    fmt.Printf("goods proce: %.2f\n", r["price"].Float32())
} else {
    g.Log().Error(gctx.New(), err)
}
```

执行后，输出结果为：

```
goods    id: 1
goods title: IPhoneX
goods proce: 5999.99
```