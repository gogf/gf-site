# Structured Programming

## I. Introduction

Structured programming can be simply understood as passing and returning parameters by defining structs.

We recommend using structured definitions to manage input/output when necessary, especially in the code design of the `controller` and `service` layers.

### 1. Pain Points of Unstructured `controller`

- It is difficult to determine the data structure of interface input/output. Most scenarios involve hard-coded parameter reception names in the code, prone to errors leading to unforeseen issues.
- Interface parameters often only define an `HttpRequest/HttpContext` object pointer, making it difficult to determine if the interface succeeded or failed.
- The processes of parameter reception, validation, and conversion are tedious.
- Generating and maintaining interface documentation is extremely challenging.

### 2. Pain Points of Unstructured `service`

- When there are many method parameters, the definition is awkward, and usage is cumbersome.
- When the number and type of method parameters are uncertain, any arbitrary change (like adding a parameter) is non-compatible, leading to high modification costs.
- Method parameter annotations are inconvenient, resulting in most business projects lacking method parameter annotations.

## II. Structured Programming

### 1. Structured Improvements for `controller`

**Advantages of Structuring:**

- By structurally managing interface input/output parameters, hard-coding parameter names for reception is no longer needed, reducing maintenance costs and avoiding errors due to hard-coded parameter names.
- Enables automated parameter reception, conversion, and validation, thereby improving productivity.
- Standardizes interface writing.
- Makes interface management as convenient as ordinary function management, allowing error handling by returning `error` and standardizing the unified error mechanism.
- Automates interface documentation generation, ensuring synchronized maintenance of interface structure definitions and documentation.

**Example of Structuring:**

Structure Definition:

Method Usage:

### 2. Structured Improvements for `service`

**Advantages of Structuring:**

- When there are many method parameters, structs elegantly manage these parameters.
- When the number and type of method parameters are uncertain, adding parameters is compatible with method invocation.
- Provides more convenient annotations for struct properties, enhancing code maintenance quality.

**Example of Structuring:**

## III. Precautions

- When using structured management for input/output parameters in the `service` layer methods, any parameter within the struct will be considered optional. It's necessary to reasonably assess feasibility based on business scenarios.

> Page: https://goframe.org/en/docs/design/project-struct-parameter
