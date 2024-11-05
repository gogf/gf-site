---
slug: '/docs/core/gdb-transaction'
title: 'ORM事务处理'
sidebar_position: 3
hide_title: true
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