---
slug: '/docs/components/text-gstr'
title: 'String Processing'
sidebar_position: 0
hide_title: true
keywords: [GoFrame,String processing,Text processing component,String judgment,Case conversion,String comparison,Split and join,Naming conversion,GoFrame framework,String conversion]
description: "gstr provides powerful and convenient text processing components, including string judgment, case conversion, string comparison, splitting and joining, naming conversion, and more, offering more comprehensive and rich features than the Golang standard library."
---

`gstr` provides powerful and convenient text processing components, with a large number of commonly used string processing methods built in, making it more comprehensive and rich compared to the `Golang` standard library, suitable for dealing with most business scenarios.

**Usage**:

```go
import "github.com/gogf/gf/v2/text/gstr"
```

**API Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/text/gstr](https://pkg.go.dev/github.com/gogf/gf/v2/text/gstr)
:::tip
The list of common methods below might be outdated compared to code updates with new features. For more methods and examples, please refer to the code documentation: [https://pkg.go.dev/github.com/gogf/gf/v2/text/gstr](https://pkg.go.dev/github.com/gogf/gf/v2/text/gstr)
:::
## String Judgment

### `IsNumeric`

- Description: `IsNumeric` verifies whether the string `s` is a number.

- Format:

```go
IsNumeric(s string) bool
```

- Example:

```go
func ExampleIsNumeric() {
      fmt.Println(gstr.IsNumeric("88"))
      fmt.Println(gstr.IsNumeric("3.1415926"))
      fmt.Println(gstr.IsNumeric("abc"))
      // Output:
      // true
      // true
      // false
}
```


## String Length

### `LenRune`

- Description: `LenRune` returns the length of a `unicode` string.

- Format:

```go
LenRune(str string) int
```

- Example:

```go
func ExampleLenRune() {
      var (
          str    = `GoFrame框架`
          result = gstr.LenRune(str)
      )
      fmt.Println(result)

      // Output:
      // 9
}
```


## String Creation

### `Repeat`

- Description: `Repeat` returns a new string consisting of the `input` string repeated `multiplier` times.

- Format:

```go
Repeat(input string, multiplier int) string
```

- Example:

```go
func ExampleRepeat() {
      var (
          input      = `goframe `
          multiplier = 3
          result     = gstr.Repeat(input, multiplier)
      )
      fmt.Println(result)

      // Output:
      // goframe goframe goframe
}
```


## Case Conversion

### `ToLower`

- Description: `ToLower` converts all `Unicode` characters in `s` to lowercase and returns its copy.

- Format:

```go
ToLower(s string) string
```

- Example:

```go
func ExampleToLower() {
      var (
          s      = `GOFRAME`
          result = gstr.ToLower(s)
      )
      fmt.Println(result)

      // Output:
      // goframe
}
```


### `ToUpper`

- Description: `ToUpper` converts all `Unicode` characters in `s` to uppercase and returns its copy.

- Format:

```go
ToUpper(s string) string
```

- Example:

```go
func ExampleToUpper() {
      var (
          s      = `goframe`
          result = gstr.ToUpper(s)
      )
      fmt.Println(result)

      // Output:
      // GOFRAME
}
```


### `UcFirst`

- Description: `UcFirst` capitalizes the first character of `s` and returns its copy.

- Format:

```go
UcFirst(s string) string
```

- Example:

```go
func ExampleUcFirst() {
      var (
          s      = `hello`
          result = gstr.UcFirst(s)
      )
      fmt.Println(result)

      // Output:
      // Hello
}
```


### `LcFirst`

- Description: `LcFirst` converts the first character of `s` to lowercase and returns its copy.

- Format:

```go
LcFirst(s string) string
```

- Example:

```go
func ExampleLcFirst() {
      var (
          str    = `Goframe`
          result = gstr.LcFirst(str)
      )
      fmt.Println(result)

      // Output:
      // goframe
}
```


### `UcWords`

- Description: `UcWords` capitalizes the first character of each word in the string `str`.

- Format:

```go
UcWords(str string) string
```

- Example:

```go
func ExampleUcWords() {
      var (
          str    = `hello world`
          result = gstr.UcWords(str)
      )
      fmt.Println(result)

      // Output:
      // Hello World
}
```


### `IsLetterLower`

- Description: `IsLetterLower` verifies whether the given character `b` is lowercase.

- Format:

```go
IsLetterLower(b byte) bool
```

- Example:

```go
func ExampleIsLetterLower() {
      fmt.Println(gstr.IsLetterLower('a'))
      fmt.Println(gstr.IsLetterLower('A'))

      // Output:
      // true
      // false
}
```


### `IsLetterUpper`

- Description: `IsLetterUpper` verifies whether the character `b` is uppercase.

- Format:

```go
IsLetterUpper(b byte) bool
```

- Example:

```go
func ExampleIsLetterUpper() {
      fmt.Println(gstr.IsLetterUpper('A'))
      fmt.Println(gstr.IsLetterUpper('a'))

      // Output:
      // true
      // false
}
```


## String Comparison

### `Compare`

- Description: `Compare` returns an integer comparing two strings lexicographically. If `a == b`, it returns `0`; if `a < b`, it returns `-1`; if `a > b`, it returns `+1`.

- Format:

```go
Compare(a, b string) int
```

- Example:

```go
func ExampleCompare() {
      fmt.Println(gstr.Compare("c", "c"))
      fmt.Println(gstr.Compare("a", "b"))
      fmt.Println(gstr.Compare("c", "b"))

      // Output:
      // 0
      // -1
      // 1
}
```


### `Equal`

- Description: `Equal` returns whether `a` and `b` are equal, case-insensitively.

- Format:

```go
Equal(a, b string) bool
```

- Example:

```go
func ExampleEqual() {
      fmt.Println(gstr.Equal(`A`, `a`))
      fmt.Println(gstr.Equal(`A`, `A`))
      fmt.Println(gstr.Equal(`A`, `B`))

      // Output:
      // true
      // true
      // false
}
```


## Split and Join

### `Split`

- Description: `Split` splits `str` into `[]string` using `delimiter`.

- Format:

```go
Split(str, delimiter string) []string
```

- Example:

```go
func ExampleSplit() {
      var (
          str       = `a|b|c|d`
          delimiter = `|`
          result    = gstr.Split(str, delimiter)
      )
      fmt.Printf(`%#v`, result)

      // Output:
      // []string{"a", "b", "c", "d"}
}
```


### `SplitAndTrim`

- Description: `SplitAndTrim` splits `str` into `[]string` using `delimiter` and calls `Trim` on each element of `[]string`, ignoring elements that are empty after `Trim`.

- Format:

```go
SplitAndTrim(str, delimiter string, characterMask ...string) []string
```

- Example:

```go
func ExampleSplitAndTrim() {
      var (
          str       = `a|b|||||c|d`
          delimiter = `|`
          result    = gstr.SplitAndTrim(str, delimiter)
      )
      fmt.Printf(`%#v`, result)

      // Output:
      // []string{"a", "b", "c", "d"}
}
```


### `Join`

- Description: `Join` concatenates each element of `array` into a new string. The parameter `sep` is used as the separator for the new string.

- Format:

```go
Join(array []string, sep string) string
```

- Example:

```go
func ExampleJoin() {
      var (
          array  = []string{"goframe", "is", "very", "easy", "to", "use"}
          sep    = ` `
          result = gstr.Join(array, sep)
      )
      fmt.Println(result)

      // Output:
      // goframe is very easy to use
}
```


### `JoinAny`

- Description: `JoinAny` concatenates each element of `array` into a new string. The parameter `sep` is used as the separator for the new string. The parameter `array` can be of any type.

- Format:

```go
JoinAny(array interface{}, sep string) string
```

- Example:

```go
func ExampleJoinAny() {
      var (
          sep    = `,`
          arr2   = []int{99, 73, 85, 66}
          result = gstr.JoinAny(arr2, sep)
      )
      fmt.Println(result)

      // Output:
      // 99,73,85,66
}
```


### `Explode`

- Description: `Explode` splits `str` into `[]string` using the delimiter `delimiter`.

- Format:

```go
Explode(delimiter, str string) []string
```

- Example:

```go
func ExampleExplode() {
      var (
          str       = `Hello World`
          delimiter = " "
          result    = gstr.Explode(delimiter, str)
      )
      fmt.Printf(`%#v`, result)

      // Output:
      // []string{"Hello", "World"}
}
```


### `Implode`

- Description: `Implode` joins each element of the `pieces` string array using `glue`.

- Format:

```go
Implode(glue string, pieces []string) string
```

- Example:

```go
func ExampleImplode() {
      var (
          pieces = []string{"goframe", "is", "very", "easy", "to", "use"}
          glue   = " "
          result = gstr.Implode(glue, pieces)
      )
      fmt.Println(result)

      // Output:
      // goframe is very easy to use
}
```


### `ChunkSplit`

- Description: `ChunkSplit` splits the string into smaller chunks of `chunkLen` and joins each chunk with `end`.

- Format:

```go
ChunkSplit(body string, chunkLen int, end string) string
```

- Example:

```go
func ExampleChunkSplit() {
      var (
          body     = `1234567890`
          chunkLen = 2
          end      = "#"
          result   = gstr.ChunkSplit(body, chunkLen, end)
      )
      fmt.Println(result)

      // Output:
      // 12#34#56#78#90#
}
```


### `Fields`

- Description: `Fields` returns `[]string` representing each word in the string.

- Format:

```go
Fields(str string) []string
```

- Example:

```go
func ExampleFields() {
      var (
          str    = `Hello World`
          result = gstr.Fields(str)
      )
      fmt.Printf(`%#v`, result)

      // Output:
      // []string{"Hello", "World"}
}
```


## Escape Processing

### `AddSlashes`

- Description: `AddSlashes` adds an escape character `'\'` before the symbols in the string.

- Format:

```go
AddSlashes(str string) string
```

- Example:

```go
func ExampleAddSlashes() {
      var (
          str    = `'aa'"bb"cc\r\n\d\t`
          result = gstr.AddSlashes(str)
      )

      fmt.Println(result)

      // Output:
      // \'aa\'\"bb\"cc\\r\\n\\d\\t
}
```


### `StripSlashes`

- Description: `StripSlashes` removes the escape characters `'\'` from string `str`.

- Format:

```go
StripSlashes(str string) string
```

- Example:

```go
func ExampleStripSlashes() {
      var (
          str    = `C:\\windows\\GoFrame\\test`
          result = gstr.StripSlashes(str)
      )
      fmt.Println(result)

      // Output:
      // C:\windows\GoFrame\test
}
```


### `QuoteMeta`

- Description: `QuoteMeta` adds an escape character `'\'` before each character in `str` among '` \ + * ? [ ^ ] ( $ )`.

- Format:

```go
QuoteMeta(str string, chars ...string) string
```

- Example:

```go
func ExampleQuoteMeta() {
      {
          var (
              str    = `.\+?[^]()`
              result = gstr.QuoteMeta(str)
          )
          fmt.Println(result)
      }
      {
          var (
              str    = `https://goframe.org/pages/viewpage.action?pageId=1114327`
              result = gstr.QuoteMeta(str)
          )
          fmt.Println(result)
      }

      // Output:
      // \.\\\+\?\[\^\]\(\)
      // https://goframe\.org/pages/viewpage\.action\?pageId=1114327

}
```


## Count Statistics

### `Count`

- Description: `Count` calculates the number of times `substr` occurs in `s`. If `substr` is not found in `s`, it returns `0`.

- Format:

```go
Count(s, substr string) int
```

- Example:

```go
func ExampleCount() {
      var (
          str     = `goframe is very, very easy to use`
          substr1 = "goframe"
          substr2 = "very"
          result1 = gstr.Count(str, substr1)
          result2 = gstr.Count(str, substr2)
      )
      fmt.Println(result1)
      fmt.Println(result2)

      // Output:
      // 1
      // 2
}
```


### `CountI`

- Description: `Count` calculates the number of times `substr` occurs in `s`, case-insensitively. If not found, returns `0`.

- Format:

```go
CountI(s, substr string) int
```

- Example:

```go
func ExampleCountI() {
      var (
          str     = `goframe is very, very easy to use`
          substr1 = "GOFRAME"
          substr2 = "VERY"
          result1 = gstr.CountI(str, substr1)
          result2 = gstr.CountI(str, substr2)
      )
      fmt.Println(result1)
      fmt.Println(result2)

      // Output:
      // 1
      // 2
}
```


### `CountWords`

- Description: `CountWords` returns a `map[string]int` with statistics of words used in `str`.

- Format:

```go
CountWords(str string) map[string]int
```

- Example:

```go
func ExampleCountWords() {
      var (
          str    = `goframe is very, very easy to use!`
          result = gstr.CountWords(str)
      )
      fmt.Printf(`%#v`, result)

      // Output:
      // map[string]int{"easy":1, "goframe":1, "is":1, "to":1, "use!":1, "very":1, "very,":1}
}
```


### `CountChars`

- Description: `CountChars` returns statistics of characters used in `str` as `map[string]int`. The `noSpace` parameter controls whether to count spaces.

- Format:

```go
CountChars(str string, noSpace ...bool) map[string]int
```

- Example:

```go
func ExampleCountChars() {
      var (
          str    = `goframe`
          result = gstr.CountChars(str)
      )
      fmt.Println(result)

      // May Output:
      // map[a:1 e:1 f:1 g:1 m:1 o:1 r:1]
}
```


## Array Processing

### `SearchArray`

- Description: `SearchArray` searches string `'s'` in `[]string 'a'` case-sensitively and returns its index in `'a'`. If `'s'` is not found, it returns `-1`.

- Format:

```go
SearchArray(a []string, s string) int
```

- Example:

```go
func ExampleSearchArray() {
      var (
          array  = []string{"goframe", "is", "very", "nice"}
          str    = `goframe`
          result = gstr.SearchArray(array, str)
      )
      fmt.Println(result)

      // Output:
      // 0
}
```


### `InArray`

- Description: `InArray` verifies whether the `[]string 'a'` contains the string `' s '`.

- Format:

```go
InArray(a []string, s string) bool
```

- Example:

```go
func ExampleInArray() {
      var (
          a      = []string{"goframe", "is", "very", "easy", "to", "use"}
          s      = "goframe"
          result = gstr.InArray(a, s)
      )
      fmt.Println(result)

      // Output:
      // true
}
```


### `PrefixArray`

- Description: `PrefixArray` adds the prefix `'prefix'` to each string in `[]string array`.

- Format:

```go
PrefixArray(array []string, prefix string)
```

- Example:

```go
func ExamplePrefixArray() {
      var (
          strArray = []string{"tom", "lily", "john"}
      )

      gstr.PrefixArray(strArray, "classA_")

      fmt.Println(strArray)

      // Output:
      // [classA_tom classA_lily classA_john]
}
```


## Naming Conversion

### `CaseCamel`

- Description: `CaseCamel` converts a string to a camel case format (capitalize the first letter).

- Format:

```go
CaseCamel(s string) string
```

- Example:

```go
func ExampleCaseCamel() {
      var (
          str    = `hello world`
          result = gstr.CaseCamel(str)
      )
      fmt.Println(result)

      // Output:
      // HelloWorld
}
```


### `CaseCamelLower`

- Description: `CaseCamelLower` converts a string to camel case format (lowercase the first letter).

- Format:

```go
CaseCamelLower(s string) string
```

- Example:

```go
func ExampleCaseCamelLower() {
      var (
          str    = `hello world`
          result = gstr.CaseCamelLower(str)
      )
      fmt.Println(result)

      // Output:
      // helloWorld
}
```


### `CaseSnake`

- Description: `CaseSnake` replaces symbols (underscore, space, dot, hyphen) in a string with underscores (`_`) and converts all to lowercase.

- Format:

```go
CaseSnake(s string) string
```

- Example:

```go
func ExampleCaseSnake() {
      var (
          str    = `hello world`
          result = gstr.CaseSnake(str)
      )
      fmt.Println(result)

      // Output:
      // hello_world
}
```


### `CaseSnakeScreaming`

- Description: `CaseSnakeScreaming` replaces symbols (underscore, space, dot, hyphen) in a string with underscores (`'_'`) and converts all letters to uppercase.

- Format:

```go
CaseSnakeScreaming(s string) string
```

- Example:

```go
func ExampleCaseSnakeScreaming() {
      var (
          str    = `hello world`
          result = gstr.CaseSnakeScreaming(str)
      )
      fmt.Println(result)

      // Output:
      // HELLO_WORLD
}
```


### `CaseSnakeFirstUpper`

- Description: `CaseSnakeFirstUpper` converts uppercase letters to lowercase and adds an underscore `'_'` before them, except the first uppercase letter, which is only converted to lowercase without an underscore.

- Format:

```go
CaseSnakeFirstUpper(word string, underscore ...string) string
```

- Example:

```go
func ExampleCaseSnakeFirstUpper() {
      var (
          str    = `RGBCodeMd5`
          result = gstr.CaseSnakeFirstUpper(str)
      )
      fmt.Println(result)

      // Output:
      // rgb_code_md5
}
```


### `CaseKebab`

- Description: `CaseKebab` replaces symbols (underscore, space, dot,) in a string with hyphens (`'-'`) and converts all to lowercase.

- Format:

```go
CaseKebab(s string) string
```

- Example:

```go
func ExampleCaseKebab() {
      var (
          str    = `hello world`
          result = gstr.CaseKebab(str)
      )
      fmt.Println(result)

      // Output:
      // hello-world
}
```


### `CaseKebabScreaming`

- Description: `CaseKebabScreaming` replaces symbols (underscore, space, dot, hyphen) in a string with hyphens (`'-'`) and converts all to uppercase.

- Format:

```go
CaseKebabScreaming(s string) string
```

- Example:

```go
func ExampleCaseKebabScreaming() {
      var (
          str    = `hello world`
          result = gstr.CaseKebabScreaming(str)
      )
      fmt.Println(result)

      // Output:
      // HELLO-WORLD
}
```


### `CaseDelimited`

- Description: `CaseDelimited` replaces symbols in a string based on specified delimiters.

- Format:

```go
CaseDelimited(s string, del byte) string
```

- Example:

```go
func ExampleCaseDelimited() {
      var (
          str    = `hello world`
          del    = byte('-')
          result = gstr.CaseDelimited(str, del)
      )
      fmt.Println(result)

      // Output:
      // hello-world
}
```


### `CaseDelimitedScreaming`

- Description: `CaseDelimitedScreaming` replaces symbols (space, underscore, dot, hyphen) in a string with the second parameter delimiter, converting to uppercase if the third parameter is `true`, or to lowercase if `false`.

- Format:

```go
CaseDelimitedScreaming(s string, del uint8, screaming bool) string
```

- Example:

```go
func ExampleCaseDelimitedScreaming() {
      {
          var (
              str    = `hello world`
              del    = byte('-')
              result = gstr.CaseDelimitedScreaming(str, del, true)
          )
          fmt.Println(result)
      }
      {
          var (
              str    = `hello world`
              del    = byte('-')
              result = gstr.CaseDelimitedScreaming(str, del, false)
          )
          fmt.Println(result)
      }

      // Output:
      // HELLO-WORLD
      // hello-world
}
```


## Contains Check

### `Contains`

- Description: `Contains` returns whether the string `str` contains the substring `substr`, case-sensitively.

- Format:

```go
Contains(str, substr string) bool
```

- Example:

```go
func ExampleContains() {
      {
          var (
              str    = `Hello World`
              substr = `Hello`
              result = gstr.Contains(str, substr)
          )
          fmt.Println(result)
      }
      {
          var (
              str    = `Hello World`
              substr = `hello`
              result = gstr.Contains(str, substr)
          )
          fmt.Println(result)
      }

      // Output:
      // true
      // false
}
```


### `ContainsI`

- Description: `ContainsI` verifies whether `substr` is in `str`, case-insensitively.

- Format:

```go
ContainsI(str, substr string) bool
```

- Example:

```go
func ExampleContainsI() {
      var (
          str     = `Hello World`
          substr  = "hello"
          result1 = gstr.Contains(str, substr)
          result2 = gstr.ContainsI(str, substr)
      )
      fmt.Println(result1)
      fmt.Println(result2)

      // Output:
      // false
      // true
}
```


### `ContainsAny`

- Description: `ContainsAny` verifies whether `s` contains `chars`.

- Format:

```go
ContainsAny(s, chars string) bool
```

- Example:

```go
func ExampleContainsAny() {
      {
          var (
              s      = `goframe`
              chars  = "g"
              result = gstr.ContainsAny(s, chars)
          )
          fmt.Println(result)
      }
      {
          var (
              s      = `goframe`
              chars  = "G"
              result = gstr.ContainsAny(s, chars)
          )
          fmt.Println(result)
      }

      // Output:
      // true
      // false
}
```


## String Conversion

### `Chr`

- Description: `Chr` returns the `ascii` character string for a number `0-255`.

- Format:

```go
Chr(ascii int) string
```

- Example:

```go
func ExampleChr() {
      var (
          ascii  = 65 // A
          result = gstr.Chr(ascii)
      )
      fmt.Println(result)

      // Output:
      // A
}
```


### `Ord`

- Description: `Ord` converts the first byte of a string to a value between `0-255`.

- Format:

```go
Ord(char string) int
```

- Example:

```go
func ExampleOrd() {
      var (
          str    = `goframe`
          result = gstr.Ord(str)
      )

      fmt.Println(result)

      // Output:
      // 103
}
```


### `OctStr`

- Description: `OctStr` converts an octal string in `str` to its original string form.

- Format:

```go
OctStr(str string) string
```

- Example:

```go
func ExampleOctStr() {
      var (
          str    = `\346\200\241`
          result = gstr.OctStr(str)
      )
      fmt.Println(result)

      // Output:
      // 怡
}
```


### `Reverse`

- Description: `Reverse` returns the reversed string of `str`.

- Format:

```go
Reverse(str string) string
```

- Example:

```go
func ExampleReverse() {
      var (
          str    = `123456`
          result = gstr.Reverse(str)
      )
      fmt.Println(result)

      // Output:
      // 654321
}
```


### `NumberFormat`

- Description: `NumberFormat` formats a number with thousand separators.

  - Parameter `decimal` sets the number of decimal points.
  - Parameter `decPoint` sets the decimal point separator.
  - Parameter `thousand` sets the thousand separator.
- Format:

```go
NumberFormat(number float64, decimals int, decPoint, thousandsSep string) string
```

- Example:

```go
func ExampleNumberFormat() {
      var (
          number       float64 = 123456
          decimals             = 2
          decPoint             = "."
          thousandsSep         = ","
          result               = gstr.NumberFormat(number, decimals, decPoint, thousandsSep)
      )
      fmt.Println(result)

      // Output:
      // 123,456.00
}
```


### `Shuffle`

- Description: `Shuffle` returns a randomly shuffled version of `str`.

- Format:

```go
Shuffle(str string) string
```

- Example:

```go
func ExampleShuffle() {
      var (
          str    = `123456`
          result = gstr.Shuffle(str)
      )
      fmt.Println(result)

      // May Output:
      // 563214
}
```


### `HideStr`

- Description: `HideStr` converts a percentage `percent` of characters in `str`, starting from the middle, to the `hide` string.

- Format:

```go
HideStr(str string, percent int, hide string) string
```

- Example:

```go
func ExampleHideStr() {
      var (
          str     = `13800138000`
          percent = 40
          hide    = `*`
          result  = gstr.HideStr(str, percent, hide)
      )
      fmt.Println(result)

      // Output:
      // 138****8000
}
```


### `Nl2Br`

- Description: `Nl2Br` inserts HTML line break `(' br ' |<br />)` before all newline characters in a string: \n\r, \r\n, \r, \n.

- Format:

```go
Nl2Br(str string, isXhtml ...bool) string
```

- Example:

```go
func ExampleNl2Br() {
      var (
          str = `goframe
is
very
easy
to
use`
          result = gstr.Nl2Br(str)
      )

      fmt.Println(result)

      // Output:
      // goframe<br>is<br>very<br>easy<br>to<br>use
}
```


### `WordWrap`

- Description: `WordWrap` uses line breaks to wrap `str` to a given number of characters (without splitting words).

- Format:

```go
WordWrap(str string, width int, br string) string
```

- Example:

```go
func ExampleWordWrap() {
      {
          var (
              str    = `A very long woooooooooooooooooord. and something`
              width  = 8
              br     = "\n"
              result = gstr.WordWrap(str, width, br)
          )
          fmt.Println(result)
      }
      {
          var (
              str    = `The quick brown fox jumped over the lazy dog.`
              width  = 20
              br     = "<br />\n"
              result = gstr.WordWrap(str, width, br)
          )
          fmt.Printf("%v", result)
      }

      // Output:
      // A very
      // long
      // woooooooooooooooooord.
      // and
      // something
      // The quick brown fox<br />
      // jumped over the lazy<br />
      // dog.
}
```


## Domain Processing

### `IsSubDomain`

- Description: `IsSubDomain` verifies whether `subDomain` is a subdomain of `mainDomain`. Supports `'*'` in `mainDomain`.

- Format:

```go
IsSubDomain(subDomain string, mainDomain string) bool
```

- Example:

```go
func ExampleIsSubDomain() {
      var (
          subDomain  = `s.goframe.org`
          mainDomain = `goframe.org`
          result     = gstr.IsSubDomain(subDomain, mainDomain)
      )
      fmt.Println(result)

      // Output:
      // true
}


