---
slug: '/docs/core/gdb-chaining-query-scan-and-count'
title: 'Model Query - ScanAndCount'
sidebar_position: 4
hide_title: true
keywords: [GoFrame, GoFrame Framework, ORM Query, ScanAndCount, Pagination Query, Limit, Page, Data Query, Total Count Query, Chaining Query]
description: "When using the GoFrame framework for ORM queries, simplify pagination query scenarios. With the ScanAndCount method, data queries and total count queries can be completed in a single operation, effectively reducing code redundancy and improving development efficiency. Suitable for situations where both data and its total count need to be obtained, such as pagination queries."
---

## Introduction

In pagination query scenarios, we often need to first call the `Scan` method combined with the `Limit/Page` chaining operation method to query the list, and then remove the `Limit/Page` chaining operation method to query the total count. This process is quite cumbersome, so from version `v2.5.0`, the framework provides the `ScanAndCount` method to simplify pagination query scenarios.

## Example Usage
:::tip
The sample code is derived from business project cases and is for reference and understanding only, it cannot run independently.
:::
Using traditional pagination query logic code:

```go
// GetList retrieves the user list of the instance.
func (s sUserInfo) GetList(ctx context.Context, in model.UserInfoGetListInput) (items []entity.UserInfo, total int, err error) {
    items = make([]entity.UserInfo, 0)
    orm := dao.UserInfo.Ctx(ctx).Where(do.UserInfo{
        ResourceId: in.ResourceId,
        Status:     in.Statuses,
    })
    err = orm.Order(in.OrderBy, in.OrderDirection).Limit(in.Offset, in.Limit).Scan(&items)
    if err != nil {
        return
    }
    total, err = orm.Count()
    return
}
```

Using the `ScanAndCount` method for pagination queries:

```go
// GetList retrieves the user list of the instance.
func (s sUserInfo) GetList(ctx context.Context, in model.UserInfoGetListInput) (items []entity.UserInfo, total int, err error) {
    items = make([]entity.UserInfo, 0)
    err = dao.UserInfo.Ctx(ctx).Where(do.UserInfo{
            ResourceId: in.ResourceId,
            Status:     in.Statuses,
        }).
        Order(in.OrderBy, in.OrderDirection).
        Limit(in.Offset, in.Limit).
        ScanAndCount(&items, &total, false)
    return
}
```

## Notes

- It is only used in scenarios where both data and total count need to be queried, generally in pagination scenarios.
- The third parameter of `ScanAndCount`, `useFieldForCount`, indicates whether to use `Fields` as the parameter for `Count` operation. Generally, it should be `false`, meaning that the `COUNT(1)` query is performed for the total count. Passing `true` means using the fields of the query as the parameter for the `COUNT` method.
