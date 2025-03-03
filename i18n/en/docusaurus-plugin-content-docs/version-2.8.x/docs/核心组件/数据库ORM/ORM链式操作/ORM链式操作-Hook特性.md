---
slug: '/docs/core/gdb-chaining-hook'
title: 'ORM Model - Hook'
sidebar_position: 13
hide_title: true
keywords: [GoFrame framework, ORM chaining operation, Hook feature, CRUD hooks, Model, database query, gdb, Go language, programming examples, code optimization]
description: "Using the Hook feature in the GoFrame framework to bind CRUD hooks to Model objects, thereby enhancing and optimizing database operations. The article provides a detailed introduction to relevant definitions, Hook registration methods, and usage examples, demonstrating query operations through hook functions."
---

The `Hook` feature allows us to bind `CRUD` hooks to the `Model` of the feature.

## Relevant Definitions

Relevant `Hook` functions:

```go
type (
    HookFuncSelect func(ctx context.Context, in *HookSelectInput) (result Result, err error)
    HookFuncInsert func(ctx context.Context, in *HookInsertInput) (result sql.Result, err error)
    HookFuncUpdate func(ctx context.Context, in *HookUpdateInput) (result sql.Result, err error)
    HookFuncDelete func(ctx context.Context, in *HookDeleteInput) (result sql.Result, err error)
)

// HookHandler manages all supported hook functions for Model.
type HookHandler struct {
    Select HookFuncSelect
    Insert HookFuncInsert
    Update HookFuncUpdate
    Delete HookFuncDelete
}
```

`Hook` registration method:

```go
// Hook sets the hook functions for current model.
func (m *Model) Hook(hook HookHandler) *Model
```

## Usage Example

When querying the `birth_day` field, also calculate the current user's age:

```go
// Hook function definition.
var hook = gdb.HookHandler{
    Select: func(ctx context.Context, in *gdb.HookSelectInput) (result gdb.Result, err error) {
        result, err = in.Next(ctx)
        if err != nil {
            return
        }
        for i, record := range result {
            if !record["birth_day"].IsEmpty() {
                age := gtime.Now().Sub(record["birth_day"].GTime()).Hours() / 24 / 365
                record["age"] = gvar.New(age)
            }
            result[i] = record
        }
        return
    },
}
// It registers the hook function, creates and returns a new `model`.
model := g.Model("user").Hook(hook)

// The hook function takes effect on each ORM operation when using the `model`.
all, err := model.Where("status", "online").OrderAsc(`id`).All()
```