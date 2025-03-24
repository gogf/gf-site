---
slug: '/docs/core/gdb-chaining-query-join'
title: 'Model Query - Join'
sidebar_position: 5
hide_title: true
keywords: [ORM Query, LeftJoin, RightJoin, InnerJoin, GoFrame, Associated Query, Table Alias, Field Operator, Join Query, Data Aggregation]
description: "How to use ORM for LeftJoin, RightJoin, and InnerJoin queries in the GoFrame framework, including different associated query methods and their application scenarios. The article emphasizes caution in using Join operations in scenarios with large data volume and high concurrency, recommending code-based data aggregation. It also provides examples of join queries using custom table aliases and field operators, along with specific usage methods combined with dao."
---

## `*Join` Series Methods

1. `LeftJoin` Left associative query.
2. `RightJoin` Right associative query.
3. `InnerJoin` Inner associative query.
:::note
Actually, we do not recommend using `Join` for join queries, especially in scenarios with large data volumes and high concurrent request volumes, as it can easily cause performance issues and increase maintenance complexity. It is recommended to use it when necessary.
Additionally, you can refer to 
[Model Association - ScanList](../ORM链式操作-模型关联/模型关联-动态关联-ScanList.md) 
section where the database is responsible only for storing data and performing simple single-table operations, with data aggregation being implemented at the code level using the functionalities provided by `ORM`.
:::
Example usage:

```go
// Query the first record that meets the condition
// SELECT u.*,ud.site FROM user u LEFT JOIN user_detail ud ON u.uid=ud.uid WHERE u.uid=1 LIMIT 1
g.Model("user u").LeftJoin("user_detail ud", "u.uid=ud.uid").Fields("u.*,ud.site").Where("u.uid", 1).One()

// Query specific field values
// SELECT ud.site FROM user u RIGHT JOIN user_detail ud ON u.uid=ud.uid WHERE u.uid=1 LIMIT 1
g.Model("user u").RightJoin("user_detail ud", "u.uid=ud.uid").Fields("ud.site").Where("u.uid", 1).Value()

// Grouping and ordering
// SELECT u.*,ud.city FROM user u INNER JOIN user_detail ud ON u.uid=ud.uid GROUP BY city ORDER BY register_time asc
g.Model("user u").InnerJoin("user_detail ud", "u.uid=ud.uid").Fields("u.*,ud.city").Group("city").Order("register_time asc").All()

// Join query without using join
// SELECT u.*,ud.city FROM user u,user_detail ud WHERE u.uid=ud.uid
g.Model("user u,user_detail ud").Where("u.uid=ud.uid").Fields("u.*,ud.city").All()
```

## Custom Table Alias

```go
// SELECT * FROM `user` AS u LEFT JOIN `user_detail` as ud ON(ud.id=u.id) WHERE u.id=1 LIMIT 1
g.Model("user", "u").LeftJoin("user_detail", "ud", "ud.id=u.id").Where("u.id", 1).One()
g.Model("user").As("u").LeftJoin("user_detail", "ud", "ud.id=u.id").Where("u.id", 1).One()
```

## `*JoinOnFields` Series Methods

The methods `LeftJoinOnFields/RightJoinOnFields/InnerJoinOnFields` allow specifying fields and operators for `join` queries. Example usage:

```go
// Query the first record that meets the condition
// SELECT user.*,user_detail.address FROM user LEFT JOIN user_detail ON (user.id = user_detail.uid) WHERE user.id=1 LIMIT 1
g.Model("user").LeftJoinOnFields("user_detail", "id", "=", "uid").Fields("user.*,user_detail.address").Where("id", 1).One()

// Query multiple records
// SELECT user.*,user_detail.address FROM user RIGHT JOIN user_detail ON (user.id = user_detail.uid)
g.Model("user").RightJoinOnFields("user_detail", "id", "=", "uid").Fields("user.*,user_detail.address").All()
```

## Example Usage with `dao`

```go
// SELECT resource_task_schedule.id,...,time_window.time_window
// FROM `resource_task_schedule`
// LEFT JOIN `time_window` ON (`resource_task_schedule`.`resource_id`=`time_window`.`resource_id`)
// WHERE (time_window.`status`="valid") AND (`time_window`.`start_time` <= 3600)
var (
    orm                = dao.ResourceTaskSchedule.Ctx(ctx)
    tsTable            = dao.ResourceTaskSchedule.Table()
    tsCls              = dao.ResourceTaskSchedule.Columns()
    twTable            = dao.TimeWindow.Table()
    twCls              = dao.TimeWindow.Columns()
    scheduleItems      []scheduleItem
)
orm = orm.FieldsPrefix(tsTable, tsCls)
orm = orm.FieldsPrefix(twTable, twCls.TimeWindow)
orm = orm.LeftJoinOnField(twTable, twCls.ResourceId)
orm = orm.WherePrefix(twTable, twCls.Status, "valid")
orm = orm.WherePrefixLTE(twTable, twCls.StartTime, 3600)
err = orm.Scan(&scheduleItems)
```

```go
// SELECT DISTINCT resource_info.* FROM `resource_info`
// LEFT JOIN `resource_network` ON (`resource_info`.`resource_id`=`resource_network`.`resource_id`)
// WHERE (`resource_info`.`resource_id` like '%10.0.1.3%')
// or (`resource_info`.`resource_name` like '%10.0.1.3%')
// or (`resource_network`.`vip`like '%10.0.1.3%')
// ORDER BY `id` Desc LIMIT 0,2
var (
    orm    = dao.ResourceInfo.Ctx(ctx).OmitEmpty()
    rTable = dao.ResourceInfo.Table()
    rCls   = dao.ResourceInfo.Columns()
    nTable = dao.ResourceNetwork.Table()
    nCls   = dao.ResourceNetwork.Columns()
)
orm = orm.LeftJoinOnField(nTable, rCls.ResourceId)
orm = orm.WherePrefix(rTable, do.ResourceInfo{
    AppId:        req.AppIds,
    ResourceId:   req.ResourceIds,
    Region:       req.Regions,
    Zone:         req.Zones,
    ResourceName: req.ResourceNames,
    Status:       req.Statuses,
    BusinessType: req.Products,
    Engine:       req.Engines,
    Version:      req.Versions,
})
orm = orm.WherePrefix(nTable, do.ResourceNetwork{
    Vip:      req.Vips,
    VpcId:    req.VpcIds,
    SubnetId: req.SubnetIds,
})
// Fuzzy like querying.
if req.Key != "" {
    var (
        keyLike = "%" + req.Key + "%"
    )
    whereFormat := fmt.Sprintf(
        "(`%s`.`%s` like ?) or (`%s`.`%s` like ?) or (`%s`.`%s`like ?) ",
        rTable, rCls.ResourceId,
        rTable, rCls.ResourceName,
        nTable, nCls.Vip,
    )
    orm = orm.Where(whereFormat, keyLike, keyLike, keyLike)
}
// Resource items.
err = orm.Distinct().FieldsPrefix(rTable, "*").Order(req.Order, req.OrderDirection).Limit(req.Offset, req.Limit).Scan(&res.Items)
```