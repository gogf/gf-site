---
slug: '/docs/core/gdb-senior-fields-mapping'
title: 'ORM Senior - Field Mapping'
sidebar_position: 4
hide_title: true
keywords: [ORM Advanced Features, Field Mapping, Automatic Table Recognition, GoFrame Framework, Interface Design, Field Cache Management, Protobuf Interface, User Information Query, Field Matching Rules, SQL Query Optimization]
description: "Through the advanced ORM features of the GoFrame framework, automatic field mapping and recognition can be achieved. When parameters of Map or Struct types are used, table field names are automatically matched, significantly reducing the workload for developers in manually matching data fields and business attributes. In addition, by designing interfaces and caching field information in memory, data operation efficiency is improved. This article also demonstrates how to effectively query user and doctor information through practical examples."
---

## Introduction

When writing or updating data using methods like `Fields/Data/Scan`, if the given parameter is of `map/struct` type, the key names/property names of the parameter will automatically be case-insensitively and character-independently mapped to the fields of the data table.
:::tip
This is why the `SHOW FULL COLUMNS FROM 'xxx'` statement appears when performing database operations with database components. This statement is executed only once per table and the results are then cached in memory.
:::
Examples of matching rules:

```html
Map Key     Field Name   Match
nickname    nickname     match
NICKNAME    nickname     match
Nick-Name   nickname     match
nick_name   nickname     match
nick name   nickname     match
NickName    nickname     match
Nick-name   nickname     match
nick_name   nickname     match
nick name   nickname     match
```

## Important Notes

### Interface Design

This feature depends on the `TableFields` interface defined in `DB`. If this interface is not implemented, the upper-level business needs to maintain the mapping relationship between property/key names and table fields, which incurs a considerable overhead unrelated to business logic. The goal of the framework is to let developers focus as much as possible on the business, hence adopting automation in places where framework components can be automated. The `driver` implementations integrated with the framework currently all support this interface.

```go
// TableFields retrieves and returns the fields' information of specified table of current
// schema.
//
// The parameter `link` is optional, if given nil it automatically retrieves a raw sql connection
// as its link to proceed necessary sql query.
//
// Note that it returns a map containing the field name and its corresponding fields.
// As a map is unsorted, the TableField struct has an "Index" field marks its sequence in
// the fields.
//
// It's using cache feature to enhance the performance, which is never expired until the
// process restarts.
func (db DB) TableFields(ctx context.Context, table string, schema ...string) (fields map[string]*TableField, err error)
```

### Field Cache

The field information of each data table is queried and cached in memory during the first operation on the table. If you need to manually refresh the field cache, you can do so with the following methods:

```go
// ClearTableFields removes certain cached table fields of current configuration group.
func (c *Core) ClearTableFields(ctx context.Context, table string, schema ...string) (err error)

// ClearTableFieldsAll removes all cached table fields of current configuration group.
func (c *Core) ClearTableFieldsAll(ctx context.Context) (err error)
```

The introductions of the methods are as in the comments. As can be seen, these two methods are mounted on the `Core` object, and the underlying `Core` object is already exposed through the `DB` interface, thus we can obtain the `Core` object like this:

```go
g.DB().GetCore()
```

## Usage Example

Let's look at an example where we implement an interface for querying basic user information, with the user being a doctor.

1. We have two tables, a `user` table with about `30` fields, and a `doctor_user` table with over `80` fields.

2. `user` is the basic user table containing the most basic user information, while `doctor_user` is a business extension table based on the `user` table for a specific user role, forming a one-to-one relationship with the `user` table.

3. We have a `GRPC` interface with the following definition (for demonstration purposes, some simplifications are made here):

1) `GetDoctorInfoRes`

