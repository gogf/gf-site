---
slug: '/docs/design/project-dao-pain'
title: 'DAO Component Pain Points and Improvements'
sidebar_position: 0
hide_title: true
---

Regarding the design of `DAO` (Data Access Object), it is actually a crucial part of the engineering practice with the `GoFrame` framework.

The `DAO` design, combined with `GoFrame`'s `ORM` component, is both performant and easy to use, which can greatly improve development and maintenance efficiency. After reading this chapter, you should be able to understand and appreciate the advantages of using `DAO` for database access object design.

:::info
Every year, I revisit this article to see if there are parts that can be removed. However, I am always disappointed because this article is still applicable to the current situation. And this year, I have added new content.
:::

## 1. Existing `ORM` Usage Example

### 1. Model Definition Required

![](/markdown/77daf5d299eabade856d950ab3161f94.png) User base table (for demonstration only, the actual table has dozens of fields)

![](/markdown/f4e8c70ee25ec329f2b64bb3a53ff503.png) Doctor information table (for demonstration only, the actual table has hundreds of fields)

### 2. `GRPC` Interface Implementation Example

A simple `GRPC` query information interface.

![](/markdown/b45b3af0a0bdc9ad30f739e31d0039ae.png) A simple `GRPC` data query interface

## 2. Existing Pain Points Description

### 1. Must Define `tag` to Associate Table Structure with `struct` Properties, No Automatic Mapping

There is originally a certain correlation between table fields and entity object property names, and there is no need to define and maintain a large number of `tag` definitions.

![](/markdown/f1bb2d203d4fe4f2c44bbc7e14b7832a.png)

A large number of unnecessary `tag` definitions are used to specify the mapping from data table fields to entity object properties.

### 2. Does Not Support Specifying Query Fields through Return Objects

It is not possible to specify query fields through the return object's data structure; you can either only `SELECT *` or manually enter query fields through additional methods, which is very inefficient.

![](/markdown/70e01c869632543b846b04a1696e9737.png)

Common `SELECT *` operation, unable to specify query fields based on interface objects.

### 3. Unable to Automatically Filter Input Object Property Names

Input and output data structures have been defined, and the output data structure already includes the field names we need to query. Developers define the return object, expecting to query only the field names needed during the query, and automatically filter out excess properties without executing the query.

### 4. Need to Create Intermediate Query Result Objects for Assignment Conversion

Query results do not support `struct` intelligent conversion, requiring the definition of an additional intermediate `model`, and then copying through other tools, which is inefficient.

![](/markdown/05bf7722da09a27e7ca82bf6e0f89271.png)

There exists an intermediate temporary model object for承接 query results and return structure object assignment conversion.

### 5. Need to Initialize Return Objects in Advance, Regardless of Whether Data is Queried

This approach is not only inelegant but also affects performance and is not friendly to `GC`. It is expected that the return object is automatically created when data is queried, and nothing is done when no data is queried.

![](/markdown/239f4b75b4b77e85bca523371a7dd1b4.png)

Need to pre-initialize return objects, regardless of whether data is queried.

### 6. The Project Uses Underlying Bare `DB` Object Operations Throughout, Without Object Encapsulation Operations

Most `Golang` beginners seem to prefer using a global `DB` object, generating a `Model` object for a specific table through the `DB` object during queries, and then performing `CURD` operations. This is a procedural usage method. This approach does not have a layered design for code, **resulting in high coupling between data operations and business logic**.

![](/markdown/d73fdaa5b76b831db0a2c1069742c218.png)

Raw database object operation method, without `DAO` encapsulation.

### 7. Ubiquitous String Hardcoding, Such as Hardcoding of Table Names and Fields

For example, if the field `userId` is accidentally written as `UserId` or `userid`, and it is not fully covered during testing, and the query operation is triggered under certain conditions, wouldn't it cause a new accident?

![](/markdown/46d8aae38995327c6ce26832d21f628b.png)

A large number of string hardcodes.

### 8. Too Many Pointer Property Definitions Caused by Underlying ORM

Pointer property objects pose hidden dangers for business logic processing. Developers need to switch between pointers and properties in the code logic, especially for some basic types that often need to pass parameters by re-acquiring values. If the input parameter is of type `interface{}`, it is more likely to cause `BUG`s.

![](/markdown/620c8a9a4a47de0243748d588aa0bb51.png)

`BUG` example, improper use of pointer properties causing address comparison logic errors.

![](/markdown/daa08ad1e9102f4ac964a8176a80e061.png)

It also affects the design of business model structure definitions, leading developers astray with wrong habits (pointer properties in upper business models are often to cater to underlying data table entity objects for easy data transfer).

![](/markdown/bba716ea66e03727826ae6401ce01b2d.png)

A common mistake worth noting is using the underlying data entity model as the top-level business model. Especially in scenarios where pointer properties are used for underlying data entity objects, this issue is very obvious.

### 9. Observability Support: Tracing, Metrics, Logging

As the most critical core component of business projects, database ORM observability support is essential.

### 10. Inconsistency Between Data Collections and Code Data Entity Structures

When maintaining data entity structures manually, there is often a risk of inconsistency between data collections and code data entity structures, which is costly in terms of development and maintenance.

## 3. Improvement Plan Design

1. No special tag definition is required for query result objects; full automatic association mapping is supported.

2. Support for automatically recognizing query fields based on specified objects, rather than all `SELECT *`.

3. Support for automatically filtering non-existent field content based on specified objects.

4. Use `DAO` object encapsulation for code design, operating on data tables through object methods.

5. `DAO` objects encapsulate associated table names and field names, avoiding string hardcoding.

6. No need to define entity objects in advance to accept return results; no need to create intermediate entity objects for interface return object assignment conversion.

7. Query result objects do not need to be initialized in advance; they will be automatically created when data is queried.

8. Built-in support for `OpenTelemetry` standard for observability, greatly improving maintenance efficiency and reducing costs.

9. Support for `SQL` log output capability with on/off functionality.

10. Decoupling of data models, data operations, and business logic; support for automated generation of `Dao` and `Model` code tools, ensuring consistency between data collections and code data structures, improving development efficiency, and facilitating standard implementation.

11. And so on.

![](/markdown/90537635dc3b5623060fa9edfc49948a.png)

Code example after adopting `DAO` design improvements

