---
slug: '/docs/components/os-gctx'
title: '上下文-gctx'
sidebar_position: 3
hide_title: true
keywords: [GoFrame,GoFrame框架,gctx,上下文管理,链路跟踪,进程初始化,上下文对象,组件API,New方法,GetInitCtx]
description: '本文档介绍了GoFrame框架中gctx组件的基本概念及常用方法。gctx用于简化链路跟踪及上下文对象的管理，方便进程初始化和上下文操作。主要涉及的内容包括如何创建和获取支持链路跟踪的上下文对象，以及在进程和init包中的应用。结合示例代码和API文档，可更详细地了解gctx的实际应用。'
---

## 基本介绍

`gctx` 组件实现了对上下文操作的封装，用以简化链路跟踪以及进程初始化上下文对象的管理。

## 常用方法

这里只简单介绍几个常用的方法，其他方法请查看组件API文档或者源码。

### `New`

用以创建一个带有链路跟踪能力的上下文对象。

### `GetInitCtx`

用在启动进程或者init包方法中，用于获取当前进程带有链路跟踪能力的上下文对象，也用于进程间传递链路跟踪信息。