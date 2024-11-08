---
slug: '/docs/core/gdb-senior-custom-type-converting'
title: 'ORM高级特性-自定义类型转换'
sidebar_position: 10
hide_title: true
description: '本页介绍了在GoFrame框架中如何实现ORM高级特性的自定义类型转换。您可以通过实现特定接口，将查询结果转换为自定义类型或作为struct属性使用。详细的类型转换方法请参考对应章节。这一功能增强了GoFrame框架的灵活性和扩展性，为开发者提供了更高效的解决方案。'
---

当我们需要将查询的结果转换到自定义的类型中，无论是作为直接转换的类型还是作为 `struct` 的属性，都可以通过实现特定的接口来实现。详细介绍请参考 [类型转换-UnmarshalValue](../../类型转换/类型转换-UnmarshalValue.md) 章节。