---
slug: '/docs/components/os-genv'
title: 'Environment'
sidebar_position: 12
hide_title: true
keywords: [GoFrame,Environment Variable Management,genv,SetMap,GetWithCmd,GoFrame Framework,Environment Variable Setting,Command Line Options,Delete Environment Variables,Batch Setting of Environment Variables]
description: "The genv environment variable management component in the GoFrame framework, including how to batch set environment variables and how to obtain environment variables through command-line options. When an environment variable does not exist, it supports reading from command-line options. Additionally, it covers adding, deleting, and naming conversion rules for environment variables."
---

Environment variable management component.

**Usage**:

```go
import "github.com/gogf/gf/v2/os/genv"
```

**API Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/os/genv](https://pkg.go.dev/github.com/gogf/gf/v2/os/genv)

## `SetMap`

```go
func SetMap(m map[string]string) error
```

This method is used for batch setting of environment variables. Usage example:

```
genv.SetMap(g.MapStrStr{
    "APPID":     "order",
    "THREAD":    "16",
    "ENDPOINTS": "127.0.0.1:6379",
})
```

## `GetWithCmd`

```go
func GetWithCmd(key string, def ...interface{}) *gvar.Var
```

This method is used to get the specified option value in the environment variable. If the environment variable does not exist, it will read from the command-line option. However, the naming rules for both will be different. For example: `genv.GetWithCmd("gf.debug")` will first try to read the value of the `GF_DEBUG` environment variable, and if it does not exist, it will go to the `gf.debug` option in the command line.

Note the naming conversion rules:

- Environment variables convert names to uppercase and `.` characters to `_` characters.
- In the command line, names are converted to lowercase and `_` characters to `.` characters.

## `All`

```go
func All() []string
```

This method returns the string in the environment variable and returns it in the form of `key=value`.

## `Map`

```go
func Map() map[string]string
```

This method returns the string in the environment variable and returns it in the form of `map`.

## `Get`

```go
func Get(key string, def ...interface{}) *gvar.Var
```

This method is used to create a generic type environment variable. If the given `key` does not exist, it returns a default generic type environment variable.

## `Set`

```go
func Set(key, value string) error
```

This method sets environment variables with the given `key` and `value`, and returns an `Error` type if there is an error.

## `SetMap`

```go
func SetMap(m map[string]string) error
```

This method stores environment variables through a parameter of type `map`.

## `Contains`

```go
func Contains(key string) bool
```

This method checks whether the `key` exists in the environment variable.

## `Remove`

```go
func Remove(key ...string) error
```

This method can delete one or more environment variables.

## `Build`

```go
func Build(m map[string]string) []string
```

This method constructs and returns the `map` parameter in the form of an array.