```


## Parameter Parsing

### `Parse`

- Description: `Parse` parses a string and returns it as `map[string]interface{}`.

- Format:

```go
Parse(s string) (result map[string]interface{}, err error)
```

- Example:

```go
func ExampleParse() {
      {
          var (
              str       = `v1=m&v2=n`
              result, _ = gstr.Parse(str)
          )
          fmt.Println(result)
      }
      {
          var (
              str       = `v[a][a]=m&v[a][b]=n`
              result, _ = gstr.Parse(str)
          )
          fmt.Println(result)
      }
      {
          // The form of nested Slice is not yet supported.
          var str = `v[][]=m&v[][]=n`
          result, err := gstr.Parse(str)
          if err != nil {
              panic(err)
          }
          fmt.Println(result)
      }
      {
          // This will produce an error.
          var str = `v=m&v[a]=n`
          result, err := gstr.Parse(str)
          if err != nil {
              println(err)
          }
          fmt.Println(result)
      }
      {
          var (
              str       = `a .[[b=c`
              result, _ = gstr.Parse(str)
          )
          fmt.Println(result)
      }

      // May Output:
      // map[v1:m v2:n]
      // map[v:map[a:map[a:m b:n]]]
      // map[v:map[]]
      // Error: expected type 'map[string]interface{}' for key 'v', but got 'string'
      // map[]
      // map[a___[b:c]
}
```


## Position Finding

### `Pos`

- Description: `Pos` returns the first occurrence of `needle` in `haystack`, case-sensitively. If not found, returns -1.

- Format:

```go
Pos(haystack, needle string, startOffset ...int) int
```

- Example:

```go
func ExamplePos() {
      var (
          haystack = `Hello World`
          needle   = `World`
          result   = gstr.Pos(haystack, needle)
      )
      fmt.Println(result)

      // Output:
      // 6
}
```


### `PosRune`

- Description: `PosRune` functions similarly to `Pos`, but supports `haystack` and `needle` as `unicode` strings.

- Format:

```go
PosRune(haystack, needle string, startOffset ...int) int
```

- Example:

```go
func ExamplePosRune() {
      var (
          haystack = `GoFrame是一款模块化、高性能、企业级的Go基础开发框架`
          needle   = `Go`
          posI     = gstr.PosRune(haystack, needle)
          posR     = gstr.PosRRune(haystack, needle)
      )
      fmt.Println(posI)
      fmt.Println(posR)

      // Output:
      // 0
      // 22
}
```


### `PosI`

- Description: `PosI` returns the first occurrence of `needle` in `haystack`, case-insensitively. If not found, returns -1.

- Format:

```go
PosI(haystack, needle string, startOffset ...int) int
```

- Example:

```go
func ExamplePosI() {
      var (
          haystack = `goframe is very, very easy to use`
          needle   = `very`
          posI     = gstr.PosI(haystack, needle)
          posR     = gstr.PosR(haystack, needle)
      )
      fmt.Println(posI)
      fmt.Println(posR)

      // Output:
      // 11
      // 17
}
```


### `PosRuneI`

- Description: `PosRuneI` functions similarly to `PosI`, but supports `haystack` and `needle` as `unicode` strings.

- Format:

```go
PosIRune(haystack, needle string, startOffset ...int) int
```

- Example:

```go
func ExamplePosIRune() {
      {
          var (
              haystack    = `GoFrame是一款模块化、高性能、企业级的Go基础开发框架`
              needle      = `高性能`
              startOffset = 10
              result      = gstr.PosIRune(haystack, needle, startOffset)
          )
          fmt.Println(result)
      }
      {
          var (
              haystack    = `GoFrame是一款模块化、高性能、企业级的Go基础开发框架`
              needle      = `高性能`
              startOffset = 30
              result      = gstr.PosIRune(haystack, needle, startOffset)
          )
          fmt.Println(result)
      }

      // Output:
      // 14
      // -1
}
```


### `PosR`

- Description: `PosR` returns the last occurrence of `needle` in `haystack`, case-sensitively. If not found, returns -1.

- Format:

```go
PosR(haystack, needle string, startOffset ...int) int
```

- Example:

```go
func ExamplePosR() {
      var (
          haystack = `goframe is very, very easy to use`
          needle   = `very`
          posI     = gstr.PosI(haystack, needle)
          posR     = gstr.PosR(haystack, needle)
      )
      fmt.Println(posI)
      fmt.Println(posR)

      // Output:
      // 11
      // 17
}
```


### `PosRuneR`

- Description: `PosRuneR` functions similarly to `PosR`, but supports `haystack` and `needle` as `unicode` strings.

- Format:

```go
PosRRune(haystack, needle string, startOffset ...int) int
```

- Example:

```go
func ExamplePosRRune() {
      var (
          haystack = `GoFrame是一款模块化、高性能、企业级的Go基础开发框架`
          needle   = `Go`
          posI     = gstr.PosIRune(haystack, needle)
          posR     = gstr.PosRRune(haystack, needle)
      )
      fmt.Println(posI)
      fmt.Println(posR)

      // Output:
      // 0
      // 22
}
```


### `PosRI`

- Description: `PosRI` returns the last occurrence of `needle` in `haystack`, case-insensitively. If not found, returns -1.

- Format:

```go
PosRI(haystack, needle string, startOffset ...int) int
```

- Example:

```go
func ExamplePosRI() {
      var (
          haystack = `goframe is very, very easy to use`
          needle   = `VERY`
          posI     = gstr.PosI(haystack, needle)
          posR     = gstr.PosRI(haystack, needle)
      )
      fmt.Println(posI)
      fmt.Println(posR)

      // Output:
      // 11
      // 17
}
```


### `PosRIRune`

- Description: `PosRIRune` functions similarly to `PosRI`, but supports `haystack` and `needle` as `unicode` strings.

- Format:

```go
PosRIRune(haystack, needle string, startOffset ...int) int
```

- Example:

```go
func ExamplePosRIRune() {
      var (
          haystack = `GoFrame是一款模块化、高性能、企业级的Go基础开发框架`
          needle   = `GO`
          posI     = gstr.PosIRune(haystack, needle)
          posR     = gstr.PosRIRune(haystack, needle)
      )
      fmt.Println(posI)
      fmt.Println(posR)

      // Output:
      // 0
      // 22
}
```


## Find and Replace

### `Replace`

- Description: `Replace` returns a new string where `search` in `origin` is replaced by `replace`. `search` is case-sensitive.

- Format:

```go
Replace(origin, search, replace string, count ...int) string
```

- Example:

```go
func ExampleReplace() {
      var (
          origin  = `golang is very nice!`
          search  = `golang`
          replace = `goframe`
          result  = gstr.Replace(origin, search, replace)
      )
      fmt.Println(result)

      // Output:
      // goframe is very nice!
}
```


### `ReplaceI`

- Description: `ReplaceI` returns a new string where `search` in `origin` is replaced by `replace`. `search` is case-insensitive.

- Format:

```go
ReplaceI(origin, search, replace string, count ...int) string
```

- Example:

```go
func ExampleReplaceI() {
      var (
          origin  = `golang is very nice!`
          search  = `GOLANG`
          replace = `goframe`
          result  = gstr.ReplaceI(origin, search, replace)
      )
      fmt.Println(result)

      // Output:
      // goframe is very nice!
}
```


### `ReplaceByArray`

- Description: `ReplaceByArray` returns a new string where `origin` is sequentially replaced with pairs `(search, replace)` from an array, case-sensitively.

- Format:

```go
ReplaceByArray(origin string, array []string) string
```

- Example:

```go
func ExampleReplaceByArray() {
      {
          var (
              origin = `golang is very nice`
              array  = []string{"lang", "frame"}
              result = gstr.ReplaceByArray(origin, array)
          )
          fmt.Println(result)
      }
      {
          var (
              origin = `golang is very good`
              array  = []string{"golang", "goframe", "good", "nice"}
              result = gstr.ReplaceByArray(origin, array)
          )
          fmt.Println(result)
      }

      // Output:
      // goframe is very nice
      // goframe is very nice
}
```


### `ReplaceIByArray`

- Description: `ReplaceIByArray` returns a new string where `origin` is sequentially replaced with pairs `(search, replace)` from an array, case-insensitively.

- Format:

```go
ReplaceIByArray(origin string, array []string) string
```

- Example:

```go
func ExampleReplaceIByArray() {
      var (
          origin = `golang is very Good`
          array  = []string{"Golang", "goframe", "GOOD", "nice"}
          result = gstr.ReplaceIByArray(origin, array)
      )

      fmt.Println(result)

      // Output:
      // goframe is very nice
}
```


### `ReplaceByMap`

- Description: `ReplaceByMap` returns a new string where keys in `map` are replaced with values in `origin`, case-sensitively.

- Format:

```go
ReplaceByMap(origin string, replaces map[string]string) string
```

- Example:

```go
func ExampleReplaceByMap() {
      {
          var (
              origin   = `golang is very nice`
              replaces = map[string]string{
                  "lang": "frame",
              }
              result = gstr.ReplaceByMap(origin, replaces)
          )
          fmt.Println(result)
      }
      {
          var (
              origin   = `golang is very good`
              replaces = map[string]string{
                  "golang": "goframe",
                  "good":   "nice",
              }
              result = gstr.ReplaceByMap(origin, replaces)
          )
          fmt.Println(result)
      }

      // Output:
      // goframe is very nice
      // goframe is very nice
}
```


### `ReplaceIByMap`

- Description: `ReplaceIByMap` returns a new string where keys in `map` are replaced with values in `origin`, case-insensitively.

- Format:

```go
ReplaceIByMap(origin string, replaces map[string]string) string
```

- Example:

```go
func ExampleReplaceIByMap() {
      var (
          origin   = `golang is very nice`
          replaces = map[string]string{
              "Lang": "frame",
          }
          result = gstr.ReplaceIByMap(origin, replaces)
      )
      fmt.Println(result)

      // Output:
      // goframe is very nice
}
```


## Substring Extraction

### `Str`

- Description: `Str` returns the substring from the first occurrence of `needle` to the end of `haystack` (including `needle` itself).

- Format:

```go
Str(haystack string, needle string) string
```

- Example:

```go
func ExampleStr() {
      var (
          haystack = `xxx.jpg`
          needle   = `.`
          result   = gstr.Str(haystack, needle)
      )
      fmt.Println(result)

      // Output:
      // .jpg
}
```


### `StrEx`

- Description: `StrEx` returns the substring from the first occurrence of `needle` to the end of `haystack` (excluding `needle` itself).

- Format:

```go
StrEx(haystack string, needle string) string
```

- Example:

```go
func ExampleStrEx() {
      var (
          haystack = `https://goframe.org/index.html?a=1&b=2`
          needle   = `?`
          result   = gstr.StrEx(haystack, needle)
      )
      fmt.Println(result)

      // Output:
      // a=1&b=2
}
```


### `StrTill`

- Description: `StrTill` returns the substring from the start of `haystack` to the first occurrence of `needle` (including `needle` itself).

- Format:

```go
StrTill(haystack string, needle string) string
```

- Example:

```go
func ExampleStrTill() {
      var (
          haystack = `https://goframe.org/index.html?test=123456`
          needle   = `?`
          result   = gstr.StrTill(haystack, needle)
      )
      fmt.Println(result)

      // Output:
      // https://goframe.org/index.html?
}
```


### `StrTillEx`

- Description: `StrTillEx` returns the substring from the start of `haystack` to the first occurrence of `needle` (excluding `needle` itself).

- Format:

```go
StrTillEx(haystack string, needle string) string
```

- Example:

```go
func ExampleStrTillEx() {
      var (
          haystack = `https://goframe.org/index.html?test=123456`
          needle   = `?`
          result   = gstr.StrTillEx(haystack, needle)
      )
      fmt.Println(result)

      // Output:
      // https://goframe.org/index.html
}
```


### `SubStr`

- Description: `SubStr` returns a new substring from `str` starting at `start` with length `length`. Parameter `length` is optional and defaults to the length of `str`.

- Format:

```go
SubStr(str string, start int, length ...int) (substr string)
```

- Example:

```go
func ExampleSubStr() {
      var (
          str    = `1234567890`
          start  = 0
          length = 4
          subStr = gstr.SubStr(str, start, length)
      )
      fmt.Println(subStr)

      // Output:
      // 1234
}
```


### `SubStrRune`

- Description: `SubStrRune` returns a new substring from `unicode` string `str` starting at `start` with length `length`. Parameter `length` is optional and defaults to the length of `str`.

- Format:

```go
SubStrRune(str string, start int, length ...int) (substr string)
```

- Example:

```go
func ExampleSubStrRune() {
      var (
          str    = `GoFrame是一款模块化、高性能、企业级的Go基础开发框架。`
          start  = 14
          length = 3
          subStr = gstr.SubStrRune(str, start, length)
      )
      fmt.Println(subStr)

      // Output:
      // 高性能
}
```


### `StrLimit`

- Description: `StrLimit` takes a substring from the beginning of `str` with length `length`, adds `suffix...`, and returns the new string.

- Format:

```go
StrLimit(str string, length int, suffix ...string) string
```

- Example:

```go
func ExampleStrLimit() {
      var (
          str    = `123456789`
          length = 3
          suffix = `...`
          result = gstr.StrLimit(str, length, suffix)
      )
      fmt.Println(result)

      // Output:
      // 123...
}
```


### `StrLimitRune`

- Description: `StrLimitRune` takes a substring from the beginning of `unicode` string `str` with length `length`, adds `suffix...`, and returns the new string.

- Format:

```go
StrLimitRune(str string, length int, suffix ...string) string
```

- Example:

```go
func ExampleStrLimitRune() {
      var (
          str    = `GoFrame是一款模块化、高性能、企业级的Go基础开发框架。`
          length = 17
          suffix = "..."
          result = gstr.StrLimitRune(str, length, suffix)
      )
      fmt.Println(result)

      // Output:
      // GoFrame是一款模块化、高性能...
}
```


### `SubStrFrom`

- Description: `SubStrFrom` returns the substring from the first occurrence of `need` to the end of `str` (including `need`).

- Format:

```go
SubStrFrom(str string, need string) (substr string)
```

- Example:

```go
func ExampleSubStrFrom() {
      var (
          str  = "我爱GoFrameGood"
          need = `爱`
      )

      fmt.Println(gstr.SubStrFrom(str, need))

      // Output:
      // 爱GoFrameGood
}
```


### `SubStrFromEx`

- Description: `SubStrFromEx` returns the substring from the first occurrence of `need` to the end of `str` (excluding `need`).

- Format:

```go
SubStrFromEx(str string, need string) (substr string)
```

- Example:

```go
func ExampleSubStrFromEx() {
      var (
          str  = "我爱GoFrameGood"
          need = `爱`
      )

      fmt.Println(gstr.SubStrFromEx(str, need))

      // Output:
      // GoFrameGood
}
```


### `SubStrFromR`

- Description: `SubStrFromR` returns the substring from the last occurrence of `need` to the end of `str` (including `need`).

- Format:

```go
SubStrFromR(str string, need string) (substr string)
```

- Example:

```go
func ExampleSubStrFromR() {
      var (
          str  = "我爱GoFrameGood"
          need = `Go`
      )

      fmt.Println(gstr.SubStrFromR(str, need))

      // Output:
      // Good
}
```


### `SubStrFromREx`

- Description: `SubStrFromREx` returns the substring from the last occurrence of `need` to the end of `str` (excluding `need`).

- Format:

```go
SubStrFromREx(str string, need string) (substr string)
```

- Example:

```go
func ExampleSubStrFromREx() {
      var (
          str  = "我爱GoFrameGood"
          need = `Go`
      )

      fmt.Println(gstr.SubStrFromREx(str, need))

      // Output:
      // od
}
```


## Character/Substring Filtering

### `Trim`

- Description: `Trim` removes spaces (or other characters) from the beginning and end of a string. The optional parameter `characterMask` specifies additional characters to trim.

- Format:

```go
Trim(str string, characterMask ...string) string
```

- Example:

```go
func ExampleTrim() {
      var (
          str           = `*Hello World*`
          characterMask = "*d"
          result        = gstr.Trim(str, characterMask)
      )
      fmt.Println(result)

      // Output:
      // Hello Worl
}
```


### `TrimStr`

- Description: `TrimStr` removes all `cut` strings from the beginning and end of a string (does not remove leading or trailing whitespace).

- Format:

```go
TrimStr(str string, cut string, count ...int) string
```

- Example:

```go
func ExampleTrimStr() {
      var (
          str    = `Hello World`
          cut    = "World"
          count  = -1
          result = gstr.TrimStr(str, cut, count)
      )
      fmt.Println(result)

      // Output:
      // Hello
}
```


### `TrimLeft`

- Description: `TrimLeft` removes spaces (or other characters) from the beginning of a string.

- Format:

```go
TrimLeft(str string, characterMask ...string) string
```

- Example:

```go
func ExampleTrimLeft() {
      var (
          str           = `*Hello World*`
          characterMask = "*"
          result        = gstr.TrimLeft(str, characterMask)
      )
      fmt.Println(result)

      // Output:
      // Hello World*
}
```


### `TrimLeftStr`

- Description: `TrimLeftStr` removes `count` occurrences of the `cut` string from the beginning of a string (does not remove leading whitespace).

- Format:

```go
TrimLeftStr(str string, cut string, count ...int) string
```

- Example:

```go
func ExampleTrimLeftStr() {
      var (
          str    = `**Hello World**`
          cut    = "*"
          count  = 1
          result = gstr.TrimLeftStr(str, cut, count)
      )
      fmt.Println(result)

      // Output:
      // *Hello World**
}
```


### `TrimRight`

- Description: `TrimRight` removes spaces (or other characters) from the end of a string.

- Format:

```go
TrimRight(str string, characterMask ...string) string
```

- Example:

```go
func ExampleTrimRight() {
      var (
          str           = `**Hello World**`
          characterMask = "*def" // []byte{"*", "d", "e", "f"}
          result        = gstr.TrimRight(str, characterMask)
      )
      fmt.Println(result)

      // Output:
      // **Hello Worl
}
```


### `TrimRightStr`

- Description: `TrimRightStr` removes `count` occurrences of the `cut` string from the end of a string (does not remove trailing whitespace).

- Format:

```go
TrimRightStr(str string, cut string, count ...int) string
```

- Example:

```go
func ExampleTrimRightStr() {
      var (
          str    = `Hello World!`
          cut    = "!"
          count  = -1
          result = gstr.TrimRightStr(str, cut, count)
      )
      fmt.Println(result)

      // Output:
      // Hello World
}
```


### `TrimAll`

- Description: `TrimAll` removes all spaces (or other characters) and `characterMask` characters from string `str`.

- Format:

```go
TrimAll(str string, characterMask ...string) string
```

- Example:

```go
func ExampleTrimAll() {
      var (
          str           = `*Hello World*`
          characterMask = "*"
          result        = gstr.TrimAll(str, characterMask)
      )
      fmt.Println(result)

      // Output:
      // HelloWorld
}
```


### `HasPrefix`

- Description: `HasPrefix` returns whether `s` starts with `prefix`.

- Format:

```go
HasPrefix(s, prefix string) bool
```

- Example:

```go
func ExampleHasPrefix() {
      var (
          s      = `Hello World`
          prefix = "Hello"
          result = gstr.HasPrefix(s, prefix)
      )
      fmt.Println(result)

      // Output:
      // true
}
```


### `HasSuffix`

- Description: `HasSuffix` returns whether `s` ends with `suffix`.

- Format:

```go
HasSuffix(s, suffix string) bool
```

- Example:

```go
func ExampleHasSuffix() {
      var (
          s      = `my best love is goframe`
          prefix = "goframe"
          result = gstr.HasSuffix(s, prefix)
      )
      fmt.Println(result)

      // Output:
      // true
}
```


## Version Comparison

### `CompareVersion`

- Description: `CompareVersion` compares `a` and `b` as standard `GNU` versions.

- Format:

```go
CompareVersion(a, b string) int
```

- Example:

```go
func ExampleCompareVersion() {
      fmt.Println(gstr.CompareVersion("v2.11.9", "v2.10.8"))
      fmt.Println(gstr.CompareVersion("1.10.8", "1.19.7"))
      fmt.Println(gstr.CompareVersion("2.8.beta", "2.8"))

      // Output:
      // 1
      // -1
      // 0
}
```


### `CompareVersionGo`

- Description: `CompareVersionGo` compares `a` and `b` as standard `Golang` versions.

- Format:

```go
CompareVersionGo(a, b string) int
```

- Example:

```go
func ExampleCompareVersionGo() {
      fmt.Println(gstr.CompareVersionGo("v2.11.9", "v2.10.8"))
      fmt.Println(gstr.CompareVersionGo("v4.20.1", "v4.20.1+incompatible"))
      fmt.Println(gstr.CompareVersionGo(
          "v0.0.2-20180626092158-b2ccc119800e",
          "v1.0.1-20190626092158-b2ccc519800e",
      ))

      // Output:
      // 1
      // 1
      // -1
}
```


## Similarity Calculation

### `Levenshtein`

- Description: `Levenshtein` calculates the `Levenshtein` distance between two strings.

- Format:

```go
Levenshtein(str1, str2 string, costIns, costRep, costDel int) int
```

- Example:

```go
func ExampleLevenshtein() {
      var (
          str1    = "Hello World"
          str2    = "hallo World"
          costIns = 1
          costRep = 1
          costDel = 1
          result  = gstr.Levenshtein(str1, str2, costIns, costRep, costDel)
      )
      fmt.Println(result)

      // Output:
      // 2
}
```


### `SimilarText`

- Description: `SimilarText` calculates the similarity between two strings.

- Format:

```go
SimilarText(first, second string, percent *float64) int
```

- Example:

```go
func ExampleSimilarText() {
      var (
          first   = `AaBbCcDd`
          second  = `ad`
          percent = 0.80
          result  = gstr.SimilarText(first, second, &percent)
      )
      fmt.Println(result)

      // Output:
      // 2
}
```


### `Soundex`

- Description: `Soundex` is used to calculate the `Soundex` key for a string.

- Format:

```go
Soundex(str string) string
```

- Example:

```go
func ExampleSoundex() {
      var (
          str1    = `Hello`
          str2    = `Hallo`
          result1 = gstr.Soundex(str1)
          result2 = gstr.Soundex(str2)
      )
      fmt.Println(result1, result2)

      // Output:
      // H400 H400
}
```