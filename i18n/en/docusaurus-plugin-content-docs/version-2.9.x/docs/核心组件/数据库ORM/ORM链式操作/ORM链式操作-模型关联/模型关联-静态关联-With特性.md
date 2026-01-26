---
slug: '/docs/core/gdb-chaining-relation-with'
title: 'Model Association - With'
sidebar_position: 1
hide_title: true
keywords: [GoFrame, With Feature, ORM, Model Association, Data Query, Transaction Operation, Data Structure, Go Language, Database, SQL]
description: "The With feature in the GoFrame framework demonstrates how to achieve model association and data queries through examples. It introduces data structure definition, transaction operations, data writing and querying, helping developers better understand and use the GoFrame framework for efficient development."
---

## 1. Design Background

Everyone knows that usability and maintainability have always been the focus of `goframe`, and it's also a significant difference between `goframe` and other frameworks and components. `goframe` does not adopt other common `ORM` model association designs like `BelongsTo`, `HasOne`, `HasMany`, `ManyToMany`, which are cumbersome to maintain due to foreign key constraints, additional tag annotations, etc., imposing a certain cognitive load on developers. Therefore, the framework is inclined not to inject overly complex tag content, associated attributes, or methods into model structures and consistently tries to simplify the design with the goal of making model association queries as understandable and easy to use as possible. Before learning more about the `With` feature, it is recommended to first understand [Model Association - ScanList](模型关联-动态关联-ScanList.md).

Through a series of project practices, we found that although `ScanList` maintains model associations from a runtime business logic perspective, this association maintenance is not as straightforward as expected. Therefore, we continue to improve and introduce the `With` model association feature, which can easily maintain the association relationships through models. Of course, this feature is still dedicated to enhancing the usability and maintainability of the overall framework, and it can be seen as a combination and improvement of `ScanList` and model association maintenance.

:::warning
The `With` feature is currently experimental.
:::

## 2. An Example

Let's start with a simple example to help better understand the `With` feature, which is an improved version of the same example from the previous `ScanList` section.

### 1. Data Structure

```sql
# User Table
CREATE TABLE `user` (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  name varchar(45) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# User Detail
CREATE TABLE `user_detail` (
  uid  int(10) unsigned NOT NULL AUTO_INCREMENT,
  address varchar(45) NOT NULL,
  PRIMARY KEY (uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# User Scores
CREATE TABLE `user_scores` (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  uid int(10) unsigned NOT NULL,
  score int(10) unsigned NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

### 2. Data Structure

Based on the table definitions, we can tell:

1. The user table and user details have a `1:1` relationship.
2. The user table and user scores have a `1:N` relationship.
3. We did not demonstrate a `N:N` relationship here because, compared to a `1:N` query, it's just an additional association or one more query, and the final processing method is similar to `1:N`.

The `Golang` model can be defined as follows:

```go
// User Detail
type UserDetail struct {
    g.Meta `orm:"table:user_detail"`
    Uid        int    `json:"uid"`
    Address    string `json:"address"`
}
// User Scores
type UserScores struct {
    g.Meta `orm:"table:user_scores"`
    Id         int `json:"id"`
    Uid        int `json:"uid"`
    Score      int `json:"score"`
}
// User Information
type User struct {
    g.Meta `orm:"table:user"`
    Id         int           `json:"id"`
    Name       string        `json:"name"`
    UserDetail *UserDetail   `orm:"with:uid=id"`
    UserScores []*UserScores `orm:"with:uid=id"`
}
```

### 3. Data Insertion

To simplify the example, we create `5` user records, using transactional operations:

- User information, `id` ranges from `1-5`, `name` ranges from `name_1` to `name_5`.
- Simultaneously create `5` user detail records, where `address` data ranges from `address_1` to `address_5`.
- Each user has `5` score entries, scoring `1-5`.

```go
g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
    for i := 1; i <= 5; i++ {
        // User.
        user := User{
            Name: fmt.Sprintf(`name_%d`, i),
        }
        lastInsertId, err := g.Model(user).Data(user).OmitEmpty().InsertAndGetId()
        if err != nil {
            return err
        }
        // Detail.
        userDetail := UserDetail{
            Uid:     int(lastInsertId),
            Address: fmt.Sprintf(`address_%d`, lastInsertId),
        }
        _, err = g.Model(userDetail).Data(userDetail).OmitEmpty().Insert()
        if err != nil {
            return err
        }
        // Scores.
        for j := 1; j <= 5; j++ {
            userScore := UserScores{
                Uid:   int(lastInsertId),
                Score: j,
            }
            _, err = g.Model(userScore).Data(userScore).OmitEmpty().Insert()
            if err != nil {
                return err
            }
        }
    }
    return nil
})
```

After execution, the database data is as follows:

```text
mysql> show tables;
+----------------+
| Tables_in_test |
+----------------+
| user           |
| user_detail    |
| user_score     |
+----------------+
3 rows in set (0.01 sec)

