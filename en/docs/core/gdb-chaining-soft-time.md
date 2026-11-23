# ORM Model - Time Fields

## Introduction

**Warning**

Note that this feature is only effective for chaining operations.

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


**Tip**

Especially for historical projects, where different time field names already exist, the time field names can be flexibly configured using configuration items.

For a complete database configuration, please refer to the [ORM - Configuration](https://goframe.org/en/docs/core/gdb-config.md) section.

## Feature Activation

When a data table contains any or multiple fields such as `created_at`, `updated_at`, `deleted_at`, or contains corresponding configuration fields in the configuration file, this feature is automatically enabled.

## Documentation

Child pages:

- [Time Fields - Intro](https://goframe.org/en/docs/core/gdb-chaining-soft-time-example.md)
- [Time Fields - Integer Fields](https://goframe.org/en/docs/core/gdb-chaining-soft-time-numeric-fields.md)
- [Time Fields - Boolean Fields](https://goframe.org/en/docs/core/gdb-chaining-soft-time-bool-fields.md)
- [Time Fields - SoftTimeOption](https://goframe.org/en/docs/core/gdb-chaining-soft-time-option.md)

> Page: https://goframe.org/en/docs/core/gdb-chaining-soft-time