```go
// Query interface return data structure
type GetDoctorInfoRes struct {
    UserInfo             *UserInfo   `protobuf:"bytes,1,opt,name=UserInfo,proto3" json:"UserInfo,omitempty"`
    DoctorInfo           *DoctorInfo `protobuf:"bytes,2,opt,name=DoctorInfo,proto3" json:"DoctorInfo,omitempty"`
    XXX_NoUnkeyedLiteral struct{}    `json:"-"`
    XXX_unrecognized     []byte      `json:"-"`
    XXX_sizecache        int32       `json:"-"`
}
```

2) `UserInfo`

```go
// Basic user information
type UserInfo struct {
    Id                   uint32   `protobuf:"varint,1,opt,name=id,proto3" json:"id,omitempty"`
    Avatar               string   `protobuf:"bytes,2,opt,name=avatar,proto3" json:"avatar,omitempty"`
    Name                 string   `protobuf:"bytes,3,opt,name=name,proto3" json:"name,omitempty"`
    Sex                  int32    `protobuf:"varint,4,opt,name=sex,proto3" json:"sex,omitempty"`
    XXX_NoUnkeyedLiteral struct{} `json:"-"`
    XXX_unrecognized     []byte   `json:"-"`
    XXX_sizecache        int32    `json:"-"`
}
```

3) `DoctorInfo`

```go
// Doctor information
type DoctorInfo struct {
    Id                   uint32   `protobuf:"varint,1,opt,name=id,proto3" json:"id,omitempty"`
    Name                 string   `protobuf:"bytes,3,opt,name=name,proto3" json:"name,omitempty"`
    Hospital             string   `protobuf:"bytes,4,opt,name=hospital,proto3" json:"hospital,omitempty"`
    Section              string   `protobuf:"bytes,6,opt,name=section,proto3" json:"section,omitempty"`
    Title                string   `protobuf:"bytes,8,opt,name=title,proto3" json:"title,omitempty"`
    XXX_NoUnkeyedLiteral struct{} `json:"-"`
    XXX_unrecognized     []byte   `json:"-"`
    XXX_sizecache        int32    `json:"-"`
}
```

4. Query interface implementation code

```go
// Query doctor information
func (s *Service) GetDoctorInfo(ctx context.Context, req *pb.GetDoctorInfoReq) (res *pb.GetDoctorInfoRes, err error) {
    // Protobuf return data structure
    res = &pb.GetDoctorInfoRes{}
    // Query doctor information
    // SELECT `id`,`avatar`,`name`,`sex` FROM `user` WHERE `user_id`=xxx
    err = dao.PrimaryDoctorUser.
        Ctx(ctx).
        Fields(res.DoctorInfo).
        Where(dao.PrimaryDoctorUser.Columns.UserId, req.Id).
        Scan(&res.DoctorInfo)
    if err != nil {
        return
    }
    // Query basic user information
    // SELECT `id`,`name`,`hospital`,`section`,`title` FROM `doctor_user` WHERE `id`=xxx
    err = dao.PrimaryUser.
        Ctx(ctx).
        Fields(res.DoctorInfo).
        Where(dao.PrimaryUser.Columns.Id, req.Id).
        Scan(&res.UserInfo)
    return res, err
}
```

When we call `GetDoctorInfo` to execute the query, two `SQL` queries will be sent to the database, for instance:

```
SELECT `id`,`avatar`,`name`,`sex` FROM `user` WHERE `user_id`=1
SELECT `id`,`name`,`hospital`,`section`,`title` FROM `doctor_user` WHERE `id`=1
```

As can be seen:

- When using the `Fields` method, the parameter type is a `struct` or `*struct`, and the `ORM` will automatically map the property names of the `struct` to the field names of the data table. When the mapping is successful, only specific field data is queried, and non-existent property fields will be automatically filtered.
- When using the `Scan` method (also applicable with `Struct`/`Structs`), the parameter type is a `*struct` or `**struct`, and the query results will automatically map to the properties of the `struct`. When the mapping is successful, conversion and assignment are automatically done; otherwise, no processing is done on the attributes of the parameters.