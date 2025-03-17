---
slug: '/docs/components/test-gtest'
title: 'Unit Testing'
sidebar_position: 0
hide_title: true
keywords: [GoFrame, unit testing, gtest, test assertions, GoFrame framework, test framework, test cases, Assert, goconvey, testify]
description: "The usage of the gtest module under the GoFrame framework, providing convenient and lightweight unit testing methods. gtest extends the functionality of the standard library testing, adding multiple testing features such as test case isolation and common assertion methods. It is suitable for most unit testing scenarios and can be combined with third-party testing frameworks like testify and goconvey for more complex testing."
---

## Introduction
The `gtest` module offers simplified, lightweight, and commonly used unit testing methods. It is an extension encapsulated on the standard library `testing`, mainly adding the following features:

- Isolation of multiple test items within unit test cases.
- Addition of a series of commonly used test assertion methods.
- Assertion methods support various common format assertions, increasing usability.
- Unified formatting of error messages when test failures occur.
:::tip
`gtest` is designed to be simple and easy to use, capable of meeting the vast majority of unit testing scenarios. For more complex testing scenarios, consider third-party testing frameworks such as `testify` and `goconvey`.
:::
**Usage**：

```go
import "github.com/gogf/gf/v2/test/gtest"
```

**API Documentation**：
This chapter may not be updated in a timely manner; for a more comprehensive introduction to the API, please refer to the API documentation.  
[https://pkg.go.dev/github.com/gogf/gf/v2/test/gtest](https://pkg.go.dev/github.com/gogf/gf/v2/test/gtest)

```go
func C(t *testing.T, f func(t *T))
func Assert(value, expect interface{})
func AssertEQ(value, expect interface{})
func AssertGE(value, expect interface{})
func AssertGT(value, expect interface{})
func AssertIN(value, expect interface{})
func AssertLE(value, expect interface{})
func AssertLT(value, expect interface{})
func AssertNE(value, expect interface{})
func AssertNI(value, expect interface{})
func Error(message ...interface{})
func Fatal(message ...interface{})
```

**Brief Explanation**：

1. Use the `C` method to create a `Case`, representing a unit test case. A unit test method can contain multiple `C`, where each `C` often represents one of the possible tests of the method.
2. The assertion method `Assert` supports comparison of variables of any type. When performing assertion comparison with `AssertEQ`, it also compares types, i.e., it performs strict assertions.
3. When using size comparison assertion methods such as `AssertGE`, the parameters support both string and number comparison, where string comparison is case-sensitive.
4. Inclusion assertion methods `AssertIN` and `AssertNI` support parameters of the `slice` type but do not currently support `map` type parameters.

The package name for unit testing can either be `package_name_test` or directly use `package_name` (the same name as the test package). Both approaches are quite common and are also both involved in the Go official standard library. However, it should be noted that when you need to test private methods/private variables of the package, you must use the `package_name` naming form. Also, when using the `package_name` naming method, ensure that methods related to unit testing (non-`Test*` test methods) are generally defined as private and not publicly exposed.

## Usage Example

For example, one of the unit test cases of the `gstr` module:

```go
package gstr_test

import (
    "github.com/gogf/gf/v2/test/gtest"
    "github.com/gogf/gf/v2/text/gstr"
    "testing"
)

func Test_Trim(t *testing.T) {
    gtest.C(t, func(t *gtest.T) {
        t.Assert(gstr.Trim(" 123456\n "),      "123456")
        t.Assert(gstr.Trim("#123456#;", "#;"), "123456")
    })
}
```

It can also be used like this:

```go
package gstr_test

import (
    . "github.com/gogf/gf/v2/test/gtest"
    "github.com/gogf/gf/v2/text/gstr"
    "testing"
)

func Test_Trim(t *testing.T) {
    C(t, func() {
        Assert(gstr.Trim(" 123456\n "),      "123456")
        Assert(gstr.Trim("#123456#;", "#;"), "123456")
    })
}
```

A unit test case can contain multiple `C`, and a `C` can perform multiple assertions. If assertions pass, it directly proceeds with a PASS; however, if assertions fail, the following error information is output, and the current unit test case's execution is terminated (subsequent other unit test cases will not be terminated).

```text
=== RUN   Test_Trim
[ASSERT] EXPECT 123456#; == 123456
1. /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/text/gstr/gstr_z_unit_trim_test.go:20
2. /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/text/gstr/gstr_z_unit_trim_test.go:18
--- FAIL: Test_Trim (0.00s)
FAIL
```