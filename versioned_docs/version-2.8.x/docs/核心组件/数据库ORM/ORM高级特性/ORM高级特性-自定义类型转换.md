---
slug: '/docs/core/gdb-senior-custom-type-converting'
title: 'ORM高级特性-自定义类型转换'
sidebar_position: 10
hide_title: true
description: '在GoFrame框架中使用ORM的自定义类型转换特性，通过特定接口将查询结果转换为所需类型，无论是直接类型还是struct属性。此功能增强了GoFrame框架的灵活性，提供高效解决方案，助力开发者实现更高级的数据库交互。'
keywords: [GoFrame,GoFrame框架,ORM,自定义类型转换,类型转换接口,查询结果处理,灵活扩展,高效解决方案,struct属性,UnmarshalValue]
---

当我们需要将查询的结果转换到自定义的类型中，无论是作为直接转换的类型还是作为 `struct` 的属性，都可以通过实现特定的接口来实现。详细介绍请参考 [类型转换-UnmarshalValue](../../类型转换/类型转换-UnmarshalValue.md) 章节。