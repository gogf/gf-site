# Data and Business Models

In the previous section [Code Layering](https://goframe.org/en/docs/design/project-layer.md), the concept of "**model**" was mentioned.

In this section, we will focus on introducing the definition and management of models in `GoFrame`.

## 1. Data Model

**Data Model**, also known as **Entity Model**, mainly comes from the data structure of the underlying persistent databases, such as `MySQL`, `Redis`, `MongoDB`, `Kafka`, etc. These data structures are maintained by third-party systems and can be identified through tools which automatically generate corresponding program data model codes. These data model codes are located in the `/internal/model/entity` directory. Developers do not need to manually maintain data models in the program. According to the `GoFrame` framework specification, data models are uniformly maintained using `CLI` tools, and codes are automatically generated.

Example of Data Model

## 2. Business Model

The business model mainly includes two types: **Interface Input/Output Model** and **Business Input/Output Model**.

### Interface Input/Output Model

Interface Input/Output Models are used for interface interaction between systems/services, defined in the `api` interface layer, and can be called by all layers of the project, such as `controller, logic, model`. However, the `api` layer is only used for interface interaction with external services, and this model cannot call or reference internal models like `model`. In the `GoFrame` framework specification, these input/output model names are named in the format `XxxReq` and `XxxRes`.

Example of Interface Input Model

### Business Input/Output Model

**Business Input/Output Models** are used for method call interactions **within** service modules/components, especially calls between `controller->service` or `service->service`. These models are defined in the `model` layer. In the `GoFrame` framework specification, these input/output model names are usually in the format `XxxInput` and `XxxOutput`.

Example of Business Input Model and Business Output Model

### Special Business Model `DO`

In `GoFrame`, there is a special business model `DO`, which is intermediate between business models and data models and is mainly used to simplify `DAO` data access operations by leveraging the framework's powerful `ORM` component.

DO is mainly used for DAO data access operations

## 3. Other Models

There are also internal private models used for module internal calls, such as models defined within each business module in `logic`, used for internal logic and not exposed to the outside.

> Page: https://goframe.org/en/docs/design/project-models
