---
slug: '/docs/core/gdb-chaining-handler'
title: 'ORM链式操作-Handler特性'
sidebar_position: 14
hide_title: true
keywords: [GoFrame,GoFrame框架,ORM链式操作,Handler特性,查询示例,分页示例,代码复用,数据库操作,Go语言,gdb库]
description: '在GoFrame框架中使用ORM链式操作实现Handler特性，通过示例展示了如何复用常见的查询逻辑和分页操作，从而简化代码，提高开发效率。Handler特性允许开发者定义通用逻辑并应用于数据库模型，实现更为简洁和可维护的代码结构。'
---

`Handler` 特性允许您轻松地复用常见的逻辑。

## 示例1，查询

```go
func AmountGreaterThan1000(m *gdb.Model) *gdb.Model {
    return m.WhereGT("amount", 1000)
}

func PaidWithCreditCard(m *gdb.Model) *gdb.Model {
    return m.Where("pay_mode_sign", "credit_card")
}

func PaidWithCod(m *gdb.Model) *gdb.Model {
    return m.Where("pay_mode_sign", "cod")
}

func OrderStatus(statuses []string) func(m *gdb.Model) *gdb.Model {
    return func(m *gdb.Model) *gdb.Model {
        return m.Where("status", statuses)
    }
}

var (
    m = g.Model("product_order")
)

m.Handler(AmountGreaterThan1000, PaidWithCreditCard).Scan(&orders)
// SELECT * FROM `product_order` WHERE `amount`>1000 AND `pay_mode_sign`='credit_card'
// 查找所有金额大于 1000 的信用卡订单

m.Handler(AmountGreaterThan1000, PaidWithCod).Scan(&orders)
// SELECT * FROM `product_order` WHERE `amount`>1000 AND `pay_mode_sign`='cod'
// 查找所有金额大于 1000 的 COD 订单

m.Handler(AmountGreaterThan1000, OrderStatus([]string{"paid", "shipped"})).Scan(&orders)
// SELECT * FROM `product_order` WHERE `amount`>1000 AND `status` IN('paid','shipped')
// 查找所有金额大于1000 的已付款或已发货订单
```

## 示例2，分页

```go
func Paginate(r *ghttp.Request) func(m *gdb.Model) *gdb.Model {
    return func(m *gdb.Model) *gdb.Model {
        type Pagination struct {
            Page int
            Size int
        }
        var pagination Pagination
        _ = r.Parse(&pagination)
        switch {
        case pagination.Size > 100:
            pagination.Size = 100

        case pagination.Size <= 0:
            pagination.Size = 10
        }
        return m.Page(pagination.Page, pagination.Size)
    }
}

m.Handler(Paginate(r)).Scan(&users)
m.Handler(Paginate(r)).Scan(&articles)
```