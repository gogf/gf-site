---
slug: '/docs/core/gdb-chaining-query-scan-and-count'
title: 'ORM查询-ScanAndCount'
sidebar_position: 4
hide_title: true
keywords: [GoFrame,GoFrame框架,ORM查询,ScanAndCount,分页查询,Limit,Page,数据查询,总数量查询,链式查询]
description: '在使用GoFrame框架进行ORM查询时简化分页查询场景。通过ScanAndCount方法，可以在一次操作中完成数据查询和总数量查询，有效减少代码冗余，提高开发效率。适用于需要同时获取数据和其总数量的情况，如分页查询。'
---

## 基本介绍

在分页查询场景中，我们往往需要先调用 `Scan` 方法结合 `Limit/Page` 链式操作方法查询列表，随后再去掉 `Limit/Page` 链式操作方法查询总数量。这一过程较为繁琐，因此从 `v2.5.0` 版本开始，框架提供了 `ScanAndCount` 方法，用于简化分页查询的场景。

## 使用示例
:::tip
示例代码来源于业务项目案例，仅供参考理解，无法独立运行。
:::
使用传统的分页查询逻辑代码：

```go
// GetList 获取实例的用户列表.
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

使用 `ScanAndCount` 方法实现分页查询：

```go
// GetList 获取实例的用户列表.
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

## 注意事项

- 仅用于需要同时查询数据和总数量的场景，一般为分页场景。
- `ScanAndCount` 的第 `3` 个参数 `useFieldForCount` 表示是否在执行 `Count` 操作的时候将 `Fields` 作为 `Count` 参数，一般为 `false` 即可，表示执行 `COUNT(1)` 查询总数量。传递 `true` 表示执行使用查询的字段作为 `COUNT` 方法的参数。

## 配合 PageCache 使用

从 `v2.9.8` 版本开始，`ScanAndCount` 支持通过 `PageCache` 方法为 count 查询和 data 查询配置不同的缓存策略：

**示例代码**

```go
import (
    "time"
    "github.com/gogf/gf/v2/database/gdb"
)

// GetList 获取实例的用户列表，使用分离的缓存策略
func (s sUserInfo) GetList(ctx context.Context, in model.UserInfoGetListInput) (items []entity.UserInfo, total int, err error) {
    items = make([]entity.UserInfo, 0)
    err = dao.UserInfo.Ctx(ctx).PageCache(
        gdb.CacheOption{
            Duration: 30 * time.Minute, // count 查询缓存 30 分钟
            Name:     "user-count",
            Force:    false,
        },
        gdb.CacheOption{
            Duration: 5 * time.Minute,  // data 查询缓存 5 分钟
            Name:     "user-data",
            Force:    false,
        },
    ).Where(do.UserInfo{
        ResourceId: in.ResourceId,
        Status:     in.Statuses,
    }).
    Order(in.OrderBy, in.OrderDirection).
    Limit(in.Offset, in.Limit).
    ScanAndCount(&items, &total, false)
    return
}
```

**使用说明**

- `PageCache` 的第一个参数用于配置 count 查询的缓存选项。
- `PageCache` 的第二个参数用于配置 data 查询的缓存选项。
- 在分页场景中，通常 count 查询可以设置较长的缓存时间，data 查询设置较短的缓存时间。
- 在事务操作下缓存功能不可用。

更多缓存配置说明请参考：[ORM链式操作-查询缓存](../ORM链式操作-查询缓存.md)