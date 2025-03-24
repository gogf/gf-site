---
slug: '/docs/components/container-gvar'
title: 'Generic'
sidebar_position: 4
hide_title: true
keywords: [GoFrame, GoFrame Framework, gvar, Generic Type, Runtime Generics, Concurrent Safe, Data Type Conversion, g.Var, Development Efficiency]
description: "The gvar type in the GoFrame framework is a runtime generic implementation designed to enhance development convenience and efficiency. gvar supports built-in data type conversion and can serve as an alternative to interface{}, with its concurrency-safe feature making it excellent in scenarios requiring frequent data conversion. Additionally, it introduces the usage of gvar types and related interface documentation."
---


## Introduction

`gvar` is a **runtime generic** implementation that enhances development convenience and efficiency with minimal runtime overhead. It supports various built-in data type conversions and can be used as an alternative to the `interface{}` type. This type supports concurrency safety toggles.
:::tip
The framework also provides the `g.Var` data type, which is essentially an alias for the `gvar.Var` data type.
:::
**Usage Scenarios**:

Scenarios where `interface{}` is used, various data formats that are not fixed, or scenarios that require frequent data type conversion.

**Usage**:

```go
import "github.com/gogf/gf/v2/container/gvar"
```

**Interface Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/container/gvar](https://pkg.go.dev/github.com/gogf/gf/v2/container/gvar)

## Documentation

import DocCardList from '@theme/DocCardList';

<DocCardList />