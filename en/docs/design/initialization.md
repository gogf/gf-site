# Implicit and Explicit Init

We know that some "initialization" logical operations need to be executed when the program starts, such as: `Server` configuration, various database (`MySQL`, `Redis`, `Kafka`, etc.) configurations, business object configurations, etc. In most scenarios, we have two initialization methods: implicit initialization and explicit initialization.

## 1. Implicit Initialization

**Warning**

Special Note: In `Golang v1.21` and later versions, the execution order of the `init` initialization has changed and may cause problems for packages that rely on `init` to execute initialization logic. Therefore, it is not recommended to execute **complex initialization logic** in `init`. **It is recommended to implement complex module initialization logic through explicit invocation.**

Implicit initialization is generally executed through the package initialization method `init`. It should be noted that if there is a possibility of errors in the initialization logic, since errors in the `init` method cannot be caught by the upper layer, if initialization fails, the program startup is often directly terminated. For example:

When implicit initialization fails, it often directly terminates the program startup.

The advantage of implicit initialization is that it does not require manually calling the initialization method, hiding initialization details from developers, and thus developers have no cognitive burden. However, the downside is also the same: developers do not know the initialization details, so once an error occurs, it is difficult to quickly pinpoint the cause. Therefore, when using implicit initialization, it is often required to print detailed errors and stack information when initialization errors occur to facilitate error localization.

Many modules in the `GoFrame` framework use implicit initialization to hide module initialization details and reduce developers' cognitive burden. For example:

Implicit initialization design is common in modules of `GoFrame`.

The `main` package using the `GoFrame` framework implicitly `imports`.

The initialization process of the package's `init` method:

## 2. Explicit Initialization

Explicit initialization requires the developer to call specific methods to perform initialization operations when the program starts, such as in the `main` or `boot` module. Generally speaking, the initialization of basic components tends to use implicit initialization more, because users do not care about the initialization logic of underlying basic modules, while the initialization of business modules is mostly done using explicit initialization. For example:

 Explicit initialization executed sequentially in the `boot` package.

 In the `main` package, the `boot.Boot()` method is called to execute initialization.

## 3. How to Choose

In business scenarios, unless specially necessary, we recommend using **explicit initialization** to ensure better maintainability.

> Page: https://goframe.org/en/docs/design/initialization