mysql> select * from `user`;
+----+--------+
| id | name   |
+----+--------+
|  1 | name_1 |
|  2 | name_2 |
|  3 | name_3 |
|  4 | name_4 |
|  5 | name_5 |
+----+--------+
5 rows in set (0.01 sec)

mysql> select * from `user_detail`;
+-----+-----------+
| uid | address   |
+-----+-----------+
|   1 | address_1 |
|   2 | address_2 |
|   3 | address_3 |
|   4 | address_4 |
|   5 | address_5 |
+-----+-----------+
5 rows in set (0.00 sec)

mysql> select * from `user_score`;
+----+-----+-------+
| id | uid | score |
+----+-----+-------+
|  1 |   1 |     1 |
|  2 |   1 |     2 |
|  3 |   1 |     3 |
|  4 |   1 |     4 |
|  5 |   1 |     5 |
|  6 |   2 |     1 |
|  7 |   2 |     2 |
|  8 |   2 |     3 |
|  9 |   2 |     4 |
| 10 |   2 |     5 |
| 11 |   3 |     1 |
| 12 |   3 |     2 |
| 13 |   3 |     3 |
| 14 |   3 |     4 |
| 15 |   3 |     5 |
| 16 |   4 |     1 |
| 17 |   4 |     2 |
| 18 |   4 |     3 |
| 19 |   4 |     4 |
| 20 |   4 |     5 |
| 21 |   5 |     1 |
| 22 |   5 |     2 |
| 23 |   5 |     3 |
| 24 |   5 |     4 |
| 25 |   5 |     5 |
+----+-----+-------+
25 rows in set (0.00 sec)
```

### 4. Data Query

With the new `With` feature, data querying is quite straightforward. For example, to query one record:

```go
// Redefine it to avoid scrolling
// User Detail
type UserDetail struct {
    g.Meta `orm:"table:user_detail"`
    Uid        int    `json:"uid"`
    Address    string `json:"address"`
}
// User Scores
type UserScores struct {
    g.Meta `orm:"table:user_scores"`
    Id         int `json:"id"`
    Uid        int `json:"uid"`
    Score      int `json:"score"`
}
// User Information
type User struct {
    g.Meta `orm:"table:user"`
    Id         int           `json:"id"`
    Name       string        `json:"name"`
    UserDetail *UserDetail   `orm:"with:uid=id"`
    UserScores []*UserScores `orm:"with:uid=id"`
}

