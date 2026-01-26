---
slug: '/docs/core/gdb-chaining-soft-time'
title: 'ORM Model - Time Fields'
sidebar_position: 11
hide_title: true
keywords: [GoFrame, GoFrame Framework, ORM, Chaining Operations, Time Maintenance, gdb, Auto-Fill, Soft Delete, Presentation Layer, Data Operation]
description: "The time maintenance feature when using ORM chaining operations in the gdb module of the GoFrame framework. By automatically filling in creation, update, and deletion times, development efficiency is significantly improved. The article elaborates on how to enable these features and implement them during database operations such as insertions, updates, and deletions. Additionally, it provides solutions for scenarios like soft deletion and ignoring time maintenance."
---

## Introduction
:::warning
Note that this feature is only effective for chaining operations.
:::
The `gdb` module supports the automatic filling of creation, update, and deletion times for data records, improving development and maintenance efficiency. To facilitate unified maintenance of time field names and types, if using this feature, we have the following conventions:

- The field type can be a time type, numeric integer, or boolean, such as: `date`, `datetime`, `timestamp`, `int`, `uint`, `big int`, `bool`, etc.
- Field names can be customized, with default naming conventions being:
  - `created_at` is updated during record creation and is only written once.
  - `updated_at` is updated during record modification and is updated each time the record changes.
  - `deleted_at` is for the soft delete feature of the record and is only written once when the record is deleted.
Field names are case-insensitive and ignore special characters, for example, `CreatedAt`, `UpdatedAt`, `DeletedAt` are also supported.

## Feature Configuration

Time field names can be customized in the configuration file, and the feature can be completely disabled on the database instance using the `timeMaintainDisabled` configuration.

Corresponding configuration items in the configuration file:

```yaml
database:
  default:                      # Group name, customizable, default is "default"
    createdAt: "created_at"     # (Optional) Auto-create time field name
    updatedAt: "updated_time"   # (Optional) Auto-update time field name
    deletedAt: "is_deleted"     # (Optional) Soft delete time field name
    timeMaintainDisabled: false # (Optional) Whether to completely disable the time update feature. If true, CreatedAt/UpdatedAt/DeletedAt will be ineffective
```

:::tip
Especially for historical projects, where different time field names already exist, the time field names can be flexibly configured using configuration items.
:::

For a complete database configuration, please refer to the [ORM - Configuration](../../ORM使用配置/ORM使用配置.md) section.

## Feature Activation

When a data table contains any or multiple fields such as `created_at`, `updated_at`, `deleted_at`, or contains corresponding configuration fields in the configuration file, this feature is automatically enabled.

## Documentation

import DocCardList from '@theme/DocCardList';

<DocCardList />