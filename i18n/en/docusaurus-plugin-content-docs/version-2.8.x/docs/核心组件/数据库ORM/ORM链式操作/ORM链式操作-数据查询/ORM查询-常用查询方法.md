---
slug: '/docs/core/gdb-chaining-query-all-one-array-value-count'
title: 'Model Query - Methods'
sidebar_position: 1
hide_title: true
keywords: [GoFrame, GoFrame Framework, ORM, Data Query, All Method, One Method, Array Method, Value Method, Count Method, CountColumn Method]
description: "Five common data query methods in the GoFrame framework: All, One, Array, Value, and Count. These methods allow you to easily retrieve multiple or single records from the database and support direct input of conditional parameters. Through example code, you'll learn how to efficiently perform database operations in GoFrame."
---

## Introduction
Commonly used data query methods:

```go
func (m *Model) All(where ...interface{} (Result, error)
func (m *Model) One(where ...interface{}) (Record, error)
func (m *Model) Array(fieldsAndWhere ...interface{}) ([]Value, error)
func (m *Model) Value(fieldsAndWhere ...interface{}) (Value, error)
func (m *Model) Count(where ...interface{}) (int, error)
func (m *Model) CountColumn(column string) (int, error)
```

Brief explanation:

1. `All` is used to query and return a list/array of multiple records.
2. `One` is used to query and return a single record.
3. `Array` is used to query data of specified field columns and return an array.
4. `Value` is used to query and return one field value, often used in conjunction with the `Fields` method.
5. `Count` is used to query and return the number of records.

Additionally, it can be seen that these four methods' definitions also support direct input of conditional parameters, with parameter types consistent with the `Where` method. However, it is important to note that the `Array` and `Value` methods require at least a field parameter to be input.

## Usage Examples

```go
// SELECT * FROM `user` WHERE `score`>60
Model("user").Where("score>?", 60).All()

// SELECT * FROM `user` WHERE `score`>60 LIMIT 1
Model("user").Where("score>?", 60).One()

// SELECT `name` FROM `user` WHERE `score`>60
Model("user").Fields("name").Where("score>?", 60).Array()

// SELECT `name` FROM `user` WHERE `uid`=1 LIMIT 1
Model("user").Fields("name").Where("uid", 1).Value()

// SELECT COUNT(1) FROM `user` WHERE `status` IN(1,2,3)
Model("user").Where("status", g.Slice{1,2,3}).Count()
```