var user *User
// WithAll will query fields with with tags, in this example, it will query tables corresponding to the UserDetail and UserScores structures
g.Model(tableUser).WithAll().Where("id", 3).Scan(&user)
```

The above statement will query information for a user with ID `3`, including user information, user details, and user score information. The above statement will automatically execute the following `SQL` statements in the database:

```text
2021-05-02 22:29:52.634 [DEBU] [  2 ms] [default] SHOW FULL COLUMNS FROM `user`
2021-05-02 22:29:52.635 [DEBU] [  1 ms] [default] SELECT * FROM `user` WHERE `id`=3 LIMIT 1
2021-05-02 22:29:52.636 [DEBU] [  1 ms] [default] SHOW FULL COLUMNS FROM `user_detail`
2021-05-02 22:29:52.637 [DEBU] [  1 ms] [default] SELECT `uid`,`address` FROM `user_detail` WHERE `uid`=3 LIMIT 1
2021-05-02 22:29:52.643 [DEBU] [  6 ms] [default] SHOW FULL COLUMNS FROM `user_score`
2021-05-02 22:29:52.644 [DEBU] [  0 ms] [default] SELECT `id`,`uid`,`score` FROM `user_score` WHERE `uid`=3
```

After execution, the information printed by `g.Dump(user)` is as follows:

```js
{
    Id:         3,
    Name:       "name_3",
    UserDetail: {
        Uid:     3,
        Address: "address_3",
    },
    UserScores: [
        {
            Id:    11,
            Uid:   3,
            Score: 1,
        },
        {
            Id:    12,
            Uid:   3,
            Score: 2,
        },
        {
            Id:    13,
            Uid:   3,
            Score: 3,
        },
        {
            Id:    14,
            Uid:   3,
            Score: 4,
        },
        {
            Id:    15,
            Uid:   3,
            Score: 5,
        },
    ],
}
```

### 5. List Query

Let's see an example of querying a list through the `With` feature:

```go
var users []*User
// With(UserDetail{}) only queries the table corresponding to UserDetail in the User structure
g.Model(users).With(UserDetail{}).Where("id>?", 3).Scan(&users)
```

After execution, the data printed by `g.Dump(users)` is as follows:

```js
[
    {
        Id:         4,
        Name:       "name_4",
        UserDetail: {
            Uid:     4,
            Address: "address_4",
        },
        UserScores: [],
    },
    {
        Id:         5,
        Name:       "name_5",
        UserDetail: {
            Uid:     5,
            Address: "address_5",
        },
        UserScores: [],
    },
]
```

### 6. Conditions and Sorting

When associating with the `With` feature, additional association conditions can be specified, as well as sorting rules for multiple data results. For example:

```go
type User struct {
    g.Meta `orm:"table:user"`
    Id         int           `json:"id"`
    Name       string        `json:"name"`
    UserDetail *UserDetail   `orm:"with:uid=id, where:uid > 3"`
    UserScores []*UserScores `orm:"with:uid=id, where:score>1 and score<5, order:score desc"`
}
```

Use the `where` sub-tag and `order` sub-tag in the `orm` tag to specify additional association conditions and sorting rules.

### 7. `unscoped` Tag

The `with` struct tag supports the `unscoped` feature, for example:

```go
type User struct {
    g.Meta `orm:"table:user"`
    Id         int          `json:"id"`
    Name       string       `json:"name"`
    UserDetail *UserDetail  `orm:"with:uid=id, unscoped:true"`
    UserScores []*UserScore `orm:"with:uid=id, unscoped:true"`
}
```

## 3. Detailed Explanation

You might be curious about some of the usages above, such as the `gmeta` package, the `WithAll` method, the `with` statement in the `orm` tag, and the `Model` method's struct parameter recognizing table names, etc. That's right, let's talk about them in detail.

### 1. `gmeta` Package

In the above data structures, you can see a `g.Meta` struct is embedded in an `embed` way, like:

```go
type UserDetail struct {
    g.Meta `orm:"table:user_detail"`
    Uid        int    `json:"uid"`
    Address    string `json:"address"`
}
```

Within the `GoFrame` framework, there are many such small component packages for implementing specific functions. The `gmeta` package is mainly used to embed into user-defined structures, and using tags to mark the struct (like `g.Meta`) in the `gmeta` package with custom tag content (such as `` `orm:"table:user_detail"` ``), and can dynamically obtain these custom tag contents with specific methods at runtime. For more details, refer to the chapter: [Metadata](../../../../组件列表/实用工具/元数据-gmeta.md).

Therefore, embedding `g.Meta` here is to label the data table name associated with the struct.

### 2. Model Association Specification

In the following structure:

```go
type User struct {
    g.Meta `orm:"table:user"`
    Id         int          `json:"id"`
    Name       string       `json:"name"`
    UserDetail *UserDetail  `orm:"with:uid=id"`
    UserScores []*UserScore `orm:"with:uid=id"`
}
```

We bind the `orm` tag to the specified struct property, and specify the association relationship between the current struct (table) and the target struct (table) through the `with` statement in the `orm` tag. The syntax of the `with` statement is as follows:

```text
with:target_table_association_field=current_structure_association_field
```

The field names are **case-insensitive and ignore special characters**. For example, the following forms of associations can all be automatically recognized:

```text
with:UID=ID
with:Uid=Id
with:U_ID=id
```

If the association fields of both tables have the same name, you can just write one, such as:

```text
with:uid
```

In this example, the table corresponding to the `UserDetail` property is `user_detail`, and the table corresponding to the `UserScores` property is `user_score`. Both are associated with the `user` table of the current `User` struct using `uid`, and the associated field of the target `user` table is `id`.

### 3. `With/WithAll`

#### 1) Introduction

By default, even if the properties in our struct have `orm` tags with `with` statements, the `ORM` component will not enable the `With` feature for association queries by default. It needs to be enabled by the `With/WithAll` method.

- `With`: Specify the association query tables by specifying the property objects.
- `WithAll`: Enable association queries for all property structures with `with` statements in the operating object.

In our example, the `WithAll` method is used, so all property model association queries in the `User` table are automatically enabled. As long as the property struct is associated with a table and the `orm` tag contains a `with` statement, it will automatically query data and bind data according to the model structure association relationship. If we only enable association queries for some properties rather than all property models, we can use the `With` method to specify. And the `With` method can specify multiple associated model automatic queries. The `WithAll` in this example is equivalent to:

```go
var user *User
g.Model(tableUser).With(UserDetail{}, UserScore{}).Where("id", 3).Scan(&user)
```

Or like this:

```go
var user *User
g.Model(tableUser).With(User{}.UserDetail, User{}.UserScore).Where("id", 3).Scan(&user)
```

#### 2) Only Associate User Detail Model

If we only need to query user details and not user scores, we can use the `With` method to enable association queries for the specified object corresponding tables, such as:

```go
var user *User
g.Model(tableUser).With(UserDetail{}).Where("id", 3).Scan(&user)
```

Or like this:

```go
var user *User
g.Model(tableUser).With(User{}.UserDetail).Where("id", 3).Scan(&user)
```

After execution, the data printed by `g.Dump(user)` is:

```js
{
        "id": 3,
        "name": "name_3",
        "UserDetail": {
                "uid": 3,
                "address": "address_3"
        },
        "UserScores": []
}
```

#### 3) Only Associate User Score Model

We can also associate and query only user score information, such as:

```go
var user *User
g.Model(tableUser).With(UserScore{}).Where("id", 3).Scan(&user)
```

Or like this:

```go
var user *User
g.Model(tableUser).With(User{}.UserScore).Where("id", 3).Scan(&user)
```

After execution, the data printed by `g.Dump(user)` is:

```js
{
        "id": 3,
        "name": "name_3",
        "UserDetail": null,
        "UserScores": [
                {
                        "id": 11,
                        "uid": 3,
                        "score": 1
                },
                {
                        "id": 12,
                        "uid": 3,
                        "score": 2
                },
                {
                        "id": 13,
                        "uid": 3,
                        "score": 3
                },
                {
                        "id": 14,
                        "uid": 3,
                        "score": 4
                },
                {
                        "id": 15,
                        "uid": 3,
                        "score": 5
                }
        ]
}
```

#### 4) Do Not Associate Any Model Query

If we do not need any association query, it's simpler, for example:

```go
var user *User
g.Model(tableUser).Where("id", 3).Scan(&user)
```

After execution, the data printed by `g.Dump(user)` is:

```js
{
        "id": 3,
        "name": "name_3",
        "UserDetail": null,
        "UserScores": []
}
```

## 4. Usage Restrictions

### 1. Field Query and Filtering

As seen in our example above, we have not specified the fields to query, but in the `SQL` logs printed, the query statement is not a simple `SELECT *` but executed concrete field queries. Under the `With` feature, automatic field query mapping according to the associated model object properties will happen, and it will automatically filter out fields that cannot be mapped.

Therefore, under the `With` feature, we cannot query only some corresponding properties’ fields. To query and assign only specific fields, it is recommended to trim the `model` data structure according to business scenarios and create data structures that meet specific business scenarios, rather than using one data structure to fit multiple different scenarios.

Let's use an example for better illustration. Suppose we have an entity object data structure `Content`, a common content model in a `CMS` system as follows, which corresponds to the fields of the data table:

```go
type Content struct {
    Id             uint        `orm:"id,primary"       json:"id"`               // Auto-increment ID
    Key            string      `orm:"key"              json:"key"`              // Unique key name, generally not commonly used
    Type           string      `orm:"type"             json:"type"`             // Content model: topic, ask, article, etc., defined by the program
    CategoryId     uint        `orm:"category_id"      json:"category_id"`      // Category ID
    UserId         uint        `orm:"user_id"          json:"user_id"`          // User ID
    Title          string      `orm:"title"            json:"title"`            // Title
    Content        string      `orm:"content"          json:"content"`          // Content
    Sort           uint        `orm:"sort"             json:"sort"`             // Sort order, lower value means higher priority, default is the timestamp when added, can be used to pin
    Brief          string      `orm:"brief"            json:"brief"`            // Summary
    Thumb          string      `orm:"thumb"            json:"thumb"`            // Thumbnail
    Tags           string      `orm:"tags"             json:"tags"`             // Tag names list, stored in JSON
    Referer        string      `orm:"referer"          json:"referer"`          // Content Source, e.g., GitHub/Gitee
    Status         uint        `orm:"status"           json:"status"`           // Status 0: Normal, 1: Disabled
    ReplyCount     uint        `orm:"reply_count"      json:"reply_count"`      // Reply count
    ViewCount      uint        `orm:"view_count"       json:"view_count"`       // View count
    ZanCount       uint        `orm:"zan_count"        json:"zan_count"`        // Likes
    CaiCount       uint        `orm:"cai_count"        json:"cai_count"`        // Dislikes
    CreatedAt      *gtime.Time `orm:"created_at"       json:"created_at"`       // Creation time
    UpdatedAt      *gtime.Time `orm:"updated_at"       json:"updated_at"`       // Update time
}
```

The content list page does not need to display such detailed content, especially the `Content` field, which is very large. We only need to query a few fields for the list page. Therefore, we can define a separate data structure for list returns (field trimming) instead of directly using the data table entity object data structure. For example:

```go
type ContentListItem struct {
    Id         uint        `json:"id"`          // Auto-increment ID
    CategoryId uint        `json:"category_id"` // Category ID
    UserId     uint        `json:"user_id"`     // User ID
    Title      string      `json:"title"`       // Title
    CreatedAt  *gtime.Time `json:"created_at"`  // Creation time
    UpdatedAt  *gtime.Time `json:"updated_at"`  // Update time
}
```

### 2. Must Exist Association Field Property

The `With` feature is achieved by recognizing data structure associations and automatically executing multiple SQL queries, so associated fields must exist as object properties for automatic retrieval of association field values. Simply put, the fields in the `with` tag must be present in the attributes of the associated object.

## 5. Recursive Association

If the associated model properties also have `with` tags, recursive association querying will occur. The `With` feature supports unlimited levels of recursive association. The following example is for reference only:

```go
// User Detail
type UserDetail struct {
    g.Meta `orm:"table:user_detail"`
    Uid        int    `json:"uid"`
    Address    string `json:"address"`
}

