---
slug: '/docs/design/project-dao-improvement'
title: 'DAO-Project Pain Points and Improvements'
sidebar_position: 1
hide_title: true
---

## 1. Basic Introduction

We all know that developing business projects is inseparable from the use of database operation components. The database is the core of the vast majority of business projects, which is also the origin of the joking term "CRUD Engineer." When performing database operations in business projects, a more rudimentary approach is to directly use `Open/New` followed by various `SQL` string operations. A slightly more normalized project might consider looking for or encapsulating an ORM abstraction to improve CRUD efficiency and reduce data operation risks. A more rigorous project might consider further increasing `DAO/DTO/VO` and other design patterns and concepts in project engineering management.

In the information age, data is very important, and data operations are very sensitive. Therefore, the `GoFrame` framework has a rigorous engineering approach to data operation management. We provide the necessary ORM abstraction, necessary DAO encapsulation, and necessary engineering specification constraints. At the same time, we do not adopt rigid design but still maintain a simple, flexible, and easily expandable engineering design philosophy.

## 2. Engineering Pain Points

In some rigorous business projects, there are already `ORM&DAO` abstractions, and the project has a preliminary engineering design. However, the following common pain points still exist.

### 1. Data Collection and Code Structure Out of Sync

When manually maintaining data structures corresponding to data collections in the code, this pit is dug, and it depends on who falls into it later.

### 2. Data Model and Business Model Vagueness

Confusing the responsibilities of data models and business, and coupling data models with business logic and interface definitions, the greater the coupling, the higher the maintenance cost of related methods and interfaces, and the greater the risk of changes to the data model. Common pain points include:

- In the `model`, there are both business-related data structures (business models) and data structures corresponding to data collections (data models). How to efficiently isolate and manage them?
- In the business process, using the data model as the **input parameter** of the business process. Even embedding the data model directly into the API interface input data structure definition (always trying to use the data model in the business model).

### 3. Too Much Business Logic Encapsulation in the DAO Layer

Do you have a feeling that any data operation has a reason to be thrown into the `DAO`?

### 4. Using Data Models as ORM/DAO Operation Parameters

You might think this is correct, but unclear data structures mean cost and risk. Any operation should be able to clearly define inputs/outputs; otherwise, it is not rigorous. Data operations should be particularly rigorous.

### 5. Data Operation Permissions Open, and Any Project Location Can Be Called at Will

Data operation permissions should be as restricted as possible. If they are too open, then as the business and personnel become more complex, the project's maintenance costs and risks will increase sharply.

### 6. Using the Same Data Structure from Top-Level Business to Bottom-Level Data Collection Operations

The common problem is designing a large structure, such as a data model (even worse, designing all attributes as pointers or `interface{}`), passing through from top-level business to bottom-level data operations, and judging method logic based on whether specific attributes are input. What problems does this cause?

- Method parameter definitions are unclear, and unclear definitions mean additional collaboration costs and additional unclear risks.
- The same data structure is coupled with many methods, and any change in the data structure will affect all related methods.
- Related methods cannot be fully reused (especially methods in the `service` layer).

## 3. Engineering Improvements

### 1. Automated Data Model Management

Automate the code generation from data collections to data models through tools to avoid desynchronization caused by manual maintenance.

### 2. Isolation of Data and Business Models

Maintain data models through the `entity` package and business models through the `model` package, distinguishing them through different package responsibilities. Data models are maintained by tools, and business models are defined and maintained by developers according to business scenarios.

### 3. Automated DAO Code Management

Automate the generation of `DAO` code for data collections through tools to improve production efficiency. `DAO` only contains automatically generated basic data operations and does not encapsulate specific business logic.

### 4. Introduction of DO Data Conversion Models

Avoid using data models directly as `DAO` parameters to avoid pitfalls. The `GoFrame` framework introduces the `DO` package, automatically converting to the corresponding data structure of the data collection during `DAO` operations, improving `DAO` operation efficiency and reducing operation risks.

### 5. Restrict Data Operation Permissions

Since data operations have been uniformly maintained by the `DAO` package, the `DAO` package can be moved to the `internal` directory of the corresponding `logic` layer business module, realizing that only the corresponding business logic code of the `logic` layer in the project engineering can perform data operations through `DAO`.

This is a stricter usage restriction, which developers can choose to use as needed. The framework's default project templates and tools do not restrict data operation permissions. Data operation permission restriction can be achieved by configuring the framework's development tools to generate `dao` code to different `logic` business module locations.
