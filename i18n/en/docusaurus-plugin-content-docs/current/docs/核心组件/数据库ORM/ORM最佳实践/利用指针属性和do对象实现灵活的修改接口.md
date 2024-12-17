---
slug: '/docs/core/gdb-practice-using-pointer-and-do-for-update-api'
title: 'Utilizing Pointer Properties and Do Objects for Flexible Modification Interfaces'
sidebar_position: 0
hide_title: true
keywords: [GoFrame, GoFrame framework, do objects, pointer, API, user information modification, database update, request parameters, business logic, automatic filtering]
description: "Utilizing pointer and do objects in the GoFrame framework to implement flexible modification interface APIs. By using attributes with pointer types and do objects, developers can easily perform user information modification operations, including updates to fields like password, nickname, and status, effectively simplifying the complexity of database updates."
---

It is well known that the framework's built-in development tools can generate `do` object code, primarily used for operations such as query, modification, and writing that automatically filter `nil` operation fields.

Today, I will teach you a new way to quickly implement flexible and convenient modification operations `API` implementation using pointers in combination with `do` objects.

## Data Structure

Here is the data structure of the user table we are using:

```sql
CREATE TABLE `user` (
    `id`        int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'User ID',
    `passport`  varchar(32) NOT NULL COMMENT 'Account',
    `password`  varchar(32) NOT NULL COMMENT 'Password',
    `nickname`  varchar(32) NOT NULL COMMENT 'Nickname',
    `status`    varchar(32) NOT NULL COMMENT 'Status',
    `brief`     varchar(512) NOT NULL COMMENT 'Remarks',
    `create_at` datetime DEFAULT NULL COMMENT 'Creation Time',
    `update_at` datetime DEFAULT NULL COMMENT 'Modification Time',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_passport` (`passport`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

For the user status, we use a separate type definition to implement enumeration values:

```go
type Status string

const (
    StatusEnabled  Status = "enabled"
    StatusDisabled Status = "disabled"
)
```

Using the `gf gen dao` command, the automatically generated `do` objects are as follows:

```go
type User struct {
    g.Meta    `table:"user" orm:"do:true"`
    Id        interface{}
    Passport  interface{}
    Password  interface{}
    Nickname  interface{}
    Status    interface{}
    Brief     interface{}
    CreatedAt interface{}
    UpdatedAt interface{}
}
```

## Request API Definition

Let's implement an API interface for modifying user information, which is a maintenance management interface that can modify user information through the user account name. The definition of this `API` is as follows:

```go
type UpdateReq struct {
    g.Meta   `path:"/user/{Id}" method:"post" summary:"Modify user information"`
    Passport string  `v:"required" dc:"User account"`
    Password *string `dc:"Modify user password"`
    Nickname *string `dc:"Modify user nickname"`
    Status   *Status `dc:"Modify user status"`
    Brief    *string `dc:"Modify user description"`
}
```

Here, the user's modifiable information includes password, nickname, status, and description, which may be modified individually or in combination. Pointer-type attribute parameters are used here to implement: execute modification when the parameter is passed, do not modify when it is not passed.

## Business Logic Implementation

For simplicity, we directly pass pointer parameters to the `do` object within the controller. We know that when the parameter is not passed by the caller, the parameter is `nil`. Therefore, when the field is passed to the `do` object, it is still `nil`, and during the database update operation, the `nil` field in the `do` object will be automatically filtered out.

```go
func (c *Controller) Update(ctx context.Context, req *v1.UpdateReq) (res *v1.UpdateRes, err error) {
    _, err = dao.User.Ctx(ctx).Data(do.User{
        Password: req.Password,
        Nickname: req.Nickname,
        Status:   req.Status,
        Brief:    req.Brief,
    }).Where(do.User{
        Passport: req.Passport,
    }).Update()
    return
}
```