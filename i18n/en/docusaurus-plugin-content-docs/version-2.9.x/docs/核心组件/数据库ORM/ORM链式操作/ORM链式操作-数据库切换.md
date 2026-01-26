---
slug: '/docs/core/gdb-chaining-schema'
title: 'ORM Model - Schema'
sidebar_position: 12
hide_title: true
keywords: [GoFrame, GoFrame Framework, ORM, Chaining Operations, Database Switching, DB Object, Model Object, Configuration Group, Schema Method, Cross-Domain Operations]
description: "When using the GoFrame framework for ORM chaining operations, the database can be switched. We can achieve various database switching schemes through different configuration groups, changing the database configuration of singleton objects at runtime, using the Schema method for chaining operations, and including the database name in table names. These methods provide developers with flexible database operation options."
---

We know that the database configuration supports configuring a default database, so the `DB` object and `Model` object are bound to a specific database when initialized. There are several ways to switch databases at runtime (assuming our databases include a `user` user database and an `order` database):

1. Achieved through different configuration groups. This requires configuring different group settings in the configuration file, and then you can obtain a singleton object of a specific database in the program via `g.DB("group name")`.
2. Switch the database of a singleton object at runtime using the `DB.SetSchema` method. Note that since the database configuration of the singleton object is modified, the impact is global:
   ```go
   g.DB().SetSchema("user-schema")
   g.DB().SetSchema("order-schema")
   ```

3. Create a `Schema` database object using the chaining operation `Schema` method, and create a model object through this database object to perform subsequent chaining operations:
   ```go
   g.DB().Schema("user-schema").Model("user").All()
   g.DB().Schema("order-schema").Model("order").All()
   ```

4. You can also set the corresponding database for the current chaining operation using the chaining operation `Model.Schema` method. If not set, the default connected database of the `DB` or `TX` is used:
   ```go
   g.Model("user").Schema("user-schema").All()
   g.Model("order").Schema("order-schema").All()
   ```
   :::tip
   Note the difference between the two usage methods: the former creates a `Model` object after the `Schema` object and then executes operations; the latter achieves database switching by modifying the database name of the current `Model` object operation.
   :::
5. Additionally, if the current database operation's configured user has permission, cross-domain operations can be achieved directly by including the database name in the table name, even for cross-domain association queries:
   ```go
   // SELECT * FROM `order`.`order` o LEFT JOIN `user`.`user` u ON (o.uid=u.id) WHERE u.id=1 LIMIT 1
   g.Model("order.order o").LeftJoin("user.user u", "o.uid=u.id").Where("u.id", 1).One()
   ```