---
slug: '/docs/core/gdb-transaction'
title: 'ORM事务处理'
sidebar_position: 3
hide_title: true
keywords: [GoFrame,GoFrame框架,ORM事务,事务处理,闭包操作,事务安全,嵌套事务,数据库,事务接口,Go开发]
description: '使用GoFrame框架的ORM组件进行事务操作非常简便且安全，有两种方式：常规操作和闭包操作。常规操作通过Begin开启事务，返回一个事务接口gdb.TX，而闭包操作通过Transaction方法封装事务逻辑，并自动管理事务的关闭，支持嵌套事务，推荐使用闭包操作以确保事务安全。'
---


使用 `GoFrame ORM` 组件进行事务操作非常简便、安全，可以通过两种操作方式来实现。

1. 常规操作：通过 `Begin` 开启事务之后会返回一个事务操作接口 `gdb.TX`，随后可以使用该接口进行如之前章节介绍的方法操作和链式操作。常规操作容易漏掉关闭事务，有一定的事务操作安全风险。
2. 闭包操作：通过 `Transaction` 闭包方法的形式来操作事务，所有的事务逻辑在闭包中实现，闭包结束后自动关闭事务保障事务操作安全。并且闭包操作支持非常便捷的 **嵌套事务**，嵌套事务在业务操作中透明无感知。
:::tip
我们推荐事务操作均统一采用 `Transaction` 闭包方式实现。
:::
接口文档： [https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#TX](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#TX)

import DocCardList from '@theme/DocCardList';

<DocCardList />