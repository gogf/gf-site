# Debugging

The `goframe` framework offers rich debugging features implemented by the `gdebug` component.

**Warning**

The so-called "debugging" methods mostly relate to the development environment, including stack and call chain information analysis, and performance is often not particularly high.

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

> Page: https://goframe.org/en/docs/components/debug-gdebug
