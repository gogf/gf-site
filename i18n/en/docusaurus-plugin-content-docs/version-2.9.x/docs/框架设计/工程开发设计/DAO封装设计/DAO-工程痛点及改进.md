---
slug: '/docs/design/project-dao-improvement'
title: 'Pain Points and Improvements In Business Project'
sidebar_position: 1
hide_title: true
keywords: [GoFrame, GoFrame Framework, DAO Improvement, Database Operation, Data Model, Business Model, ORM Abstraction, Engineering Design, Data Permission, Automated Code Generation]
description: "The DAO engineering pain points and corresponding improvement strategies in project development using the GoFrame framework. Enhance data operation management efficiency through automated data model management, separation of data and business models, automated DAO code management, and introduction of DO data conversion models. Emphasize the importance of data operation permission consolidation to reduce maintenance costs and risks associated with data operations."
---

## 1. Introduction

We all know that developing business projects is inextricably linked to using database operation components, and the database is the core of most business projects, which is the origin of the nickname "CRUD engineer." When performing database operations in business projects, a rather low approach is to directly "Open/New" and then engage in various SQL string operations. Slightly more standard projects might consider selecting or encapsulating an ORM abstraction layer to improve CRUD efficiency and reduce the risk of data operations. More rigorous projects might further consider engineering management by introducing design patterns and concepts such as DAO/DTO/VO.

In the information age, data is extremely important and data operations are highly sensitive, so GoFrame framework's engineering approach to data operation management is rigorous. We provide necessary ORM abstractions, necessary DAO encapsulations, and necessary engineering norms and constraints. Additionally, we do not adopt a standardized design but maintain a simple, flexible, and easy-to-extend engineering design approach.

## 2. Engineering Pain Points

In some rigorous business projects, even with ORM & DAO abstractions and preliminary engineering design in place, the following common pain points still exist.

### 1. Data Set and Code Structure Asynchrony

When manually maintaining the data structures corresponding to data sets in the code, it's like digging a pit—just waiting to see who falls into it later.

### 2. Ambiguity between Data Model and Business Model

Confusing the responsibilities of data models with business models, and coupling data models with business logic and interface definitions, increases maintenance costs and risks associated with data models changes. Common pain points include:

- In the `model`, there are both business-related data structures (business model) and data structures corresponding to data sets (data model). How can they be efficiently isolated and managed?
- In business processes, using data models as the **input parameters** and even embedding data models directly into the API interface input data structure (always finding ways to use data models in business models).

### 3. Too Much Business Logic Encapsulation in the DAO Layer

Have you ever felt that any data operation has a reason to be thrown into the `DAO`?

### 4. Using Data Models as Parameters for ORM/DAO Operations

You might think this is correct, but unclear data structures imply costs and risks. Any operation should clearly specify inputs/outputs; otherwise, it lacks rigor, especially in data operations.

### 5. Open Data Operation Permissions, Allowing Calls from Anywhere in the Project

Data operation permissions should be consolidated as much as possible. If overly open, maintenance costs and risks will exponentially increase as business and personnel complexity grows.

### 6. Using the Same Data Structure from Top-level Business to Bottom-level Data Set Operations

A common issue is designing a large structure, such as a data model (some even design all attributes as pointers or `interface{}`), passing it seamlessly from top-level business through to bottom-level data operations, with method logic determining parameters based on specific input attributes. What problems does this cause?

- Method parameter definitions are unclear, resulting in extra collaboration costs and risks due to ambiguity.
- The same data structure is coupled with multiple methods, meaning any change in the data structure will affect all related methods.
- Related methods cannot be fully reused (especially methods in the `service` layer).

## 3. Engineering Improvements

### 1. Automated Data Model Management

Implement automated generation of data models from data sets using tools to avoid asynchrony caused by manual maintenance.

### 2. Separation of Data and Business Models

Maintain data models through an `entity` package and business models through a `model` package, distinguishing responsibilities per package. Data models are tool-maintained, and business models are defined and maintained by developers based on business scenarios.

### 3. Automated DAO Code Management

Implement automated generation of `DAO` code from data sets using tools to increase production efficiency. Only basic data operations autogenerated, with no specific business logic encapsulation.

### 4. Introduction of DO Data Conversion Model

Avoid using data models directly as `DAO` parameters to avoid pitfalls. The GoFrame framework introduces a `DO` package that automatically converts to data set corresponding data structures during `DAO` operations, enhancing operational efficiency and reducing risks.

### 5. Consolidating Data Operation Permissions

Since data operations are centrally maintained by the `DAO` package, it can be migrated to the `internal` directory of the corresponding `logic` layer business module, ensuring that only `logic` layer business logic code can execute data operations through `DAO`.

This is a stricter usage limitation, used selectively based on developer needs. The default project templates and tools of the framework do not consolidate data operation permissions. This consolidation can be achieved through framework development tool configurations to generate `dao` code for different `logic` business module locations.