---
slug: '/docs/core/gdb-chaining-fields-retrieving'
title: 'ORM Model - Fields Retrieval'
sidebar_position: 7
hide_title: true
keywords: [ORM, chaining operations, field retrieval, FieldsStr, FieldsExStr, GoFrame, GoFrame framework, database fields, field prefix, field exclusion]
description: "Techniques for retrieving database table fields using ORM chaining operations in the GoFrame framework, including using FieldsStr and FieldsExStr methods to retrieve fields of a specified table and uses of field exclusion, supporting custom field prefixes to enhance development efficiency and code readability."
---

## `FieldsStr/FieldsExStr` Field Retrieval

1. `FieldsStr` is used to retrieve fields of a specified table, with an optional field prefix. The fields are returned as a string, concatenated using a "," symbol.
2. `FieldsExStr` is used to retrieve fields from a specified table, excluding certain fields, with an optional field prefix. The fields are returned as a string, concatenated using a "," symbol.

### `FieldsStr` Example

1. Suppose the `user` table has 4 fields: `uid`, `nickname`, `passport`, `password`.
2. Retrieve fields:
    ```go
    // uid,nickname,passport,password
    g.Model("user").FieldsStr()
    ```

3. Retrieve fields with a specified prefix:
    ```go
    // gf_uid,gf_nickname,gf_passport,gf_password
    g.Model("user").FieldsStr("gf_")
    ```

### `FieldsExStr` Example

1. Suppose the `user` table has 4 fields: `uid`, `nickname`, `passport`, `password`.
2. Retrieve fields excluding some:
    ```go
    // uid,nickname
    g.Model("user").FieldsExStr("passport, password")
    ```

3. Retrieve fields excluding some with a specified prefix:
    ```go
    // gf_uid,gf_nickname
    g.Model("user").FieldsExStr("passport, password", "gf_")
    ```