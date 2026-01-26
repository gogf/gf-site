---
slug: '/docs/core/gdb-chaining-relation-scan-list'
title: 'Model Association - ScanList'
sidebar_position: 0
hide_title: true
keywords: [GoFrame, Dynamic Association, ScanList, Data Insertion, Data Query, Data Model, Transaction Handling, Binding Data, Association, Data Structure]
description: "How the GoFrame framework handles model association design by simplifying tag content and association attributes, reducing cognitive load. It provides a detailed explanation of how to use the ScanList method for dynamic association of data structures, demonstrating 1:1 and 1:N relationships between users, user details, and user credits, and provides sample Go code for data queries and insertion operations, including implementation methods for transaction handling and data binding."
---

The `ORM` of `gf` does not adopt common model association designs such as `BelongsTo`, `HasOne`, `HasMany`, `ManyToMany` found in other `ORMs`. Such association maintenance is quite cumbersome, involving foreign key constraints, additional tag annotations, etc., imposing a cognitive burden on developers. Therefore, the `gf` framework doesn't favor injecting complex tag content, association attributes, or methods into model structs. It consistently strives to simplify the design, aiming to make model association queries as easy to understand and useful as possible.

:::warning
The following implementation of model association provided by `gf ORM` is available from `GoFrame v1.13.6` and is currently an experimental feature.
:::

Let's introduce the model association provided by `gf ORM` with an example.

### Data Structure

To simplify the example, the tables we design here are as simple as possible, with each table containing only 3-4 fields to conveniently explain the associations.

```
# User Table
CREATE TABLE `user` (
  uid int(10) unsigned NOT NULL AUTO_INCREMENT,
  name varchar(45) NOT NULL,
  PRIMARY KEY (uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# User Details
CREATE TABLE `user_detail` (
  uid  int(10) unsigned NOT NULL AUTO_INCREMENT,
  address varchar(45) NOT NULL,
  PRIMARY KEY (uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# User Credits
CREATE TABLE `user_scores` (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  uid int(10) unsigned NOT NULL,
  score int(10) unsigned NOT NULL,
  course varchar(45) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

```

### Data Model

Based on the table definition, we can infer:

1. The user table and user details have a `1:1` relationship.
2. The user table and user credits have a `1:N` relationship.
3. We don't demonstrate the `N:N` relationship here, as it is similar to `1:N` in terms of needing only one more association or query, with a similar final processing method.

The model in Golang can be defined as follows:

```go
// User Table
type EntityUser struct {
    Uid  int    `orm:"uid"`
    Name string `orm:"name"`
}
// User Details
type EntityUserDetail struct {
    Uid     int    `orm:"uid"`
    Address string `orm:"address"`
}
// User Credits
type EntityUserScores struct {
    Id     int    `orm:"id"`
    Uid    int    `orm:"uid"`
    Score  int    `orm:"score"`
    Course string `orm:"course"`
}
// Composite Model, User Information
type Entity struct {
    User       *EntityUser
    UserDetail *EntityUserDetail
    UserScores []*EntityUserScores
}
```

Here, `EntityUser`, `EntityUserDetail`, and `EntityUserScores` correspond to the data models for user table, user details, and user credits, respectively. `Entity` is a composite model representing all detailed information of a user.

### Data Insertion

Data insertion involves simple database transactions.

```go
    err := g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
            r, err := tx.Model("user").Save(EntityUser{
            Name: "john",
        })
        if err != nil {
            return err
        }
        uid, err := r.LastInsertId()
        if err != nil {
            return err
        }
        _, err = tx.Model("user_detail").Save(EntityUserDetail{
            Uid:     int(uid),
            Address: "Beijing DongZhiMen #66",
        })
        if err != nil {
            return err
        }
        _, err = tx.Model("user_scores").Save(g.Slice{
            EntityUserScores{Uid: int(uid), Score: 100, Course: "math"},
            EntityUserScores{Uid: int(uid), Score: 99, Course: "physics"},
        })
        return err
    })
```

### Data Query

#### Single Data Record

Querying a single model data is straightforward using the `Scan` method, which automatically identifies whether to bind query results to a single object attribute or an array object attribute. For example:

```go
// Define User List
var user Entity
// Query User Basic Data
// SELECT * FROM `user` WHERE `name`='john'
err := g.Model("user").Scan(&user.User, "name", "john")
if err != nil {
    return err
}
// Query User Detail Data
// SELECT * FROM `user_detail` WHERE `uid`=1
err := g.Model("user_detail").Scan(&user.UserDetail, "uid", user.User.Uid)
// Query User Credits Data
// SELECT * FROM `user_scores` WHERE `uid`=1
err := g.Model("user_scores").Scan(&user.UserScores, "uid", user.User.Uid)
```

This method has been introduced in previous sections, so I won't repeat it here.

#### Multiple Data Records

