# Interface and Generic

## 1. Introduction

Interface is a higher level of abstraction. The framework components are designed using interfaces as much as possible instead of providing specific implementations. The biggest advantage of interface design is that it allows users to customize implementations to replace the component's underlying interface layer, achieving strong flexibility and extensibility.

## 2. Component Interface Design

The core components of the `GoFrame` framework adopt an interface design. For example, the following image shows an overview of the interface implementation for some components:

Most components use `Adapter` as the name of their interface layer. The current interface implementation can be set using the `SetAdapter` method and obtained using the `GetAdapter` method. Additionally, to enhance usability, components provide some default `Adapter` implementations for users to choose from. Taking the `gsession` component as an example:

The underlying interface is defined using `Storage`, with four implementations available: `File/Memory/Redis/RedisHashTable`. The default implementation is `File`.

## 3. Interface and Generics

The interface design of components offers high extensibility but needs to be combined with generics for more flexible usage. Again, taking the `gsession` component as an example, parameters are returned using generics, which allows for conversion to the corresponding data types as needed in business applications.

### Increasing Parameter Flexibility, Simplifying Usage Complexity

Without generics, interfaces would either need to provide methods for various types or return `interface{}` types, both of which can be complex. By uniformly returning through generic data types, parameter type flexibility is enhanced, significantly reducing usage complexity.

Generics support conversion to various types:

Convert to the corresponding data type according to business scenario needs. Type conversion utilizes the framework’s unified type conversion component, which prioritizes using assertions for type recognition to ensure conversion efficiency.

### Unified Usage Method, Shielding Underlying Impact

For some complex type interface scenarios, the underlying implementation of the interface may involve external storage situations, generating serialization/deserialization operations, which may change/lose data types. Using generics can shield the impact of the underlying implementation through a unified usage method. For example, in the following example, no matter how the underlying `Session` implementation changes, the upper layer uses generics to convert to the target object through the `Scan` method.

## 4. Notes

Although the framework provides generic design, it is not recommended to widely use generics in business applications. The data structure design in the business layer, including interfaces and business model data structures, should be accurate and definite.

> Page: https://goframe.org/en/docs/design/interface-generic
