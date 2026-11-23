# Error Handling - Comparison

## `Equal` Comparison Method

Error objects support comparison, and the `Equal` method is used to fully determine whether two `errors` are the same. This is mainly achieved through the following method:

```go
// Equal reports whether current error `err` equals to error `target`.
// Please note that, in default comparison for `Error`,
// the errors are considered the same if both the `code` and `text` of them are the same.
func Equal(err, target error) bool
```

### Interface Definition

If a custom error data structure needs to support comparison, the custom error structure needs to implement the following interface:

```go
// IEqual is the interface for Equal feature.
type IEqual interface {
    Error() string
    Equal(target error) bool
}
```

Error objects created by the `GoFrame` framework's error component already implement this interface, and the component's default comparison logic checks the error code and error message.

**Info**

Note that if both errors do not carry error codes and their error messages are the same, the component considers the two errors to be the same.

### Usage Example

```go
func ExampleEqual() {
    err1 := errors.New("permission denied")
    err2 := gerror.New("permission denied")
    err3 := gerror.NewCode(gcode.CodeNotAuthorized, "permission denied")
    fmt.Println(gerror.Equal(err1, err2))
    fmt.Println(gerror.Equal(err2, err3))

    // Output:
    // true
    // false
}
```

## `Is` Inclusion Judgment

Error objects support **inclusion** judgment. The `Is` method is used to determine whether the given `error` is in a specified `error` chain (if the `error` carries a stack, it will be judged recursively). This is mainly achieved through the following method:

```go
// Is reports whether current error `err` has error `target` in its chaining errors.
// It is just for implements for stdlib errors.Unwrap from Go version 1.17.
func Is(err, target error) bool
```

Usage Example

```go
func ExampleIs() {
    err1 := errors.New("permission denied")
    err2 := gerror.Wrap(err1, "operation failed")
    fmt.Println(gerror.Is(err1, err1))
    fmt.Println(gerror.Is(err2, err2))
    fmt.Println(gerror.Is(err2, err1))
    fmt.Println(gerror.Is(err1, err2))

    // Output:
    // false
    // true
    // true
    // false
}
```

> Page: https://goframe.org/en/docs/core/gerror-comparison
