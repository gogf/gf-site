---
slug: '/docs/core/gdb-chaining-handler'
title: 'ORM Model - Handler'
sidebar_position: 14
hide_title: true
keywords: [GoFrame, GoFrame Framework, ORM Chaining Operation, Handler Feature, Query Example, Pagination Example, Code Reuse, Database Operations, Go Language, gdb Library]
description: "Using ORM chaining operations in the GoFrame framework to implement the Handler feature, examples demonstrate how to reuse common query logic and pagination operations, simplifying code and improving development efficiency. The Handler feature allows developers to define common logic and apply it to database models, achieving a cleaner and more maintainable code structure."
---

The `Handler` feature allows you to easily reuse common logic.

## Example 1: Query

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
// Find all credit card orders with an amount greater than 1000

m.Handler(AmountGreaterThan1000, PaidWithCod).Scan(&orders)
// SELECT * FROM `product_order` WHERE `amount`>1000 AND `pay_mode_sign`='cod'
// Find all COD orders with an amount greater than 1000

m.Handler(AmountGreaterThan1000, OrderStatus([]string{"paid", "shipped"})).Scan(&orders)
// SELECT * FROM `product_order` WHERE `amount`>1000 AND `status` IN('paid','shipped')
// Find all orders with an amount greater than 1000 that are paid or shipped
```

## Example 2: Pagination

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