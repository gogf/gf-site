# Pain Points and Improvements In ORM Component

The design of `DAO` (Data Access Object) is actually a significant part of the engineering practices in the `GoFrame` framework.

The `DAO` design, combined with the `ORM` component of `GoFrame`, offers strong performance and ease of use, which can greatly enhance development and maintenance efficiency. After reading this chapter, individuals should be able to understand and appreciate the advantages of using DAO database access object design.

**Info**

I review this article every year to see if any parts can be removed. However, I am always disappointed because this article still applies to the current situation. I have even added new content this year.

## 1. Current `ORM` Usage Example

### 1. Need to Define Models

 Basic User Table (for demonstration purposes only, real table has dozens of fields)

 Doctor Information Table (for demonstration purposes only, real table has hundreds of fields)

### 2. `GRPC` Interface Implementation Example

A simple `GRPC` information query interface.

 A simple `GRPC` data query interface

## 2. Description of Current Pain Points

### 1. Must Define `tag` to Associate Table Structure with `struct` Properties, Cannot Achieve Automatic Mapping

There is already a certain correlation rule between table fields and entity object property names, making it unnecessary to define and maintain a large number of `tags`.

A large number of unnecessary `tag` definitions used to map database table fields to entity object properties

### 2. Does Not Support Specifying Fields to Query via the Return Object

You cannot specify query fields via the structure of the returned object. Either you can only `SELECT *` or manually input query fields through additional methods, which is inefficient.

Common `SELECT *` operation, unable to specify query fields based on the interface object

### 3. Unable to Automatically Filter Field Names of Input Object Properties

Once the input and output data structures are defined, the output data structure already contains the field names we need to query. Developers define a return object with the expectation that only the fields needed will be queried, automatically filtering out unnecessary properties.

### 4. Need to Create Intermediate Query Result Objects for Assignment and Conversion

Query results do not support intelligent `struct` conversion, requiring an additional intermediate `model` model and using other tools to copy, which is inefficient.

Existence of an intermediate temporary model object for taking query results and assigning values to the return structure object

### 5. Need to Pre-initialize Return Objects Regardless of Whether Data is Queried

This approach is inelegant, impacts performance, and is not `GC` friendly. Expectation is to auto-create return objects only when data is queried and do nothing if no data is found.

Need to pre-initialize return objects regardless of whether data is queried

### 6. Entire Project Uses Low-Level Bare `DB` Object Operations Without Object Encapsulation

Most `Golang` beginners seem to prefer using a global `DB` object to create a specific table `Model` object for `CRUD` operations. This approach lacks a layered code design, **resulting in high coupling between data operations and business logic**.

Primitive database object operation without `DAO` encapsulation

### 7. Ubiquitous String Hardcoding, such as Table Names and Field Hardcoding

For instance, if the field `userId` is accidentally written as `UserId` or `userid`, and tests do not fully cover this, it could lead to a new accident under certain circumstances.

大量的字符串硬编码

### 8. Too Many Pointer Property Definitions Caused by the Underlying ORM

Pointer property objects lay hidden risks for business logic processing, requiring developers to switch between pointers and properties in the code logic, especially since basic types often need to pass parameters by re-evaluation. If the input parameter is of `interface{}` type, it is easier to cause `BUG`.

`BUG` example, inappropriate use of pointer properties causing logical errors in address comparison.

This also affects the design of business model structure definitions, leading developers to form incorrect habits (upper business model pointer properties often cater to the lower-level data table entity objects for convenient data transmission).

Notably, a common mistake is using the lower-level data entity model as the top-leve business model. This issue is particularly evident when pointer properties are used in the lower-level data entity objects.

### 9. Support for Observability: Tracing, Metrics, Logging

As the most critical core component of business projects, supporting observability is crucial.

### 10. Data Set and Code Data Entity Structure Mismatch

When data entity structures are manually maintained, there is often a risk of inconsistency between data sets and code data entity structures, resulting in high development and maintenance costs.

## 3. Improvement Design

1. No special tag definitions needed for query result objects, fully automatic association mapping

2. Support automatic identification of query fields based on the specified object instead of all `SELECT *`

3. Support automatic filtering of non-existent field contents based on the specified object

4. Use `DAO` object encapsulation code design, operating data tables via object methods

5. `DAO` objects encapsulate associated table and field names to avoid string hardcoding

6. No need to predefine entity objects for receiving results, nor create intermediate entities for interface return object assignment and conversion

7. Query result objects are not pre-initialized, automatically created only when data is queried

8. Built-in support for `OpenTelemetry` standards, achieving observability, greatly improving maintenance efficiency, reducing costs

9. Support for `SQL` log output capabilities, with on/off switch functionality

10. Decoupling of data models, data operations, and business logic, supporting automated generation of `Dao` and `Model` code tools, ensuring consistency of data sets and code data structure, improving development efficiency, and facilitating the implementation of standards

11. Etc.

Code example after improvement using `DAO` design

> Page: https://goframe.org/en/docs/design/project-dao-pain
