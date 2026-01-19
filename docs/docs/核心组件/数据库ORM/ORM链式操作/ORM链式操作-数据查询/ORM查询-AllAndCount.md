---
slug: '/docs/core/gdb-chaining-query-all-and-count'
title: 'ORM查询-AllAndCount'
sidebar_position: 2
hide_title: true
keywords: [GoFrame,GoFrame框架,ORM查询,AllAndCount,分页查询,数据查询,总数量查询,v2.5.0,记录列表,查询逻辑简化]
description: '该文档介绍了GoFrame框架中从v2.5.0版本开始提供的AllAndCount方法，该方法用于在分页查询场景中同时检索数据记录列表及总数量，简化查询逻辑。通过在查询时忽略Limit/Page操作，AllAndCount方法能够提供一种便捷的方式对数据进行检索和计数。'
---

## 基本介绍
该方法从 `v2.5.0` 版本开始提供，用于同时查询数据记录列表及总数量，一般用于分页查询场景中，简化分页查询逻辑。

方法定义：

```go
// AllAndCount retrieves all records and the total count of records from the model.
// If useFieldForCount is true, it will use the fields specified in the model for counting;
// otherwise, it will use a constant value of 1 for counting.
// It returns the result as a slice of records, the total count of records, and an error if any.
// The where parameter is an optional list of conditions to use when retrieving records.
//
// Example:
//
//    var model Model
//    var result Result
//    var count int
//    where := []interface{}{"name = ?", "John"}
//    result, count, err := model.AllAndCount(true)
//    if err != nil {
//        // Handle error.
//    }
//    fmt.Println(result, count)
func (m *Model) AllAndCount(useFieldForCount bool) (result Result, totalCount int, err error)
```

在方法内部查询总数量时，将会忽略查询中的 `Limit/Page` 操作。

## 使用示例

**基础查询**

```go
// SELECT `uid`,`name` FROM `user` WHERE `status`='deleted' LIMIT 0,10
// SELECT COUNT(`uid`,`name`) FROM `user` WHERE `status`='deleted'
all, count, err := Model("user").Fields("uid", "name").Where("status", "deleted").Limit(0, 10).AllAndCount(true)

// SELECT `uid`,`name` FROM `user` WHERE `status`='deleted' LIMIT 0,10
// SELECT COUNT(1) FROM `user` WHERE `status`='deleted'
all, count, err := Model("user").Fields("uid", "name").Where("status", "deleted").Limit(0, 10).AllAndCount(false)
```

**配合 PageCache 使用**

从 `v2.9.8` 版本开始，`AllAndCount` 支持通过 `PageCache` 方法为 count 查询和 data 查询配置不同的缓存策略：

```go
import (
    "time"
    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/frame/g"
)

// 为 count 查询和 data 查询设置不同的缓存时间
result, total, err := g.Model("user").Ctx(ctx).PageCache(
    gdb.CacheOption{
        Duration: time.Hour,        // count 查询缓存 1 小时
        Name:     "user-count",
        Force:    false,
    },
    gdb.CacheOption{
        Duration: 5 * time.Minute,  // data 查询缓存 5 分钟
        Name:     "user-data",
        Force:    false,
    },
).Where("status", "active").Limit(0, 10).AllAndCount(false)
```

更多缓存配置说明请参考：[ORM链式操作-查询缓存](../ORM链式操作-查询缓存.md)