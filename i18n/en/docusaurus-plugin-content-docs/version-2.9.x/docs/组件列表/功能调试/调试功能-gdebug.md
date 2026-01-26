---
slug: '/docs/components/debug-gdebug'
title: 'Debugging'
sidebar_position: 0
hide_title: true
keywords: [GoFrame, GoFrame framework, debugging functionality, gdebug, GoFrame debugging, gdebug component, stack analysis, call chain information, performance optimization, API documentation]
description: "The GoFrame framework provides rich debugging functionality through the gdebug component, suitable for stack and call chain analysis in the development environment. Although debugging methods are not strongly related to performance efficiency, they can help developers better understand code execution paths and call information."
---

The `goframe` framework offers rich debugging features implemented by the `gdebug` component.
:::warning
The so-called "debugging" methods mostly relate to the development environment, including stack and call chain information analysis, and performance is often not particularly high.
:::
**Usage:**

```go
import "github.com/gogf/gf/v2/debug/gdebug"
```

**API Documentation:**

[https://pkg.go.dev/github.com/gogf/gf/v2/debug/gdebug](https://pkg.go.dev/github.com/gogf/gf/v2/debug/gdebug)

**Method List:**

```go
func BinVersion() string
func BinVersionMd5() string
func Caller(skip ...int) (function string, path string, line int)
func CallerDirectory() string
func CallerFileLine() string
func CallerFileLineShort() string
func CallerFilePath() string
func CallerFunction() string
func CallerPackage() string
func CallerWithFilter(filter string, skip ...int) (function string, path string, line int)
func FuncName(f interface{}) string
func FuncPath(f interface{}) string
func GoroutineId() int
func PrintStack(skip ...int)
func Stack(skip ...int) string
func StackWithFilter(filter string, skip ...int) string
func StackWithFilters(filters []string, skip ...int) string
func TestDataPath(names ...string) string
```

> Those familiar with `PHP` might understand this better, as some of these methods are actually similar to certain [magic constants](https://www.php.net/manual/en/language.constants.predefined.php) in PHP. `CallerDirectory` corresponds to `__DIR__`, `CallerFilePath` corresponds to `__FILE__`, and `CallerFunction` corresponds to `__FUNCTION__`.