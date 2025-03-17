---
slug: '/docs/components/util-gutil'
title: 'Utility Functions'
sidebar_position: 6
hide_title: true
keywords: [GoFrame, GoFrame Framework, gutil, utility methods, Go language, development components, data formatting, API documentation, Dump function, DumpWithType]
description: "The gutil component is a module in the GoFrame framework used to encapsulate commonly used development utility methods. It provides a series of convenient functions to support friendly output of data structures, such as Dump and DumpWithType. Developers can introduce the gutil component through the GitHub repository to improve Go language project development efficiency."
---

## Introduction

The `gutil` component encapsulates some commonly used utility methods in development.

Usage:

```go
import "github.com/gogf/gf/v2/util/gutil"
```

API documentation:

[https://pkg.go.dev/github.com/gogf/gf/v2/util/gutil](https://pkg.go.dev/github.com/gogf/gf/v2/util/gutil)

## Common Methods

### `Dump`

- Description: `Dump` outputs `values` to the standard output in a more readable way.

- Format:

```go
Dump(values ...interface{})
```

- Example:

```go
type User struct {
      Name string
      Age int
}

type Location struct {
      Province string
      City string
}

type UserInfo struct {
      U User
      L Location
}

func main() {
      userList := make([]UserInfo, 0)
      userList = append(userList, UserInfo{
          U: User{
              Name: "郭强",
              Age:  18,
          },
          L: Location{
              Province: "四川",
              City:     "成都",
          },
      })
      userList = append(userList, UserInfo{
          U: User{
              Name: "黄骞",
              Age:  18,
          },
          L: Location{
              Province: "江苏",
              City:     "南京",
          },
      })

      gutil.Dump(userList)
}

// Output:
[
      {
          U: {
              Name: "郭强",
              Age:  18,
          },
          L: {
              Province: "四川",
              City:     "成都",
          },
      },
      {
          U: {
              Name: "黄骞",
              Age:  18,
          },
          L: {
              Province: "江苏",
              City:     "南京",
          },
      },
]
```


### `DumpWithType`

- Description: `DumpWithType` is similar to `Dump` but includes type information.

- Format:

```go
DumpWithType(values ...interface{})
```

- Example:

```go
type User struct {
      Name string
      Age int
}

type Location struct {
      Province string
      City string
}

type UserInfo struct {
      U User
      L Location
}

func main() {
      userList := make([]UserInfo, 0)
      userList = append(userList, UserInfo{
          U: User{
              Name: "郭强",
              Age:  18,
          },
          L: Location{
              Province: "四川",
              City:     "成都",
          },
      })
      userList = append(userList, UserInfo{
          U: User{
              Name: "黄骞",
              Age:  18,
          },
          L: Location{
              Province: "江苏",
              City:     "南京",
          },
      })

      gutil.DumpWithType(userList)
}

// Output:
[]main.UserInfo(2) [
      main.UserInfo(2) {
          U: main.User(2) {
              Name: string(6) "郭强",
              Age:  int(18),
          },
          L: main.Location(2) {
              Province: string(6) "四川",
              City:     string(6) "成都",
          },
      },
      main.UserInfo(2) {
          U: main.User(2) {
              Name: string(6) "黄骞",
              Age:  int(18),
          },
          L: main.Location(2) {
              Province: string(6) "江苏",
              City:     string(6) "南京",
          },
      },
]
```


### `DumpTo`

- Description: `DumpTo` writes `value` to `writer` in a customized output format.

- Format:

```go
DumpTo(writer io.Writer, value interface{}, option DumpOption)
```

- Example:

```go
package main

import (
      "bytes"
      "fmt"
      "github.com/gogf/gf/v2/util/gutil"
      "io"
)

type UserInfo struct {
      Name     string
      Age      int
      Province string
      City     string
}

type DumpWriter struct {
      Content string
}

func (d *DumpWriter) Write(p []byte) (n int, err error) {
      buffer := bytes.NewBuffer(nil)
      buffer.WriteString("I'm Start!\n")
      buffer.WriteString(string(p))
      buffer.WriteString("\nI'm End!\n")

      d.Content = buffer.String()

      return buffer.Len(), nil
}

func main() {
      u := UserInfo{
          "a", 18, "b", "c",
      }

      var dw io.Writer = &DumpWriter{}

      gutil.DumpTo(dw, u, gutil.DumpOption{})

      fmt.Println(dw.(*DumpWriter).Content)
}

// Output:
I'm Start!
{
      Name:     "a",
      Age:      18,
      Province: "b",
      City:     "c",
}
I'm End!
```