To query multiple data records and bind the data to the data model array, you need to use the `ScanList` method. This method requires you to specify the relationship between the result fields and the model attributes, then iterates over the array and automatically binds the data. For example:

```go
// Define User List
var users []Entity
// Query User Basic Data
// SELECT * FROM `user`
err := g.Model("user").ScanList(&users, "User")
// Query User Detail Data
// SELECT * FROM `user_detail` WHERE `uid` IN(1,2)
err := g.Model("user_detail").
       Where("uid", gdb.ListItemValuesUnique(users, "User", "Uid")).
       ScanList(&users, "UserDetail", "User", "uid:Uid")
// Query User Credits Data
// SELECT * FROM `user_scores` WHERE `uid` IN(1,2)
err := g.Model("user_scores").
       Where("uid", gdb.ListItemValuesUnique(users, "User", "Uid")).
       ScanList(&users, "UserScores", "User", "uid:Uid")
```

This involves two important methods:

**1\. `ScanList`**

Method definition:

```go
// ScanList converts <r> to struct slice which contains other complex struct attributes.
// Note that the parameter <listPointer> should be type of *[]struct/*[]*struct.
// Usage example:
//
// type Entity struct {
//        User       *EntityUser
//        UserDetail *EntityUserDetail
//       UserScores []*EntityUserScores
// }
// var users []*Entity
// or
// var users []Entity
//
// ScanList(&users, "User")
// ScanList(&users, "UserDetail", "User", "uid:Uid")
// ScanList(&users, "UserScores", "User", "uid:Uid")
// The parameters "User"/"UserDetail"/"UserScores" in the example codes specify the target attribute struct
// that current result will be bound to.
// The "uid" in the example codes is the table field name of the result, and the "Uid" is the relational
// struct attribute name. It automatically calculates the HasOne/HasMany relationship with given <relation>
// parameter.
// See the example or unit testing cases for clear understanding for this function.
func (m *Model) ScanList(listPointer interface{}, attributeName string, relation ...string) (err error)
```

This method is used to bind the queried array data to the specified list, for example:

- `ScanList(&users, "User")`

Indicates binding the queried user information array data to the `User` attribute of each item in the `users` list.

- `ScanList(&users, "UserDetail", "User", "uid:Uid")`

Indicates binding the queried user detail array data to the `UserDetail` attribute of each item in the `users` list, and associating with another `User` object attribute through `uid:Uid` field:attribute relation. Internally, this will automatically handle data binding based on this association. Here `uid:Uid` specifies the `uid` field in the query result and `Uid` denotes the `Uid` attribute in the target associated object.

- `ScanList(&users, "UserScores", "User", "uid:Uid")`

Indicates binding the queried user detail array data to the `UserScores` attribute of each item in the `users` list, and associating with another `User` object attribute through `uid:Uid` field:attribute relation. Internally, this method can automatically recognize that `User` to `UserScores` is essentially a `1:N` relation due to `UserScores` being an array type `[]*EntityUserScores`, and thus completes data binding.

Do note, if the corresponding association attribute data does not exist within the associated data, the attribute will not be initialized and will remain `nil`.

**2\. `ListItemValues/ListItemValuesUnique`**

Method definition:

```go
// ListItemValues retrieves and returns the elements of all item struct/map with key <key>.
// Note that the parameter <list> should be type of slice which contains elements of map or struct,
// or else it returns an empty slice.
//
// The parameter <list> supports types like:
// []map[string]interface{}
// []map[string]sub-map
// []struct
// []struct:sub-struct
// Note that the sub-map/sub-struct makes sense only if the optional parameter <subKey> is given.
func ListItemValues(list interface{}, key interface{}, subKey ...interface{}) (values []interface{})

// ListItemValuesUnique retrieves and returns the unique elements of all struct/map with key <key>.
// Note that the parameter <list> should be type of slice which contains elements of map or struct,
// or else it returns an empty slice.
// See gutil.ListItemValuesUnique.
func ListItemValuesUnique(list interface{}, key string, subKey ...interface{}) []interface{}
```

The difference between `ListItemValuesUnique` and `ListItemValues` is that the former filters out duplicate return values, ensuring the returned list does not contain duplicates. These functions are used to obtain specified attribute/key values from elements in a given list containing `struct`/`map` data items, constructing them into a `[]interface{}` array to return. Example:

- `gdb.ListItemValuesUnique(users, "Uid")` is used to obtain every `Uid` attribute from the `users` array, constructing it into a `[]interface{}` array to return. This facilitates constructing a `SELECT...IN...` query based on `uid`.
- `gdb.ListItemValuesUnique(users, "User", "Uid")` is used to obtain every `Uid` attribute from the `User` property item in the `users` array, constructing it into a `[]interface{}` array to return. This facilitates constructing a `SELECT...IN...` query based on `uid`.