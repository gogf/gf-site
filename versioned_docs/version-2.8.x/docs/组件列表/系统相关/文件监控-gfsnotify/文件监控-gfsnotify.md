---
slug: '/docs/components/os-gfsnotify'
title: '文件监控-gfsnotify'
sidebar_position: 13
hide_title: true
keywords: [GoFrame,GoFrame框架,gfsnotify,文件监控,Go框架,文件操作,监控模块,Go开发,系统监控,目录监控]
description: '使用GoFrame框架中gfsnotify模块来实现文件和目录的监控。gfsnotify能够检测文件的增加、删除、修改、重命名等变动操作，并提供方便的接口函数如Add和Remove进行监控和取消监控操作。适用于*nix系统的inotify机制，在使用时会受到系统内核参数的限制。通过实例代码展示如何设置、移除监控及进行文件操作监控。'
---


## 基本介绍

`gfsnotify` 能监控指定文件/目录的改变，如文件的增加、删除、修改、重命名等操作。

**使用方式**：

```go
import "github.com/gogf/gf/v2/os/gfsnotify"
```

**接口文档**：

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gfsnotify](https://pkg.go.dev/github.com/gogf/gf/v2/os/gfsnotify)

推荐使用 `gfsnotify` 模块提供的 `Add` 和 `Remove` 模块方法，用于添加监控和取消监控。推荐原因见随后章节说明。

此外也可能通过 `New` 方法创建一个监控管理对象之后再进行监控管理。其中，添加监控的时候需要给定触发监控时的回调函数，参数类型为 `*gfsnotify.Event` 对象指针。

## 相关文档

import DocCardList from '@theme/DocCardList';

<DocCardList />

