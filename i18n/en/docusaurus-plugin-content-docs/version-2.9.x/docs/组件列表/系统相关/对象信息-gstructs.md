---
slug: '/docs/components/os-gstructs'
title: 'Object Information'
sidebar_position: 18
hide_title: true
keywords: [GoFrame, GoFrame Framework, gstructs, Structure Information, Field Retrieval, TagMapName, Fields Method, GoFrame Framework, Middleware Writing, Underlying Components]
description: "The gstructs component is a low-level utility in the GoFrame framework used for obtaining structure information. It is mainly used in framework, basic library, and middleware writing, supporting the Fields method to get structure field information and the TagMapName method to retrieve fields through tags. It is suitable for developers to use this component for field operations and retrieval when building Go applications."
---

## Introduction

The `gstructs` component is used to conveniently obtain information about structures.

This is a low-level component, rarely used in general business, but used in framework, basic library, and middleware writing.

Usage:

```go
import "github.com/gogf/gf/v2/os/gstructs"
```

API Documentation:

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gstructs](https://pkg.go.dev/github.com/gogf/gf/v2/os/gstructs)

## Common Methods

### `Fields`

- Description: `Fields` returns the fields of the `Pointer` attribute of the input parameter `in` in the form of a `Field` slice.

- Format:

```go
Fields(in FieldsInput) ([]Field, error)
```

- Example:

```go
func main() {
      type User struct {
          Id   int
          Name string `params:"name"`
          Pass string `my-tag1:"pass1" my-tag2:"pass2" params:"pass"`
      }
      var user *User
      fields, _ := gstructs.Fields(gstructs.FieldsInput{
          Pointer:         user,
          RecursiveOption: 0,
      })

      g.Dump(fields)
}

// Output:
[
      {
          Value:    "<int Value>",
          Field:    {
              Name:      "Id",
              PkgPath:   "",
              Type:      "int",
              Tag:       "",
              Offset:    0,
              Index:     [
                  0,
              ],
              Anonymous: false,
          },
          TagValue: "",
      },
      {
          Value:    {},
          Field:    {
              Name:      "Name",
              PkgPath:   "",
              Type:      "string",
              Tag:       "params:\"name\"",
              Offset:    8,
              Index:     [
                  1,
              ],
              Anonymous: false,
          },
          TagValue: "",
      },
      {
          Value:    {},
          Field:    {
              Name:      "Pass",
              PkgPath:   "",
              Type:      "string",
              Tag:       "my-tag1:\"pass1\" my-tag2:\"pass2\" params:\"pass\"",
              Offset:    24,
              Index:     [
                  2,
              ],
              Anonymous: false,
          },
          TagValue: "",
      },
]
```

### `TagMapName`

- Description: `TagMapName` retrieves `tag` from the parameter `pointer` and returns it in the form of `map[string]string`.

- Note:
  - The type of parameter `pointer` should be `struct/*struct`.
  - Only exported fields (fields with an uppercase initial) will be returned.
- Format:

```go
TagMapName(pointer interface{}, priority []string) (map[string]string, error)
```

- Example:

```go
func main() {
      type User struct {
          Id   int
          Name string `params:"name"`
          Pass string `my-tag1:"pass1" my-tag2:"pass2" params:"pass"`
      }
      var user User
      m, _ := gstructs.TagMapName(user, []string{"params"})

      g.Dump(m)
}

// Output:
{
      "name": "Name",
      "pass": "Pass",
}
```