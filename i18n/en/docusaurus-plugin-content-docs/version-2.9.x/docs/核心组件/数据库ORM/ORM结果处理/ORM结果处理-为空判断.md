---
slug: '/docs/core/gdb-result-empty-check'
title: 'ORM Result - Empty Check'
sidebar_position: 1
hide_title: true
keywords: [GoFrame, GoFrame Framework, ORM, Result Processing, Empty Check, Data Set, Data Record, Data Field Value, Struct Object, Struct Array]
description: "Using the GoFrame framework for empty checks in ORM result processing. This includes handling data sets, multiple data records, data field values, as well as result processing methods for Struct objects and Struct arrays. By using methods like IsEmpty and IsNil, you can easily determine if the query result is empty."
---


Using `GoFrame ORM` for checking if the returned result is empty is very simple. In most scenarios, you can directly check if the returned data is `nil` or has a length of `0`, or use the `IsEmpty/IsNil` methods.

## I. Data Sets (Multiple)

```go
r, err := g.Model("order").Where("status", 1).All()
if err != nil {
    return err
}
if len(r) == 0 {
    // Result is empty
}
```

You can also use the `IsEmpty` method:

```go
r, err := g.Model("order").Where("status", 1).All()
if err != nil {
    return err
}
if r.IsEmpty() {
    // Result is empty
}
```

## II. Data Records (Single)

```go
r, err := g.Model("order").Where("status", 1).One()
if err != nil {
    return err
}
if len(r) == 0 {
    // Result is empty
}
```

You can also use the `IsEmpty` method:

```go
r, err := g.Model("order").Where("status", 1).One()
if err != nil {
    return err
}
if r.IsEmpty() {
    // Result is empty
}
```

## III. Data Field Value

The return is a "generic" variable, so you can only use `IsEmpty` to determine if it is empty.

```go
r, err := g.Model("order").Where("status", 1).Value()
if err != nil {
    return err
}
if r.IsEmpty() {
    // Result is empty
}
```

## IV. Field Value Array

The returned field value array is of type `[]gdb.Value`, so you can directly check if the length is `0`.

```go
// Array/FindArray
r, err := g.Model("order").Fields("id").Where("status", 1).Array()
if err != nil {
    return err
}
if len(r) == 0 {
    // Result is empty
}
```

## V. `Struct` Object (🔥Note🔥)

For `Struct` conversion object, there is a slight difference. Let's look at an example.

When the passed object is **a null pointer**, if data is found in the query, this object will be **automatically created** internally. If no data is found, the null pointer remains a null pointer and no internal handling is done.

```go
var user *User
err := g.Model("order").Where("status", 1).Scan(&user)
if err != nil {
    return err
}
if user == nil {
    // Result is empty
}
```

When the passed object is **already an initialized object**, if data is found, it will be assigned internally to this object. **If no data is found, you cannot use `nil` to check for an empty result**. Therefore, `ORM` will return an `sql.ErrNoRows` error, indicating to the developer that no data has been found and no assignments were made, allowing further empty result checks.

```go
var user = new(User)
err := g.Model("order").Where("status", 1).Scan(&user)
if err != nil && err != sql.ErrNoRows {
    return err
}
if err == sql.ErrNoRows {
    // Result is empty
}
```
:::tip
Therefore, we recommend that developers do not pass an already initialized object to `ORM`, but rather pass a pointer to a pointer of the object (`**struct` type). Internally, `ORM` will smartly perform automatic initialization based on the query result.
:::
## VI. `Struct` Array

When the passed object array is initially an empty array (length `0`), if data is found, it will be automatically assigned internally to the array. If no data is found, the empty array remains an empty array, and no internal handling is done.

```go
var users []*User
err := g.Model("order").Where("status", 1).Scan(&users)
if err != nil {
    return err
}
if len(users) == 0 {
    // Result is empty
}
```

When the passed object array is not an empty array, if data is found, it will be overridden internally onto the array from index `0`. If no data is found, you cannot judge the empty result using length `0`. Therefore, `ORM` will return an `sql.ErrNoRows` error, indicating that no data has been found and no assignments were made, allowing further empty result checks.

```go
var users = make([]*User, 100)
err := g.Model("order").Where("status", 1).Scan(&users)
if err != nil {
    return err
}
if err == sql.ErrNoRows {
    // Result is empty
}
```
:::warning
Due to `Golang` reflection features employed in `struct` conversion, there is a certain performance overhead. If you are dealing with conversions of large numbers of query result data into `struct` array objects and need to improve conversion performance, please refer to the custom implementation of the corresponding `struct` `UnmarshalValue` method:
[Type Conversion - Interface](../../类型转换/类型转换-UnmarshalValue.md)
:::