// User Scores - Required Courses
type UserScoresRequired struct {
    g.Meta `orm:"table:user_scores"`
    Id         int `json:"id"`
    Uid        int `json:"uid"`
    Score      int `json:"score"`
}

// User Scores - Elective Courses
type UserScoresOptional struct {
    g.Meta `orm:"table:user_scores"`
    Id         int `json:"id"`
    Uid        int `json:"uid"`
    Score      int `json:"score"`
}

// User Scores
type UserScores struct {
    g.Meta `orm:"table:user_scores"`
    Id         int                  `json:"id"`
    Uid        int                  `json:"uid"`
    Required   []UserScoresRequired `orm:"with:id, where:type=1"`
    Optional   []UserScoresOptional `orm:"with:id, where:type=2"`
}

// User Information
type User struct {
    g.Meta `orm:"table:user"`
    Id         int           `json:"id"`
    Name       string        `json:"name"`
    UserDetail *UserDetail   `orm:"with:uid=id"`
    UserScores []*UserScores `orm:"with:uid=id"`
}
```

## 6. Model Examples

Based on the current data tables, more model writing examples are provided for reference.

### 1. Nested Associated Models

```go
type UserDetail struct {
    g.Meta `orm:"table:user_detail"`
    Uid        int    `json:"uid"`
    Address    string `json:"address"`
}

