---
slug: '/docs/components/os-gtime'
title: '时间管理-gtime'
sidebar_position: 6
hide_title: true
keywords: [GoFrame,GoFrame框架,时间管理,gtime,日期格式化,PHP date,通用时间模块,时间扩展,时间日期方法,自定义格式]
description: 'gtime模块是GoFrame框架的通用时间管理模块，拓展了Golang标准库time的功能，提供了自定义的日期格式化语法，对PHP的date函数格式有良好兼容性，使PHP开发者在Go中实现时间管理时更加便利。'
---

## 基本介绍

通用时间管理模块，封装了常用的时间/日期相关的方法，作为标准库 `time` 的功能性扩展，提供了更多的功能特性。支持自定义的日期格式化语法，格式化语法灵感来源于 `PHP` 的 `date` 函数语法 ( [http://php.net/manual/zh/function.date.php](http://php.net/manual/zh/function.date.php) )。
:::tip
`gtime` 的时间格式语法对于熟悉 `PHP` 的开发者来说非常友好。
:::
**使用方式**：

```go
import "github.com/gogf/gf/v2/os/gtime"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gtime](https://pkg.go.dev/github.com/gogf/gf/v2/os/gtime)

## 相关文档
import DocCardList from '@theme/DocCardList';

<DocCardList />