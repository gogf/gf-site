---
slug: '/quick/scaffold-api-implements'
title: 'Step5 - Implement API Logic'
hide_title: true
sidebar_position: 5
keywords: [GoFrame, CRUD Logic, API Creation, Parameter Validation, Update API, Delete API, Retrieve API, Database Operations, Scaffold Tool, Business Logic Implementation]
description: "Use GoFrame framework to complete API logic implementation. By using the project scaffolding, pre-generate code unrelated to project business logic and focus on business logic implementation. The specific implementation process of CRUD operations, including creation, update, deletion, and retrieval of APIs, is introduced. It elaborates on parameter validation, form data insertion and update, intelligent data mapping, validation mechanism, and efficiently utilizing GoFrame framework functionalities during data operations."
---

As you can see, with the project scaffold tool, a lot of code unrelated to the project's business logic has already been pre-generated, so we only need to focus on the business logic implementation. Let's take a look at how to implement the specific `CRUD` logic.

## `Create`

### Implementation of Creation Logic
```go title="internal/controller/user/user_v1_create.go"
package user

import (
    "context"

    "demo/api/user/v1"
    "demo/internal/dao"
    "demo/internal/model/do"
)

func (c *ControllerV1) Create(ctx context.Context, req *v1.CreateReq) (res *v1.CreateRes, err error) {
    insertId, err := dao.User.Ctx(ctx).Data(do.User{
        Name:   req.Name,
        Status: v1.StatusOK,
        Age:    req.Age,
    }).InsertAndGetId()
    if err != nil {
        return nil, err
    }
    res = &v1.CreateRes{
        Id: insertId,
    }
    return
}
```
In the `Create` implementation method:
- We use `dao.User` through the `dao` component to operate the `user` table.
- Each `dao` operation requires passing the `ctx` parameter, so we create a `gdb.Model` object with the `Ctx(ctx)` method. This object is the framework's model object used to operate specific data tables.
- We use `Data` to pass the data that needs to be written to the data table. Here, we use the `do` conversion model object to input our data. The `do` conversion model automatically filters `nil` data and converts it to the corresponding data table field type at a lower level. In most cases, we use the `do` conversion model to pass write/update parameters, query conditions, and other data to the database operation object.
- The `InsertAndGetId` method writes the `Data` parameters into the database and returns the newly created record's primary key `id`.

### Parameter Validation Implementation

Hold on, you might wonder why there is no validation logic here. This is because the validation logic is already configured on the request parameter object `CreateReq`. Remember the `v` tag introduced earlier? Let's take another look at this request parameter object:
```go title="api/user/v1/user.go"
type CreateReq struct {
    g.Meta `path:"/user" method:"put" tags:"User" summary:"Create user"`
    Name   string `v:"required|length:3,10" dc:"user name"`
    Age    uint   `v:"required|between:18,200" dc:"user age"`
}
type CreateRes struct {
    Id int64 `json:"id" dc:"user id"`
}
```
The `required/length/between` validation rules here are automatically executed by the `GoFrame` framework's `Server` before calling the route function `Create`.
If the request parameter validation fails, an error will be returned immediately, and the route function will not be executed. This mechanism of the `GoFrame` framework greatly simplifies the development process,
developers only need to focus on the business logic implementation in this route function.
:::info
Of course, if there are some additional, customized business logic validations, they need to be implemented in the route function by yourself.
:::
## `Delete`

```go title="internal/controller/user/user_v1_delete.go"
package user

import (
    "context"

    "demo/api/user/v1"
    "demo/internal/dao"
)

func (c *ControllerV1) Delete(ctx context.Context, req *v1.DeleteReq) (res *v1.DeleteRes, err error) {
    _, err = dao.User.Ctx(ctx).WherePri(req.Id).Delete()
    return
}
```
The deletion logic is relatively straightforward. Here, we use a `WherePri` method, which takes the given parameter `req.Id` as the primary key for `Where` condition restriction.

## `Update`

```go title="internal/controller/user/user_v1_update.go"
package user

import (
    "context"

    "demo/api/user/v1"
    "demo/internal/dao"
    "demo/internal/model/do"
)

func (c *ControllerV1) Update(ctx context.Context, req *v1.UpdateReq) (res *v1.UpdateRes, err error) {
    _, err = dao.User.Ctx(ctx).Data(do.User{
        Name:   req.Name,
        Status: req.Status,
        Age:    req.Age,
    }).WherePri(req.Id).Update()
    return
}
```
The update API is also straightforward. Besides the already introduced `WherePri` method, it also requires using the `Data` method to pass the data to be updated when updating the data.

## `GetOne`

```go title="internal/controller/user/user_v1_get_one.go"
package user

import (
    "context"

    "demo/api/user/v1"
    "demo/internal/dao"
)

func (c *ControllerV1) GetOne(ctx context.Context, req *v1.GetOneReq) (res *v1.GetOneRes, err error) {
    res = &v1.GetOneRes{}
    err = dao.User.Ctx(ctx).WherePri(req.Id).Scan(&res.User)
    return
}
```
In the data retrieval API, we use a `Scan` method, which can intelligently map the retrieved single data table record to a structure object. It should be noted that the `User` attribute object in `&res.User` is actually not initialized and its value is `nil`. If data is retrieved, the `Scan` method will initialize and assign it. If no data is retrieved, the `Scan` method will do nothing, and its value will remain `nil`.

## `GetList`

```go title="internal/controller/user/user_v1_get_list.go"
package user

import (
    "context"

    "demo/api/user/v1"
    "demo/internal/dao"
    "demo/internal/model/do"
)

func (c *ControllerV1) GetList(ctx context.Context, req *v1.GetListReq) (res *v1.GetListRes, err error) {
    res = &v1.GetListRes{}
    err = dao.User.Ctx(ctx).Where(do.User{
        Age:    req.Age,
        Status: req.Status,
    }).Scan(&res.List)
    return
}
```
When retrieving list data, we also use the `Scan` method, which is very powerful. Like retrieving single data's logic, it only initializes `&res.List` when data is retrieved.

## Learning Summary

Example source code for this chapter: https://github.com/gogf/quick-demo/tree/main/internal/controller/user

As you can see, using the `GoFrame` database `ORM` component can very quickly and efficiently complete API development work. Throughout the `CRUD` API development, the business logic that developers need to implement requires only a few lines of code😼.

The improvement in development efficiency is not only due to the scaffold tool automatically generating the `dao` and `controller` code but also thanks to the powerful database `ORM` component. As you can see, when we operate the database table, the code is very concise and elegant, but the internal design of the database `ORM` component involves a lot of fine design, strict code testing, and the result of years of functional iteration.

With the API logic development completed, in the next step, we need to perform some database configuration and route registration operations, which is also very simple. Let's take a look together.