type UserScores struct {
    g.Meta `orm:"table:user_scores"`
    Id         int `json:"id"`
    Uid        int `json:"uid"`
    Score      int `json:"score"`
}

type User struct {
    g.Meta  `orm:"table:user"`
    *UserDetail `orm:"with:uid=id"`
    Id          int           `json:"id"`
    Name        string        `json:"name"`
    UserScores  []*UserScores `orm:"with:uid=id"`
}
```

Nested models also support nesting to allow automatic data assignment for embedded structures, such as:

```go
type UserDetail struct {
    Uid     int    `json:"uid"`
    Address string `json:"address"`
}

type UserDetailEmbedded struct {
    UserDetail
}

type UserScores struct {
    Id    int `json:"id"`
    Uid   int `json:"uid"`
    Score int `json:"score"`
}

type User struct {
    *UserDetailEmbedded `orm:"with:uid=id"`
    Id                  int           `json:"id"`
    Name                string        `json:"name"`
    UserScores          []*UserScores `orm:"with:uid=id"`
}
```

### 2. Basic Model Nesting

```go
type UserDetail struct {
    g.Meta `orm:"table:user_detail"`
    Uid        int    `json:"uid"`
    Address    string `json:"address"`
}

type UserScores struct {
    g.Meta `orm:"table:user_scores"`
    Id         int `json:"id"`
    Uid        int `json:"uid"`
    Score      int `json:"score"`
}

type UserEmbedded struct {
    Id   int    `json:"id"`
    Name string `json:"name"`
}

type User struct {
    g.Meta `orm:"table:user"`
    UserEmbedded
    *UserDetail `orm:"with:uid=id"`
    UserScores  []*UserScores `orm:"with:uid=id"`
}
```

### 3. Models Without `meta` Information

The `meta` structure in the model is crucial for specifying the table name. When there is no `meta` information, the table name for query will automatically use the `CaseSnake` name of the struct. For example, `UserDetail` will automatically use the `user_detail` table name, and `UserScores` will automatically use the `user_scores` table name.

```go
type UserDetail struct {
    Uid     int    `json:"uid"`
    Address string `json:"address"`
}

type UserScores struct {
    Id    int `json:"id"`
    Uid   int `json:"uid"`
    Score int `json:"score"`
}

type User struct {
    *UserDetail `orm:"with:uid=id"`
    Id          int           `json:"id"`
    Name        string        `json:"name"`
    UserScores  []*UserScores `orm:"with:uid=id"`
}
```

## 7. Future Improvements

- Currently, the `With` feature is only implemented for query operations and does not support write or update operations.