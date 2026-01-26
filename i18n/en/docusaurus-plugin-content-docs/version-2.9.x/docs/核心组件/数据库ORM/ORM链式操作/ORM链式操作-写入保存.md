---
slug: '/docs/core/gdb-chaining-insert-save'
title: 'ORM Model - Insert/Save'
sidebar_position: 1
hide_title: true
keywords: [ORM Chained Operations, Data Insertion, GoFrame, Insert, Replace, Save, Database, Batch Operations, SQL, RawSQL]
description: "Insert, Replace, Save methods usage in GoFrame's ORM chained operations, supporting automatic single or batch data insertion across various database environments. Detailed examples demonstrate how to use these methods with the Data method for data operations."
---

## Common Methods

### `Insert/Replace/Save`

These chained operation methods are used for data insertion and support automatic single or batch data insertion, with differences as follows:

1. `Insert`
   
    Uses the `INSERT INTO` statement for database insertion. If the inserted data contains a primary key or unique index, it returns failure; otherwise, a new record is inserted.

2. `Replace`

    Uses the `REPLACE INTO` statement for database insertion. If the inserted data contains a primary key or unique index, it deletes the existing record, ensuring that a new record is inserted.

3. `Save`

    Uses the `INSERT INTO` statement for database insertion. If the inserted data contains a primary key or unique index, it updates the existing data; otherwise, it inserts a new record. For certain databases, such as `PgSQL, SQL server, Oracle`, you can use the `OnConflict` method to specify conflict keys.

    ```go
    db.Model(table).Data(g.Map{
        "id":          1,
        "passport":    "p1",
        "password":    "pw1",
    }).OnConflict("id").Save()
    ```

> Some database types do not support `Replace/Save` methods. Refer to the [ORM - Model 🔥](../ORM链式操作/ORM链式操作.md) section for details.

These methods need to be used in conjunction with the `Data` method, which is used to pass data parameters for data insertion/updating and other write operations.

### `InsertIgnore`

This method is used to ignore errors and continue with insertion if the inserted data contains a primary key or unique index. The method is defined as follows:

```go
func (m *Model) InsertIgnore(data ...interface{}) (result sql.Result, err error)
```

### `InsertAndGetId`

This method is used to insert data while directly returning the auto-increment field's `ID`. The method is defined as follows:

```go
func (m *Model) InsertAndGetId(data ...interface{}) (lastInsertId int64, err error)
```

### `OnDuplicate/OnDuplicateEx`

`OnDuplicate/OnDuplicateEx` methods need to be used together with the `Save` method to specify the fields to be updated/not updated for the `Save` operation. Parameters can be strings, string arrays, or `Map`. For example:

```go
OnDuplicate("nickname, age")
OnDuplicate("nickname", "age")
OnDuplicate(g.Map{
    "nickname": gdb.Raw("CONCAT('name_', VALUES(`nickname`))"),
})
OnDuplicate(g.Map{
    "nickname": "passport",
})
```

`OnDuplicateEx` is used to exclude specified fields from being updated, with excluded fields already in the data set being inserted.

## Usage Examples

### Example 1: Basic Usage

Data insertion/save methods need to be used with the `Data` method. The parameter type can be `Map/Struct/Slice`:

```go
// INSERT INTO `user`(`name`) VALUES('john')
g.Model("user").Data(g.Map{"name": "john"}).Insert()

// INSERT IGNORE INTO `user`(`uid`,`name`) VALUES(10000,'john')
g.Model("user").Data(g.Map{"uid": 10000, "name": "john"}).InsertIgnore()

// REPLACE INTO `user`(`uid`,`name`) VALUES(10000,'john')
g.Model("user").Data(g.Map{"uid": 10000, "name": "john"}).Replace()

// INSERT INTO `user`(`uid`,`name`) VALUES(10001,'john') ON DUPLICATE KEY UPDATE `uid`=VALUES(`uid`),`name`=VALUES(`name`)
g.Model("user").Data(g.Map{"uid": 10001, "name": "john"}).Save()
```

You can also directly pass data parameters to the insertion/save methods without using the `Data` method:

```go
g.Model("user").Insert(g.Map{"name": "john"})
g.Model("user").Replace(g.Map{"uid": 10000, "name": "john"})
g.Model("user").Save(g.Map{"uid": 10001, "name": "john"})
```

Data parameters are often `struct` types, for example, when the table fields are `uid/name/site`:

```go
type User struct {
    Uid  int    `orm:"uid"`
    Name string `orm:"name"`
    Site string `orm:"site"`
}
user := &User{
    Uid:  1,
    Name: "john",
    Site: "https://goframe.org",
}
// INSERT INTO `user`(`uid`,`name`,`site`) VALUES(1,'john','https://goframe.org')
g.Model("user").Data(user).Insert()
```

### Example 2: Batch Data Insertion

Batch insertion is achieved by passing a `Slice` array type parameter to the `Data` method. Array elements need to be of `Map` or `Struct` type to automatically derive field information and generate batch operation `SQL`.

```go
// INSERT INTO `user`(`name`) VALUES('john_1'),('john_2'),('john_3')
g.Model("user").Data(g.List{
    {"name": "john_1"},
    {"name": "john_2"},
    {"name": "john_3"},
}).Insert()
```

You can specify the number of records to be written in batches using the `Batch` method (default is `10`). The following example will be split into two insertion requests:

```go
// INSERT INTO `user`(`name`) VALUES('john_1'),('john_2')
// INSERT INTO `user`(`name`) VALUES('john_3')
g.Model("user").Data(g.List{
    {"name": "john_1"},
    {"name": "john_2"},
    {"name": "john_3"},
}).Batch(2).Insert()
```

### Example 3: Batch Data Save

The principle of batch save operations is the same as single save operations. When the inserted data contains a primary key or unique index, it updates the existing record; otherwise, a new record is inserted.

> `oracle, dm, mssql` do not support batch savings.

```go
// INSERT INTO `user`(`uid`,`name`) VALUES(10000,'john_1'),(10001,'john_2'),(10002,'john_3')
// ON DUPLICATE KEY UPDATE `uid`=VALUES(`uid`),`name`=VALUES(`name`)
g.Model("user").Data(g.List{
    {"uid":10000, "name": "john_1"},
    {"uid":10001, "name": "john_2"},
    {"uid":10002, "name": "john_3"},
}).Save()
```

## `RawSQL` Statement Embedding

`gdb.Raw` is a string type whose parameters will be directly embedded as `SQL` fragments into the final `SQL` statement submitted to the underlying database, not automatically converted to string parameter types, nor treated as preprocessed parameters. For more details, refer to the section: [ORM Senior - RawSQL](../ORM高级特性/ORM高级特性-RawSQL.md). For example:

```go
// INSERT INTO `user`(`id`,`passport`,`password`,`nickname`,`create_time`) VALUES('id+2','john','123456','now()')
g.Model("user").Data(g.Map{
    "id":          "id+2",
    "passport":    "john",
    "password":    "123456",
    "nickname":    "JohnGuo",
    "create_time": "now()",
}).Insert()
// Execution Error: Error Code: 1136. Column count doesn't match value count at row 1
```

Revised using `gdb.Raw`:

```go
// INSERT INTO `user`(`id`,`passport`,`password`,`nickname`,`create_time`) VALUES(id+2,'john','123456',now())
g.Model("user").Data(g.Map{
    "id":          gdb.Raw("id+2"),
    "passport":    "john",
    "password":    "123456",
    "nickname":    "JohnGuo",
    "create_time": gdb.Raw("now()"),
}).Insert()
```