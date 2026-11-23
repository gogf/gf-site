# Array

## Introduction

Array container that provides regular arrays and sorted arrays, supporting data item uniqueness correction and concurrency-safe toggle control.

**Application Scenarios**:

Array operations.

**Usage**:

```go
import "github.com/gogf/gf/v2/container/garray"
```

**Interface Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/container/garray](https://pkg.go.dev/github.com/gogf/gf/v2/container/garray)

Brief Description:

1. There are many objects and methods under the `garray` module, so it is recommended to look carefully at the interface documentation.
2. `garray` supports the three common data types: `int`, `string`, `interface{}`.
3. `garray` supports both regular arrays and sorted arrays. The structure name of a regular array is defined in the format `*Array`, and the structure name of a sorted array is defined in the format `Sorted*Array`, as follows:
   - `Array`, `intArray`, `StrArray`
   - `SortedArray`, `SortedIntArray`, `SortedStrArray`
   - Among them, the sorted array `SortedArray` requires a given sorting comparison method, and many `Comparator*` comparison methods are also defined in the toolkit `gutil`.

## Documentation

Child pages:

- [Array - Usage](https://goframe.org/en/docs/components/container-garray-example.md)
- [Array - Methods](https://goframe.org/en/docs/components/container-garray-funcs.md)

> Page: https://goframe.org/en/docs/components/container-garray
